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
  isActive: boolean
}

interface Booking {
  id: string
  user: { name: string; email: string }
  package: { title: string }
  totalPrice: number
  status: string
  createdAt: string
}

export default function AdminPage() {
  const [packages, setPackages] = useState<Package[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState<'packages' | 'bookings'>('packages')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPackages()
    fetchBookings()
  }, [])

  const fetchPackages = async () => {
    try {
      const res = await fetch('/api/modules/packages')
      const data = await res.json()
      setPackages(data)
    } catch (error) {
      console.error('Failed to fetch packages:', error)
    }
  }

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/modules/booking')
      const data = await res.json()
      setBookings(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
      setLoading(false)
    }
  }

  const togglePackageStatus = async (id: string, isActive: boolean) => {
    try {
      await fetch(`/api/modules/packages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      fetchPackages()
    } catch (error) {
      console.error('Failed to update package:', error)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-2xl font-bold text-gray-900">FlyToSky Admin</Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-blue-600">Home</Link>
              <Link href="/admin" className="text-blue-600">Admin</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-6 py-2 rounded-l-lg ${
              activeTab === 'packages' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Manage Packages
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-2 rounded-r-lg ${
              activeTab === 'bookings' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            View Bookings
          </button>
        </div>

        {/* Packages Management */}
        {activeTab === 'packages' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Packages</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Add New Package
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Title</th>
                      <th className="text-left py-2">Location</th>
                      <th className="text-left py-2">Price</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((pkg) => (
                      <tr key={pkg.id} className="border-b">
                        <td className="py-4">{pkg.title}</td>
                        <td className="py-4">{pkg.location}</td>
                        <td className="py-4">${pkg.basePrice}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            pkg.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {pkg.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-4">
                          <button
                            onClick={() => togglePackageStatus(pkg.id, pkg.isActive)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 mr-2"
                          >
                            {pkg.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings View */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Bookings</h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Customer</th>
                      <th className="text-left py-2">Package</th>
                      <th className="text-left py-2">Total Price</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b">
                        <td className="py-4">
                          <div>
                            <p className="font-medium">{booking.user.name}</p>
                            <p className="text-sm text-gray-600">{booking.user.email}</p>
                          </div>
                        </td>
                        <td className="py-4">{booking.package.title}</td>
                        <td className="py-4">${booking.totalPrice}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4">{new Date(booking.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}