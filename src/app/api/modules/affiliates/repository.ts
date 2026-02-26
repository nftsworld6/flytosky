import { prisma } from '@/lib/database/prisma'
import type { CreateAffiliateInput, UpdateAffiliateCommissionInput, UpdateAffiliateSettingsInput } from './types'

export class AffiliatesRepository {
  async getAffiliateStats(affiliateId: string) {
    const [totalReferrals, totalCommission, pendingTracking, approvedTracking, paidTracking] = await Promise.all([
      prisma.affiliateTracking.count({
        where: { affiliateId },
      }),
      prisma.affiliateTracking.aggregate({
        where: { affiliateId },
        _sum: { commission: true },
      }),
      prisma.affiliateTracking.aggregate({
        where: {
          affiliateId,
          status: 'PENDING',
        },
        _sum: { commission: true },
      }),
      prisma.affiliateTracking.aggregate({
        where: {
          affiliateId,
          status: 'APPROVED',
        },
        _sum: { commission: true },
      }),
      prisma.affiliateTracking.aggregate({
        where: {
          affiliateId,
          status: 'PAID',
        },
        _sum: { commission: true },
      }),
    ])

    // حساب معدل التحويل
    const totalBookings = await prisma.booking.count({
      where: { affiliateId },
    })
    const successfulBookings = await prisma.booking.count({
      where: {
        affiliateId,
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
    })
    const conversionRate = totalBookings > 0 ? (successfulBookings / totalBookings) * 100 : 0

    // حساب عمولة الشهر الحالي
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthlyCommission = await prisma.affiliateTracking.aggregate({
      where: {
        affiliateId,
        createdAt: { gte: monthStart },
      },
      _sum: { commission: true },
    })

    return {
      totalReferrals,
      totalCommission: totalCommission._sum.commission || 0,
      pendingCommission: pendingTracking._sum.commission || 0,
      approvedCommission: approvedTracking._sum.commission || 0,
      paidCommission: paidTracking._sum.commission || 0,
      conversionRate: Math.round(conversionRate * 100) / 100,
      monthlyCommission: monthlyCommission._sum.commission || 0,
    }
  }

  async getAffiliateReferrals(affiliateId: string) {
    return prisma.affiliateTracking.findMany({
      where: { affiliateId },
      include: {
        booking: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  }

  async createTracking(affiliateId: string, bookingId: string, commission: number, commissionRate: number) {
    return prisma.affiliateTracking.create({
      data: {
        affiliateId,
        bookingId,
        commission,
        commissionRate,
        status: 'PENDING',
      },
    })
  }

  async updateTrackingStatus(id: string, status: 'PENDING' | 'APPROVED' | 'PAID') {
    return prisma.affiliateTracking.update({
      where: { id },
      data: { status },
    })
  }

  async createAffiliate(data: CreateAffiliateInput & { affiliateCode: string }) {
    return prisma.user.create({
      data: {
        ...data,
        role: 'AFFILIATE',
        isAffiliateActive: true,
      },
    })
  }

  async getAffiliateById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        affiliateCommissions: true,
        affiliateSettings: true,
      },
    })
  }

  async getAffiliateByCode(code: string) {
    return prisma.user.findUnique({
      where: { affiliateCode: code },
    })
  }

  async getAllAffiliates() {
    return prisma.user.findMany({
      where: { role: 'AFFILIATE' },
      include: {
        affiliateCommissions: true,
        affiliateSettings: true,
      },
    })
  }

  async updateAffiliateCommission(data: UpdateAffiliateCommissionInput & { affiliateId: string }) {
    return prisma.affiliateCommission.upsert({
      where: {
        affiliateId_productType: {
          affiliateId: data.affiliateId,
          productType: data.productType,
        },
      },
      update: {
        commissionRate: data.commissionRate,
        minAmount: data.minAmount || 0,
        maxAmount: data.maxAmount || 999999,
      },
      create: {
        affiliateId: data.affiliateId,
        productType: data.productType,
        commissionRate: data.commissionRate,
        minAmount: data.minAmount || 0,
        maxAmount: data.maxAmount || 999999,
      },
    })
  }

  async getAffiliateCommission(affiliateId: string, productType: string) {
    return prisma.affiliateCommission.findUnique({
      where: {
        affiliateId_productType: {
          affiliateId,
          productType,
        },
      },
    })
  }

  async updateAffiliateSettings(affiliateId: string, data: UpdateAffiliateSettingsInput) {
    return prisma.affiliateSettings.upsert({
      where: { affiliateId },
      update: data,
      create: {
        affiliateId,
        ...data,
      },
    })
  }

  async getAffiliateSettings(affiliateId: string) {
    return prisma.affiliateSettings.findUnique({
      where: { affiliateId },
    })
  }

  async toggleAffiliateActive(affiliateId: string, isActive: boolean) {
    return prisma.user.update({
      where: { id: affiliateId },
      data: { isAffiliateActive: isActive },
    })
  }

  async getRecentReferrals(affiliateId: string, limit: number = 10) {
    return prisma.affiliateTracking.findMany({
      where: { affiliateId },
      include: {
        booking: {
          include: { user: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })
  }

  async getMonthlyEarnings(affiliateId: string, months: number = 12) {
    const earnings = []
    const now = new Date()

    for (let i = 0; i < months; i++) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0)

      const monthlyTotal = await prisma.affiliateTracking.aggregate({
        where: {
          affiliateId,
          createdAt: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
        _sum: { commission: true },
      })

      earnings.unshift({
        month: monthStart.toLocaleString('default', { month: 'long', year: 'numeric' }),
        amount: monthlyTotal._sum.commission || 0,
      })
    }

    return earnings
  }
}