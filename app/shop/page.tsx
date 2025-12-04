'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Product {
    _id: string;
    name: string;
    price: number;
    images: { url: string }[];
    category: string;
}

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('all');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/api/products`);
            const data = await res.json();
            setProducts(data.products || data || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            // Use placeholder products for demo
            setProducts([
                { _id: '1', name: 'Abstract Mountain Poster', price: 599, images: [{ url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop' }], category: 'abstract' },
                { _id: '2', name: 'Ocean Waves Print', price: 499, images: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop' }], category: 'nature' },
                { _id: '3', name: 'City Skyline Art', price: 699, images: [{ url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop' }], category: 'urban' },
                { _id: '4', name: 'Botanical Garden', price: 449, images: [{ url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=500&fit=crop' }], category: 'nature' },
                { _id: '5', name: 'Minimalist Lines', price: 399, images: [{ url: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=500&fit=crop' }], category: 'minimal' },
                { _id: '6', name: 'Sunset Dreams', price: 549, images: [{ url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&h=500&fit=crop' }], category: 'nature' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['all', 'abstract', 'nature', 'urban', 'minimal'];
    const filteredProducts = category === 'all'
        ? products
        : products.filter(p => p.category === category);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-black text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4 animate-fade-in">Shop</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Discover our curated collection of premium wall posters and art prints
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-wrap gap-3 justify-center mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-6 py-2 rounded-full capitalize transition-all duration-300 ${category === cat
                                    ? 'bg-black text-white scale-105'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {filteredProducts.map((product, index) => (
                            <Link
                                key={product._id}
                                href={`/product/${product._id}`}
                                className="group"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-4">
                                    <img
                                        src={product.images[0]?.url || 'https://via.placeholder.com/400x500'}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                    <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-2 rounded-full font-medium opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        Quick View
                                    </button>
                                </div>
                                <h3 className="font-medium text-lg group-hover:text-gray-600 transition-colors">{product.name}</h3>
                                <p className="text-gray-600">₹{product.price.toLocaleString()}</p>
                            </Link>
                        ))}
                    </div>
                )}

                {filteredProducts.length === 0 && !loading && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-2xl mb-4">No products found</p>
                        <button onClick={() => setCategory('all')} className="text-black underline">
                            View all products
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
