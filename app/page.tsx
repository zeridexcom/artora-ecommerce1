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
                        image: '/images/collections/h3i07.jpg',
                        title: 'Clean lines, bold forms.',
                        description: 'Discover striking simplicity with our curated selection of modern, minimal framed artwork.',
                        link: '/collections/modern',
                    },
                    {
                        number: '02',
                        image: '/images/collections/h3i02.jpg',
                        title: 'Nature, framed beautifully.',
                        description: 'Bring the calm and color of nature indoors with lush, botanical-inspired pieces.',
                        link: '/collections/nature',
                    },
                    {
                        number: '03',
                        image: '/images/collections/h3i08.jpg',
                        title: 'Let color and shape speak.',
                        description: 'A collection of expressive abstract works to ignite imagination and emotion.',
                        link: '/collections/abstract',
                    },
                    {
                        number: '04',
                        image: '/images/collections/h3i06.jpg',
                        title: 'Art that never ages.',
                        description: 'Explore iconic, classic framed art pieces for a touch of elegance in any space.',
                        link: '/collections/classic',
                    },
                ]}
            />

            {/* Promotional Banner - Banner V12 */}
            <PromoBanner
                image="/images/promo/pexels-pavel-danilyuk-6712471.jpg"
                title="Your Walls Deserve Better. Celebrate Art with Our Biggest Framing Sale of the Season!"
                subtitle="Transform your space into a gallery of self-expression. Whether you're into bold abstracts, serene landscapes, or vintage photography, our curated collection of framed artwork is designed to elevate every wall. Hand-framed, high-quality, and ready to hang—now's the time to bring home the pieces that speak to you."
                description="Your walls are a blank canvas—let's fill them with beauty. Shop our exclusive collection of professionally framed art prints at up to 40% off. From contemporary minimalism to timeless classics, we have styles to match every mood and room. Crafted with care, shipped with love—art that's made to last and meant to be seen."
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
