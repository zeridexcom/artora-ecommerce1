'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface PromoBannerProps {
    image: string
    title: string
    subtitle: string
    description: string
    link: string
}

export default function PromoBanner({ image, title, subtitle, description, link }: PromoBannerProps) {
    const [isVisible, setIsVisible] = useState(false)
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
            { threshold: 0.3 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <section ref={sectionRef} className="banner-v12 section py-16 md:py-24 overflow-hidden">
            <div className="container-wide">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Image with slide-in animation */}
                    <div className={`relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-xl shadow-2xl
                        transition-all duration-1000 ease-out
                        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Content with staggered animations */}
                    <div className="space-y-6">
                        <h2 className={`text-4xl md:text-5xl font-bold leading-tight
                            transition-all duration-700 delay-200
                            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            {title}
                        </h2>

                        <p className={`text-lg opacity-80 leading-relaxed
                            transition-all duration-700 delay-400
                            ${isVisible ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            {subtitle}
                        </p>

                        <p className={`text-base opacity-70 leading-relaxed
                            transition-all duration-700 delay-500
                            ${isVisible ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            {description}
                        </p>

                        <Link
                            href={link}
                            className={`btn inline-block mt-6 hover:scale-105 hover:shadow-lg transition-all duration-300
                                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                                transition-all duration-700 delay-600`}
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
