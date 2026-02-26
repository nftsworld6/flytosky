import { NextRequest, NextResponse } from 'next/server'
import { WorkContractsService } from '../service'
import { updateWorkContractSchema } from '../types'

const workContractsService = new WorkContractsService()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const workContract = await workContractsService.getWorkContractById(params.id)
    return NextResponse.json(workContract)
  } catch (error) {
    if (error instanceof Error && error.message === 'Work contract not found') {
      return NextResponse.json({ error: 'Work contract not found' }, { status: 404 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const input = updateWorkContractSchema.parse(body)
    const workContract = await workContractsService.updateWorkContract(params.id, input)
    return NextResponse.json(workContract)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await workContractsService.deleteWorkContract(params.id)
    return NextResponse.json({ message: 'Work contract deleted' })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}