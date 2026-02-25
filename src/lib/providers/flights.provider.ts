export interface SearchParams {
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: number
}

export interface FlightResult {
  id: string
  airline: string
  flightNumber: string
  departureTime: string
  arrivalTime: string
  price: number
  duration: string
}

export interface FlightsProvider {
  searchFlights(params: SearchParams): Promise<FlightResult[]>
}

export class MockFlightsProvider implements FlightsProvider {
  async searchFlights(params: SearchParams): Promise<FlightResult[]> {
    // Mock implementation - replace with real API call
    return [
      {
        id: '1',
        airline: 'Mock Airlines',
        flightNumber: 'MA101',
        departureTime: params.departureDate + 'T10:00:00Z',
        arrivalTime: params.departureDate + 'T14:00:00Z',
        price: 299.99,
        duration: '4h',
      },
    ]
  }
}