import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
    title: 'Artora - Framed Art Gallery',
    description: 'Discover striking simplicity with our curated selection of modern, minimal framed artwork.',
    keywords: 'framed art, artwork, gallery, modern art, wall decor',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <CartProvider>
                        <div id="root">
                            <Header />
                            <main id="main-content" className="content-for-layout">
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </CartProvider>
                </AuthProvider>
                <SpeedInsights />
            </body>
        </html>
    )
}
