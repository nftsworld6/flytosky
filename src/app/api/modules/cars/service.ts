import { CarsRepository } from './repository'
import { calculateFinalPrice } from '@/lib/pricing/engine'
import type { CreateCarInput, UpdateCarInput } from './types'
import type { Car } from '@prisma/client'

export class CarsService {
  private repository = new CarsRepository()

  async getAllCars(): Promise<(Car & { finalPrice: number })[]> {
    const cars = await this.repository.findAll()
    return cars.map(car => ({
      ...car,
      finalPrice: calculateFinalPrice({ basePrice: car.pricePerDay }),
    }))
  }

  async getCarById(id: string): Promise<Car & { finalPrice: number }> {
    const car = await this.repository.findById(id)
    if (!car) {
      throw new Error('Car not found')
    }
    return {
      ...car,
      finalPrice: calculateFinalPrice({ basePrice: car.pricePerDay }),
    }
  }

  async createCar(input: CreateCarInput) {
    return this.repository.create(input)
  }

  async updateCar(id: string, input: UpdateCarInput) {
    return this.repository.update(id, input)
  }

  async deleteCar(id: string) {
    return this.repository.delete(id)
  }
}