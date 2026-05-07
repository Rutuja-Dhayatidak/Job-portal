import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ArrowLeft, ArrowRight } from 'lucide-react';
import person1 from '../assets/person1.png';
import person2 from '../assets/person2.png';

const testimonials = [
  {
    id: 1,
    name: 'Karmo kerin',
    role: 'CEO - Tredex',
    text: "I just brought it and i love it. Lorem Ipsum is simply dummy text of the and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.",
    avatar: '/testimonial_avatar_woman_1777620106201.png',
    mainImage: person1
  },
  {
    id: 2,
    name: 'James Wilson',
    role: 'Product Manager',
    text: "This platform has completely transformed how we hire. The quality of candidates is exceptional and the process is seamless.",
    avatar: '/testimonial_avatar_woman_1777620106201.png',
    mainImage: person2
  }
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 bg-[#1a2e24] overflow-hidden relative">
      {/* Decorative Dots */}
      <div className="absolute top-10 left-10 opacity-20 hidden lg:block">
        <div className="grid grid-cols-5 gap-2">
          {[...Array(25)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 bg-white rounded-full"></div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-1.5 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-md mb-6">
                WHAT SAYE'S OUR CLIENTS
              </div>
              <h2 className="text-4=xl md:text-6xl font-serif text-white mb-12">
                Our Testimonials
              </h2>

              <div className="relative min-h-[250px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Quote className="w-10 h-10 text-white/20 mb-6" />
                    <p className="text-white/80 text-2xl leading-relaxed mb-10 max-w-lg italic">
                      "{testimonials[index].text}"
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full border-2 border-emerald-500 p-1">
                          <img
                            src={testimonials[index].avatar}
                            alt={testimonials[index].name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-lg">{testimonials[index].name}</h4>
                          <p className="text-white/40 text-sm">{testimonials[index].role}</p>
                        </div>
                      </div>

                      {/* Navigation Arrows */}
                      <div className="flex gap-4">
                        <button
                          onClick={prev}
                          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all group"
                        >
                          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <button
                          onClick={next}
                          className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all group"
                        >
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right Dynamic Character Visual */}
          <div className="lg:w-1/2 relative min-h-[500px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 w-full flex justify-center"
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
                    src={testimonials[index].mainImage}
                    alt="Success Story"
                    className="w-full max-w-[400px] h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    style={{
                      maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'
                    }}
                  />
                </motion.div>

                {/* Floating Dot Grid on Image */}
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-20 z-0">
                  <div className="grid grid-cols-6 gap-3">
                    {[...Array(36)].map((_, i) => (
                      <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
