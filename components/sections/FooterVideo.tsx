'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface FooterVideoProps {
    videoUrl: string
    heading: string
    link: string
}

export default function FooterVideo({ videoUrl, heading, link }: FooterVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const sectionRef = useRef<HTMLElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log('Video autoplay failed:', error)
            })
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true)
                    }
                })
            },
            { threshold: 0.4 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [])

    return (
        <section ref={sectionRef} className="banner-v15 section relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full">
                <video
                    ref={videoRef}
                    className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
                    loop
                    muted
                    playsInline
                    autoPlay
                >
                    <source src={videoUrl} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content with scale animation */}
            <div className="relative z-10 container-wide text-center">
                <Link
                    href={link}
                    className={`inline-block transition-all duration-1000 ease-out
                        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
                >
                    <h2 className="text-white text-5xl md:text-7xl font-bold 
                        hover:scale-110 hover:text-gray-200 transition-all duration-500
                        relative">
                        {heading}
                        <span className={`absolute -bottom-2 left-0 h-1 bg-white transition-all duration-700 delay-300
                            ${isVisible ? 'w-full' : 'w-0'}`} />
                    </h2>
                </Link>
            </div>

            {/* Animated corner accents */}
            <div className={`absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-white/50
                transition-all duration-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
            <div className={`absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-white/50
                transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} />
        </section>
    )
}
