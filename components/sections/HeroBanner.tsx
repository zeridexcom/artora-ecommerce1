'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface HeroBannerProps {
    videoUrl: string
    leftText: string
    rightText: string
    leftLink: string
    rightLink: string
}

export default function HeroBanner({ videoUrl, leftText, rightText, leftLink, rightLink }: HeroBannerProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log('Video autoplay failed:', error)
            })
        }
        // Trigger animation after mount
        setTimeout(() => setIsVisible(true), 100)
    }, [])

    return (
        <section className="banner-v11 relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
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
                <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content with Animations */}
            <div className="relative z-10 container-wide">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                    <Link
                        href={leftLink}
                        className={`banner-v11__heading text-white text-6xl md:text-8xl lg:text-9xl font-bold 
                            transition-all duration-700 ease-out hover:scale-110 hover:text-gray-200
                            ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}
                    >
                        {leftText}
                    </Link>
                    <Link
                        href={rightLink}
                        className={`banner-v11__heading text-white text-6xl md:text-8xl lg:text-9xl font-bold 
                            transition-all duration-700 ease-out delay-200 hover:scale-110 hover:text-gray-200
                            ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}
                    >
                        {rightText}
                    </Link>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
                    <div className="w-1.5 h-3 bg-white rounded-full mt-2 animate-bounce" />
                </div>
            </div>
        </section>
    )
}
