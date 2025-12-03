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
    return (
        <section className="collection-v3 section py-16 md:py-24">
            <div className="container-wide">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {collections.map((collection, index) => (
                        <div key={index} className="collection-v3-item group">
                            <div className="collection-v3-item__header text-6xl font-bold mb-4 opacity-20 group-hover:opacity-40 transition-opacity">
                                {collection.number}
                            </div>

                            <Link href={collection.link} className="block mb-6 overflow-hidden">
                                <div className="relative aspect-[3/4] bg-gray-100">
                                    <Image
                                        src={collection.image}
                                        alt={collection.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </Link>

                            <div className="collection-v3-item-content">
                                <h3 className="collection-v3-item-content__title text-2xl font-bold mb-3">
                                    {collection.title}
                                </h3>
                                <p className="collection-v3-item-content__desc text-base opacity-75 leading-relaxed">
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
