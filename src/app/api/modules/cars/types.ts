import { z } from 'zod'

export const createCarSchema = z.object({
  model: z.string().min(1),
  type: z.string().min(1),
  location: z.string().min(1),
  pricePerDay: z.number().positive(),
  seats: z.number().int().positive(),
  image: z.string().url(),
})

export const updateCarSchema = createCarSchema.partial()

export type CreateCarInput = z.infer<typeof createCarSchema>
export type UpdateCarInput = z.infer<typeof updateCarSchema>