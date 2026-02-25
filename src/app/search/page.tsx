'use client'

import { useState } from 'react'
import Link from 'next/link'

interface FlightResult {
  id: string
  airline: string
  flightNumber: string
  departureTime: string
  arrivalTime: string
  price: number
  duration: string
}

interface HotelResult {
  id: string
  name: string
  location: string
  rating: number
  pricePerNight: number
  amenities: string[]
}

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<'flights' | 'hotels'>('flights')
  const [flights, setFlights] = useState<FlightResult[]>([])
  const [hotels, setHotels] = useState<HotelResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleFlightSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const searchData = {
      origin: formData.get('origin'),
      destination: formData.get('destination'),
      departureDate: formData.get('departureDate'),
      returnDate: formData.get('returnDate'),
      passengers: parseInt(formData.get('passengers') as string),
    }

    try {
      const res = await fetch('/api/modules/flights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchData),
      })
      const data = await res.json()
      setFlights(data)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleHotelSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const searchData = {
      location: formData.get('location'),
      checkIn: formData.get('checkIn'),
      checkOut: formData.get('checkOut'),
      guests: parseInt(formData.get('guests') as string),
    }

    try {
      const res = await fetch('/api/modules/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchData),
      })
      const data = await res.json()
      setHotels(data)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-gray-900">FlyToSky</Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-blue-600">Home</Link>
              <Link href="/packages" className="text-gray-900 hover:text-blue-600">Packages</Link>
              <Link href="/search" className="text-blue-600">Search</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Search Flights & Hotels</h1>

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab('flights')}
            className={`px-6 py-2 rounded-l-lg ${
              activeTab === 'flights' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Flights
          </button>
          <button
            onClick={() => setActiveTab('hotels')}
            className={`px-6 py-2 rounded-r-lg ${
              activeTab === 'hotels' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Hotels
          </button>
        </div>

        {/* Flight Search */}
        {activeTab === 'flights' && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <form onSubmit={handleFlightSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <input
                name="origin"
                type="text"
                placeholder="From"
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                name="destination"
                type="text"
                placeholder="To"
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                name="departureDate"
                type="date"
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                name="returnDate"
                type="date"
                className="border border-gray-300 rounded px-3 py-2"
              />
              <select
                name="passengers"
                className="border border-gray-300 rounded px-3 py-2"
                defaultValue="1"
              >
                <option value="1">1 Passenger</option>
                <option value="2">2 Passengers</option>
                <option value="3">3 Passengers</option>
                <option value="4">4 Passengers</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Searching...' : 'Search Flights'}
              </button>
            </form>
          </div>
        )}

        {/* Hotel Search */}
        {activeTab === 'hotels' && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <form onSubmit={handleHotelSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                name="location"
                type="text"
                placeholder="Location"
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                name="checkIn"
                type="date"
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
              <input
                name="checkOut"
                type="date"
                className="border border-gray-300 rounded px-3 py-2"
                required
              />
              <select
                name="guests"
                className="border border-gray-300 rounded px-3 py-2"
                defaultValue="1"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 md:col-span-4"
              >
                {loading ? 'Searching...' : 'Search Hotels'}
              </button>
            </form>
          </div>
        )}

        {/* Results */}
        {activeTab === 'flights' && flights.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Flight Results</h2>
            {flights.map((flight) => (
              <div key={flight.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{flight.airline} {flight.flightNumber}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(flight.departureTime).toLocaleString()} - {new Date(flight.arrivalTime).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Duration: {flight.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">${flight.price}</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'hotels' && hotels.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Hotel Results</h2>
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{hotel.name}</h3>
                    <p className="text-sm text-gray-600">{hotel.location}</p>
                    <p className="text-sm text-gray-600">Rating: {hotel.rating}/5</p>
                    <p className="text-sm text-gray-600">Amenities: {hotel.amenities.join(', ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">${hotel.pricePerNight}/night</p>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Select
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}