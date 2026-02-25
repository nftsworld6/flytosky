import { MockFlightsProvider } from '@/lib/providers/flights.provider'
import type { SearchFlightsInput } from './types'

export class FlightsService {
  private provider = new MockFlightsProvider()

  async searchFlights(input: SearchFlightsInput) {
    return this.provider.searchFlights(input)
  }
}