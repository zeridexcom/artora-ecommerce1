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
    return (
        <section className="banner-v12 section py-16 md:py-24">
            <div className="container-wide">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Image */}
                    <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden">
                        <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                            {title}
                        </h2>

                        <p className="text-lg opacity-80 leading-relaxed">
                            {subtitle}
                        </p>

                        <p className="text-base opacity-70 leading-relaxed">
                            {description}
                        </p>

                        <Link
                            href={link}
                            className="btn inline-block mt-6"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
