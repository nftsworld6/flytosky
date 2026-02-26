import { prisma } from '@/lib/database/prisma'
import type { Restaurant } from '@prisma/client'

export class RestaurantsRepository {
  async findAll(): Promise<Restaurant[]> {
    return prisma.restaurant.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string): Promise<Restaurant | null> {
    return prisma.restaurant.findUnique({
      where: { id },
    })
  }

  async create(data: {
    name: string
    location: string
    cuisine: string
    rating: number
    priceRange: string
    image: string
  }): Promise<Restaurant> {
    return prisma.restaurant.create({
      data,
    })
  }

  async update(id: string, data: Partial<{
    name: string
    location: string
    cuisine: string
    rating: number
    priceRange: string
    image: string
    isActive: boolean
  }>): Promise<Restaurant> {
    return prisma.restaurant.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<Restaurant> {
    return prisma.restaurant.update({
      where: { id },
      data: { isActive: false },
    })
  }
}