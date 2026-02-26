'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Package {
  id: string
  title: string
  location: string
  hotelName: string
  basePrice: number
  nights: number
  inclusions: string[]
  image: string
  finalPrice: number
}

export default function PackagesPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([])
  const [filters, setFilters] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    hotel: '',
    minPrice: '',
    maxPrice: '',
  })

  useEffect(() => {
    fetch('/api/modules/packages')
      .then(res => res.json())
      .then(data => {
        setPackages(data)
        setFilteredPackages(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    let filtered = packages

    if (filters.destination) {
      filtered = filtered.filter(pkg => 
        pkg.location.toLowerCase().includes(filters.destination.toLowerCase())
      )
    }

    if (filters.hotel) {
      filtered = filtered.filter(pkg => 
        pkg.hotelName.toLowerCase().includes(filters.hotel.toLowerCase())
      )
    }

    if (filters.minPrice) {
      filtered = filtered.filter(pkg => pkg.finalPrice >= parseInt(filters.minPrice))
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(pkg => pkg.finalPrice <= parseInt(filters.maxPrice))
    }

    setFilteredPackages(filtered)
  }, [filters, packages])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">FlyToSky</Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</Link>
              <Link href="/packages" className="text-blue-600 font-medium">Packages</Link>
              <Link href="/search" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Search</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Travel Packages</h1>
          <p className="text-xl text-gray-600">Discover your perfect vacation with our curated packages</p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-12 border border-white/20">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Filter Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
              <input
                type="text"
                placeholder="e.g. Bali, Tokyo"
                value={filters.destination}
                onChange={(e) => handleFilterChange('destination', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
              <input
                type="date"
                value={filters.checkIn}
                onChange={(e) => handleFilterChange('checkIn', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
              <input
                type="date"
                value={filters.checkOut}
                onChange={(e) => handleFilterChange('checkOut', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hotel</label>
              <input
                type="text"
                placeholder="Hotel name"
                value={filters.hotel}
                onChange={(e) => handleFilterChange('hotel', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
              <input
                type="number"
                placeholder="10000"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setFilters({ destination: '', checkIn: '', checkOut: '', hotel: '', minPrice: '', maxPrice: '' })}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div key={pkg.id} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <img src={pkg.image} alt={pkg.title} className="w-full h-48 object-cover" />
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{pkg.title}</h3>
                <p className="text-gray-600 mb-2 flex items-center">
                  <span className="mr-2">📍</span>{pkg.location}
                </p>
                <p className="text-gray-600 mb-2 flex items-center">
                  <span className="mr-2">🏨</span>{pkg.hotelName}
                </p>
                <p className="text-sm text-gray-500 mb-4 flex items-center">
                  <span className="mr-2">🕒</span>{pkg.nights} nights
                </p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">${pkg.finalPrice}</span>
                    <p className="text-sm text-gray-500">per person</p>
                  </div>
                  <Link
                    href={`/packages/${pkg.id}`}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-12 shadow-lg border border-white/20">
              <p className="text-gray-600 text-xl">No packages match your filters. Try adjusting your search criteria.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}