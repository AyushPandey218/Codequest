import React from 'react';
import { ArrowUpRight, Play } from 'lucide-react';

const LogoisumHero = () => {
    return (
        <section className="relative min-h-[90vh] w-full overflow-hidden flex flex-col items-center justify-center pt-20">
            {/* Video Background */}
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            >
                <source src="/landingvid/pk34pwvq0nrmt0cwshts0ymj1m_result_.mp4" type="video/mp4" />
                {/* Fallback to external URL if local fails */}
                <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260228_065522_522e2295-ba22-457e-8fdb-fbcd68109c73.mp4" type="video/mp4" />
            </video>

            {/* Navigation Bar */}
            <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl z-50">
                <div className="bg-white rounded-[16px] shadow-lg px-8 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <span className="font-barlow font-bold text-2xl text-[#222]">Logoisum</span>
                    </div>

                    {/* Menu */}
                    <ul className="hidden md:flex items-center gap-10">
                        {['About', 'Works', 'Services', 'Testimonial'].map((item) => (
                            <li key={item}>
                                <a
                                    href={`#${item.toLowerCase()}`}
                                    className="font-barlow font-medium text-[14px] text-[#222] hover:opacity-70 transition-opacity"
                                >
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>

                    {/* CTA */}
                    <button className="bg-[#222] text-white px-6 py-2.5 rounded-full flex items-center gap-3 font-barlow font-medium text-[14px] hover:scale-[1.05] transition-transform">
                        Book A Free Meeting
                        <div className="bg-white text-[#222] p-1 rounded-full flex items-center justify-center">
                            <ArrowUpRight size={14} strokeWidth={3} />
                        </div>
                    </button>
                </div>
            </nav>

            {/* Hero Content */}
            <div className="relative z-10 container mx-auto px-4 text-center text-white">
                <h1 className="flex flex-col items-center leading-none">
                    <span className="font-barlow font-medium text-4xl md:text-6xl lg:text-[72px] tracking-[-0.04em] mb-2">
                        Agency that makes your
                    </span>
                    <span className="font-instrument italic text-6xl md:text-[84px] lg:text-hero-title">
                        videos & reels viral
                    </span>
                </h1>

                <p className="mt-10 font-barlow font-medium text-lg md:text-[18px] opacity-90 max-w-2xl mx-auto">
                    Short-form video editing for Influencers, Creators and Brands
                </p>

                <button className="mt-12 bg-white text-[#222] px-10 py-5 rounded-full flex items-center gap-4 font-barlow font-bold text-lg hover:bg-opacity-90 transition-all group">
                    <div className="bg-[#222] p-1.5 rounded-full text-white">
                        <Play size={20} fill="currentColor" />
                    </div>
                    See Our Workreel
                </button>
            </div>
        </section>
    );
};

export default LogoisumHero;
