import { FlightsRepository } from './repository'
import { MockFlightsProvider } from '@/lib/providers/flights.provider'
import { calculateFinalPrice } from '@/lib/pricing/engine'
import type { SearchFlightsInput, CreateFlightInput, UpdateFlightInput } from './types'

export class FlightsService {
  private repository = new FlightsRepository()
  private provider = new MockFlightsProvider()

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