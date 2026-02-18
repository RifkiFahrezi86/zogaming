'use client';

import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useData } from '@/lib/DataContext';

export default function ContactPage() {
    const { settings } = useData();

    return (
        <>
            <Header />

            {/* Page Heading */}
            <section
                className="relative h-64 bg-cover bg-center flex items-center"
                style={{ backgroundImage: 'url(/images/page-heading-bg.jpg)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-[#010101] to-[#010101]/70" />
                <div className="container mx-auto px-4 relative z-10 pt-20">
                    <h3 className="text-4xl font-bold text-white mb-4">Contact Us</h3>
                    <nav className="flex items-center gap-2 text-white/80">
                        <Link href="/" className="hover:text-white transition-colors">
                            Home
                        </Link>
                        <span>&gt;</span>
                        <span className="text-white">Contact Us</span>
                    </nav>
                </div>
            </section>

            {/* Contact Content */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Left - Contact Info */}
                    <div>
                        <div className="section-heading mb-8">
                            <h6>Contact Us</h6>
                            <h2>Say Hello!</h2>
                        </div>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            ZOGAMING is your ultimate destination for the best video games.
                            Have questions or need help? We are here to assist you. Feel free to
                            reach out to us using the contact information below or send us a message
                            using the form.
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#010101]/10 flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#010101" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900 block mb-1">Phone</span>
                                    <span className="text-gray-600">{settings.phone}</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-[#010101]/10 flex items-center justify-center flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#010101" strokeWidth="2">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-900 block mb-1">Email</span>
                                    <span className="text-gray-600">{settings.email}</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Right - Form */}
                    <div className="space-y-8">

                        {/* Contact Form */}
                        <form className="bg-white rounded-3xl shadow-lg p-8">
                            <div className="grid md:grid-cols-2 gap-6 mb-6">
                                <input
                                    type="text"
                                    placeholder="Your Name..."
                                    className="w-full h-14 px-6 rounded-full border border-gray-200 outline-none focus:border-[#010101] transition-colors"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Your Surname..."
                                    className="w-full h-14 px-6 rounded-full border border-gray-200 outline-none focus:border-[#010101] transition-colors"
                                    required
                                />
                                <input
                                    type="email"
                                    placeholder="Your Email..."
                                    className="w-full h-14 px-6 rounded-full border border-gray-200 outline-none focus:border-[#010101] transition-colors"
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Subject..."
                                    className="w-full h-14 px-6 rounded-full border border-gray-200 outline-none focus:border-[#010101] transition-colors"
                                />
                            </div>
                            <textarea
                                placeholder="Your Message..."
                                rows={5}
                                className="w-full px-6 py-4 rounded-3xl border border-gray-200 outline-none focus:border-[#010101] transition-colors resize-none mb-6"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full h-14 bg-[#ee626b] text-white font-semibold rounded-full hover:bg-[#010101] transition-colors"
                            >
                                Send Message Now
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}
