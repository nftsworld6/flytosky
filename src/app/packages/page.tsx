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

  useEffect(() => {
    fetch('/api/modules/packages')
      .then(res => res.json())
      .then(data => {
        setPackages(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-gray-900">FlyToSky</Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-blue-600">Home</Link>
              <Link href="/packages" className="text-blue-600">Packages</Link>
              <Link href="/search" className="text-gray-900 hover:text-blue-600">Search</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Travel Packages</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={pkg.image} alt={pkg.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                <p className="text-gray-600 mb-2">{pkg.location}</p>
                <p className="text-gray-600 mb-2">{pkg.hotelName}</p>
                <p className="text-sm text-gray-500 mb-4">{pkg.nights} nights</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">${pkg.finalPrice}</span>
                  <Link
                    href={`/packages/${pkg.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {packages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No packages available at the moment.</p>
          </div>
        )}
      </main>
    </div>
  )
}