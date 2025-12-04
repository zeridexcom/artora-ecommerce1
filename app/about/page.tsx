export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="relative h-[60vh] bg-black text-white flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=1600&h=900&fit=crop)' }}
                />
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6">About Lazywalls</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Transforming spaces with art that speaks to your soul
                    </p>
                </div>
            </div>

            {/* Story Section */}
            <div className="max-w-4xl mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <span className="text-sm text-gray-500 uppercase tracking-widest">Our Story</span>
                    <h2 className="text-4xl font-bold mt-4 mb-6">Art for Everyone</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Lazywalls was born from a simple idea: everyone deserves beautiful walls. We believe that art shouldn't be reserved for galleries and museums—it should live in your home, your office, your favorite coffee spot.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=800&fit=crop"
                            alt="Art process"
                            className="rounded-2xl shadow-2xl"
                        />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-4">Premium Quality</h3>
                        <p className="text-gray-600 mb-4">
                            Every poster is printed on museum-quality paper with archival inks that won't fade. We obsess over the details so you don't have to.
                        </p>
                        <h3 className="text-2xl font-bold mb-4">Curated Collections</h3>
                        <p className="text-gray-600 mb-4">
                            Our team carefully selects and curates each piece in our collection. From emerging artists to classical masterpieces, we bring you the best.
                        </p>
                        <h3 className="text-2xl font-bold mb-4">Sustainable Practices</h3>
                        <p className="text-gray-600">
                            We're committed to eco-friendly packaging and sustainable sourcing. Art shouldn't cost the earth.
                        </p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-y border-gray-200">
                    {[
                        { number: '50K+', label: 'Happy Customers' },
                        { number: '500+', label: 'Designs' },
                        { number: '15+', label: 'Countries' },
                        { number: '4.9', label: 'Star Rating' }
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <p className="text-4xl font-bold mb-2">{stat.number}</p>
                            <p className="text-gray-500">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Team */}
                <div className="text-center py-20">
                    <h2 className="text-3xl font-bold mb-12">Our Mission</h2>
                    <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
                        "To make beautiful art accessible to everyone, transforming blank walls into canvases of self-expression. We believe every space deserves a story, and every story deserves to be seen."
                    </p>
                </div>
            </div>
        </div>
    );
}
