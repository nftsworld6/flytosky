'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SearchResult {
  id: string
  name?: string
  title?: string
  location?: string
  price?: number
  finalPrice?: number
  image?: string
  type: string
}

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'flights' | 'hotels' | 'restaurants' | 'yachts' | 'packages' | 'work_contracts' | 'visas'>('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const query = formData.get('query') as string
    setSearchQuery(query)

    try {
      const endpoints: string[] = []
      if (activeTab === 'all' || activeTab === 'flights') endpoints.push('/api/modules/flights')
      if (activeTab === 'all' || activeTab === 'hotels') endpoints.push('/api/modules/hotels')
      if (activeTab === 'all' || activeTab === 'restaurants') endpoints.push('/api/modules/restaurants')
      if (activeTab === 'all' || activeTab === 'yachts') endpoints.push('/api/modules/yachts')
      if (activeTab === 'all' || activeTab === 'packages') endpoints.push('/api/modules/packages')
      if (activeTab === 'all' || activeTab === 'work_contracts') endpoints.push('/api/modules/work_contracts')
      if (activeTab === 'all' || activeTab === 'visas') endpoints.push('/api/modules/visas')

      const promises = endpoints.map(endpoint => fetch(endpoint).then(res => res.json()))
      const dataArrays = await Promise.all(promises)

      let allResults: SearchResult[] = []
      dataArrays.forEach((data, index) => {
        const type = endpoints[index].split('/').pop()!
        const formattedData = data.map((item: any) => ({
          ...item,
          type,
          name: item.name || item.title,
          price: item.price || item.pricePerDay || item.basePrice || item.salary,
        }))
        allResults = [...allResults, ...formattedData]
      })

      if (query) {
        allResults = allResults.filter(item =>
          item.name?.toLowerCase().includes(query.toLowerCase()) ||
          item.location?.toLowerCase().includes(query.toLowerCase())
        )
      }

      setResults(allResults)
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">FlyToSky</Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</Link>
              <Link href="/packages" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Packages</Link>
              <Link href="/search" className="text-blue-600 font-medium">Search</Link>
              <Link href="/yachts" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Yachts</Link>
              <Link href="/visas" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Visas</Link>
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Admin</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Global Search</h1>
          <p className="text-xl text-gray-600">Find flights, hotels, restaurants, yachts, packages, work contracts, and visas worldwide</p>
        </div>

        {/* Search Form */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 mb-12 border border-white/20">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Query</label>
              <input
                type="text"
                name="query"
                placeholder="Search by name, location, or type..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                defaultValue={searchQuery}
              />
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'all', label: 'All' },
                { key: 'flights', label: 'Flights' },
                { key: 'hotels', label: 'Hotels' },
                { key: 'restaurants', label: 'Restaurants' },
                { key: 'yachts', label: 'Yachts' },
                { key: 'packages', label: 'Packages' },
                { key: 'work_contracts', label: 'Work Contracts' },
                { key: 'visas', label: 'Visas' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === key
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((item) => (
              <div key={`${item.type}-${item.id}`} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all transform hover:-translate-y-2">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
                      {item.type.replace('_', ' ')}
                    </span>
                  </div>
                  {item.location && (
                    <p className="text-gray-600 mb-2 flex items-center">
                      <span className="mr-2">📍</span>{item.location}
                    </p>
                  )}
                  {item.finalPrice && (
                    <p className="text-2xl font-bold text-blue-600 mb-4">${item.finalPrice}</p>
                  )}
                  <Link
                    href={`/${item.type}/${item.id}`}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-center block"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && !loading && searchQuery && (
          <div className="text-center py-16">
            <div className="bg-white/60 backdrop-blur-md rounded-2xl p-12 shadow-lg border border-white/20">
              <p className="text-gray-600 text-xl">No results found for "{searchQuery}". Try different keywords or categories.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}