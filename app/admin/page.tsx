'use client'

import { useEffect, useState } from 'react'

interface DashboardStats {
    totalOrders: number
    totalRevenue: number
    totalProducts: number
    totalCustomers: number
    lowStockProducts: number
    recentOrders: any[]
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardStats()
    }, [])

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            })
            const data = await response.json()
            setStats(data)
        } catch (error) {
            console.error('Error fetching stats:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="text-center py-12">Loading...</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-sm text-gray-600 mb-2">Total Revenue</div>
                    <div className="text-3xl font-bold">${stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-sm text-gray-600 mb-2">Total Orders</div>
                    <div className="text-3xl font-bold">{stats?.totalOrders || 0}</div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-sm text-gray-600 mb-2">Total Products</div>
                    <div className="text-3xl font-bold">{stats?.totalProducts || 0}</div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-sm text-gray-600 mb-2">Total Customers</div>
                    <div className="text-3xl font-bold">{stats?.totalCustomers || 0}</div>
                </div>
            </div>

            {/* Low Stock Alert */}
            {stats && stats.lowStockProducts > 0 && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                <strong>{stats.lowStockProducts}</strong> products are low on stock.
                                <a href="/admin/inventory" className="font-medium underline ml-2">View inventory</a>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Recent Orders</h2>
                </div>
                <div className="p-6">
                    {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4">Order #</th>
                                        <th className="text-left py-3 px-4">Customer</th>
                                        <th className="text-left py-3 px-4">Total</th>
                                        <th className="text-left py-3 px-4">Status</th>
                                        <th className="text-left py-3 px-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.recentOrders.map((order: any) => (
                                        <tr key={order._id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">{order.orderNumber}</td>
                                            <td className="py-3 px-4">{order.user?.name}</td>
                                            <td className="py-3 px-4">${order.total.toFixed(2)}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No orders yet</p>
                    )}
                </div>
            </div>
        </div>
    )
}
