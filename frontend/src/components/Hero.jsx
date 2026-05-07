import React from 'react';
import { motion } from 'framer-motion';
import person2 from '../assets/person2.png';

const Hero = () => {
  // ... rest of the file ...
  return (
    <section className="relative min-h-screen flex items-start pt-10 overflow-hidden bg-[#1a2e24] pb-10">
      {/* Background Image Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/hero-bg.png"
          alt=""
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-[#1a2e24]/70 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2e24]/20 via-[#1a2e24]/40 to-[#1a2e24]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-8 w-full relative z-10 ">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-emerald-500 text-xs font-bold tracking-widest uppercase">Over 10,000+ Active Jobs</span>
              </div>

              <h1 className="text-5xl md:text-8xl font-serif text-white mb-6 leading-[1.05]">
                Find Your <br />
                <span className="text-emerald-400 italic">Dream</span> Career.
              </h1>

              <p className="text-green-100/60 text-lg max-w-xl leading-relaxed">
                Connect with top-tier companies and take your professional journey to the next level with our AI-powered job matching system.
              </p>

              {/* Search Bar */}
              <div className="mt-10 p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Job title or keyword"
                  className="flex-1 px-6 py-4 bg-transparent text-white outline-none placeholder:text-white/40"
                />
                <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-[#1a2e24] font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95">
                  Search Jobs
                </button>
              </div>

              {/* Stats */}
              <div className="mt-12 flex items-center gap-10">
                <div>
                  <div className="text-3xl font-bold text-white font-serif">12k+</div>
                  <div className="text-green-100/40 text-sm">Active Users</div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <div className="text-3xl font-bold text-white font-serif">450+</div>
                  <div className="text-green-100/40 text-sm">Companies</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Visual (Person 2) */}
          <div className="lg:w-1/2 relative h-full flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative z-10 w-full flex justify-center pt-10"
            >
              {/* Glowing Background */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px] -z-10"></div>

              <motion.div
                animate={{
                  y: [0, -15, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <img
                  src={person2}
                  alt="Professional Hero"
                  className="w-full max-w-[480px] h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                  style={{
                    maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Decorative Orbits */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-emerald-500/5 rounded-full -z-10 animate-spin-slow"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] border border-emerald-500/10 border-dashed rounded-full -z-10 animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
