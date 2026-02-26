'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Item {
  id: string
  name?: string
  title?: string
  location?: string
  price?: number
  basePrice?: number
  salary?: number
  isActive: boolean
  createdAt: string
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'packages' | 'flights' | 'hotels' | 'restaurants' | 'yachts' | 'work_contracts' | 'visas' | 'bookings' | 'affiliates'>('packages')
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<any>({})
  const [affiliates, setAffiliates] = useState<any[]>([])
  const [showAffiliateModal, setShowAffiliateModal] = useState(false)
  const [affiliateCommissionForm, setAffiliateCommissionForm] = useState({
    affiliateId: '',
    productType: 'PACKAGE',
    commissionRate: 5,
    minAmount: 0,
    maxAmount: 999999,
  })

  const modules = [
    { key: 'affiliates', label: 'Affiliates', endpoint: '/api/modules/admin-affiliates' },
    { key: 'packages', label: 'Packages', endpoint: '/api/modules/packages' },
    { key: 'flights', label: 'Flights', endpoint: '/api/modules/flights' },
    { key: 'hotels', label: 'Hotels', endpoint: '/api/modules/hotels' },
    { key: 'restaurants', label: 'Restaurants', endpoint: '/api/modules/restaurants' },
    { key: 'yachts', label: 'Yachts', endpoint: '/api/modules/yachts' },
    { key: 'work_contracts', label: 'Work Contracts', endpoint: '/api/modules/work_contracts' },
    { key: 'visas', label: 'Visas', endpoint: '/api/modules/visas' },
    { key: 'bookings', label: 'Bookings', endpoint: '/api/modules/booking' },
  ]

  useEffect(() => {
    fetchItems()
  }, [activeTab])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const module = modules.find(m => m.key === activeTab)
      if (module) {
        const res = await fetch(module.endpoint)
        const data = await res.json()
        
        if (activeTab === 'affiliates') {
          setAffiliates(data)
        } else {
          setItems(data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const module = modules.find(m => m.key === activeTab)
      if (module && activeTab !== 'affiliates') {
        await fetch(module.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        setShowForm(false)
        setFormData({})
        fetchItems()
      }
    } catch (error) {
      console.error('Failed to create item:', error)
    }
  }

  const handleCommissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/modules/admin-affiliates?action=commission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(affiliateCommissionForm),
      })
      if (res.ok) {
        alert('تم تحديث العمولة بنجاح')
        setShowAffiliateModal(false)
        fetchItems()
      } else {
        alert('فشل في تحديث العمولة')
      }
    } catch (error) {
      console.error('Failed to update commission:', error)
      alert('خطأ في تحديث العمولة')
    }
  }

  const toggleAffiliateStatus = async (affiliateId: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/modules/admin-affiliates?action=toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ affiliateId, isActive: !currentStatus }),
      })
      if (res.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error('Failed to toggle affiliate:', error)
    }
  }

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const module = modules.find(m => m.key === activeTab)
      if (module) {
        await fetch(`${module.endpoint}/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: !currentStatus }),
        })
        fetchItems()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const deleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        const module = modules.find(m => m.key === activeTab)
        if (module) {
          await fetch(`${module.endpoint}/${id}`, {
            method: 'DELETE',
          })
          fetchItems()
        }
      } catch (error) {
        console.error('Failed to delete item:', error)
      }
    }
  }

  const renderForm = () => {
    const fields: { [key: string]: any[] } = {
      packages: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'location', label: 'Location', type: 'text' },
        { name: 'hotelName', label: 'Hotel Name', type: 'text' },
        { name: 'basePrice', label: 'Base Price', type: 'number' },
        { name: 'nights', label: 'Nights', type: 'number' },
        { name: 'inclusions', label: 'Inclusions (comma separated)', type: 'text' },
        { name: 'image', label: 'Image URL', type: 'url' },
      ],
      flights: [
        { name: 'airline', label: 'Airline', type: 'text' },
        { name: 'flightNumber', label: 'Flight Number', type: 'text' },
        { name: 'departure', label: 'Departure', type: 'text' },
        { name: 'arrival', label: 'Arrival', type: 'text' },
        { name: 'departureTime', label: 'Departure Time', type: 'datetime-local' },
        { name: 'arrivalTime', label: 'Arrival Time', type: 'datetime-local' },
        { name: 'price', label: 'Price', type: 'number' },
        { name: 'seatsAvailable', label: 'Seats Available', type: 'number' },
      ],
      hotels: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'location', label: 'Location', type: 'text' },
        { name: 'rating', label: 'Rating', type: 'number', step: '0.1' },
        { name: 'pricePerNight', label: 'Price Per Night', type: 'number' },
        { name: 'amenities', label: 'Amenities (comma separated)', type: 'text' },
        { name: 'image', label: 'Image URL', type: 'url' },
      ],
      restaurants: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'location', label: 'Location', type: 'text' },
        { name: 'cuisine', label: 'Cuisine', type: 'text' },
        { name: 'rating', label: 'Rating', type: 'number', step: '0.1' },
        { name: 'priceRange', label: 'Price Range', type: 'text' },
        { name: 'image', label: 'Image URL', type: 'url' },
      ],
      yachts: [
        { name: 'name', label: 'Name', type: 'text' },
        { name: 'location', label: 'Location', type: 'text' },
        { name: 'capacity', label: 'Capacity', type: 'number' },
        { name: 'pricePerDay', label: 'Price Per Day', type: 'number' },
        { name: 'amenities', label: 'Amenities (comma separated)', type: 'text' },
        { name: 'image', label: 'Image URL', type: 'url' },
      ],
      work_contracts: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'location', label: 'Location', type: 'text' },
        { name: 'salary', label: 'Salary', type: 'number' },
        { name: 'type', label: 'Type', type: 'text' },
        { name: 'requirements', label: 'Requirements', type: 'textarea' },
      ],
      visas: [
        { name: 'type', label: 'Type', type: 'text' },
        { name: 'country', label: 'Country', type: 'text' },
        { name: 'duration', label: 'Duration (days)', type: 'number' },
        { name: 'price', label: 'Price', type: 'number' },
        { name: 'requirements', label: 'Requirements (comma separated)', type: 'text' },
        { name: 'description', label: 'Description', type: 'textarea' },
      ],
    }

    const currentFields = fields[activeTab] || []

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">Add New {modules.find(m => m.key === activeTab)?.label}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {currentFields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                ) : (
                  <input
                    type={field.type}
                    step={field.step}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData({ ...formData, [field.name]: field.type === 'number' ? parseFloat(e.target.value) : e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                )}
              </div>
            ))}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">FlyToSky Admin</Link>
            <nav className="flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Home</Link>
              <Link href="/packages" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Packages</Link>
              <Link href="/search" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">Search</Link>
              <Link href="/admin" className="text-blue-600 font-medium">Admin</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Admin Dashboard</h1>
          <p className="text-xl text-gray-600">Manage all your travel services and bookings</p>
        </div>

        {/* Module Tabs */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
          <div className="flex flex-wrap gap-2">
            {modules.map(({ key, label }) => (
              <button
                key={key}
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
        </div>

        {/* Actions */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8 border border-white/20">
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-lg"
          >
            Add New {modules.find(m => m.key === activeTab)?.label}
          </button>
        </div>

        {/* Items List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        ) : activeTab === 'affiliates' ? (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">الاسم</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">البريد الإلكتروني</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">الرمز</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">الحالة</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {affiliates.map((affiliate) => (
                    <tr key={affiliate.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{affiliate.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{affiliate.email}</td>
                      <td className="px-6 py-4 text-sm font-mono text-blue-600">{affiliate.affiliateCode}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          affiliate.isAffiliateActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {affiliate.isAffiliateActive ? 'نشط' : 'معطل'}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => {
                            setAffiliateCommissionForm({ ...affiliateCommissionForm, affiliateId: affiliate.id })
                            setShowAffiliateModal(true)
                          }}
                          className="px-3 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800 hover:bg-blue-200"
                        >
                          تعيين عمولة
                        </button>
                        <button
                          onClick={() => toggleAffiliateStatus(affiliate.id, affiliate.isAffiliateActive)}
                          className={`px-3 py-1 text-xs font-medium rounded ${
                            affiliate.isAffiliateActive ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {affiliate.isAffiliateActive ? 'تعطيل' : 'تفعيل'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {affiliates.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">لا توجد مسوقين. أضف بعض المسوقين للبدء.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Name/Title</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{item.name || item.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.location}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">${item.price || item.basePrice || item.salary}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() => toggleStatus(item.id, item.isActive)}
                          className={`px-3 py-1 text-xs font-medium rounded ${
                            item.isActive ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {item.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="px-3 py-1 text-xs font-medium rounded bg-red-100 text-red-800 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {items.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No items found. Add some {modules.find(m => m.key === activeTab)?.label.toLowerCase()} to get started.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {showForm && renderForm()}

      {/* Commission Modal */}
      {showAffiliateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">تعيين عمولة للمسوق</h3>
            <form onSubmit={handleCommissionSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع المنتج</label>
                <select
                  value={affiliateCommissionForm.productType}
                  onChange={(e) =>
                    setAffiliateCommissionForm({
                      ...affiliateCommissionForm,
                      productType: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PACKAGE">الحزم السياحية</option>
                  <option value="FLIGHT">الرحلات الجوية</option>
                  <option value="HOTEL">الفنادق</option>
                  <option value="CAR">السيارات</option>
                  <option value="RESTAURANT">المطاعم</option>
                  <option value="VISA">التأشيرات</option>
                  <option value="YACHT">اليخوت</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نسبة العمولة (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={affiliateCommissionForm.commissionRate}
                  onChange={(e) =>
                    setAffiliateCommissionForm({
                      ...affiliateCommissionForm,
                      commissionRate: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأدنى</label>
                  <input
                    type="number"
                    min="0"
                    value={affiliateCommissionForm.minAmount}
                    onChange={(e) =>
                      setAffiliateCommissionForm({
                        ...affiliateCommissionForm,
                        minAmount: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الحد الأقصى</label>
                  <input
                    type="number"
                    min="0"
                    value={affiliateCommissionForm.maxAmount}
                    onChange={(e) =>
                      setAffiliateCommissionForm({
                        ...affiliateCommissionForm,
                        maxAmount: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  حفظ
                </button>
                <button
                  type="button"
                  onClick={() => setShowAffiliateModal(false)}
                  className="flex-1 bg-gray-300 text-gray-900 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}