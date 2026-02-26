import { NextRequest, NextResponse } from 'next/server'
import { AffiliatesService } from './service'
import { 
  createAffiliateSchema, 
  updateAffiliateCommissionSchema,
  updateAffiliateSettingsSchema
} from './types'

const affiliatesService = new AffiliatesService()

// الحصول على إحصائيات المسوق الحالي
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const affiliateId = searchParams.get('affiliateId') || searchParams.get('id')
    const type = searchParams.get('type') || 'stats'

    if (!affiliateId) {
      return NextResponse.json(
        { error: 'Affiliate ID is required' },
        { status: 400 }
      )
    }

    if (type === 'referrals') {
      const referrals = await affiliatesService.getAffiliateReferrals(affiliateId)
      return NextResponse.json(referrals)
    }

    if (type === 'earnings') {
      const months = parseInt(searchParams.get('months') || '12')
      const earnings = await affiliatesService.getMonthlyEarnings(affiliateId, months)
      return NextResponse.json(earnings)
    }

    if (type === 'settings') {
      const settings = await affiliatesService.getAffiliateSettings(affiliateId)
      return NextResponse.json(settings)
    }

    if (type === 'info') {
      const affiliate = await affiliatesService.getAffiliateById(affiliateId)
      if (!affiliate) {
        return NextResponse.json({ error: 'Affiliate not found' }, { status: 404 })
      }
      const stats = await affiliatesService.getAffiliateStats(affiliateId)
      return NextResponse.json({ ...affiliate, stats })
    }

    // الافتراضي: إرجاع الإحصائيات
    const stats = await affiliatesService.getAffiliateStats(affiliateId)
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching affiliate data:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// إنشاء مسوق جديد (للمسؤولين فقط)
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')

    if (action === 'create') {
      const body = await request.json()
      const data = createAffiliateSchema.parse(body)
      const affiliate = await affiliatesService.createAffiliate(data)
      return NextResponse.json(affiliate, { status: 201 })
    }

    if (action === 'commission') {
      const { affiliateId, ...commissionData } = await request.json()
      const validated = updateAffiliateCommissionSchema.parse(commissionData)
      const commission = await affiliatesService.setAffiliateCommission(affiliateId, validated)
      return NextResponse.json(commission)
    }

    if (action === 'settings') {
      const { affiliateId, ...settingsData } = await request.json()
      const validated = updateAffiliateSettingsSchema.parse(settingsData)
      const settings = await affiliatesService.updateAffiliateSettings(affiliateId, validated)
      return NextResponse.json(settings)
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    console.error('Error creating affiliate:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// تحديث حالة المسوق
export async function PATCH(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const action = searchParams.get('action')
    const { affiliateId } = await request.json()

    if (!affiliateId) {
      return NextResponse.json(
        { error: 'Affiliate ID is required' },
        { status: 400 }
      )
    }

    if (action === 'toggle') {
      const { isActive } = await request.json()
      const result = await affiliatesService.toggleAffiliateStatus(affiliateId, isActive)
      return NextResponse.json(result)
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating affiliate:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}