import { HotelsRepository } from './repository'
import { MockHotelsProvider, HotelsProvider } from '@/lib/providers/hotels.provider'
import { calculateFinalPrice } from '@/lib/pricing/engine'
import { env } from '@/lib/config/env'
import { getAmadeusProvider } from '@/lib/providers/amadeus.provider'
import type { SearchHotelsInput, CreateHotelInput, UpdateHotelInput } from './types'

export class HotelsService {
  private repository = new HotelsRepository()
  private provider: HotelsProvider = env.HOTELS_PROVIDER === 'amadeus'
    ? (getAmadeusProvider() as unknown as HotelsProvider)
    : new MockHotelsProvider()

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
    if (env.HOTELS_PROVIDER === 'amadeus') {
      // delegate to provider for global search
      const results = await this.provider.searchHotels({
        cityCode: input.location,
        checkInDate: input.checkIn,
        checkOutDate: input.checkOut,
        adults: input.guests,
      } as any)
      return results.map((h: any) => ({
        id: h.id || h.hotelId,
        name: h.name,
        location: h.location || h.address,
        rating: h.rating,
        pricePerNight: h.pricePerNight || h.price,
        amenities: (h.amenities || []).join(','),
        finalPrice: calculateFinalPrice({ basePrice: h.pricePerNight || h.price }),
      }))
    }

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