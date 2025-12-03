'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

interface FooterVideoProps {
    videoUrl: string
    heading: string
    link: string
}

export default function FooterVideo({ videoUrl, heading, link }: FooterVideoProps) {
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.log('Video autoplay failed:', error)
            })
        }
    }, [])

    return (
        <section className="banner-v15 section relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
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

            {/* Content */}
            <div className="relative z-10 container-wide text-center">
                <Link
                    href={link}
                    className="inline-block"
                >
                    <h2 className="text-white text-5xl md:text-7xl font-bold hover:opacity-80 transition-opacity">
                        {heading}
                    </h2>
                </Link>
            </div>
        </section>
    )
}
