'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface AffiliateStats {
  totalReferrals: number
  totalCommission: number
  pendingCommission: number
}

interface Referral {
  id: string
  booking: {
    user: { name: string }
    package: { title: string }
    totalPrice: number
    status: string
    createdAt: string
  }
  commission: number
}

export default function AffiliatePage() {
  const [stats, setStats] = useState<AffiliateStats | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchReferrals()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/modules/affiliates')
      const data = await res.json()
      setStats(data)
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  const fetchReferrals = async () => {
    try {
      // In a real app, this would fetch referrals for the authenticated affiliate
      setReferrals([])
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch referrals:', error)
      setLoading(false)
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
            <Link href="/" className="text-2xl font-bold text-gray-900">FlyToSky Affiliate</Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-blue-600">Home</Link>
              <Link href="/affiliate" className="text-blue-600">Affiliate</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Affiliate Dashboard</h1>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Total Referrals</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalReferrals}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Total Commission</h3>
              <p className="text-3xl font-bold text-green-600">${stats.totalCommission.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-2">Pending Commission</h3>
              <p className="text-3xl font-bold text-yellow-600">${stats.pendingCommission.toFixed(2)}</p>
            </div>
          </div>
        )}

        {/* Referral Link */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Referral Link</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value="https://flytosky.com/?ref=YOUR_CODE"
              readOnly
              className="flex-1 border border-gray-300 rounded px-3 py-2"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Copy Link
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Share this link with friends and family. You&apos;ll earn commission on every booking made through your link.
          </p>
        </div>

        {/* Referrals Table */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Your Referrals</h2>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Customer</th>
                    <th className="text-left py-2">Package</th>
                    <th className="text-left py-2">Booking Value</th>
                    <th className="text-left py-2">Commission</th>
                    <th className="text-left py-2">Status</th>
                    <th className="text-left py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-500">
                        No referrals yet. Start sharing your link to earn commissions!
                      </td>
                    </tr>
                  ) : (
                    referrals.map((referral) => (
                      <tr key={referral.id} className="border-b">
                        <td className="py-4">{referral.booking.user.name}</td>
                        <td className="py-4">{referral.booking.package.title}</td>
                        <td className="py-4">${referral.booking.totalPrice}</td>
                        <td className="py-4">${referral.commission}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded text-sm ${
                            referral.booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            referral.booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {referral.booking.status}
                          </span>
                        </td>
                        <td className="py-4">{new Date(referral.booking.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}