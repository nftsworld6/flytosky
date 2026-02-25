export interface HotelSearchParams {
  location: string
  checkIn: string
  checkOut: string
  guests: number
}

export interface HotelResult {
  id: string
  name: string
  location: string
  rating: number
  pricePerNight: number
  amenities: string[]
}

export interface HotelsProvider {
  searchHotels(params: HotelSearchParams): Promise<HotelResult[]>
}

export class MockHotelsProvider implements HotelsProvider {
  async searchHotels(params: HotelSearchParams): Promise<HotelResult[]> {
    // Mock implementation - replace with real API call
    return [
      {
        id: '1',
        name: 'Mock Hotel',
        location: params.location,
        rating: 4.5,
        pricePerNight: 150.00,
        amenities: ['WiFi', 'Pool', 'Gym'],
      },
    ]
  }
}