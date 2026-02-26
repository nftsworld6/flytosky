import { NextRequest, NextResponse } from 'next/server'
import { WorkContractsService } from './service'
import { createWorkContractSchema } from './types'

const workContractsService = new WorkContractsService()

export async function GET() {
  try {
    const workContracts = await workContractsService.getAllWorkContracts()
    return NextResponse.json(workContracts)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = createWorkContractSchema.parse(body)
    const workContract = await workContractsService.createWorkContract(input)
    return NextResponse.json(workContract, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}