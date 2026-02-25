import { NextRequest, NextResponse } from 'next/server'
import { HotelsService } from '../service'
import { updateHotelSchema } from '../types'

const hotelsService = new HotelsService()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hotel = await hotelsService.getHotelById(params.id)
    return NextResponse.json(hotel)
  } catch (error) {
    if (error instanceof Error && error.message === 'Hotel not found') {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
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
    const input = updateHotelSchema.parse(body)
    const hotel = await hotelsService.updateHotel(params.id, input)
    return NextResponse.json(hotel)
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
    await hotelsService.deleteHotel(params.id)
    return NextResponse.json({ message: 'Hotel deleted' })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}