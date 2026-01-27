import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { requireAuthOrSessionAndOwnership } from '@/lib/auth-helper'

// GET /api/estate-plans/[id]/attorney-questions - List questions
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const countOnly = searchParams.get('count') === 'true'

    const where: { estatePlanId: string; category?: string } = { estatePlanId }
    if (category) {
      where.category = category
    }

    if (countOnly) {
      const [total, answered] = await Promise.all([
        prisma.attorneyQuestion.count({ where }),
        prisma.attorneyQuestion.count({ where: { ...where, isAnswered: true } }),
      ])
      return NextResponse.json({
        total,
        answered,
        unanswered: total - answered,
      })
    }

    const questions = await prisma.attorneyQuestion.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error('Failed to get attorney questions:', error)
    return NextResponse.json(
      { error: 'Failed to get attorney questions' },
      { status: 500 }
    )
  }
}

// POST /api/estate-plans/[id]/attorney-questions - Create question
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    const body = await request.json()
    const { question, category } = body

    if (!question || !category) {
      return NextResponse.json(
        { error: 'Question and category are required' },
        { status: 400 }
      )
    }

    const newQuestion = await prisma.attorneyQuestion.create({
      data: {
        estatePlanId,
        question,
        category,
        isAnswered: false,
      },
    })

    return NextResponse.json(newQuestion, { status: 201 })
  } catch (error) {
    console.error('Failed to create attorney question:', error)
    return NextResponse.json(
      { error: 'Failed to create attorney question' },
      { status: 500 }
    )
  }
}

// PUT /api/estate-plans/[id]/attorney-questions - Update question or mark answered
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    const body = await request.json()
    const { id, question, category, isAnswered, answer } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      )
    }

    // Verify question belongs to this estate plan
    const existingQuestion = await prisma.attorneyQuestion.findFirst({
      where: { id, estatePlanId },
    })
    if (!existingQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    const data: {
      question?: string
      category?: string
      isAnswered?: boolean
      answer?: string | null
    } = {}

    if (question !== undefined) data.question = question
    if (category !== undefined) data.category = category
    if (isAnswered !== undefined) {
      data.isAnswered = isAnswered
      if (isAnswered && answer) {
        data.answer = answer
      } else if (!isAnswered) {
        data.answer = null
      }
    }

    const updated = await prisma.attorneyQuestion.update({
      where: { id },
      data,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Failed to update attorney question:', error)
    return NextResponse.json(
      { error: 'Failed to update attorney question' },
      { status: 500 }
    )
  }
}

// DELETE /api/estate-plans/[id]/attorney-questions - Delete question
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: estatePlanId } = await params

    // Verify ownership
    const { error } = await requireAuthOrSessionAndOwnership(estatePlanId, request)
    if (error) return error

    const { searchParams } = new URL(request.url)
    const questionId = searchParams.get('questionId')

    if (!questionId) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      )
    }

    // Verify question belongs to this estate plan
    const existingQuestion = await prisma.attorneyQuestion.findFirst({
      where: { id: questionId, estatePlanId },
    })
    if (!existingQuestion) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 })
    }

    await prisma.attorneyQuestion.delete({
      where: { id: questionId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete attorney question:', error)
    return NextResponse.json(
      { error: 'Failed to delete attorney question' },
      { status: 500 }
    )
  }
}
