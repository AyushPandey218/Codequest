import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Play } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import BlurText from '../common/BlurText';

const SpaceHero = () => {
    const navigate = useNavigate();
    const navLinks = ["Quests", "Leaderboard", "Compilers", "Community", "Dashboard"];
    const partners = ["GitHub", "Microsoft", "Google", "Amazon", "OpenAI"];

    return (
        <section className="relative h-screen w-full overflow-hidden flex flex-col bg-background text-foreground selection:bg-white/30 selection:text-white">
            {/* Background Video Layer */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="h-full w-full object-cover"
                >
                    <source src="/landingvid/pk34pwvq0nrmt0cwshts0ymj1m_result_.mp4" type="video/mp4" />
                    {/* Fallback to external URL */}
                    <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260306_115329_5e00c9c5-4d69-49b7-94c3-9c31c60bb644.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/40 z-0" />
                {/* Addition of a vignette for better text focus */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 z-0" />
            </div>

            {/* Navbar */}
            <nav className="fixed top-4 left-0 right-0 z-50 px-8 lg:px-16">
                <div className="flex items-center justify-between mx-auto max-w-7xl">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-2"
                    >
                        <img src="/logo.png" alt="CodeQuest Logo" className="h-12 w-12 object-contain" />
                        <span className="font-heading italic text-2xl tracking-tight hidden sm:block">CodeQuest</span>
                    </motion.div>

                    {/* Desktop Menu Pill */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="hidden md:flex items-center liquid-glass rounded-full px-4 py-1.5 gap-2 shadow-sm"
                    >
                        <Link
                            to="/legal/privacy"
                            className="text-sm font-medium text-foreground/80 font-body hover:text-white transition-colors px-2"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/auth/signup"
                            className="text-sm font-medium text-foreground/80 font-body hover:text-white transition-colors px-2"
                        >
                            Sign Up
                        </Link>
                        <button
                            onClick={() => navigate('/auth/login')}
                            className="bg-white text-black rounded-full px-5 py-1.5 text-sm font-medium font-body flex items-center gap-1.5 hover:bg-white/90 transition-transform active:scale-95 ml-1"
                        >
                            Sign In
                            <ArrowUpRight className="h-4 w-4" />
                        </button>
                    </motion.div>

                    {/* Spacer for right alignment if logo is left */}
                    <div className="md:hidden">
                        {/* Mobile Menu Trigger could go here */}
                    </div>
                </div>
            </nav>

            {/* Hero Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pt-24">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="liquid-glass rounded-full px-1 py-1 flex items-center mb-2"
                >
                    <span className="bg-white text-black rounded-full px-3 py-1 text-xs font-semibold font-body mr-3">New</span>
                    <span className="text-sm text-foreground/90 pr-3 font-body">Build. Ship. Compete. Your coding journey starts here</span>
                </motion.div>

                {/* Heading */}
                <BlurText
                    text="Master Your Craft Through Epic Quests"
                    className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-heading italic text-foreground leading-[0.9] sm:leading-[0.8] max-w-4xl justify-center tracking-[-2px] sm:tracking-[-4px] drop-shadow-2xl px-2"
                    delay={100}
                    animateBy="words"
                    direction="bottom"
                />

                {/* Subheading */}
                <motion.p
                    initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
                    animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-6 text-sm md:text-base text-white/90 max-w-2xl font-body font-light leading-snug sm:leading-tight drop-shadow-lg"
                >
                    Elite challenges for developers. Level up your engineering skills, conquer complex architecture challenges, and join a fellowship of master coders.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
                    animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                    className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mt-10 w-full sm:w-auto px-4"
                >
                    <button
                        onClick={() => navigate('/auth/login')}
                        className="w-full sm:w-auto liquid-glass-strong rounded-full px-8 py-4 text-sm font-bold text-foreground font-body flex items-center justify-center gap-2 group hover:scale-105 transition-all shadow-2xl shadow-white/5"
                    >
                        Start Your Quest
                        <ArrowUpRight className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </button>
                </motion.div>
            </div>
            {/* Bottom Label */}
            <div className="relative z-10 flex justify-center pb-8 sm:pb-10 px-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 1.5 }}
                    className="liquid-glass rounded-full px-4 py-1.5 text-[10px] sm:text-xs font-medium text-white/70 font-body text-center"
                >
                    Warning: May cause sudden urge to rewrite everything in TypeScript 🤓
                </motion.div>
            </div>

        </section>
    );
};

export default SpaceHero;
