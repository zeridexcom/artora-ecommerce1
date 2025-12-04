import HeroBanner from '@/components/sections/HeroBanner'
import CollectionGrid from '@/components/sections/CollectionGrid'
import PromoBanner from '@/components/sections/PromoBanner'
import ProductTabs from '@/components/sections/ProductTabs'
import FooterVideo from '@/components/sections/FooterVideo'

export default function HomePage() {
    return (
        <>
            {/* Hero Video Banner - Banner V11 */}
            <HeroBanner
                videoUrl="https://cdn.shopify.com/videos/c/o/v/692b886e2a2e40eabd84fd11227725fe.mp4"
                leftText="Framed"
                rightText="Art"
                leftLink="/collections/framed"
                rightLink="/collections/art"
            />

            {/* Collection Grid - Collection V3 */}
            <CollectionGrid
                collections={[
                    {
                        number: '01',
                        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=800&fit=crop',
                        title: 'Clean lines, bold forms.',
                        description: 'Discover striking simplicity with our curated selection of modern, minimal wall posters.',
                        link: '/collections/modern',
                    },
                    {
                        number: '02',
                        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop',
                        title: 'Nature, framed beautifully.',
                        description: 'Bring the calm and color of nature indoors with lush, botanical-inspired pieces.',
                        link: '/collections/nature',
                    },
                    {
                        number: '03',
                        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=800&fit=crop',
                        title: 'Let color and shape speak.',
                        description: 'A collection of expressive abstract works to ignite imagination and emotion.',
                        link: '/collections/abstract',
                    },
                    {
                        number: '04',
                        image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=600&h=800&fit=crop',
                        title: 'Art that never ages.',
                        description: 'Explore iconic, classic wall art pieces for a touch of elegance in any space.',
                        link: '/collections/classic',
                    },
                ]}
            />

            {/* Promotional Banner - Banner V12 */}
            <PromoBanner
                image="https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=1200&h=800&fit=crop"
                title="Your Walls Deserve Better. Celebrate Art with Our Biggest Wall Poster Sale of the Season!"
                subtitle="Transform your space into a gallery of self-expression. Whether you're into bold abstracts, serene landscapes, or vintage photography, our curated collection of wall posters is designed to elevate every wall. High-quality prints ready to hang—now's the time to bring home art that speaks to you."
                description="Your walls are a blank canvas—let's fill them with beauty. Shop our exclusive collection of premium wall posters at up to 40% off. From contemporary minimalism to timeless classics, we have styles to match every mood and room."
                link="/collections/sale"
            />

            {/* Product Tabs - Product V2 */}
            <ProductTabs
                tabs={[
                    { title: 'Featured', collection: 'featured' },
                    { title: 'Trending', collection: 'trending' },
                    { title: 'Creative', collection: 'creative' },
                    { title: 'Whisper', collection: 'whisper' },
                ]}
            />

            {/* Footer Video - Banner V15 */}
            <FooterVideo
                videoUrl="https://cdn.shopify.com/videos/c/o/v/fd239e8ebc6a41e083bd74ee3e699ef5.mp4"
                heading="See the picture"
                link="/collections/all"
            />
        </>
    )
}
