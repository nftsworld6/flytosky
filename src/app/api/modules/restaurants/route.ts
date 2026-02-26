import { NextRequest, NextResponse } from 'next/server'
import { RestaurantsService } from './service'
import { createRestaurantSchema } from './types'

const restaurantsService = new RestaurantsService()

export async function GET() {
  try {
    const restaurants = await restaurantsService.getAllRestaurants()
    return NextResponse.json(restaurants)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = createRestaurantSchema.parse(body)
    const restaurant = await restaurantsService.createRestaurant(input)
    return NextResponse.json(restaurant, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}