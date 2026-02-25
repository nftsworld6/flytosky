import { NextRequest, NextResponse } from 'next/server'
import { FlightsService } from './service'
import { searchFlightsSchema } from './types'

const flightsService = new FlightsService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = searchFlightsSchema.parse(body)
    const results = await flightsService.searchFlights(input)
    return NextResponse.json(results)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}