import { NextRequest, NextResponse } from 'next/server'
import { CarsService } from './service'
import { createCarSchema } from './types'

const carsService = new CarsService()

export async function GET(request: NextRequest) {
  try {
    const cars = await carsService.getAllCars()
    return NextResponse.json(cars)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = createCarSchema.parse(body)
    const car = await carsService.createCar(input)
    return NextResponse.json(car, { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}