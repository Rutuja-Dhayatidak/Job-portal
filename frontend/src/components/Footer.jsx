import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#3a5a40] text-green-100/80 pt-20 pb-10 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        {/* Brand Column */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-white text-xl font-bold tracking-tight">NextHire</span>
          </div>
          <p className="text-sm leading-relaxed">
            Revolutionizing the way you find work. NextHire is the world's leading job portal connecting top talent with global opportunities.
          </p>
          <div className="flex gap-4">
            {['github', 'twitter', 'linkedin', 'facebook'].map((social) => (
              <a key={social} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-all group">
                <span className="sr-only">{social}</span>
                <div className="w-4 h-4 bg-current" /> {/* Placeholder for icons */}
              </a>
            ))}
          </div>
        </div>

        {/* Links Columns */}
        <div>
          <h3 className="text-white font-bold text-lg mb-6">For Candidates</h3>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-orange-400 transition-colors">Browse Jobs</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Job Alerts</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Applied Jobs</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Saved Jobs</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-6">For Employers</h3>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-orange-400 transition-colors">Post a Job</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Browse Candidates</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Employer Dashboard</a></li>
            <li><a href="#" className="hover:text-orange-400 transition-colors">Pricing Plans</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-6">Stay Updated</h3>
          <p className="text-sm mb-4">Subscribe to our newsletter for the latest job openings.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:border-orange-500 transition-colors"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-green-100/40">
        <p>© 2026 NextHire. All rights reserved. Designed with ❤️ by Antigravity.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
