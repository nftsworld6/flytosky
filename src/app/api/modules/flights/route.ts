import { NextRequest, NextResponse } from 'next/server'
import { FlightsService } from './service'
import { searchFlightsSchema, createFlightSchema } from './types'

const flightsService = new FlightsService()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (action === 'search') {
    try {
      const origin = searchParams.get('origin')
      const destination = searchParams.get('destination')
      const departureDate = searchParams.get('departureDate')
      const passengers = searchParams.get('passengers')

      if (!origin || !destination || !departureDate || !passengers) {
        return NextResponse.json({ error: 'Missing search parameters' }, { status: 400 })
      }

      const input = searchFlightsSchema.parse({
        origin,
        destination,
        departureDate,
        passengers: parseInt(passengers),
      })

      const results = await flightsService.searchFlights(input)
      return NextResponse.json(results)
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  } else {
    try {
      const flights = await flightsService.getAllFlights()
      return NextResponse.json(flights)
    } catch {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = createFlightSchema.parse(body)
    const flight = await flightsService.createFlight(input)
    return NextResponse.json(flight, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}