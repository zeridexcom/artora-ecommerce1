'use client';

import React, { useState, useEffect } from 'react';

interface DashboardData {
    overview: {
        totalRevenue: number;
        totalOrders: number;
        totalProducts: number;
        totalCustomers: number;
    };
    recentOrders: Array<{
        _id: string;
        orderNumber: string;
        total: number;
        status: string;
        createdAt: string;
        user: { name: string; email: string };
    }>;
    topProducts: Array<{
        _id: string;
        name: string;
        totalSold: number;
        revenue: number;
    }>;
    lowStockProducts: Array<{
        _id: string;
        name: string;
        quantity: number;
        images: { url: string }[];
    }>;
}

interface SalesData {
    salesData: Array<{
        _id: string;
        revenue: number;
        orders: number;
    }>;
    summary: {
        totalRevenue: number;
        totalOrders: number;
        totalItems: number;
        averageOrderValue: number;
    };
}

export default function AnalyticsPage() {
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [salesData, setSalesData] = useState<SalesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30d');
    const [activeTab, setActiveTab] = useState('overview');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        fetchData();
    }, [period]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token}` };

            const [dashboardRes, salesRes] = await Promise.all([
                fetch(`${API_URL}/api/analytics/dashboard`, { headers }),
                fetch(`${API_URL}/api/analytics/sales?period=${period}`, { headers })
            ]);

            if (dashboardRes.ok) {
                setDashboard(await dashboardRes.json());
            }
            if (salesRes.ok) {
                setSalesData(await salesRes.json());
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;
    const formatDate = (date: string) => new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-gray-600 mt-1">Track your store performance</p>
                </div>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                </select>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl text-white">
                    <p className="text-green-100 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold mt-1">{formatCurrency(dashboard?.overview?.totalRevenue || 0)}</p>
                    <p className="text-green-200 text-sm mt-2">↑ All time</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
                    <p className="text-blue-100 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold mt-1">{dashboard?.overview?.totalOrders || 0}</p>
                    <p className="text-blue-200 text-sm mt-2">📦 Completed</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl text-white">
                    <p className="text-purple-100 text-sm">Products</p>
                    <p className="text-3xl font-bold mt-1">{dashboard?.overview?.totalProducts || 0}</p>
                    <p className="text-purple-200 text-sm mt-2">🏷️ Active</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-xl text-white">
                    <p className="text-orange-100 text-sm">Customers</p>
                    <p className="text-3xl font-bold mt-1">{dashboard?.overview?.totalCustomers || 0}</p>
                    <p className="text-orange-200 text-sm mt-2">👥 Registered</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b">
                {[
                    { id: 'overview', label: '📊 Overview' },
                    { id: 'sales', label: '💰 Sales' },
                    { id: 'products', label: '🏷️ Products' },
                    { id: 'alerts', label: '⚠️ Alerts' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 -mb-px transition ${activeTab === tab.id
                                ? 'border-b-2 border-black font-medium'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Sales Chart Placeholder */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
                        <div className="h-64 flex flex-col justify-end">
                            <div className="flex items-end gap-2 h-48">
                                {(salesData?.salesData || []).slice(-14).map((day, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                                        style={{
                                            height: `${Math.max(10, (day.revenue / (Math.max(...(salesData?.salesData || []).map(d => d.revenue)) || 1)) * 100)}%`
                                        }}
                                        title={`${day._id}: ${formatCurrency(day.revenue)}`}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>14 days ago</span>
                                <span>Today</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                        <div className="space-y-3">
                            {(dashboard?.recentOrders || []).map(order => (
                                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <p className="font-medium">{order.orderNumber}</p>
                                        <p className="text-sm text-gray-500">{order.user?.name || 'Guest'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">{formatCurrency(order.total)}</p>
                                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {(!dashboard?.recentOrders || dashboard.recentOrders.length === 0) && (
                                <p className="text-gray-500 text-center py-4">No recent orders</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Sales Tab */}
            {activeTab === 'sales' && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-6">Sales Summary</h3>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Revenue</p>
                            <p className="text-xl font-bold">{formatCurrency(salesData?.summary?.totalRevenue || 0)}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Orders</p>
                            <p className="text-xl font-bold">{salesData?.summary?.totalOrders || 0}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Items Sold</p>
                            <p className="text-xl font-bold">{salesData?.summary?.totalItems || 0}</p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-500">Avg Order Value</p>
                            <p className="text-xl font-bold">{formatCurrency(salesData?.summary?.averageOrderValue || 0)}</p>
                        </div>
                    </div>

                    {/* Daily Breakdown */}
                    <h4 className="font-medium mb-3">Daily Breakdown</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left px-4 py-3">Date</th>
                                    <th className="text-right px-4 py-3">Orders</th>
                                    <th className="text-right px-4 py-3">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(salesData?.salesData || []).slice().reverse().slice(0, 10).map(day => (
                                    <tr key={day._id} className="border-b">
                                        <td className="px-4 py-3">{day._id}</td>
                                        <td className="text-right px-4 py-3">{day.orders}</td>
                                        <td className="text-right px-4 py-3 font-medium">{formatCurrency(day.revenue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
                <div className="bg-white rounded-xl shadow-sm border p-6">
                    <h3 className="text-lg font-semibold mb-6">Top Selling Products</h3>

                    <div className="space-y-4">
                        {(dashboard?.topProducts || []).map((product, i) => (
                            <div key={product._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                                    {i + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-gray-500">{product.totalSold} sold</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-600">{formatCurrency(product.revenue)}</p>
                                </div>
                            </div>
                        ))}
                        {(!dashboard?.topProducts || dashboard.topProducts.length === 0) && (
                            <p className="text-gray-500 text-center py-8">No sales data yet</p>
                        )}
                    </div>
                </div>
            )}

            {/* Alerts Tab */}
            {activeTab === 'alerts' && (
                <div className="space-y-6">
                    {/* Low Stock Alert */}
                    <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center gap-2">
                            ⚠️ Low Stock Alerts
                        </h3>
                        {(dashboard?.lowStockProducts && dashboard.lowStockProducts.length > 0) ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {dashboard.lowStockProducts.map(product => (
                                    <div key={product._id} className="flex items-center gap-3 p-3 bg-white rounded-lg">
                                        {product.images?.[0]?.url ? (
                                            <img src={product.images[0].url} alt={product.name} className="w-12 h-12 object-cover rounded" />
                                        ) : (
                                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">🖼️</div>
                                        )}
                                        <div>
                                            <p className="font-medium">{product.name}</p>
                                            <p className="text-sm text-red-600">{product.quantity} left</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-yellow-700">All products are well stocked! 🎉</p>
                        )}
                    </div>

                    {/* Performance Alerts */}
                    <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                        <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                            💡 Performance Insights
                        </h3>
                        <ul className="space-y-2 text-blue-700">
                            <li>• Average order value is {formatCurrency(salesData?.summary?.averageOrderValue || 0)}</li>
                            <li>• {dashboard?.overview?.totalProducts || 0} products currently active</li>
                            <li>• {dashboard?.overview?.totalCustomers || 0} registered customers</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
