import Link from 'next/link'

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer-v4 bg-black text-white section">
            <div className="container-wide py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                    {/* Newsletter */}
                    <div>
                        <h3 className="text-2xl mb-4">Our Newsletter</h3>
                        <p className="mb-6 opacity-80">
                            Join our list and get 15% off your first purchase! Don't worry we don't spam
                        </p>
                        <form className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white/40"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-white text-black font-semibold hover:bg-white/90 transition-colors uppercase text-sm tracking-wider"
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-2xl mb-4">Quick Links</h3>
                        <ul className="grid grid-cols-2 gap-3 list-none m-0 p-0">
                            <li>
                                <Link href="/about" className="hover:opacity-70 transition-opacity">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:opacity-70 transition-opacity">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/shipping" className="hover:opacity-70 transition-opacity">
                                    Shipping Info
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="hover:opacity-70 transition-opacity">
                                    Returns
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:opacity-70 transition-opacity">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:opacity-70 transition-opacity">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Social Icons & Copyright */}
                <div className="border-t border-white/20 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex gap-6">
                            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
                                </svg>
                            </a>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                                </svg>
                            </a>
                            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                                </svg>
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                </svg>
                            </a>
                        </div>

                        <div className="text-sm opacity-80 text-center md:text-right">
                            <p>
                                © Copyright {currentYear} | <Link href="/" className="hover:opacity-70">Artora</Link> By{' '}
                                <a href="https://shopilaunch.com/" target="_blank" rel="noopener noreferrer" className="hover:opacity-70">
                                    ShopiLaunch.
                                </a>{' '}
                                Powered by Shopify.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
