import React from 'react';
import { Info, Plus, ChevronRight } from 'lucide-react';

const RightPanel = () => {
  return (
    <aside className="hidden lg:flex flex-col gap-2 w-[315px]">

      {/* News Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-800 text-base">NextHire News</h3>
          <Info className="w-4 h-4 text-slate-600 fill-slate-200" />
        </div>
        <div className="space-y-3">
          <NewsItem
            title="Top skills for 2024"
            time="1h ago"
            readers="42,852 readers"
          />
          <NewsItem
            title="Hybrid work trends"
            time="3h ago"
            readers="18,124 readers"
          />
          <NewsItem
            title="AI in Recruiting"
            time="5h ago"
            readers="12,450 readers"
          />
          <NewsItem
            title="Tech layoff updates"
            time="12h ago"
            readers="85,920 readers"
          />
        </div>
        <button className="flex items-center gap-1 text-slate-500 font-bold text-sm mt-3 px-2 py-1 rounded hover:bg-slate-100 transition-colors">
          Show more <ChevronRight className="w-4 h-4 rotate-90" />
        </button>
      </div>

      {/* Suggested Connections */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-3 sticky top-[4.5rem]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-800 text-base">Add to your feed</h3>
          <Info className="w-4 h-4 text-slate-600 fill-slate-200" />
        </div>
        <div className="space-y-4">
          <SuggestedUser
            name="Sundar Pichai"
            title="CEO at Google"
            avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=2574&auto=format&fit=crop"
          />
          <SuggestedUser
            name="Tim Cook"
            title="CEO at Apple"
            avatar="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2574&auto=format&fit=crop"
          />
          <SuggestedUser
            name="Sheryl Sandberg"
            title="Author & Former COO"
            avatar="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2670&auto=format&fit=crop"
          />
        </div>
        <button className="flex items-center gap-1 text-slate-500 font-bold text-sm mt-4 px-2 py-1 rounded hover:bg-slate-100 transition-colors">
          View all recommendations <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </aside>
  );
};

const NewsItem = ({ title, time, readers }) => (
  <div className="group cursor-pointer">
    <h4 className="text-sm font-bold text-slate-700 group-hover:underline leading-tight">{title}</h4>
    <div className="flex gap-1 text-[11px] text-slate-400 font-medium mt-0.5">
      <span>{time}</span>
      <span>•</span>
      <span>{readers}</span>
    </div>
  </div>
);

const SuggestedUser = ({ name, title, avatar }) => (
  <div className="flex gap-3">
    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
      <img src={avatar} alt={name} className="w-full h-full object-cover" />
    </div>
    <div className="flex flex-col flex-1">
      <h4 className="text-sm font-bold text-slate-700 leading-tight hover:text-[#0a66c2] cursor-pointer">{name}</h4>
      <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-0.5">{title}</p>
      <button className="mt-2 w-fit px-4 py-1.5 border border-slate-500 rounded-full text-slate-600 font-bold text-sm flex items-center gap-1 hover:bg-slate-50 hover:border-slate-800 hover:ring-1 hover:ring-slate-800 transition-all">
        <Plus className="w-4 h-4" /> Follow
      </button>
    </div>
  </div>
);

export default RightPanel;
