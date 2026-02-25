'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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

export default function PackageDetailPage() {
  const params = useParams()
  const [pkg, setPkg] = useState<Package | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetch(`/api/modules/packages/${params.id}`)
        .then(res => res.json())
        .then(data => {
          setPkg(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [params.id])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!pkg) {
    return <div className="min-h-screen flex items-center justify-center">Package not found</div>
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
              <Link href="/search" className="text-gray-900 hover:text-blue-600">Search</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <img src={pkg.image} alt={pkg.title} className="w-full h-64 object-cover" />
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{pkg.title}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Location</h3>
                <p className="text-gray-600">{pkg.location}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Hotel</h3>
                <p className="text-gray-600">{pkg.hotelName}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Duration</h3>
                <p className="text-gray-600">{pkg.nights} nights</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Price</h3>
                <p className="text-2xl font-bold text-blue-600">${pkg.finalPrice}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">What&apos;s Included</h3>
              <ul className="list-disc list-inside text-gray-600">
                {pkg.inclusions.map((inclusion, index) => (
                  <li key={index}>{inclusion}</li>
                ))}
              </ul>
            </div>

            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">
              Book Now
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}