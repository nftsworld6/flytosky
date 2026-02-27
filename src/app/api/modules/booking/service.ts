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
        const restaurant = await this.restaurantsService.getRestaurantById(input.itemId)
        basePrice = restaurant.priceRange ? parseFloat(restaurant.priceRange.replace(/[^0-9\.]/g, '')) || 50 : 50
        break
      case 'WORK_CONTRACT':
        // Work contracts might not have booking price, but for consistency
        basePrice = 0
        break
      default:
        throw new Error('Invalid booking type')
    }

    const totalPrice = calculateFinalPrice({ basePrice })

    const booking = await this.repository.create({
      userId: input.userId,
      type: input.type,
      itemId: input.itemId,
      totalPrice,
      affiliateId: input.affiliateId || null,
    })

    // تتبع الإحالة في حالة وجود affiliateId
    if (input.affiliateId) {
      await this.trackReferral(input.affiliateId, booking.id, basePrice, input.productType || input.type)
    }

    // بعد إنشاء الحجز، إرسال إشعارات
    try {
      const user = await this.repository.findUserById(input.userId)
      const userEmail = user?.email
      if (input.type === 'RESTAURANT') {
        const rest = await this.restaurantsService.getRestaurantById(input.itemId)
        // the Restaurant type coming from the service is missing some optional
        // fields in its default-selection alias (contactEmail, etc.), so we cast to
        // any here before accessing them.
        if ((rest as any).contactEmail) {
          await import('@/lib/notification/mailer').then(m =>
            m.sendEmail(
              (rest as any).contactEmail,
              'New restaurant reservation',
              `A new booking has been made for ${rest.name}. Booking ID: ${booking.id}`
            )
          )
        }
      }
      if (input.type === 'CAR') {
        const carInfo = await this.carsService.getCarById(input.itemId)
        if ((carInfo as any).contactEmail) {
          await import('@/lib/notification/mailer').then(m =>
            m.sendEmail(
              (carInfo as any).contactEmail,
              'New car rental reservation',
              `A new car rental booking has been made for ${carInfo.model}. Booking ID: ${booking.id}`
            )
          )
        }
      }
      // Send confirmation to user
      if (userEmail) {
        await import('@/lib/notification/mailer').then(m =>
          m.sendEmail(
            userEmail,
            'Booking confirmed',
            `Your booking (ID ${booking.id}) has been placed successfully.`
          )
        )
      }
    } catch (err) {
      console.error('Notification error', err)
    }

    return booking
  }

  async updateBookingStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'CANCELLED') {
    return this.repository.updateStatus(id, status)
  }

  private async trackReferral(affiliateId: string, bookingId: string, basePrice: number, productType: string) {
    // Import affiliates service and track the referral
    const AffiliatesRepository = (await import('../affiliates/repository')).AffiliatesRepository
    const affiliatesRepo = new AffiliatesRepository()
    
    const commissionRate = 5 // Default 5%
    const commission = (basePrice * commissionRate) / 100
    
    await affiliatesRepo.createTracking(affiliateId, bookingId, commission, commissionRate)
  }
}