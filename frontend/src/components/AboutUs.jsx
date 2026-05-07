import React from 'react';
import { ShieldCheck, CheckCircle, BadgeDollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutUs = () => {
  const features = [
    {
      id: 1,
      title: 'Highly Secured',
      desc: "Firstly, your account to be secured in login or sign up & don't be upset, be confident.",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
    },
    {
      id: 2,
      title: 'Authentic Source',
      desc: 'Secondly, Every job post to be secured in login or sign up & don\'t be upset, be confident.',
      icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
    },
    {
      id: 3,
      title: 'Cost Effective',
      desc: 'Thirdly, Every job post to be secured in login or sign up & don\'t be upset, be confident.',
      icon: <BadgeDollarSign className="w-6 h-6 text-emerald-500" />,
    },
  ];

  return (
    <section className="py-16 bg-[#f2f9d8] overflow-hidden pt-20 pb-20" >
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4 leading-tight">
                To Know <span className="text-emerald-500 italic">About</span> JOBES
              </h2>
              <p className="text-slate-500 mb-8 text-base leading-relaxed max-w-lg">
                To much valuable feed from our trusted users in world-wide.
              </p>

              <div className="space-y-6">
                {features.map((feature) => (
                  <div key={feature.id} className="flex gap-4 group">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                      {React.cloneElement(feature.icon, { className: 'w-5 h-5' })}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{feature.title}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Pinterest-style Right Images - Scaled Down */}
          <div className="lg:w-1/2 relative min-h-[400px]">
            <div className="grid grid-cols-2 gap-3">
              {/* Column 1 */}
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    scale: { duration: 0.6 },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="rounded-xl overflow-hidden shadow-md"
                >
                  <img
                    src="/job_interview_people_1777619172937.png"
                    alt="Interviews"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    scale: { duration: 0.6, delay: 0.2 },
                    y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }
                  }}
                  className="rounded-xl overflow-hidden shadow-md"
                >
                  <img
                    src="/office_workspace_minimal_1777619687592.png"
                    alt="Workspace"
                    className="w-full h-32 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
              </div>

              {/* Column 2 */}
              <div className="space-y-3 pt-8">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    scale: { duration: 0.6, delay: 0.1 },
                    y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.2 }
                  }}
                  className="rounded-xl overflow-hidden shadow-md"
                >
                  <img
                    src="/women_laptop_working_1777619192857.png"
                    alt="Team working"
                    className="w-full h-[280px] object-cover hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>

                {/* Floating Badge integrated into Pinterest style */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-emerald-500 p-4 rounded-xl shadow-lg text-white"
                >
                  <div className="flex flex-col gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm leading-tight">Best Quality For Jobs Site</h4>
                      <p className="text-white/80 text-[9px] mt-1 font-medium">To Make Sure Your Job Opportunity.</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Decorative background shape */}
            <div className="absolute -top-6 -right-6 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
