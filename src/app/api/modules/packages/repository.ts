import { prisma } from '@/lib/database/prisma'
import type { Package } from '@prisma/client'

export class PackagesRepository {
  async findAll(): Promise<Package[]> {
    return prisma.package.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string): Promise<Package | null> {
    return prisma.package.findUnique({
      where: { id },
    })
  }

  async create(data: {
    title: string
    location: string
    hotelName: string
    basePrice: number
    nights: number
    inclusions: string[]
    image: string
  }): Promise<Package> {
    return prisma.package.create({
      data,
    })
  }

  async update(id: string, data: Partial<{
    title: string
    location: string
    hotelName: string
    basePrice: number
    nights: number
    inclusions: string[]
    image: string
    isActive: boolean
  }>): Promise<Package> {
    return prisma.package.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<Package> {
    return prisma.package.update({
      where: { id },
      data: { isActive: false },
    })
  }
}