import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">FlyToSky</h1>
            </div>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</Link>
              <Link href="/packages" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Packages</Link>
              <Link href="/search" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Search</Link>
              <Link href="/yachts" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Yachts</Link>
              <Link href="/visas" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Visas</Link>
              <Link href="/admin" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Admin</Link>
              <Link href="/affiliate" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Affiliate</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold text-white mb-6 drop-shadow-lg">Your Dream Vacation Awaits</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">Discover amazing travel packages and book your next adventure with unbeatable prices</p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
              <form className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                  <input
                    type="text"
                    placeholder="Where to?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="flex items-end">
                  <Link
                    href="/packages"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Search Packages
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center mb-16 text-gray-900">Featured Packages</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mock packages - in real app, fetch from API */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <img src="/api/placeholder/400/250" alt="Package" className="w-full h-48 object-cover" />
              <div className="p-8">
                <h4 className="text-2xl font-bold mb-3 text-gray-900">Bali Paradise</h4>
                <p className="text-gray-600 mb-6">7 nights at luxury resort with private villa</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">$1,299</span>
                    <p className="text-sm text-gray-500">per person</p>
                  </div>
                  <Link
                    href="/packages/1"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <img src="/api/placeholder/400/250" alt="Package" className="w-full h-48 object-cover" />
              <div className="p-8">
                <h4 className="text-2xl font-bold mb-3 text-gray-900">Tokyo Adventure</h4>
                <p className="text-gray-600 mb-6">5 nights in city center with guided tours</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">$899</span>
                    <p className="text-sm text-gray-500">per person</p>
                  </div>
                  <Link
                    href="/packages/2"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-white/20 hover:shadow-2xl transition-all transform hover:-translate-y-2">
              <img src="/api/placeholder/400/250" alt="Package" className="w-full h-48 object-cover" />
              <div className="p-8">
                <h4 className="text-2xl font-bold mb-3 text-gray-900">Paris Romance</h4>
                <p className="text-gray-600 mb-6">4 nights in boutique hotel with Seine cruise</p>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-3xl font-bold text-blue-600">$1,499</span>
                    <p className="text-sm text-gray-500">per person</p>
                  </div>
                  <Link
                    href="/packages/3"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
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
      <section className="bg-gradient-to-r from-gray-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-center mb-16 text-gray-900">Why Choose FlyToSky?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-lg">
                ✈️
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-900">Best Prices</h4>
              <p className="text-gray-600 text-lg">Competitive rates and exclusive deals you won't find elsewhere</p>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-lg">
                🏨
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-900">Quality Hotels</h4>
              <p className="text-gray-600 text-lg">Handpicked luxury accommodations with premium amenities</p>
            </div>
            <div className="text-center bg-white/60 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20 hover:shadow-xl transition-all">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-lg">
                🎯
              </div>
              <h4 className="text-2xl font-bold mb-4 text-gray-900">Expert Support</h4>
              <p className="text-gray-600 text-lg">24/7 customer service and personalized travel assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">FlyToSky</h3>
              <p className="text-gray-400">Your gateway to unforgettable adventures</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/packages" className="text-gray-400 hover:text-white transition-colors">Packages</Link></li>
                <li><Link href="/search" className="text-gray-400 hover:text-white transition-colors">Search</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-2xl">📘</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-2xl">🐦</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-2xl">📷</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 FlyToSky. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}