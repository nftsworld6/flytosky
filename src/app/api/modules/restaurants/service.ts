import { RestaurantsRepository } from './repository'
import { calculateFinalPrice } from '@/lib/pricing/engine'
import type { CreateRestaurantInput, UpdateRestaurantInput } from './types'
import type { Restaurant } from '@prisma/client'

export class RestaurantsService {
  private repository = new RestaurantsRepository()

  async getAllRestaurants(): Promise<(Restaurant & { finalPrice: number })[]> {
    const restaurants = await this.repository.findAll()
    return restaurants.map(restaurant => ({
      ...restaurant,
      finalPrice: calculateFinalPrice({ basePrice: 50 }), // Placeholder price
    }))
  }

  async getRestaurantById(id: string): Promise<Restaurant & { finalPrice: number }> {
    const restaurant = await this.repository.findById(id)
    if (!restaurant) {
      throw new Error('Restaurant not found')
    }
    return {
      ...restaurant,
      finalPrice: calculateFinalPrice({ basePrice: 50 }),
    }
  }

  async createRestaurant(input: CreateRestaurantInput) {
    return this.repository.create(input)
  }

  async updateRestaurant(id: string, input: UpdateRestaurantInput) {
    return this.repository.update(id, input)
  }

  async deleteRestaurant(id: string) {
    return this.repository.delete(id)
  }
}