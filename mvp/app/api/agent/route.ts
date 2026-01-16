import { prisma } from '../../../lib/db'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { Sandbox } from 'e2b'
import { z } from 'zod'

// Input validation schema
const agentInputSchema = z.object({
  input: z
    .string()
    .min(1, 'Input is required')
    .max(10000, 'Input too long (max 10,000 characters)')
    .trim(),
})

const SYSTEM_PROMPT = `You are a code generation assistant. When asked to create files, you MUST respond with executable code that creates those files.

IMPORTANT RULES:
1. Wrap your code in a single fenced code block with the language tag (python or javascript)
2. All files MUST be created in the /output/ directory
3. Use the file system APIs to write files
4. Create the /output/ directory if it doesn't exist
5. After creating files, print a summary of what was created`

// Extract code block from Claude response
function extractCodeBlock(response: string): { language: 'python' | 'javascript'; code: string } | null {
  const regex = /```(python|javascript|js|node)\n([\s\S]*?)```/i
  const match = response.match(regex)
  if (!match) return null

  const lang = match[1].toLowerCase()
  return {
    language: lang === 'js' || lang === 'node' ? 'javascript' : 'python',
    code: match[2].trim(),
  }
}

// Check if file is binary
function isBinaryFile(filename: string): boolean {
  const binaryExts = ['.png', '.jpg', '.jpeg', '.gif', '.pdf', '.zip', '.mp3', '.mp4']
  const ext = filename.substring(filename.lastIndexOf('.')).toLowerCase()
  return binaryExts.includes(ext)
}

// POST /api/agent - Run the AI agent
export async function POST(request: Request) {
  // Parse and validate input
  let validatedInput: string
  try {
    const body = await request.json()
    const parsed = agentInputSchema.parse(body)
    validatedInput = parsed.input
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    )
  }

  // Create the run record
  const run = await prisma.agentRun.create({
    data: { prompt: validatedInput, status: 'pending' },
  })

  try {
    // Update to running
    await prisma.agentRun.update({
      where: { id: run.id },
      data: { status: 'running' },
    })

    // Call Claude
    const anthropic = new Anthropic()
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: validatedInput }],
    })

    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    const extracted = extractCodeBlock(responseText)

    if (!extracted) {
      await prisma.agentRun.update({
        where: { id: run.id },
        data: {
          status: 'completed',
          output: 'No code block found.\n\n' + responseText,
          completedAt: new Date(),
        },
      })
      return NextResponse.json({ runId: run.id })
    }

    // Execute in E2B sandbox
    const sandbox = await Sandbox.create({ timeoutMs: 60000 })

    try {
      await sandbox.files.makeDir('/output')
      const codeFile = extracted.language === 'python' ? '/code.py' : '/code.js'
      await sandbox.files.write(codeFile, extracted.code)

      const cmd = extracted.language === 'python' ? 'python3 /code.py' : 'node /code.js'
      const result = await sandbox.commands.run(cmd, { timeoutMs: 30000 })

      // Read generated files
      const outputExists = await sandbox.files.exists('/output')
      if (outputExists) {
        const entries = await sandbox.files.list('/output')

        for (const entry of entries) {
          if (entry.type === 'file') {
            const isBinary = isBinaryFile(entry.name)
            let content: string

            if (isBinary) {
              const bytes = await sandbox.files.read(entry.path, { format: 'bytes' })
              content = Buffer.from(bytes).toString('base64')
            } else {
              content = await sandbox.files.read(entry.path, { format: 'text' })
            }

            await prisma.generatedFile.create({
              data: {
                runId: run.id,
                path: entry.name,
                content,
                isBinary,
                size: entry.size,
              },
            })
          }
        }
      }

      // Update run as completed
      await prisma.agentRun.update({
        where: { id: run.id },
        data: {
          status: result.exitCode === 0 ? 'completed' : 'failed',
          output: `stdout:\n${result.stdout}\n\nstderr:\n${result.stderr}`,
          error: result.exitCode !== 0 ? result.stderr : null,
          completedAt: new Date(),
        },
      })

    } finally {
      await sandbox.kill()
    }

    return NextResponse.json({ runId: run.id })

  } catch (error) {
    await prisma.agentRun.update({
      where: { id: run.id },
      data: {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date(),
      },
    })
    return NextResponse.json({ error: 'Agent failed' }, { status: 500 })
  }
}
