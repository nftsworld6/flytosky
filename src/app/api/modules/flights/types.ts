import { z } from 'zod'

export const searchFlightsSchema = z.object({
  origin: z.string().min(3),
  destination: z.string().min(3),
  departureDate: z.string(),
  returnDate: z.string().optional(),
  passengers: z.number().int().positive(),
})

export const createFlightSchema = z.object({
  airline: z.string().min(1),
  flightNumber: z.string().min(1),
  departure: z.string().min(1),
  arrival: z.string().min(1),
  departureTime: z.string().transform(str => new Date(str)),
  arrivalTime: z.string().transform(str => new Date(str)),
  price: z.number().positive(),
  seatsAvailable: z.number().int().positive(),
})

export const updateFlightSchema = createFlightSchema.partial()

export type SearchFlightsInput = z.infer<typeof searchFlightsSchema>
export type CreateFlightInput = z.infer<typeof createFlightSchema>
export type UpdateFlightInput = z.infer<typeof updateFlightSchema>