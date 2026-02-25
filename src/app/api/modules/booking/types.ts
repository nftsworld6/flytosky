import { z } from 'zod'

export const createBookingSchema = z.object({
  packageId: z.string(),
  userId: z.string(),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>