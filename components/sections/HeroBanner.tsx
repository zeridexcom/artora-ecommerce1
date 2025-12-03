'use client'

import { useEffect, useRef } from 'react'
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

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log('Video autoplay failed:', error)
            })
        }
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

            {/* Content */}
            <div className="relative z-10 container-wide">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                    <Link
                        href={leftLink}
                        className="banner-v11__heading text-white text-6xl md:text-8xl lg:text-9xl font-bold hover:opacity-80 transition-opacity"
                    >
                        {leftText}
                    </Link>
                    <Link
                        href={rightLink}
                        className="banner-v11__heading text-white text-6xl md:text-8xl lg:text-9xl font-bold hover:opacity-80 transition-opacity"
                    >
                        {rightText}
                    </Link>
                </div>
            </div>
        </section>
    )
}
