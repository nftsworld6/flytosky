import { AffiliatesRepository } from './repository'
import type { 
  AffiliateStats, 
  CreateAffiliateInput,
  UpdateAffiliateCommissionInput,
  UpdateAffiliateSettingsInput 
} from './types'
import { v4 as uuidv4 } from 'uuid'

export class AffiliatesService {
  private repository = new AffiliatesRepository()

  async getAffiliateStats(affiliateId: string): Promise<AffiliateStats> {
    return this.repository.getAffiliateStats(affiliateId)
  }

  async getAffiliateReferrals(affiliateId: string) {
    return this.repository.getAffiliateReferrals(affiliateId)
  }

  async trackReferral(affiliateId: string, bookingId: string, basePrice: number, productType: string = 'PACKAGE') {
    // الحصول على معدل العمولة الخاص بالمسوق
    const commission = await this.repository.getAffiliateCommission(affiliateId, productType)
    const commissionRate = commission?.commissionRate || 5 // القيمة الافتراضية 5%
    
    // حساب العمولة
    const calculatedCommission = (basePrice * commissionRate) / 100
    
    return this.repository.createTracking(affiliateId, bookingId, calculatedCommission, commissionRate)
  }

  async createAffiliate(data: CreateAffiliateInput) {
    // توليد رمز فريد للمسوق
    const affiliateCode = `AFF-${uuidv4().slice(0, 8).toUpperCase()}`
    
    return this.repository.createAffiliate({
      ...data,
      affiliateCode,
    })
  }

  async getAffiliateById(id: string) {
    return this.repository.getAffiliateById(id)
  }

  async getAffiliateByCode(code: string) {
    return this.repository.getAffiliateByCode(code)
  }

  async getAllAffiliates() {
    return this.repository.getAllAffiliates()
  }

  async setAffiliateCommission(affiliateId: string, data: UpdateAffiliateCommissionInput) {
    return this.repository.updateAffiliateCommission({
      ...data,
      affiliateId,
    })
  }

  async updateAffiliateSettings(affiliateId: string, data: UpdateAffiliateSettingsInput) {
    return this.repository.updateAffiliateSettings(affiliateId, data)
  }

  async getAffiliateSettings(affiliateId: string) {
    return this.repository.getAffiliateSettings(affiliateId)
  }

  async toggleAffiliateStatus(affiliateId: string, isActive: boolean) {
    return this.repository.toggleAffiliateActive(affiliateId, isActive)
  }

  async updateTrackingStatus(id: string, status: 'PENDING' | 'APPROVED' | 'PAID') {
    return this.repository.updateTrackingStatus(id, status)
  }

  async getRecentReferrals(affiliateId: string, limit: number = 10) {
    return this.repository.getRecentReferrals(affiliateId, limit)
  }

  async getMonthlyEarnings(affiliateId: string, months: number = 12) {
    return this.repository.getMonthlyEarnings(affiliateId, months)
  }

  // إنشاء رابط الحالة
  async generateAffiliateLink(affiliateCode: string, productType: string = 'packages'): Promise<string> {
    return `${process.env.APP_URL || 'http://localhost:3000'}/${productType}?ref=${affiliateCode}`
  }
}