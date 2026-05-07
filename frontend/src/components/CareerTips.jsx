import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const tips = [
  {
    id: 1,
    category: 'Career',
    title: 'How to build a professional resume for your next job.',
    image: 'https://img.freepik.com/free-vector/professional-resume-template-concept_23-2148812686.jpg',
    author: 'Admin',
    date: 'March 24, 2024'
  },
  {
    id: 2,
    category: 'Design',
    title: 'Top 10 design principles every beginner should know.',
    image: 'https://img.freepik.com/free-vector/graphic-design-concept-with-tablet_23-2148473210.jpg',
    author: 'Admin',
    date: 'April 10, 2024'
  },
  {
    id: 3,
    category: 'Development',
    title: 'Why React is the best choice for your next web project.',
    image: 'https://img.freepik.com/free-vector/react-concept-illustration_114360-1014.jpg',
    author: 'Admin',
    date: 'May 02, 2024'
  }
];

const CareerTips = () => {
  return (
    <section className="py-24 bg-[#F2F9D8]">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Header */}
        <div className="text-center mb-20 overflow-hidden">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-bold leading-tight"
          >
            <span className="text-[#1a2e24] opacity-20">Little Career Tips</span>{' '}
            <span className="text-[#1a2e24]">That Help</span>
          </motion.h2>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {tips.map((tip, i) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative h-64 rounded-3xl overflow-hidden mb-6 shadow-xl">
                <img 
                  src={tip.image} 
                  alt={tip.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 bg-white text-[#1a2e24] text-xs font-bold rounded-full shadow-lg uppercase tracking-wider">
                    {tip.category}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs font-bold text-[#1a2e24]/60 uppercase tracking-[0.2em]">
                  <span>BY {tip.author}</span>
                  <div className="w-1 h-1 bg-emerald-400 rounded-full" />
                  <span>{tip.date}</span>
                </div>

                <h3 className="text-2xl font-bold text-[#1a2e24] leading-snug group-hover:text-emerald-600 transition-colors flex items-start gap-2">
                  {tip.title}
                  <ArrowUpRight className="w-6 h-6 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0" />
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 text-center"
        >
          <button className="px-12 py-5 bg-[#1a2e24] text-white font-bold rounded-2xl hover:bg-emerald-700 transition-all shadow-2xl">
            Explore More Tips
          </button>
        </motion.div>

      </div>
    </section>
  );
};

export default CareerTips;
