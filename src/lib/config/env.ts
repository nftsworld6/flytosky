import { z } from 'zod'

const envSchema = z.object({
  DATABASE_URL: z.string().default('postgresql://user:password@localhost:5432/flytosky'),
  JWT_SECRET: z.string().default('default-jwt-secret-key-for-development'),
  FLIGHTS_PROVIDER: z.string().default('mock'),
  HOTELS_PROVIDER: z.string().default('mock'),
  ADMIN_MARKUP_PERCENTAGE: z.coerce.number().default(10),
  SEASONAL_MULTIPLIER: z.coerce.number().default(1.0),
  AFFILIATE_COMMISSION_PERCENTAGE: z.coerce.number().default(5),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  AMADEUS_CLIENT_ID: z.string().optional(),
  AMADEUS_CLIENT_SECRET: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
})

export const env = envSchema.parse(process.env || {})