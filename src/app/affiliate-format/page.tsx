'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface AffiliateStats {
  totalReferrals: number
  totalCommission: number
  pendingCommission: number
  approvedCommission: number
  paidCommission: number
  conversionRate: number
  monthlyCommission?: number
}

interface Referral {
  id: string
  bookingId: string
  commission: number
  commissionRate: number
  status: string
  customerName: string
  totalPrice: number
  createdAt: string
}

interface MonthlyEarning {
  month: string
  amount: number
}

interface AffiliateUser {
  id: string
  name: string
  affiliateCode: string
  email: string
  companyName?: string
  isAffiliateActive: boolean
  stats: AffiliateStats
}

export default function AffiliateFormatPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'referrals' | 'earnings' | 'settings' | 'links'>('dashboard')
  const [affiliateData, setAffiliateData] = useState<AffiliateUser | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [earnings, setEarnings] = useState<MonthlyEarning[]>([])
  const [loading, setLoading] = useState(true)
  const [showCommissionModal, setShowCommissionModal] = useState(false)
  const [commissionForm, setCommissionForm] = useState({
    productType: 'PACKAGE',
    commissionRate: 5,
    minAmount: 0,
    maxAmount: 999999,
  })

  // محاكاة معرّف المسوق
  const MOCK_AFFILIATE_ID = 'affiliate-1'

  useEffect(() => {
    fetchAffiliateData()
  }, [])

  const fetchAffiliateData = async () => {
    setLoading(true)
    try {
      // جلب البيانات الأساسية
      const infoRes = await fetch(`/api/modules/affiliates?id=${MOCK_AFFILIATE_ID}&type=info`)
      const info = await infoRes.json()
      setAffiliateData(info)

      // جلب الإحالات
      const referralsRes = await fetch(`/api/modules/affiliates?id=${MOCK_AFFILIATE_ID}&type=referrals`)
      const referralsData = await referralsRes.json()
      setReferrals(referralsData.slice(0, 10))

      // جلب الأرباح
      const earningsRes = await fetch(`/api/modules/affiliates?id=${MOCK_AFFILIATE_ID}&type=earnings&months=12`)
      const earningsData = await earningsRes.json()
      setEarnings(earningsData)
    } catch (error) {
      console.error('Failed to fetch affiliate data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCommissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/modules/affiliates?action=commission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          affiliateId: MOCK_AFFILIATE_ID,
          ...commissionForm,
        }),
      })
      if (res.ok) {
        alert('تم تحديث العمولة بنجاح')
        setShowCommissionModal(false)
        fetchAffiliateData()
      }
    } catch (error) {
      console.error('Failed to update commission:', error)
      alert('فشل في تحديث العمولة')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">جاري التحميل...</div>
  }

  const stats = affiliateData?.stats || {
    totalReferrals: 0,
    totalCommission: 0,
    pendingCommission: 0,
    approvedCommission: 0,
    paidCommission: 0,
    conversionRate: 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                لوحة المسوق
              </h1>
              {affiliateData && (
                <p className="text-gray-600 mt-1">
                  {affiliateData.companyName || affiliateData.name} • {affiliateData.affiliateCode}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">الرمز الترويجي:</p>
              <p className="text-lg font-bold text-blue-600 font-mono">{affiliateData?.affiliateCode || 'N/A'}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto border-b border-white/20">
          {['dashboard', 'referrals', 'earnings', 'settings', 'links'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'dashboard' && 'لوحة التحكم'}
              {tab === 'referrals' && 'الإحالات'}
              {tab === 'earnings' && 'الأرباح'}
              {tab === 'settings' && 'الإعدادات'}
              {tab === 'links' && 'روابط الدعوة'}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Total Commission Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">إجمالي العمولة</p>
                    <p className="text-4xl font-bold text-blue-600 mt-2">
                      ${stats.totalCommission.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-5xl text-blue-200">💰</div>
                </div>
              </div>

              {/* Monthly Commission Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">عمولة هذا الشهر</p>
                    <p className="text-4xl font-bold text-green-600 mt-2">
                      ${stats.monthlyCommission?.toFixed(2) || '0.00'}
                    </p>
                  </div>
                  <div className="text-5xl text-green-200">📈</div>
                </div>
              </div>

              {/* Referrals Count Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">عدد الإحالات</p>
                    <p className="text-4xl font-bold text-purple-600 mt-2">{stats.totalReferrals}</p>
                  </div>
                  <div className="text-5xl text-purple-200">👥</div>
                </div>
              </div>

              {/* Pending Commission Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">عمولة قيد الانتظار</p>
                    <p className="text-4xl font-bold text-yellow-600 mt-2">
                      ${stats.pendingCommission.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-5xl text-yellow-200">⏳</div>
                </div>
              </div>

              {/* Approved Commission Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">عمولة معتمدة</p>
                    <p className="text-4xl font-bold text-indigo-600 mt-2">
                      ${stats.approvedCommission.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-5xl text-indigo-200">✅</div>
                </div>
              </div>

              {/* Conversion Rate Card */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">معدل التحويل</p>
                    <p className="text-4xl font-bold text-red-600 mt-2">{stats.conversionRate.toFixed(2)}%</p>
                  </div>
                  <div className="text-5xl text-red-200">🎯</div>
                </div>
              </div>
            </div>

            {/* Recent Referrals Preview */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">آخر الإحالات</h2>
              <div className="space-y-4">
                {referrals.slice(0, 5).map((ref) => (
                  <div
                    key={ref.id}
                    className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-white/20"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{ref.customerName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(ref.createdAt).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">${ref.commission.toFixed(2)}</p>
                      <p
                        className={`text-sm font-medium ${
                          ref.status === 'PAID'
                            ? 'text-green-600'
                            : ref.status === 'APPROVED'
                            ? 'text-blue-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {ref.status === 'PAID' && 'مدفوع'}
                        {ref.status === 'APPROVED' && 'معتمد'}
                        {ref.status === 'PENDING' && 'قيد الانتظار'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Referrals Tab */}
        {activeTab === 'referrals' && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">سجل الإحالات</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-3 text-right font-semibold text-gray-700">العميل</th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-700">المبلغ</th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-700">العمولة</th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-700">النسبة</th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-700">الحالة</th>
                    <th className="px-6 py-3 text-right font-semibold text-gray-700">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/20">
                  {referrals.map((ref) => (
                    <tr key={ref.id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{ref.customerName}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900">${ref.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 font-bold text-blue-600">${ref.commission.toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-600">{ref.commissionRate}%</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            ref.status === 'PAID'
                              ? 'bg-green-100 text-green-800'
                              : ref.status === 'APPROVED'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {ref.status === 'PAID' && 'مدفوع'}
                          {ref.status === 'APPROVED' && 'معتمد'}
                          {ref.status === 'PENDING' && 'قيد الانتظار'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(ref.createdAt).toLocaleDateString('ar-EG')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">الأرباح الشهرية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {earnings.map((earning, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-white/20"
                >
                  <p className="text-gray-600 text-sm font-medium mb-2">{earning.month}</p>
                  <p className="text-3xl font-bold text-blue-600">${earning.amount.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Commission Settings */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">إعدادات العمولة</h2>
                <button
                  onClick={() => setShowCommissionModal(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  تعديل العمولة
                </button>
              </div>
              <p className="text-gray-600">يمكنك تعديل نسب العمولة الخاصة بك لكل نوع منتج</p>
            </div>

            {/* Payment Settings */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">بيانات الدفع</h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">طريقة الدفع</label>
                  <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option>تحويل بنكي</option>
                    <option>محفظة رقمية</option>
                    <option>شيك</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">الدقة الدنيا للسحب</label>
                  <input type="number" min="50" max="1000" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
                </div>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-8 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  حفظ الإعدادات
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Links Tab */}
        {activeTab === 'links' && (
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">روابط الدعوة</h2>
            <div className="space-y-6">
              {['packages', 'flights', 'hotels', 'cars', 'restaurants'].map((product) => {
                const link = `${typeof window !== 'undefined' ? window.location.origin : 'https://flytosky.com'}/${product}?ref=${affiliateData?.affiliateCode}`
                return (
                  <div key={product} className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-white/20">
                    <h3 className="font-semibold text-gray-900 mb-3 capitalize">{product}</h3>
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        readOnly
                        value={link}
                        className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg font-mono text-sm"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(link)
                          alert('تم نسخ الرابط')
                        }}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        نسخ
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Commission Modal */}
      {showCommissionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-900">تحديث العمولة</h3>
            <form onSubmit={handleCommissionSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">نوع المنتج</label>
                <select
                  value={commissionForm.productType}
                  onChange={(e) =>
                    setCommissionForm({
                      ...commissionForm,
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
                  value={commissionForm.commissionRate}
                  onChange={(e) =>
                    setCommissionForm({
                      ...commissionForm,
                      commissionRate: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
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
                  onClick={() => setShowCommissionModal(false)}
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
