'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Product {
    _id: string;
    name: string;
    price: number;
    images: { url: string }[];
    category: string;
}

export default function CollectionDetailPage() {
    const params = useParams();
    const collectionId = params.id as string;
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const collectionNames: Record<string, string> = {
        abstract: 'Abstract Art',
        nature: 'Nature & Landscapes',
        minimal: 'Minimalist',
        vintage: 'Vintage & Retro',
        photography: 'Photography',
        typography: 'Typography',
        modern: 'Modern Art',
        classic: 'Classic Collection'
    };

    useEffect(() => {
        // Demo products for collection
        setProducts([
            { _id: '1', name: `${collectionNames[collectionId] || 'Art'} Print 1`, price: 599, images: [{ url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=500&fit=crop' }], category: collectionId },
            { _id: '2', name: `${collectionNames[collectionId] || 'Art'} Print 2`, price: 499, images: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=500&fit=crop' }], category: collectionId },
            { _id: '3', name: `${collectionNames[collectionId] || 'Art'} Print 3`, price: 699, images: [{ url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop' }], category: collectionId },
            { _id: '4', name: `${collectionNames[collectionId] || 'Art'} Print 4`, price: 449, images: [{ url: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=500&fit=crop' }], category: collectionId },
            { _id: '5', name: `${collectionNames[collectionId] || 'Art'} Print 5`, price: 399, images: [{ url: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=500&fit=crop' }], category: collectionId },
            { _id: '6', name: `${collectionNames[collectionId] || 'Art'} Print 6`, price: 549, images: [{ url: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&h=500&fit=crop' }], category: collectionId },
        ]);
        setLoading(false);
    }, [collectionId]);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-black text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <Link href="/collections" className="text-gray-400 hover:text-white mb-4 inline-block">
                        ← All Collections
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-bold mb-4">
                        {collectionNames[collectionId] || collectionId}
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Explore our curated {collectionNames[collectionId]?.toLowerCase() || 'art'} collection
                    </p>
                </div>
            </div>

            {/* Products */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <Link key={product._id} href={`/product/${product._id}`} className="group">
                                <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 mb-4">
                                    <img
                                        src={product.images[0]?.url}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                </div>
                                <h3 className="font-medium text-lg group-hover:text-gray-600 transition-colors">{product.name}</h3>
                                <p className="text-gray-600">₹{product.price.toLocaleString()}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
