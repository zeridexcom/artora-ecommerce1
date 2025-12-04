'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) {
            router.push('/login?redirect=/admin')
        } else if (user.role !== 'admin') {
            router.push('/')
        } else {
            setLoading(false)
        }
    }, [user, router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-black text-white min-h-screen p-6">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold">Lazywalls</h2>
                        <p className="text-sm opacity-70 mt-1">Admin Dashboard</p>
                    </div>

                    <nav className="space-y-2">
                        <Link
                            href="/admin"
                            className="block px-4 py-3 rounded hover:bg-white/10 transition-colors"
                        >
                            📊 Dashboard
                        </Link>
                        <Link
                            href="/admin/theme-editor"
                            className="block px-4 py-3 rounded hover:bg-white/10 transition-colors"
                        >
                            🎨 Theme Editor
                        </Link>
                        <Link
                            href="/admin/products"
                            className="block px-4 py-3 rounded hover:bg-white/10 transition-colors"
                        >
                            🖼️ Products
                        </Link>
                        <Link
                            href="/admin/inventory"
                            className="block px-4 py-3 rounded hover:bg-white/10 transition-colors"
                        >
                            📦 Inventory
                        </Link>
                        <Link
                            href="/admin/orders"
                            className="block px-4 py-3 rounded hover:bg-white/10 transition-colors"
                        >
                            🛒 Orders
                        </Link>
                        <Link
                            href="/admin/customers"
                            className="block px-4 py-3 rounded hover:bg-white/10 transition-colors"
                        >
                            👥 Customers
                        </Link>
                        <Link
                            href="/admin/analytics"
                            className="block px-4 py-3 rounded hover:bg-white/10 transition-colors"
                        >
                            📈 Analytics
                        </Link>
                        <Link
                            href="/admin/settings"
                            className="block px-4 py-3 rounded hover:bg-white/10 transition-colors"
                        >
                            ⚙️ Settings
                        </Link>
                        <Link
                            href="/"
                            className="block px-4 py-3 rounded hover:bg-white/10 transition-colors mt-8 border-t border-white/20 pt-6"
                        >
                            ← Back to Store
                        </Link>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
