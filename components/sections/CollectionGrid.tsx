'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Collection {
    number: string
    image: string
    title: string
    description: string
    link: string
}

interface CollectionGridProps {
    collections: Collection[]
}

export default function CollectionGrid({ collections }: CollectionGridProps) {
    const [visibleItems, setVisibleItems] = useState<boolean[]>([])
    const sectionRef = useRef<HTMLElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        // Stagger the animations
                        collections.forEach((_, index) => {
                            setTimeout(() => {
                                setVisibleItems(prev => {
                                    const newState = [...prev]
                                    newState[index] = true
                                    return newState
                                })
                            }, index * 150)
                        })
                    }
                })
            },
            { threshold: 0.2 }
        )

        if (sectionRef.current) {
            observer.observe(sectionRef.current)
        }

        return () => observer.disconnect()
    }, [collections])

    return (
        <section ref={sectionRef} className="collection-v3 section py-16 md:py-24">
            <div className="container-wide">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {collections.map((collection, index) => (
                        <div
                            key={index}
                            className={`collection-v3-item group transition-all duration-700 ease-out
                                ${visibleItems[index] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                        >
                            <div className="collection-v3-item__header text-6xl font-bold mb-4 opacity-20 group-hover:opacity-60 transition-all duration-300 group-hover:translate-x-2">
                                {collection.number}
                            </div>

                            <Link href={collection.link} className="block mb-6 overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                                <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
                                    <Image
                                        src={collection.image}
                                        alt={collection.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                                </div>
                            </Link>

                            <div className="collection-v3-item-content">
                                <h3 className="collection-v3-item-content__title text-2xl font-bold mb-3 group-hover:text-gray-600 transition-colors duration-300">
                                    {collection.title}
                                </h3>
                                <p className="collection-v3-item-content__desc text-base opacity-75 leading-relaxed group-hover:opacity-100 transition-opacity duration-300">
                                    {collection.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
