import { NextRequest, NextResponse } from 'next/server'
import { HotelsService } from './service'
import { searchHotelsSchema, createHotelSchema } from './types'

const hotelsService = new HotelsService()

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')

  if (action === 'search') {
    try {
      const location = searchParams.get('location')
      const checkIn = searchParams.get('checkIn')
      const checkOut = searchParams.get('checkOut')
      const guests = searchParams.get('guests')

      if (!location || !checkIn || !checkOut || !guests) {
        return NextResponse.json({ error: 'Missing search parameters' }, { status: 400 })
      }

      const input = searchHotelsSchema.parse({
        location,
        checkIn,
        checkOut,
        guests: parseInt(guests),
      })

      const results = await hotelsService.searchHotels(input)
      return NextResponse.json(results)
    } catch (error) {
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  } else {
    try {
      const hotels = await hotelsService.getAllHotels()
      return NextResponse.json(hotels)
    } catch {
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = createHotelSchema.parse(body)
    const hotel = await hotelsService.createHotel(input)
    return NextResponse.json(hotel, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}