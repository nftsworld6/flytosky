import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">FlyToSky</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-900 hover:text-blue-600">Home</Link>
              <Link href="/packages" className="text-gray-900 hover:text-blue-600">Packages</Link>
              <Link href="/search" className="text-gray-900 hover:text-blue-600">Search</Link>
              <Link href="/admin" className="text-gray-900 hover:text-blue-600">Admin</Link>
              <Link href="/affiliate" className="text-gray-900 hover:text-blue-600">Affiliate</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">Your Dream Vacation Awaits</h2>
            <p className="text-xl mb-8">Discover amazing travel packages and book your next adventure</p>
            <Link
              href="/packages"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Explore Packages
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">Featured Packages</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mock packages - in real app, fetch from API */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src="/api/placeholder/400/250" alt="Package" className="w-full h-48 object-cover" />
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-2">Bali Paradise</h4>
                <p className="text-gray-600 mb-4">7 nights at luxury resort</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">$1,299</span>
                  <Link
                    href="/packages/1"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-12">Why Choose FlyToSky?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                ✈️
              </div>
              <h4 className="text-xl font-semibold mb-2">Best Prices</h4>
              <p className="text-gray-600">Competitive rates and exclusive deals</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                🏨
              </div>
              <h4 className="text-xl font-semibold mb-2">Quality Hotels</h4>
              <p className="text-gray-600">Handpicked luxury accommodations</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                🎯
              </div>
              <h4 className="text-xl font-semibold mb-2">Expert Support</h4>
              <p className="text-gray-600">24/7 customer service and travel assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 FlyToSky. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}