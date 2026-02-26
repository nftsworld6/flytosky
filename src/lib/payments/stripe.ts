import Stripe from 'stripe'
import { env } from '../config/env'

const stripe = new Stripe(env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' })

export async function createPaymentIntent(amount: number, currency: string = 'usd', metadata: any = {}) {
  return stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency,
    metadata,
  })
}

export async function retrievePaymentIntent(id: string) {
  return stripe.paymentIntents.retrieve(id)
}

// يمكنك إضافة وظائف مساعدة أخرى، مثل إنشاء روابط الدفع أو إدارة العملاء
