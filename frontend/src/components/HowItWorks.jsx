import React, { useRef } from 'react';
import { UserPlus, FileText, Search } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);

  const steps = [
    {
      id: 1,
      title: 'Create Account',
      desc: "It's very easy to open an account and start your journey.",
      icon: <UserPlus className="w-8 h-8 text-[#1a2e24]" />,
    },
    {
      id: 2,
      title: 'Complete your profile',
      desc: 'Complete your profile with all the info to get attention of client.',
      icon: <FileText className="w-8 h-8 text-[#1a2e24]" />,
    },
    {
      id: 3,
      title: 'Apply job or hire',
      desc: 'Apply & get your preferable jobs with all the requirements and get it.',
      icon: <Search className="w-8 h-8 text-[#1a2e24]" />,
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 pb-20 bg-[#1a2e24] relative overflow-hidden">
      {/* Parallax Background decoration */}
      <motion.div style={{ y: y1 }} className="absolute top-10 left-10 w-48 h-48 border-4 border-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <motion.div style={{ y: y2 }} className="absolute bottom-10 right-10 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative inline-block mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-2">
            How it's work?
          </h2>
          <svg className="absolute -top-8 -right-12 w-16 h-16 text-[#d9f468] opacity-80" viewBox="0 0 100 100" fill="none" stroke="currentColor">
            <path d="M10,80 Q50,10 90,80" strokeWidth="2" strokeLinecap="round" />
            <path d="M70,20 Q85,15 95,30" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connecting Arrows (Visible on Desktop) */}
          <div className="hidden md:block absolute top-12 left-1/4 w-1/4 h-8 pointer-events-none opacity-20">
            <svg className="w-full h-full text-white" viewBox="0 0 100 20" fill="none" stroke="currentColor">
              <path d="M0,10 Q50,-10 100,10" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M95,5 L100,10 L95,15" strokeWidth="1" />
            </svg>
          </div>
          <div className="hidden md:block absolute top-12 left-2/4 w-1/4 h-8 pointer-events-none opacity-20 translate-x-12">
            <svg className="w-full h-full text-white" viewBox="0 0 100 20" fill="none" stroke="currentColor">
              <path d="M0,10 Q50,-10 100,10" strokeWidth="1" strokeDasharray="4 4" />
              <path d="M95,5 L100,10 L95,15" strokeWidth="1" />
            </svg>
          </div>

          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex flex-col items-center group"
            >
              <div className="w-20 h-20 rounded-full bg-[#d9f468] flex items-center justify-center mb-6 shadow-xl shadow-[#d9f468]/20 transform transition-all group-hover:scale-110 duration-500 relative">
                <div className="absolute -inset-1.5 rounded-full border-2 border-dashed border-[#d9f468]/30 animate-spin-slow"></div>
                <div className="relative z-10 scale-75 md:scale-100">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#d9f468] transition-colors">
                {step.title}
              </h3>
              <p className="text-white/50 leading-relaxed max-w-[240px] text-sm font-medium">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
