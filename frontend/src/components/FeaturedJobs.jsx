import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';

const categories = ['Recent Jobs', 'Featured Jobs', 'Freelancer', 'Part Time', 'Full Time'];

const jobs = [
  {
    id: 1,
    title: 'UI UX Designer',
    type: 'Full Time',
    location: 'Los Angeles, CA',
    salary: '$40000-$42000',
    posted: '2 days ago',
    image: 'https://img.freepik.com/free-vector/ui-ux-design-concept-illustration_114360-6859.jpg',
    desc: 'We are looking for a talented UI/UX Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills, and be able to translate high-level requirements into...'
  },
  {
    id: 2,
    title: 'Product Manager',
    type: 'Remote',
    location: 'Seattle, WA',
    salary: '$110k - $140k',
    posted: '1 week ago',
    image: 'https://img.freepik.com/free-vector/product-manager-concept-illustration_114360-6014.jpg',
    desc: 'We are looking for a strategic and data-driven Product Manager to lead the development of innovative products. You will work cross-functionally to define product vision, prioritize the roadmap, and ship features that delight...'
  },
  {
    id: 3,
    title: 'Data Scientist',
    type: 'Full Time',
    tags: ['Hybrid', 'Strategic'],
    location: 'Cupertino, CA',
    salary: '$140k - $180k',
    posted: '4 days ago',
    image: 'https://img.freepik.com/free-vector/data-scientist-concept-illustration_114360-5014.jpg',
    desc: "We're seeking a talented Data Scientist to join our AI and machine learning team. You will analyze large datasets, build predictive models, and work closely with engineering and product teams to derive actionable insights."
  }
];

const FeaturedJobs = () => {
  const [activeTab, setActiveTab] = useState('Featured Jobs');

  return (
    <section className="py-24 bg-[#1a2e24]">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Discover New <span className="text-emerald-400 italic">Roles</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/60 text-base max-w-2xl mx-auto"
          >
            Just post your job and explain your project we'll take care of finding the right freelancers.
          </motion.p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 bg-white/5 p-1.5 rounded-full w-fit mx-auto backdrop-blur-sm border border-white/10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${
                activeTab === cat 
                ? 'bg-emerald-400 text-[#1a2e24] shadow-lg shadow-emerald-400/20' 
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Job Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="wait">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col hover:-translate-y-2 transition-transform duration-500 group"
              >
                {/* Illustration Area */}
                <div className="h-48 bg-emerald-50/50 p-6 flex items-center justify-center overflow-hidden">
                  <img 
                    src={job.image} 
                    alt={job.title} 
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" 
                  />
                </div>

                {/* Content Area */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded-md uppercase">
                      {job.type}
                    </span>
                    {job.tags?.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[9px] font-bold rounded-md uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-xl font-bold text-slate-800 mb-2">{job.title}</h3>
                  
                  <div className="flex items-center gap-4 text-slate-400 text-xs mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-slate-800">{job.salary}</span>
                    <span className="text-slate-400 text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {job.posted}
                    </span>
                  </div>

                  <p className="text-slate-500 text-xs leading-relaxed mb-5 flex-grow line-clamp-3">
                    {job.desc}
                  </p>

                  <button className="w-full py-3.5 bg-[#1a2e24] text-white text-sm font-bold rounded-xl hover:bg-emerald-600 transition-colors">
                    Apply Now
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};

export default FeaturedJobs;
