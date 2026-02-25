import { AffiliatesRepository } from './repository'
import type { AffiliateStats } from './types'

export class AffiliatesService {
  private repository = new AffiliatesRepository()

  async getAffiliateStats(affiliateId: string): Promise<AffiliateStats> {
    return this.repository.getAffiliateStats(affiliateId)
  }

  async getAffiliateReferrals(affiliateId: string) {
    return this.repository.getAffiliateReferrals(affiliateId)
  }

  async trackReferral(affiliateId: string, bookingId: string, commission: number) {
    return this.repository.createTracking(affiliateId, bookingId, commission)
  }
}