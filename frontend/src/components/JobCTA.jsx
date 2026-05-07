import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const JobCTA = () => {
  return (
    <section className="py-24 bg-[#3A5A40] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          
          {/* Left: Lottie Animation Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 relative min-h-[600px] flex items-center justify-center"
          >
            {/* Background Blob */}
            <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl scale-125" />
            
            <div className="relative z-10 w-full h-full scale-[1.8]">
              <DotLottieReact
                src="https://lottie.host/26d71ffe-f8cb-486a-bfb4-8bcb9b3bdf1a/zv9R0UdvWB.lottie"
                loop
                autoplay
              />
            </div>
            
            {/* Clock Outline (matching screenshot) */}
            <div className="absolute -left-20 top-0 opacity-10 pointer-events-none">
              <div className="w-40 h-40 border-2 border-white rounded-full flex items-center justify-center">
                <div className="w-1 h-16 bg-white origin-bottom rotate-45" />
                <div className="w-1 h-10 bg-white origin-bottom -rotate-12 absolute" />
              </div>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 text-white"
          >
            <h2 className="text-6xl md:text-7xl font-bold leading-[1.1] mb-8">
              Find Your Next <br /> 
              Job from <br />
              <span className="relative inline-block">
                5,000+
                <span className="absolute bottom-2 left-0 w-full h-1.5 bg-[#10b981] rounded-full" />
              </span> <br />
              Openings
            </h2>
            <p className="text-white/70 text-lg max-w-md mb-12 leading-relaxed">
              Find the solutions you need on our platform—we're committed to delivering quality service every time.
            </p>
            
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: '#e69738' }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-[#F8A849] text-[#1a2e24] font-bold text-base rounded-xl shadow-[0_20px_50px_rgba(248,168,73,0.3)] transition-all uppercase tracking-widest"
            >
              Find a job
            </motion.button>
          </motion.div>

        </div>
      </div>

      {/* Decorative Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
    </section>
  );
};

export default JobCTA;
