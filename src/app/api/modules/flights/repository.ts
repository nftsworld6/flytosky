import { prisma } from '@/lib/database/prisma'
import type { Flight } from '@prisma/client'

export class FlightsRepository {
  async findAll(): Promise<Flight[]> {
    return prisma.flight.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findById(id: string): Promise<Flight | null> {
    return prisma.flight.findUnique({
      where: { id },
    })
  }

  async searchFlights(origin: string, destination: string, departureDate: Date): Promise<Flight[]> {
    return prisma.flight.findMany({
      where: {
        departure: origin,
        arrival: destination,
        departureTime: {
          gte: departureDate,
          lt: new Date(departureDate.getTime() + 24 * 60 * 60 * 1000),
        },
        isActive: true,
        seatsAvailable: { gt: 0 },
      },
      orderBy: { price: 'asc' },
    })
  }

  async create(data: {
    airline: string
    flightNumber: string
    departure: string
    arrival: string
    departureTime: Date
    arrivalTime: Date
    price: number
    seatsAvailable: number
  }): Promise<Flight> {
    return prisma.flight.create({
      data,
    })
  }

  async update(id: string, data: Partial<{
    airline: string
    flightNumber: string
    departure: string
    arrival: string
    departureTime: Date
    arrivalTime: Date
    price: number
    seatsAvailable: number
    isActive: boolean
  }>): Promise<Flight> {
    return prisma.flight.update({
      where: { id },
      data,
    })
  }

  async delete(id: string): Promise<Flight> {
    return prisma.flight.update({
      where: { id },
      data: { isActive: false },
    })
  }
}