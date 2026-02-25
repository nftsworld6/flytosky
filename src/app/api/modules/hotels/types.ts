import { z } from 'zod'

export const searchHotelsSchema = z.object({
  location: z.string().min(2),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int().positive(),
})

export const createHotelSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  rating: z.number().min(0).max(5),
  pricePerNight: z.number().positive(),
  amenities: z.array(z.string()),
  image: z.string().url(),
})

export const updateHotelSchema = createHotelSchema.partial()

export type SearchHotelsInput = z.infer<typeof searchHotelsSchema>
export type CreateHotelInput = z.infer<typeof createHotelSchema>
export type UpdateHotelInput = z.infer<typeof updateHotelSchema>