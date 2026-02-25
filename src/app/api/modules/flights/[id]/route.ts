import { NextRequest, NextResponse } from 'next/server'
import { FlightsService } from '../service'
import { updateFlightSchema } from '../types'

const flightsService = new FlightsService()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const flight = await flightsService.getFlightById(params.id)
    return NextResponse.json(flight)
  } catch (error) {
    if (error instanceof Error && error.message === 'Flight not found') {
      return NextResponse.json({ error: 'Flight not found' }, { status: 404 })
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
    const input = updateFlightSchema.parse(body)
    const flight = await flightsService.updateFlight(params.id, input)
    return NextResponse.json(flight)
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
    await flightsService.deleteFlight(params.id)
    return NextResponse.json({ message: 'Flight deleted' })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}