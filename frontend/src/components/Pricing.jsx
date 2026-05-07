import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Basic',
    price: '0',
    period: '/ Month',
    desc: 'Perfect for individuals starting their journey.',
    features: ['Post 5 Jobs', 'Basic Support', 'Standard Profile', 'Community Access'],
    buttonText: 'Get Started',
    highlight: false,
  },
  {
    name: 'Professional',
    price: '29',
    period: '/ Month',
    desc: 'The best choice for growing businesses.',
    features: ['Post Unlimited Jobs', 'Priority Support', 'Verified Badge', 'Advanced Analytics', 'Custom Branding'],
    buttonText: 'Sign Up Now',
    highlight: true,
    badge: 'Most Popular'
  },
  {
    name: 'Extended',
    price: '59',
    period: '/ Month',
    desc: 'Powerful tools for large scale operations.',
    features: ['All Pro Features', 'Dedicated Account Manager', 'API Access', 'Enterprise Security'],
    buttonText: 'Contact Sales',
    highlight: false,
  },
];

const Pricing = () => {
  return (
    <section className="py-20 bg-[#F2F9D8] relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-100/30 rounded-full blur-3xl animate-pulse" />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4"
          >
            Pricing Plans
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif text-[#1a2e24] mb-4 leading-tight"
          >
            Flexible <span className="italic text-emerald-600">Membership</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 text-base max-w-xl mx-auto leading-relaxed font-medium"
          >
            Simple, transparent pricing that grows with you.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative flex flex-col p-8 rounded-[2rem] transition-all duration-500 border ${
                plan.highlight 
                ? 'bg-[#10b981] text-white border-transparent shadow-[0_30px_60px_rgba(16,185,129,0.2)] py-12' 
                : 'bg-white text-slate-800 border-emerald-50 shadow-[0_15px_40px_rgba(0,0,0,0.04)]'
              }`}
            >
              {plan.badge && (
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#1a2e24] text-emerald-400 text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className={`text-xs ${plan.highlight ? 'text-emerald-50' : 'text-slate-400'}`}>
                  {plan.desc}
                </p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-black italic">$</span>
                <span className="text-5xl font-black tracking-tight">{plan.price}</span>
                <span className={`text-sm font-medium opacity-60`}>{plan.period}</span>
              </div>

              {/* Features List */}
              <div className="space-y-3 mb-10 flex-grow">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                    <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                      plan.highlight ? 'bg-white/20' : 'bg-emerald-100'
                    }`}>
                      <Check className={`w-2.5 h-2.5 ${plan.highlight ? 'text-white' : 'text-emerald-600'}`} strokeWidth={4} />
                    </div>
                    <span className={`text-[13px] font-semibold ${plan.highlight ? 'text-white' : 'text-slate-600'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
                plan.highlight 
                ? 'bg-[#1a2e24] text-white hover:bg-black shadow-emerald-900/10' 
                : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-emerald-500/10'
              }`}>
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
