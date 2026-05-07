import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// ORIGINAL DATA (no angle here)
const brandData = [
  { id: 1, name: 'Google', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_"G"_logo.svg' },
  { id: 2, name: 'Instagram', icon: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg' },
  { id: 3, name: 'Messenger', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/be/Facebook_Messenger_logo_2020.svg' },
  { id: 4, name: 'Slack', icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg' },
  { id: 5, name: 'LinkedIn', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png' },
  { id: 6, name: 'WhatsApp', icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg' },
  { id: 7, name: 'Drive', icon: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg' },
  { id: 8, name: 'Zoom', icon: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Zoom_Communications_Logo.svg' },
  { id: 9, name: 'Figma', icon: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg' },
];

// AUTO ANGLE CALCULATION
const brands = brandData.map((brand, i) => ({
  ...brand,
  angle: (i / brandData.length) * 360,
}));

const BrandCollaboration = () => {
  const radius = 190; // must match orbit circle

  return (
    <section className="py-24 bg-[#3A5A40] overflow-hidden relative">

      {/* Background particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/20 rounded-full"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0, 0.5, 0]
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">

          {/* LEFT SIDE */}
          <div className="lg:w-1/2 relative h-[500px] flex items-center justify-center">

            {/* Glow */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute w-60 h-60 bg-emerald-400/20 rounded-full blur-[80px]"
            />

            {/* Center Logo */}
            <div className="relative z-20 w-40 h-40 bg-white rounded-full flex items-center justify-center shadow-xl">
              <span className="text-2xl font-bold text-[#1a2e24]">jobi</span>
            </div>

            {/* Orbit Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="absolute w-[380px] h-[380px] border border-dashed border-white/10 rounded-full"
            />

            {/* ORBIT CONTAINER */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0"
            >
              {brands.map((brand, i) => (
                <div
                  key={brand.id}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    transform: `
                      rotate(${brand.angle}deg)
                      translateY(-${radius}px)
                      rotate(-${brand.angle}deg)
                    `
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.15 }}
                    animate={{
                      y: [0, -10, 0]
                    }}
                    transition={{
                      duration: 3 + i,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center p-4"
                  >
                    <img
                      src={brand.icon}
                      alt={brand.name}
                      className="w-full h-full object-contain"
                    />
                  </motion.div>
                </div>
              ))}
            </motion.div>

          </div>

          {/* RIGHT SIDE */}
          <div className="lg:w-1/2 space-y-6 text-white">
            <h2 className="text-5xl font-serif">
              Collaboration with <br />
              <span className="text-emerald-300 italic">Top Brands</span>
            </h2>

            <p className="text-white/60">
              We collaborate with top companies to shape the future of work.
            </p>

            <button className="flex items-center gap-4 font-bold">
              Learn More
              <ArrowRight />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BrandCollaboration;