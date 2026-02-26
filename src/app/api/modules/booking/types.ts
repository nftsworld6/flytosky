import { z } from 'zod'

export const createBookingSchema = z.object({
  type: z.string(),
  itemId: z.string(),
  userId: z.string(),
  affiliateId: z.string().optional(),
  productType: z.string().optional(), // useful when affiliate rate differs from type
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>