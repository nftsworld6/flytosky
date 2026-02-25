import { prisma } from '@/lib/database/prisma'
import type { Hotel } from '@prisma/client'

export class HotelsRepository {
  async findAll(): Promise<Hotel[]> {
    return prisma.hotel.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string): Promise<Hotel | null> {
    return prisma.hotel.findUnique({
      where: { id },
    })
  }

  async searchHotels(location: string): Promise<Hotel[]> {
    return prisma.hotel.findMany({
      where: {
        location: { contains: location, mode: 'insensitive' },
        isActive: true,
      },
      orderBy: { rating: 'desc' },
    })
  }

  async create(data: {
    name: string
    location: string
    rating: number
    pricePerNight: number
    amenities: string[]
    image: string
  }): Promise<Hotel> {
    return prisma.hotel.create({
      data,
    })
  }

  async update(id: string, data: Partial<{
    name: string
    location: string
    rating: number
    pricePerNight: number
    amenities: string[]
    image: string
    isActive: boolean
  }>): Promise<Hotel> {
    return prisma.hotel.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<Hotel> {
    return prisma.hotel.update({
      where: { id },
      data: { isActive: false },
    })
  }
}