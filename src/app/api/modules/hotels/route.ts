import { NextRequest, NextResponse } from 'next/server'
import { HotelsService } from './service'
import { searchHotelsSchema } from './types'

const hotelsService = new HotelsService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const input = searchHotelsSchema.parse(body)
    const results = await hotelsService.searchHotels(input)
    return NextResponse.json(results)
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}