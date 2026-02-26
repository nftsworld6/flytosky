import { z } from 'zod'

export const createRestaurantSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  cuisine: z.string().min(1),
  rating: z.number().min(0).max(5),
  priceRange: z.string().min(1),
  image: z.string().url(),
})

export const updateRestaurantSchema = createRestaurantSchema.partial()

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>