/**
 * Amadeus API Integration Provider
 * 
 * هذا الملف يوفر الدوال الأساسية لتكامل Amadeus API
 * للحصول على بيانات الفنادق والرحلات الجوية
 */

import axios, { AxiosInstance } from 'axios'

interface AmadeusTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

interface Hotel {
  hotelId: string
  name: string
  address: string
  rating: number
  price: number
  image?: string
  amenities: string[]
}

interface Flight {
  id: string
  airline: string
  departure: string
  arrival: string
  departureTime: string
  arrivalTime: string
  price: number
  seats: number
}

class AmadeusProvider {
  private clientId: string
  private clientSecret: string
  private accessToken: string | null = null
  private tokenExpiration: number | null = null
  private axiosInstance: AxiosInstance

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    
    this.axiosInstance = axios.create({
      baseURL: 'https://api.amadeus.com/v2',
      headers: {
        'Accept': 'application/vnd.amadeus+json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  }

  /**
   * الحصول على access token أو تحديثه
   */
  async getAccessToken(): Promise<string> {
    // تحقق إذا كان التوكن لا يزال صالحاً
    if (this.accessToken && this.tokenExpiration && Date.now() < this.tokenExpiration) {
      return this.accessToken
    }

    try {
      const response = await axios.post<AmadeusTokenResponse>(
        'https://api.amadeus.com/v1/security/oauth2/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.clientId,
          client_secret: this.clientSecret,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      )

      this.accessToken = response.data.access_token
      this.tokenExpiration = Date.now() + response.data.expires_in * 1000
      
      return this.accessToken
    } catch (error) {
      console.error('Failed to get Amadeus access token:', error)
      throw new Error('Unable to authenticate with Amadeus API')
    }
  }

  /**
   * البحث عن الفنادق
   */
  async searchHotels(params: {
    cityCode: string
    checkInDate: string
    checkOutDate: string
    adults: number
    radius?: number
    language?: string
  }): Promise<Hotel[]> {
    try {
      const token = await this.getAccessToken()
      
      const response = await this.axiosInstance.get('/shopping/hotel-offers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          cityCode: params.cityCode,
          checkInDate: params.checkInDate,
          checkOutDate: params.checkOutDate,
          adults: params.adults,
          radius: params.radius || 5,
          language: params.language || 'en',
        },
      })

      // تحويل البيانات من صيغة Amadeus إلى صيغتنا
      return response.data.data?.map((hotel: any) => ({
        hotelId: hotel.id,
        name: hotel.name,
        address: hotel.address?.city || 'Unknown',
        rating: hotel.rating || 0,
        price: hotel.offers?.[0]?.price?.total || 0,
        image: hotel.image,
        amenities: hotel.amenities || [],
      })) || []
    } catch (error) {
      console.error('Hotel search failed:', error)
      throw error
    }
  }

  /**
   * البحث عن الرحلات الجوية
   */
  async searchFlights(params: {
    originLocationCode: string
    destinationLocationCode: string
    departureDate: string
    returnDate?: string
    adults: number
    children?: number
    infants?: number
  }): Promise<Flight[]> {
    try {
      const token = await this.getAccessToken()

      const response = await this.axiosInstance.get('/shopping/flight-offers', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          originLocationCode: params.originLocationCode,
          destinationLocationCode: params.destinationLocationCode,
          departureDate: params.departureDate,
          returnDate: params.returnDate,
          adults: params.adults,
          children: params.children || 0,
          infants: params.infants || 0,
          max: 10, // الحد الأقصى 10 نتائج
        },
      })

      // تحويل البيانات من صيغة Amadeus
      return response.data.data?.map((flight: any) => {
        const itinerary = flight.itineraries?.[0]
        const segment = itinerary?.segments?.[0]

        return {
          id: flight.id,
          airline: segment?.operating?.carrierCode || 'Unknown',
          departure: segment?.departure?.at || '',
          arrival: segment?.arrival?.at || '',
          departureTime: segment?.departure?.at || '',
          arrivalTime: segment?.arrival?.at || '',
          price: parseFloat(flight.price?.grandTotal || 0),
          seats: 9, // قيمة افتراضية
        }
      }) || []
    } catch (error) {
      console.error('Flight search failed:', error)
      throw error
    }
  }

  /**
   * الحصول على تفاصيل الفندق
   */
  async getHotelDetails(hotelId: string): Promise<Hotel | null> {
    try {
      const token = await this.getAccessToken()

      const response = await this.axiosInstance.get(`/reference-data/locations/${hotelId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = response.data.data

      return {
        hotelId: data.id,
        name: data.name,
        address: data.address?.cityName || 'Unknown',
        rating: data.rating || 0,
        price: 0, // يجب البحث عن العرض الفعلي
        image: data.image,
        amenities: [],
      }
    } catch (error) {
      console.error('Failed to get hotel details:', error)
      return null
    }
  }

  /**
   * الحصول على الدول والمدن المتاحة
   */
  async searchCities(keyword: string): Promise<Array<{ code: string; name: string }>> {
    try {
      const token = await this.getAccessToken()

      const response = await this.axiosInstance.get('/reference-data/locations', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        params: {
          keyword,
          subType: 'CITY,AIRPORT',
          limit: 10,
        },
      })

      return response.data.data?.map((location: any) => ({
        code: location.iataCode,
        name: location.name,
      })) || []
    } catch (error) {
      console.error('Failed to search cities:', error)
      return []
    }
  }
}

// إنشاء instance واحد من Provider
let amadeusInstance: AmadeusProvider | null = null

export function getAmadeusProvider(): AmadeusProvider {
  if (!amadeusInstance) {
    const clientId = process.env.AMADEUS_CLIENT_ID || ''
    const clientSecret = process.env.AMADEUS_CLIENT_SECRET || ''

    if (!clientId || !clientSecret) {
      throw new Error('Amadeus credentials not configured')
    }

    amadeusInstance = new AmadeusProvider(clientId, clientSecret)
  }

  return amadeusInstance
}

export default AmadeusProvider
