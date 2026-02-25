import { NextRequest, NextResponse } from 'next/server'
import { BookingService } from './service'
import { createBookingSchema } from './types'

const bookingService = new BookingService()

export async function GET() {
  try {
    const bookings = await bookingService.getAllBookings()
    return NextResponse.json(bookings)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = createBookingSchema.parse(body)
    const booking = await bookingService.createBooking(input)
    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}