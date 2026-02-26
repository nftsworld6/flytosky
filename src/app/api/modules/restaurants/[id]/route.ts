import { NextRequest, NextResponse } from 'next/server'
import { RestaurantsService } from '../service'
import { updateRestaurantSchema } from '../types'

const restaurantsService = new RestaurantsService()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const restaurant = await restaurantsService.getRestaurantById(params.id)
    return NextResponse.json(restaurant)
  } catch (error) {
    if (error instanceof Error && error.message === 'Restaurant not found') {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 })
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
    const input = updateRestaurantSchema.parse(body)
    const restaurant = await restaurantsService.updateRestaurant(params.id, input)
    return NextResponse.json(restaurant)
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
    await restaurantsService.deleteRestaurant(params.id)
    return NextResponse.json({ message: 'Restaurant deleted' })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}