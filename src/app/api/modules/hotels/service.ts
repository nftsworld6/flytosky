import { HotelsRepository } from './repository'
import { MockHotelsProvider } from '@/lib/providers/hotels.provider'
import { calculateFinalPrice } from '@/lib/pricing/engine'
import type { SearchHotelsInput, CreateHotelInput, UpdateHotelInput } from './types'

export class HotelsService {
  private repository = new HotelsRepository()
  private provider = new MockHotelsProvider()

  async getAllHotels() {
    const hotels = await this.repository.findAll()
    return hotels.map(hotel => ({
      ...hotel,
      amenities: JSON.parse(hotel.amenities),
      finalPrice: calculateFinalPrice({ basePrice: hotel.pricePerNight }),
    }))
  }

  async getHotelById(id: string) {
    const hotel = await this.repository.findById(id)
    if (!hotel) {
      throw new Error('Hotel not found')
    }
    return {
      ...hotel,
      amenities: JSON.parse(hotel.amenities),
      finalPrice: calculateFinalPrice({ basePrice: hotel.pricePerNight }),
    }
  }

  async searchHotels(input: SearchHotelsInput) {
    const hotels = await this.repository.searchHotels(input.location)
    return hotels.map(hotel => ({
      ...hotel,
      finalPrice: calculateFinalPrice({ basePrice: hotel.pricePerNight }),
    }))
  }

  async createHotel(input: CreateHotelInput) {
    const data = {
      ...input,
      amenities: JSON.stringify(input.amenities),
    }
    return this.repository.create(data)
  }

  async updateHotel(id: string, input: UpdateHotelInput) {
    const data = {
      ...input,
      amenities: input.amenities ? JSON.stringify(input.amenities) : undefined,
    }
    return this.repository.update(id, data)
  }

  async deleteHotel(id: string) {
    return this.repository.delete(id)
  }
}