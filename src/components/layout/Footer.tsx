import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            className="relative bg-cover bg-center py-8 mt-20"
            style={{ backgroundImage: 'url(/images/footer-bg.jpg)' }}
        >
            <div className="absolute inset-0 bg-black/80" />
            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-400 text-sm text-center md:text-left">
                        Copyright © {currentYear} ZOGAMING Company. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link
                            href="/admin"
                            className="text-gray-400 hover:text-white text-sm transition-colors"
                        >
                            Admin Dashboard
                        </Link>
                        <a
                            href="https://templatemo.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-[#010101] text-sm transition-colors"
                        >
                            Design: TemplateMo
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
