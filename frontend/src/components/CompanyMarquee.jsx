import React from 'react';

const CompanyMarquee = () => {
  const companies = [
    { name: 'Google', logo: 'https://cdn.simpleicons.org/google' },
    { name: 'Amazon', logo: 'https://cdn.simpleicons.org/amazon' },
    { name: 'Shopify', logo: 'https://cdn.simpleicons.org/shopify' },
    { name: 'Slack', logo: 'https://cdn.simpleicons.org/slack' },
    { name: 'Microsoft', logo: 'https://cdn.simpleicons.org/microsoft' },
    { name: 'Netflix', logo: 'https://cdn.simpleicons.org/netflix' },
    { name: 'Facebook', logo: 'https://cdn.simpleicons.org/facebook' },
    { name: 'Uber', logo: 'https://cdn.simpleicons.org/uber' },
  ];

  return (
    <div className="w-full bg-[#1a2e24] py-2- overflow-hidden pb-6">
      {/* Top Text Marquee - Scrolling Left */}
      <div className="flex whitespace-nowrap mb-6 border-y border-white/10 py-4 ">
        <div className="flex animate-marquee-slow items-center ">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center text-white text-3xl font-bold px-4">
              Work With Exciting 100+ <span className="text-orange-500 mx-2">Companies</span> In The World
              <span className="mx-8 opacity-20">|</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Logo Marquee - Scrolling Right */}
      <div className="flex whitespace-nowrap overflow-hidden py-2 ">
        <div className="flex animate-marquee-reverse items-center gap-12">
          {[...companies, ...companies, ...companies].map((company, index) => (
            <div key={index} className="flex items-center gap-3 group cursor-pointer transition-transform hover:scale-110">
              <img
                src={company.logo}
                alt={company.name}
                className="h-5 w-5 object-contain opacity-80 group-hover:opacity-100"
              />
              <span className="text-white/70 group-hover:text-white transition-colors text-sm font-medium lowercase">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyMarquee;
