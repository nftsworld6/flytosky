import { BookingRepository } from './repository'
import { PackagesService } from '../packages/service'
import { FlightsService } from '../flights/service'
import { HotelsService } from '../hotels/service'
import { CarsService } from '../cars/service'
import { RestaurantsService } from '../restaurants/service'
import { WorkContractsService } from '../work_contracts/service'
import { calculateFinalPrice } from '@/lib/pricing/engine'
import type { CreateBookingInput } from './types'

export class BookingService {
  private repository = new BookingRepository()
  private packagesService = new PackagesService()
  private flightsService = new FlightsService()
  private hotelsService = new HotelsService()
  private carsService = new CarsService()
  private restaurantsService = new RestaurantsService()
  private workContractsService = new WorkContractsService()

  async getAllBookings() {
    return this.repository.findAll()
  }

  async getBookingById(id: string) {
    const booking = await this.repository.findById(id)
    if (!booking) {
      throw new Error('Booking not found')
    }
    return booking
  }

  async getBookingsByUser(userId: string) {
    return this.repository.findByUserId(userId)
  }

  async createBooking(input: CreateBookingInput) {
    let basePrice = 0

    switch (input.type) {
      case 'PACKAGE':
        const pkg = await this.packagesService.getPackageById(input.itemId)
        basePrice = pkg.basePrice
        break
      case 'FLIGHT':
        const flight = await this.flightsService.getFlightById(input.itemId)
        basePrice = flight.price
        break
      case 'HOTEL':
        const hotel = await this.hotelsService.getHotelById(input.itemId)
        basePrice = hotel.pricePerNight
        break
      case 'CAR':
        const car = await this.carsService.getCarById(input.itemId)
        basePrice = car.pricePerDay
        break
      case 'RESTAURANT':
        // Assume booking for a meal, use a fixed price or from restaurant
        const restaurant = await this.restaurantsService.getRestaurantById(input.itemId)
        basePrice = 50 // Placeholder, could be dynamic
        break
      case 'WORK_CONTRACT':
        // Work contracts might not have booking price, but for consistency
        basePrice = 0
        break
      default:
        throw new Error('Invalid booking type')
    }

    const totalPrice = calculateFinalPrice({ basePrice })

    return this.repository.create({
      userId: input.userId,
      type: input.type,
      itemId: input.itemId,
      totalPrice,
    })
  }

  async updateBookingStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED') {
    return this.repository.updateStatus(id, status)
  }
}