'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Product {
    _id: string;
    name: string;
    price: number;
    images: { url: string }[];
    description: string;
    category: string;
    quantity: number;
}

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

    useEffect(() => {
        fetchProduct();
    }, [params.id]);

    const fetchProduct = async () => {
        try {
            const res = await fetch(`${API_URL}/api/products/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setProduct(data);
            } else {
                // Demo product
                setProduct({
                    _id: params.id as string,
                    name: 'Premium Wall Art Print',
                    price: 599,
                    images: [{ url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=1000&fit=crop' }],
                    description: 'A stunning piece of wall art that will transform any room. Printed on premium matte paper with archival inks for lasting quality.',
                    category: 'Wall Art',
                    quantity: 50
                });
            }
        } catch (error) {
            console.error('Failed to fetch product:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
                    <Link href="/shop" className="text-black underline">Back to Shop</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-7xl mx-auto px-4">
                <Link href="/shop" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-8">
                    ← Back to Shop
                </Link>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Image */}
                    <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-gray-100">
                        <img
                            src={product.images[0]?.url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Details */}
                    <div className="py-8">
                        <span className="text-sm text-gray-500 uppercase tracking-wider">{product.category}</span>
                        <h1 className="text-4xl font-bold mt-2 mb-4">{product.name}</h1>
                        <p className="text-3xl font-bold mb-6">₹{product.price.toLocaleString()}</p>

                        <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

                        {/* Quantity */}
                        <div className="flex items-center gap-4 mb-8">
                            <span className="font-medium">Quantity:</span>
                            <div className="flex items-center border rounded-lg">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
                                >
                                    -
                                </button>
                                <span className="w-12 text-center">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <button className="w-full py-4 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition mb-4">
                            Add to Cart - ₹{(product.price * quantity).toLocaleString()}
                        </button>

                        <button className="w-full py-4 border-2 border-black text-black rounded-xl font-medium hover:bg-black hover:text-white transition">
                            Buy Now
                        </button>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🚚</span>
                                <span className="text-sm text-gray-600">Free Shipping</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🔄</span>
                                <span className="text-sm text-gray-600">Easy Returns</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">✅</span>
                                <span className="text-sm text-gray-600">Premium Quality</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">💖</span>
                                <span className="text-sm text-gray-600">Handcrafted</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
