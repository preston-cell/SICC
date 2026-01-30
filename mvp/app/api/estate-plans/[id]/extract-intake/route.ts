import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuthOrSessionAndOwnership } from '@/lib/auth-helper'
import { readFile } from 'fs/promises'
import { join } from 'path'
import Anthropic from '@anthropic-ai/sdk'
import type { UploadedDocument } from '@prisma/client'

// POST /api/estate-plans/[id]/extract-intake - Extract structured intake data from all uploaded documents
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    // Get all uploaded documents for this estate plan
    const documents = await prisma.uploadedDocument.findMany({
      where: { estatePlanId },
    })

    if (documents.length === 0) {
      return NextResponse.json(
        { error: 'No documents uploaded yet' },
        { status: 400 }
      )
    }

    const anthropic = new Anthropic()
    const uploadsDir = join(process.cwd(), 'uploads')

    // Step 1: Read all PDF files and extract text from any that haven't been extracted yet
    const pdfContents: Array<{ doc: UploadedDocument; base64: string }> = []

    for (const doc of documents) {
      const filePath = join(uploadsDir, `${doc.storageId}.pdf`)
      let fileBuffer: Buffer
      try {
        fileBuffer = await readFile(filePath)
      } catch {
        if (!doc.extractedText) {
          await prisma.uploadedDocument.update({
            where: { id: doc.id },
            data: {
              analysisStatus: 'failed',
              analysisError: 'File not found in storage',
            },
          })
        }
        continue
      }

      pdfContents.push({ doc, base64: fileBuffer.toString('base64') })

      // Extract raw text if not done yet (for the extractedText field)
      if (!doc.extractedText && doc.analysisStatus !== 'failed') {
        try {
          await prisma.uploadedDocument.update({
            where: { id: doc.id },
            data: { analysisStatus: 'extracting' },
          })

          const extractionMessage = await anthropic.messages.create({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 8000,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'document',
                    source: {
                      type: 'base64',
                      media_type: 'application/pdf',
                      data: fileBuffer.toString('base64'),
                    },
                  },
                  {
                    type: 'text',
                    text: `Extract the COMPLETE text from this legal document verbatim. Preserve every name, date, address, dollar amount, section heading, and legal term exactly as written. Do not summarize or omit anything.`,
                  },
                ],
              },
            ],
          })

          const textContent = extractionMessage.content.find(
            (block) => block.type === 'text'
          )
          const extractedText = textContent?.text || ''

          await prisma.uploadedDocument.update({
            where: { id: doc.id },
            data: {
              extractedText,
              extractedAt: new Date(),
              analysisStatus: 'analyzing',
            },
          })

          doc.extractedText = extractedText
        } catch (err) {
          console.error(`Failed to extract text from document ${doc.id}:`, err)
          await prisma.uploadedDocument.update({
            where: { id: doc.id },
            data: {
              analysisStatus: 'failed',
              analysisError: err instanceof Error ? err.message : 'Text extraction failed',
            },
          })
        }
      }
    }

    if (pdfContents.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Could not read any uploaded documents' },
        { status: 500 }
      )
    }

    // Step 2: Send PDFs directly to AI for structured intake extraction
    // Build message content with all PDFs attached for maximum accuracy
    const messageContent: Anthropic.MessageCreateParams['messages'][0]['content'] = []

    for (const { doc, base64 } of pdfContents) {
      messageContent.push({
        type: 'document' as const,
        source: {
          type: 'base64' as const,
          media_type: 'application/pdf' as const,
          data: base64,
        },
      })
      messageContent.push({
        type: 'text' as const,
        text: `[Above document: "${doc.fileName}" — classified as: ${doc.documentType}]`,
      })
    }

    messageContent.push({
      type: 'text' as const,
      text: EXTRACTION_PROMPT,
    })

    let extractedSections: Record<string, unknown>

    try {
      const extractionMessage = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 16000,
        messages: [
          {
            role: 'user',
            content: messageContent,
          },
        ],
      })

      const textContent = extractionMessage.content.find(
        (block) => block.type === 'text'
      )
      const responseText = textContent?.text || ''

      // Parse JSON response
      const jsonStart = responseText.indexOf('{')
      const jsonEnd = responseText.lastIndexOf('}') + 1
      if (jsonStart !== -1 && jsonEnd > jsonStart) {
        extractedSections = JSON.parse(responseText.substring(jsonStart, jsonEnd))
      } else {
        throw new Error('No valid JSON found in AI response')
      }
    } catch (err) {
      console.error('AI extraction error:', err)
      return NextResponse.json(
        { success: false, error: 'Failed to extract intake data from documents' },
        { status: 500 }
      )
    }

    // Step 3: Save ExtractedIntakeData records for each section
    const sourceDocumentIds = pdfContents.map(({ doc }) => doc.id)
    const sections = ['personal', 'family', 'assets', 'existing_documents', 'goals'] as const
    const savedSections: string[] = []
    const sectionConfidence = (extractedSections.sectionConfidence || {}) as Record<string, number>

    for (const section of sections) {
      const sectionData = extractedSections[section]
      const confidence = sectionConfidence[section] ?? 0

      // Skip sections with truly no data (but allow low-confidence sections through)
      if (!sectionData) continue

      // Upsert the extracted data
      const existing = await prisma.extractedIntakeData.findFirst({
        where: { estatePlanId, section },
      })

      if (existing) {
        await prisma.extractedIntakeData.update({
          where: { id: existing.id },
          data: {
            extractedData: JSON.stringify(sectionData),
            sourceDocumentIds,
            confidence,
            status: 'extracted',
          },
        })
      } else {
        await prisma.extractedIntakeData.create({
          data: {
            estatePlanId,
            section,
            extractedData: JSON.stringify(sectionData),
            sourceDocumentIds,
            confidence,
            status: 'extracted',
          },
        })
      }

      savedSections.push(section)
    }

    // Step 4: Mark all processed documents as completed
    for (const { doc } of pdfContents) {
      if (doc.analysisStatus !== 'completed' && doc.analysisStatus !== 'failed') {
        await prisma.uploadedDocument.update({
          where: { id: doc.id },
          data: {
            analysisStatus: 'completed',
            analyzedAt: new Date(),
          },
        })
      }
    }

    return NextResponse.json({
      success: true,
      extractedSections: savedSections,
      documentsProcessed: pdfContents.length,
    })
  } catch (error) {
    console.error('Extract intake error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to extract intake data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Comprehensive extraction prompt
// ─────────────────────────────────────────────────────────────────────────────

const EXTRACTION_PROMPT = `You are an expert estate planning attorney. Your job is to meticulously extract EVERY piece of personal and legal information from the uploaded estate planning documents.

READ EACH DOCUMENT THOROUGHLY. Legal documents contain critical details in every section — names of spouses, children, executors, trustees, guardians, addresses, dates, trust names, and more. Do NOT skip any section.

EXTRACTION RULES:
1. Extract EVERY named person and their role (spouse, child, executor, trustee, guardian, beneficiary, witness, attorney, etc.)
2. Extract EVERY date mentioned (execution dates, birth dates, trust dates, etc.)
3. Extract EVERY address and location mentioned
4. Extract trust and document names verbatim
5. If a person has multiple roles (e.g., spouse who is also executor), capture ALL roles
6. Infer marital status from context (e.g., "my wife" = married)
7. Infer relationships from context (e.g., "my brother DAVID CHEN" = sibling)
8. Look in ALL sections including signature blocks, attestation clauses, and prepared-by footers

Return a JSON object with these sections:

{
  "personal": {
    "firstName": "First name of the document creator/testator",
    "middleName": "Middle name if stated",
    "lastName": "Last name",
    "dateOfBirth": "Date of birth if mentioned, or null",
    "address": "Street address if mentioned, or null",
    "city": "City of residence (look for 'resident of [city]')",
    "county": "County if mentioned",
    "state": "State (look for 'Commonwealth of', 'State of', or city/state references)",
    "zip": "ZIP code if mentioned, or null",
    "phone": "Phone if mentioned, or null",
    "email": "Email if mentioned, or null",
    "maritalStatus": "married/single/divorced/widowed — infer from 'my wife/husband/spouse'",
    "spouseFirstName": "Spouse's first name",
    "spouseMiddleName": "Spouse's middle name if stated",
    "spouseLastName": "Spouse's last name",
    "spouseFullName": "Spouse's full name exactly as written in the document"
  },
  "family": {
    "spouseFirstName": "Spouse's first name (DUPLICATE from personal for form compatibility)",
    "spouseLastName": "Spouse's last name",
    "spouseFullName": "Spouse's full name exactly as written",
    "spouseDateOfBirth": "Spouse's date of birth if mentioned, or null",
    "children": [
      {
        "fullName": "Child's full name exactly as written",
        "dateOfBirth": "Date of birth if mentioned",
        "isMinor": true/false (based on birth date or context like 'minor children'),
        "relationship": "son/daughter/child"
      }
    ],
    "siblings": [
      {
        "fullName": "Sibling's full name",
        "relationship": "brother/sister",
        "city": "City if mentioned",
        "state": "State if mentioned"
      }
    ],
    "otherFamilyAndContacts": [
      {
        "fullName": "Person's full name",
        "relationship": "family friend / uncle / aunt / etc.",
        "city": "City if mentioned",
        "state": "State if mentioned",
        "role": "What role they play (guardian, trustee, etc.)"
      }
    ],
    "guardianForMinors": {
      "primaryGuardian": "Full name of primary guardian for minor children",
      "primaryGuardianRelationship": "Relationship (e.g., 'sister')",
      "primaryGuardianLocation": "City, State if mentioned",
      "successorGuardian": "Full name of successor/alternate guardian",
      "successorGuardianRelationship": "Relationship",
      "successorGuardianLocation": "City, State if mentioned"
    }
  },
  "assets": {
    "realEstate": [{"description": "Property description", "estimatedValue": "Value or null"}],
    "bankAccounts": [{"institution": "Bank name", "type": "checking/savings/etc."}],
    "investments": [{"description": "Description", "estimatedValue": "Value or null"}],
    "retirementAccounts": [{"type": "401k/IRA/etc.", "institution": "Company"}],
    "lifeInsurance": [{"company": "Insurance company", "beneficiary": "Named beneficiary or null"}],
    "otherAssets": [{"description": "Description of asset"}],
    "notes": "Any general notes about assets or asset disposition mentioned in the documents"
  },
  "existing_documents": {
    "hasWill": true/false,
    "willType": "Simple Will / Pour-Over Will / Testamentary Trust Will / etc.",
    "willDate": "Execution date of the will",
    "hasTrust": true/false,
    "trustName": "Exact name of trust (e.g., 'CHEN FAMILY REVOCABLE LIVING TRUST')",
    "trustDate": "Date trust was established",
    "trustType": "Revocable Living Trust / Irrevocable Trust / etc.",
    "testatorRole": "Grantor / Co-Grantor / Settlor / etc. — the testator's role in the trust",
    "hasPoaFinancial": true/false,
    "hasPoaHealthcare": true/false,
    "hasHealthcareDirective": true/false,
    "executor": {
      "name": "Full name of primary executor",
      "relationship": "Relationship to testator (e.g., 'wife', 'brother')"
    },
    "successorExecutor": {
      "name": "Full name of successor executor",
      "relationship": "Relationship to testator",
      "location": "City, State if mentioned"
    },
    "trustee": {
      "name": "Trustee name or null",
      "relationship": "Relationship or null"
    },
    "successorTrustee": {
      "name": "Successor trustee name or null",
      "relationship": "Relationship or null"
    },
    "healthcareProxy": "Name of healthcare proxy/agent or null",
    "financialPoa": "Name of financial power of attorney agent or null",
    "attorney": {
      "name": "Attorney who prepared the document",
      "firm": "Law firm name",
      "address": "Firm address if mentioned"
    },
    "witnesses": [
      {
        "name": "Witness full name",
        "address": "Witness address if mentioned"
      }
    ],
    "notary": {
      "name": "Notary public name or null",
      "commissionExpires": "Commission expiration date or null"
    },
    "governingLaw": "State whose laws govern (e.g., 'Commonwealth of Massachusetts')",
    "specialProvisions": [
      "List any notable legal provisions: pour-over clauses, simultaneous death clauses, survivorship requirements, no-contest clauses, tax directives, etc."
    ]
  },
  "goals": {
    "primaryGoals": ["Inferred goals from document provisions, e.g., 'Transfer all assets to family trust', 'Provide for minor children'"],
    "concerns": ["Inferred concerns, e.g., 'Guardianship of minor children', 'Tax efficiency'"],
    "specialInstructions": "Any specific burial/funeral/medical wishes, charitable bequests, etc.",
    "distributionPlan": "How assets are to be distributed (e.g., 'All residuary estate pours over to the Chen Family Revocable Living Trust')",
    "executorName": "Full name of the primary executor (DUPLICATE from existing_documents for form compatibility)",
    "executorRelationship": "Relationship of executor to testator (e.g., 'wife', 'brother')",
    "alternateExecutorName": "Full name of the successor/alternate executor",
    "hasMinorChildren": true/false,
    "guardianName": "Full name of primary guardian for minor children (DUPLICATE from family for form compatibility)",
    "guardianRelationship": "Relationship of guardian to testator (e.g., 'sister', 'brother', 'friend')",
    "alternateGuardianName": "Full name of successor/alternate guardian"
  },
  "sectionConfidence": {
    "personal": 0-100,
    "family": 0-100,
    "assets": 0-100,
    "existing_documents": 0-100,
    "goals": 0-100
  }
}

CONFIDENCE SCORING:
- 90-100: Section has comprehensive data directly from documents
- 60-89: Section has good data but some fields are missing
- 30-59: Section has partial data
- 10-29: Section has minimal data, mostly inferred
- 0: Absolutely no relevant data found

For this will document, you should find AT MINIMUM:
- The testator's full name, city, state, marital status, and spouse name
- Children's names and birth dates
- Executor and successor executor names
- Guardian and successor guardian names
- Trust name and date
- Will execution date
- Attorney name and firm
- Witness names

If you cannot find the spouse's name in a document that says "I am married to [NAME]", something is wrong. Read more carefully.

Respond ONLY with the JSON object.`
