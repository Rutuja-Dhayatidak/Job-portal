import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const Categories = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 50]);

  const categories = [
    { id: 1, name: 'UI/UX Design', jobs: '12k+', icon: '🎨', color: 'from-pink-500 to-rose-500' },
    { id: 2, name: 'Development', jobs: '8k+', icon: '💻', color: 'from-blue-500 to-cyan-500' },
    { id: 3, name: 'Marketing', jobs: '10k+', icon: '🚀', color: 'from-orange-500 to-amber-500' },
    { id: 4, name: 'Telemarketing', jobs: '6k+', icon: '📞', color: 'from-green-500 to-emerald-500' },
    { id: 5, name: 'Editing', jobs: '7k+', icon: '🎬', color: 'from-purple-500 to-indigo-500' },
    { id: 6, name: 'Accounting', jobs: '17k+', icon: '📊', color: 'from-yellow-500 to-orange-500' },
  ];

  return (
    <section ref={sectionRef} className="relative py-16 overflow-hidden bg-[#f2f9d8]">
      {/* Subtle Parallax Background Shapes */}
      <motion.div style={{ y: y1 }} className="absolute top-20 right-[10%] w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
      <motion.div style={{ y: y2 }} className="absolute bottom-20 left-[10%] w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative group"
          >
            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 leading-tight">
              Most Demanding <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-700 animate-gradient">Categories.</span>
            </h2>
            <div className="absolute -bottom-2 left-0 w-16 h-1 bg-gradient-to-r from-emerald-600 to-blue-700 rounded-full group-hover:w-full transition-all duration-700"></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-sm bg-white/40 backdrop-blur-md border border-white p-6 rounded-2xl shadow-lg shadow-emerald-900/5"
          >
            <p className="text-slate-600 mb-4 leading-relaxed text-sm">
              Unlock your potential in the most sought-after industries. Together with smart notifications and collaboration tools.
            </p>
            <a href="#" className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 text-sm font-bold rounded-lg border border-emerald-600/20 transition-all group">
              Explore All Fields
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-[30px] blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

              <div className="relative h-full bg-white/60 backdrop-blur-xl border border-white p-5 rounded-[30px] flex items-center gap-4 transition-all duration-500 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-emerald-900/10">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-xl shadow-md shadow-black/10 group-hover:rotate-12 transition-transform duration-500`}>
                  {cat.icon}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                    {cat.name}
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                      {cat.jobs} Openings
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
