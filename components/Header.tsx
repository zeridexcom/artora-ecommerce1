'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { cart } = useCart()
    const { user } = useAuth()

    const cartItemCount = cart?.items?.reduce((total: number, item: any) => total + item.quantity, 0) || 0

    return (
        <header className="header-v7 header-v7--transparent">
            {/* Top Bar with Social Icons */}
            <div className="header-v7__topbar bg-white">
                <div className="container-wide">
                    <div className="grid grid-cols-2 items-center py-2">
                        <ul className="flex gap-4 list-none m-0 p-0">
                            <li>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-70">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-70">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-70">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                    </svg>
                                </a>
                            </li>
                            <li>
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-black hover:opacity-70">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                    </svg>
                                </a>
                            </li>
                        </ul>
                        <div className="flex gap-4 justify-end text-sm">
                            <span>Currency: USD</span>
                            <span>Language: EN</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="header-v7__sticky bg-black text-white sticky top-0 z-50">
                <div className="container-wide">
                    <div className="grid grid-cols-3 items-center py-4 gap-4">
                        {/* Logo */}
                        <div className="header-v7__logo">
                            <Link href="/" className="flex items-center">
                                <Image
                                    src="/images/ArtoraLogoWhite.png"
                                    alt="Artora"
                                    width={120}
                                    height={40}
                                    className="hidden md:block"
                                    priority
                                />
                                <Image
                                    src="/images/ArtoraLogoWhite.png"
                                    alt="Artora"
                                    width={100}
                                    height={33}
                                    className="md:hidden"
                                    priority
                                />
                            </Link>
                        </div>

                        {/* Navigation */}
                        <nav className="header-v7__navigation hidden lg:flex justify-center">
                            <ul className="flex gap-8 list-none m-0 p-0 text-sm uppercase tracking-wider">
                                <li>
                                    <Link href="/" className="hover:opacity-70 transition-opacity">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/products" className="hover:opacity-70 transition-opacity">
                                        Shop
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/collections" className="hover:opacity-70 transition-opacity">
                                        Collections
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/about" className="hover:opacity-70 transition-opacity">
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="hover:opacity-70 transition-opacity">
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        {/* Utilities */}
                        <div className="header-v7__utilities flex gap-4 justify-end items-center">
                            <button className="hover:opacity-70 transition-opacity" aria-label="Search">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.35-4.35" />
                                </svg>
                            </button>

                            <Link href={user ? "/account" : "/login"} className="hover:opacity-70 transition-opacity hidden md:block" aria-label="Account">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </Link>

                            <Link href="/wishlist" className="hover:opacity-70 transition-opacity hidden md:block relative" aria-label="Wishlist">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                            </Link>

                            <Link href="/cart" className="hover:opacity-70 transition-opacity relative" aria-label="Cart">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="9" cy="21" r="1" />
                                    <circle cx="20" cy="21" r="1" />
                                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                                </svg>
                                {cartItemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                        {cartItemCount}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile Menu Toggle */}
                            <button
                                className="lg:hidden"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label="Toggle menu"
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="lg:hidden bg-black text-white">
                    <nav className="container-wide py-6">
                        <ul className="flex flex-col gap-4 list-none m-0 p-0">
                            <li>
                                <Link href="/" className="block py-2 hover:opacity-70" onClick={() => setMobileMenuOpen(false)}>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="block py-2 hover:opacity-70" onClick={() => setMobileMenuOpen(false)}>
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link href="/collections" className="block py-2 hover:opacity-70" onClick={() => setMobileMenuOpen(false)}>
                                    Collections
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="block py-2 hover:opacity-70" onClick={() => setMobileMenuOpen(false)}>
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="block py-2 hover:opacity-70" onClick={() => setMobileMenuOpen(false)}>
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href={user ? "/account" : "/login"} className="block py-2 hover:opacity-70" onClick={() => setMobileMenuOpen(false)}>
                                    {user ? 'Account' : 'Login'}
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </header>
    )
}
