import { z } from 'zod'

export const searchHotelsSchema = z.object({
  location: z.string().min(2),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int().positive(),
})

export type SearchHotelsInput = z.infer<typeof searchHotelsSchema>