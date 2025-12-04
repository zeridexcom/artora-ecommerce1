'use client'

import { useState, useEffect, useRef } from 'react'
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
    const [isVisible, setIsVisible] = useState(false)
    const [animateProducts, setAnimateProducts] = useState(false)
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true)
                    }
                })
            },
            { threshold: 0.1 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        // Fetch products for active tab
        const fetchProducts = async () => {
            setLoading(true)
            setAnimateProducts(false)
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
                // Trigger animation after products load
                setTimeout(() => setAnimateProducts(true), 100)
            }
        }

        fetchProducts()
    }, [activeTab, tabs])

    return (
        <section ref={sectionRef} className="product-v2 section py-16 md:py-24 bg-gray-50">
            <div className="container-wide">
                {/* Tabs with underline animation */}
                <div className={`flex justify-center mb-12 border-b border-gray-200
                    transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                    <div className="flex gap-8 overflow-x-auto">
                        {tabs.map((tab, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTab(index)}
                                className={`relative pb-4 px-2 text-lg font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap
                                    ${activeTab === index
                                        ? 'text-black'
                                        : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab.title}
                                <span className={`absolute bottom-0 left-0 h-0.5 bg-black transition-all duration-300
                                    ${activeTab === index ? 'w-full' : 'w-0'}`} />
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
                        {products.map((product, index) => (
                            <Link
                                key={product.id}
                                href={product.link}
                                className={`group transition-all duration-500 ease-out
                                    ${animateProducts ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                                style={{ transitionDelay: `${index * 50}ms` }}
                            >
                                <div className="relative aspect-square bg-gray-100 mb-4 overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                                    {/* Quick view overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/80 text-white text-center text-sm font-medium
                                        translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        Quick View
                                    </div>
                                </div>
                                <h3 className="font-semibold mb-2 group-hover:text-gray-600 transition-colors duration-300">
                                    {product.name}
                                </h3>
                                <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                            </Link>
                        ))}
                    </div>
                )}

                {/* View All Button */}
                <div className={`text-center transition-all duration-700 delay-500
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                    <Link href="/shop" className="btn-secondary hover:scale-105 transition-transform duration-300">
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
        image: `https://images.unsplash.com/photo-${1579783902614 + i}?w=400&h=400&fit=crop`,
        link: `/product/product-${i + 1}`,
    }))
}
