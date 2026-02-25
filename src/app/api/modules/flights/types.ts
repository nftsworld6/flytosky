import { z } from 'zod'

export const searchFlightsSchema = z.object({
  origin: z.string().min(3),
  destination: z.string().min(3),
  departureDate: z.string(),
  returnDate: z.string().optional(),
  passengers: z.number().int().positive(),
})

export type SearchFlightsInput = z.infer<typeof searchFlightsSchema>