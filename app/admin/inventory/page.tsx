'use client';

import React, { useState, useEffect } from 'react';

interface Product {
    _id: string;
    name: string;
    sku?: string;
    price: number;
    quantity: number;
    category: string;
    images: { url: string }[];
    active: boolean;
    lowStockThreshold?: number;
}

export default function InventoryPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, low, out
    const [search, setSearch] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState(0);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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
        } finally {
            setLoading(false);
        }
    };

    const updateInventory = async (productId: string, quantity: number, action: 'set' | 'increase' | 'decrease') => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/products/${productId}/inventory`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity, action })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: 'Inventory updated!' });
                fetchProducts();
                setEditingId(null);
            } else {
                setMessage({ type: 'error', text: 'Failed to update inventory' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Error updating inventory' });
        }
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    // Filter products
    const filteredProducts = products.filter(p => {
        // Search filter
        if (search && !p.name.toLowerCase().includes(search.toLowerCase())) {
            return false;
        }
        // Stock filter
        if (filter === 'low' && p.quantity > (p.lowStockThreshold || 10)) {
            return false;
        }
        if (filter === 'out' && p.quantity > 0) {
            return false;
        }
        return true;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        let comparison = 0;
        switch (sortBy) {
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'quantity':
                comparison = a.quantity - b.quantity;
                break;
            case 'price':
                comparison = a.price - b.price;
                break;
            case 'category':
                comparison = a.category.localeCompare(b.category);
                break;
        }
        return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Stats
    const totalProducts = products.length;
    const inStock = products.filter(p => p.quantity > 10).length;
    const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= 10).length;
    const outOfStock = products.filter(p => p.quantity === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    const getStockStatus = (quantity: number, threshold: number = 10) => {
        if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
        if (quantity <= threshold) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
        return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
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
                    <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-gray-600 mt-1">Track and manage your product stock levels</p>
                </div>
                <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center gap-2">
                    📥 Export CSV
                </button>
            </div>

            {/* Message */}
            {message.text && (
                <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <p className="text-sm text-gray-500">Total Products</p>
                    <p className="text-2xl font-bold">{totalProducts}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl shadow-sm border border-green-200">
                    <p className="text-sm text-green-600">In Stock</p>
                    <p className="text-2xl font-bold text-green-700">{inStock}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-xl shadow-sm border border-yellow-200">
                    <p className="text-sm text-yellow-600">Low Stock</p>
                    <p className="text-2xl font-bold text-yellow-700">{lowStock}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl shadow-sm border border-red-200">
                    <p className="text-sm text-red-600">Out of Stock</p>
                    <p className="text-2xl font-bold text-red-700">{outOfStock}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-xl shadow-sm border border-blue-200">
                    <p className="text-sm text-blue-600">Total Value</p>
                    <p className="text-2xl font-bold text-blue-700">₹{totalValue.toLocaleString()}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex-1 min-w-64">
                    <input
                        type="text"
                        placeholder="🔍 Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                    />
                </div>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                >
                    <option value="all">All Products</option>
                    <option value="low">Low Stock Only</option>
                    <option value="out">Out of Stock</option>
                </select>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                >
                    <option value="name">Sort by Name</option>
                    <option value="quantity">Sort by Quantity</option>
                    <option value="price">Sort by Price</option>
                    <option value="category">Sort by Category</option>
                </select>
                <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-4 py-3 border rounded-lg hover:bg-gray-100 transition"
                >
                    {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="text-left px-6 py-4 font-medium text-gray-600">Product</th>
                            <th className="text-left px-6 py-4 font-medium text-gray-600">Category</th>
                            <th className="text-left px-6 py-4 font-medium text-gray-600">Price</th>
                            <th className="text-center px-6 py-4 font-medium text-gray-600">Stock</th>
                            <th className="text-center px-6 py-4 font-medium text-gray-600">Status</th>
                            <th className="text-center px-6 py-4 font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedProducts.map((product) => {
                            const status = getStockStatus(product.quantity, product.lowStockThreshold);
                            return (
                                <tr key={product._id} className="border-b hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {product.images?.[0]?.url ? (
                                                <img
                                                    src={product.images[0].url}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                    🖼️
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium">{product.name}</p>
                                                {product.sku && <p className="text-sm text-gray-500">SKU: {product.sku}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 capitalize">{product.category}</td>
                                    <td className="px-6 py-4">₹{product.price.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">
                                        {editingId === product._id ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <input
                                                    type="number"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(parseInt(e.target.value) || 0)}
                                                    className="w-20 px-2 py-1 border rounded text-center"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => updateInventory(product._id, editValue, 'set')}
                                                    className="text-green-600 hover:text-green-800"
                                                >
                                                    ✓
                                                </button>
                                                <button
                                                    onClick={() => setEditingId(null)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <span
                                                className="font-bold cursor-pointer hover:underline"
                                                onClick={() => {
                                                    setEditingId(product._id);
                                                    setEditValue(product.quantity);
                                                }}
                                            >
                                                {product.quantity}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                                            {status.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() => updateInventory(product._id, 1, 'increase')}
                                                className="w-8 h-8 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition flex items-center justify-center"
                                                title="Add 1"
                                            >
                                                +
                                            </button>
                                            <button
                                                onClick={() => updateInventory(product._id, 1, 'decrease')}
                                                className="w-8 h-8 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center justify-center"
                                                title="Remove 1"
                                                disabled={product.quantity === 0}
                                            >
                                                -
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {sortedProducts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No products found matching your criteria
                    </div>
                )}
            </div>

            {/* Low Stock Alert */}
            {lowStock > 0 && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ Low Stock Alert</h3>
                    <p className="text-yellow-700 mb-4">The following products need restocking:</p>
                    <div className="flex flex-wrap gap-2">
                        {products
                            .filter(p => p.quantity > 0 && p.quantity <= (p.lowStockThreshold || 10))
                            .map(p => (
                                <span key={p._id} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                                    {p.name} ({p.quantity} left)
                                </span>
                            ))
                        }
                    </div>
                </div>
            )}
        </div>
    );
}
