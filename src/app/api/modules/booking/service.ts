import { BookingRepository } from './repository'
import { PackagesService } from '../packages/service'
import { calculateFinalPrice } from '@/lib/pricing/engine'
import type { CreateBookingInput } from './types'

export class BookingService {
  private repository = new BookingRepository()
  private packagesService = new PackagesService()

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
    const pkg = await this.packagesService.getPackageById(input.packageId)
    const totalPrice = calculateFinalPrice({ basePrice: pkg.basePrice })

    return this.repository.create({
      userId: input.userId,
      packageId: input.packageId,
      totalPrice,
    })
  }

  async updateBookingStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED') {
    return this.repository.updateStatus(id, status)
  }
}