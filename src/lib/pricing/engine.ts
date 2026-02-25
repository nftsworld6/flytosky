import { env } from '@/lib/config/env'

export interface PricingParams {
  basePrice: number
  isAffiliate?: boolean
}

export const calculateFinalPrice = ({ basePrice, isAffiliate = false }: PricingParams): number => {
  const adminMarkup = basePrice * (env.ADMIN_MARKUP_PERCENTAGE / 100)
  const seasonalAdjustment = basePrice * (env.SEASONAL_MULTIPLIER - 1)
  const affiliateCommission = isAffiliate ? basePrice * (env.AFFILIATE_COMMISSION_PERCENTAGE / 100) : 0

  return basePrice + adminMarkup + seasonalAdjustment + affiliateCommission
}