import { z } from 'zod'

export const createAffiliateSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  companyName: z.string().optional(),
  taxNumber: z.string().optional(),
  bankAccount: z.string().optional(),
})

export const updateAffiliateSchema = z.object({
  name: z.string().optional(),
  companyName: z.string().optional(),
  taxNumber: z.string().optional(),
  bankAccount: z.string().optional(),
})

export const updateAffiliateCommissionSchema = z.object({
  productType: z.enum(['PACKAGE', 'FLIGHT', 'HOTEL', 'CAR', 'RESTAURANT', 'VISA', 'YACHT']),
  commissionRate: z.number().min(0).max(100),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
})

export const updateAffiliateSettingsSchema = z.object({
  paymentMethod: z.string().optional(),
  paymentDetails: z.string().optional(),
  taxRate: z.number().optional(),
  minimumPayout: z.number().optional(),
  payoutFrequency: z.enum(['MONTHLY', 'WEEKLY', 'ON_DEMAND']).optional(),
})

export interface AffiliateStats {
  totalReferrals: number
  totalCommission: number
  pendingCommission: number
  approvedCommission: number
  paidCommission: number
  conversionRate: number
  monthlyCommission?: number
}

export interface AffiliateInfo {
  id: string
  name: string
  email: string
  affiliateCode: string
  companyName?: string
  isAffiliateActive: boolean
  createdAt: string
  updatedAt: string
  stats: AffiliateStats
}

export interface AffiliateReferral {
  id: string
  bookingId: string
  commission: number
  commissionRate: number
  status: string
  productType: string
  totalPrice: number
  customerName: string
  createdAt: string
}

export type CreateAffiliateInput = z.infer<typeof createAffiliateSchema>
export type UpdateAffiliateInput = z.infer<typeof updateAffiliateSchema>
export type UpdateAffiliateCommissionInput = z.infer<typeof updateAffiliateCommissionSchema>
export type UpdateAffiliateSettingsInput = z.infer<typeof updateAffiliateSettingsSchema>