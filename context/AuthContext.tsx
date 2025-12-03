'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
    id: string
    email: string
    name: string
    role: 'customer' | 'admin'
}

interface AuthContextType {
    user: User | null
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    register: (email: string, password: string, name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        // Check for saved user session
        const savedUser = localStorage.getItem('user')
        if (savedUser) {
            setUser(JSON.parse(savedUser))
        }
    }, [])

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })

            if (!response.ok) throw new Error('Login failed')

            const data = await response.json()
            setUser(data.user)
            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('token', data.token)
        } catch (error) {
            console.error('Login error:', error)
            throw error
        }
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
    }

    const register = async (email: string, password: string, name: string) => {
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, name }),
            })

            if (!response.ok) throw new Error('Registration failed')

            const data = await response.json()
            setUser(data.user)
            localStorage.setItem('user', JSON.stringify(data.user))
            localStorage.setItem('token', data.token)
        } catch (error) {
            console.error('Registration error:', error)
            throw error
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
