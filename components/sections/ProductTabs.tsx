'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Tab {
    title: string
    collection: string
}

interface Product {
    id: string
    name: string
    price: number
    image: string
    link: string
}

interface ProductTabsProps {
    tabs: Tab[]
}

export default function ProductTabs({ tabs }: ProductTabsProps) {
    const [activeTab, setActiveTab] = useState(0)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch products for active tab
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api/products?collection=${tabs[activeTab].collection}&limit=12`)
                const data = await response.json()
                setProducts(data.products || [])
            } catch (error) {
                console.error('Error fetching products:', error)
                // Use mock data for now
                setProducts(getMockProducts())
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [activeTab, tabs])

    return (
        <section className="product-v2 section py-16 md:py-24 bg-gray-50">
            <div className="container-wide">
                {/* Tabs */}
                <div className="flex justify-center mb-12 border-b border-gray-200">
                    <div className="flex gap-8 overflow-x-auto">
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={`pb-4 px-2 text-lg font-semibold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === index
                                        ? 'border-b-2 border-black text-black'
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab.title}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                        {products.map((product) => (
                            <Link
                                key={product.id}
                                href={product.link}
                                className="group"
                            >
                                <div className="relative aspect-square bg-gray-100 mb-4 overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="font-semibold mb-2 group-hover:opacity-70 transition-opacity">
                                    {product.name}
                                </h3>
                                <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                            </Link>
                        ))}
                    </div>
                )}

                {/* View All Button */}
                <div className="text-center">
                    <Link href="/products" className="btn-secondary">
                        All Products
                    </Link>
                </div>
            </div>
        </section>
    )
}

// Mock data for development
function getMockProducts(): Product[] {
    return Array.from({ length: 12 }, (_, i) => ({
        id: `product-${i + 1}`,
        name: `Framed Artwork ${i + 1}`,
        price: 99 + i * 10,
        image: `/images/products/product-${(i % 4) + 1}.jpg`,
        link: `/products/product-${i + 1}`,
    }))
}
