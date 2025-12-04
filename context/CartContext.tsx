'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CartItem {
    id: string
    name: string
    price: number
    quantity: number
    image: string
}

interface CartContextType {
    cart: { items: CartItem[] } | null
    addToCart: (item: CartItem) => void
    removeFromCart: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<{ items: CartItem[] } | null>(null)

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart')
        if (savedCart) {
            setCart(JSON.parse(savedCart))
        } else {
            setCart({ items: [] })
        }
    }, [])

    useEffect(() => {
        // Save cart to localStorage
        if (cart) {
            localStorage.setItem('cart', JSON.stringify(cart))
        }
    }, [cart])

    const addToCart = (item: CartItem) => {
        setCart((prevCart) => {
            if (!prevCart) return { items: [item] }

            const existingItem = prevCart.items.find((i) => i.id === item.id)
            if (existingItem) {
                return {
                    items: prevCart.items.map((i) =>
                        i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
                    ),
                }
            }
            return { items: [...prevCart.items, item] }
        })
    }

    const removeFromCart = (id: string) => {
        setCart((prevCart) => {
            if (!prevCart) return null
            return { items: prevCart.items.filter((i) => i.id !== id) }
        })
    }

    const updateQuantity = (id: string, quantity: number) => {
        setCart((prevCart) => {
            if (!prevCart) return null
            if (quantity <= 0) {
                return { items: prevCart.items.filter((i) => i.id !== id) }
            }
            return {
                items: prevCart.items.map((i) =>
                    i.id === id ? { ...i, quantity } : i
                ),
            }
        })
    }

    const clearCart = () => {
        setCart({ items: [] })
    }

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
