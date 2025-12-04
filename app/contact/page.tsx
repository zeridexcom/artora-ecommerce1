'use client';

import { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate form submission
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="bg-black text-white py-20 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-5xl md:text-7xl font-bold mb-4">Contact Us</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        We'd love to hear from you. Get in touch with our team.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div>
                        <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                                    📍
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Visit Us</h3>
                                    <p className="text-gray-600">
                                        123 Art Street, Creative District<br />
                                        Mumbai, Maharashtra 400001
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                                    📧
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Email Us</h3>
                                    <p className="text-gray-600">
                                        hello@lazywalls.com<br />
                                        support@lazywalls.com
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0">
                                    📞
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-1">Call Us</h3>
                                    <p className="text-gray-600">
                                        +91 98765 43210<br />
                                        Mon - Sat, 9am - 6pm IST
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="mt-12">
                            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                            <div className="flex gap-4">
                                {['Instagram', 'Pinterest', 'Facebook', 'Twitter'].map(social => (
                                    <a
                                        key={social}
                                        href="#"
                                        className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                                    >
                                        {social[0]}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gray-50 rounded-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

                        {submitted && (
                            <div className="mb-6 p-4 bg-green-100 border border-green-200 text-green-700 rounded-lg">
                                Thanks for your message! We'll get back to you soon.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <select
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition"
                                >
                                    <option value="">Select a topic</option>
                                    <option value="order">Order Inquiry</option>
                                    <option value="shipping">Shipping Question</option>
                                    <option value="returns">Returns & Refunds</option>
                                    <option value="partnership">Business Partnership</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    rows={5}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none transition resize-none"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
