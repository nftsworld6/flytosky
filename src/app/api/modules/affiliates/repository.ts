import { prisma } from '@/lib/database/prisma'

export class AffiliatesRepository {
  async getAffiliateStats(affiliateId: string) {
    const [totalReferrals, totalCommission, pendingCommission] = await Promise.all([
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
          booking: {
            status: 'PENDING',
          },
        },
        _sum: { commission: true },
      }),
    ])

    return {
      totalReferrals,
      totalCommission: totalCommission._sum.commission || 0,
      pendingCommission: pendingCommission._sum.commission || 0,
    }
  }

  async getAffiliateReferrals(affiliateId: string) {
    return prisma.affiliateTracking.findMany({
      where: { affiliateId },
      include: {
        booking: {
          include: {
            user: true,
            package: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async createTracking(affiliateId: string, bookingId: string, commission: number) {
    return prisma.affiliateTracking.create({
      data: {
        affiliateId,
        bookingId,
        commission,
      },
    })
  }
}