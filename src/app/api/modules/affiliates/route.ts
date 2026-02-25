import { NextResponse } from 'next/server'
import { AffiliatesService } from './service'

const affiliatesService = new AffiliatesService()

export async function GET() {
  try {
    // In a real app, get affiliateId from authenticated user
    const affiliateId = 'mock-affiliate-id'
    const stats = await affiliatesService.getAffiliateStats(affiliateId)
    return NextResponse.json(stats)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}