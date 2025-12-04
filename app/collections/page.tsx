import Link from 'next/link';

export default function CollectionsPage() {
    const collections = [
        {
            id: 'abstract',
            name: 'Abstract Art',
            image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
            description: 'Bold colors and expressive forms',
            count: 24
        },
        {
            id: 'nature',
            name: 'Nature & Landscapes',
            image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
            description: 'Bring the outdoors inside',
            count: 36
        },
        {
            id: 'minimal',
            name: 'Minimalist',
            image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=600&fit=crop',
            description: 'Clean lines and simple beauty',
            count: 18
        },
        {
            id: 'vintage',
            name: 'Vintage & Retro',
            image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
            description: 'Timeless classics',
            count: 22
        },
        {
            id: 'photography',
            name: 'Photography',
            image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&h=600&fit=crop',
            description: 'Captured moments',
            count: 42
        },
        {
            id: 'typography',
            name: 'Typography',
            image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=600&fit=crop',
            description: 'Words as art',
            count: 15
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-black text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4">Collections</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Explore our curated collections of wall art for every style
                    </p>
                </div>
            </div>

            {/* Collections Grid */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {collections.map((collection, index) => (
                        <Link
                            key={collection.id}
                            href={`/collections/${collection.id}`}
                            className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <img
                                src={collection.image}
                                alt={collection.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <span className="text-sm text-gray-300">{collection.count} items</span>
                                <h2 className="text-2xl font-bold mb-1">{collection.name}</h2>
                                <p className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {collection.description}
                                </p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium">
                                    Explore →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
