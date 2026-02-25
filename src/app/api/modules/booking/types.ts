import { z } from 'zod'
import { BookingType } from '@prisma/client'

export const createBookingSchema = z.object({
  type: z.nativeEnum(BookingType),
  itemId: z.string(),
  userId: z.string(),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>