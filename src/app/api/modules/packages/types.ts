import { z } from 'zod'

export const createPackageSchema = z.object({
  title: z.string().min(1),
  location: z.string().min(1),
  category: z.string().optional(),
  hotelName: z.string().min(1),
  basePrice: z.number().positive(),
  nights: z.number().int().positive(),
  inclusions: z.array(z.string()),
  image: z.string().url(),
})

export const updatePackageSchema = createPackageSchema.partial()

export type CreatePackageInput = z.infer<typeof createPackageSchema>
export type UpdatePackageInput = z.infer<typeof updatePackageSchema>