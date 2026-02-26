import { FlightsRepository } from './repository'
import { MockFlightsProvider } from '@/lib/providers/flights.provider'
import { calculateFinalPrice } from '@/lib/pricing/engine'
import { env } from '@/lib/config/env'
import { AmadeusProvider } from '@/lib/providers/amadeus.provider'
import type { SearchFlightsInput, CreateFlightInput, UpdateFlightInput } from './types'

export class FlightsService {
  private repository = new FlightsRepository()
  private provider = env.FLIGHTS_PROVIDER === 'amadeus'
    ? new AmadeusProvider(env.AMADEUS_CLIENT_ID || '', env.AMADEUS_CLIENT_SECRET || '')
    : new MockFlightsProvider()

  async getAllFlights() {
    const flights = await this.repository.findAll()
    return flights.map(flight => ({
      ...flight,
      finalPrice: calculateFinalPrice({ basePrice: flight.price }),
    }))
  }

  async getFlightById(id: string) {
    const flight = await this.repository.findById(id)
    if (!flight) {
      throw new Error('Flight not found')
    }
    return {
      ...flight,
      finalPrice: calculateFinalPrice({ basePrice: flight.price }),
    }
  }

  async searchFlights(input: SearchFlightsInput) {
    if (env.FLIGHTS_PROVIDER === 'amadeus') {
      const results = await this.provider.searchFlights({
        originLocationCode: input.origin,
        destinationLocationCode: input.destination,
        departureDate: input.departureDate,
        returnDate: input.returnDate,
        adults: input.adults,
        children: input.children,
        infants: input.infants,
      })
      // Map provider flights to our Flight type
      return results.map(f => ({
        id: f.id,
        airline: f.airline,
        flightNumber: '',
        departure: f.departure,
        arrival: f.arrival,
        departureTime: new Date(f.departureTime),
        arrivalTime: new Date(f.arrivalTime),
        price: f.price,
        seatsAvailable: f.seats,
        finalPrice: calculateFinalPrice({ basePrice: f.price }),
      }))
    }

    const departureDate = new Date(input.departureDate)
    const flights = await this.repository.searchFlights(input.origin, input.destination, departureDate)
    return flights.map(flight => ({
      ...flight,
      finalPrice: calculateFinalPrice({ basePrice: flight.price }),
    }))
  }

  async createFlight(input: CreateFlightInput) {
    return this.repository.create(input)
  }

  async updateFlight(id: string, input: UpdateFlightInput) {
    return this.repository.update(id, input)
  }

  async deleteFlight(id: string) {
    return this.repository.delete(id)
  }
}