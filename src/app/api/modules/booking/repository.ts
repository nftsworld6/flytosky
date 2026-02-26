import { prisma } from '@/lib/database/prisma'
import type { Booking } from '@prisma/client'

export class BookingRepository {
  async findAll(): Promise<Booking[]> {
    return prisma.booking.findMany({
      include: {
        user: true,
        tracking: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string): Promise<Booking | null> {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        tracking: true,
      },
    })
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    return prisma.booking.findMany({
      where: { userId },
      include: {
        tracking: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async create(data: {
    userId: string
    type: string
    itemId: string
    totalPrice: number
  }): Promise<Booking> {
    return prisma.booking.create({
      data,
      include: {
        user: true,
      },
    })
  }

  async updateStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'): Promise<Booking> {
    return prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        tracking: true,
      },
    })
  }
}