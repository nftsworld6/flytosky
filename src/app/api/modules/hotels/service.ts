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
    return this.repository.create(input)
  }

  async updateHotel(id: string, input: UpdateHotelInput) {
    return this.repository.update(id, input)
  }

  async deleteHotel(id: string) {
    return this.repository.delete(id)
  }
}