import { prisma } from '@/lib/database/prisma'
import type { Car } from '@prisma/client'

export class CarsRepository {
  async findAll(): Promise<Car[]> {
    return prisma.car.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string): Promise<Car | null> {
    return prisma.car.findUnique({
      where: { id },
    })
  }

  async create(data: {
    model: string
    type: string
    location: string
    pricePerDay: number
    seats: number
    image: string
  }): Promise<Car> {
    return prisma.car.create({
      data,
    })
  }

  async update(id: string, data: Partial<{
    model: string
    type: string
    location: string
    pricePerDay: number
    seats: number
    image: string
    isActive: boolean
  }>): Promise<Car> {
    return prisma.car.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<Car> {
    return prisma.car.update({
      where: { id },
      data: { isActive: false },
    })
  }
}