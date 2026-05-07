import React from 'react';
import { Image as ImageIcon, PlayCircle, Calendar, FileText } from 'lucide-react';
import PostCard from './PostCard';

const DashboardFeed = () => {
  const posts = [
    {
      id: 1,
      author: {
        name: "Elon Musk",
        avatar: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=2680&auto=format&fit=crop",
        title: "CEO at Tesla & SpaceX"
      },
      content: "Thrilled to announce that we're pushing the boundaries of neural interfaces. The future is closer than we think! 🚀 #Tech #Innovation #Future",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop",
      timestamp: "2h",
      likes: "12,450",
      comments: "842"
    },
    {
      id: 2,
      author: {
        name: "Satya Nadella",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=2574&auto=format&fit=crop",
        title: "CEO at Microsoft"
      },
      content: "Empowering every person and every organization on the planet to achieve more. Today we're launching new AI initiatives to support local developers.",
      timestamp: "5h",
      likes: "8,920",
      comments: "315"
    }
  ];

  return (
    <div className="flex-1 max-w-[555px] flex flex-col gap-2">

      {/* Create Post Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm mb-2">
        <div className="flex gap-3 items-center mb-3">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=2574&auto=format&fit=crop"
              alt="Me"
              className="w-full h-full object-cover"
            />
          </div>
          <button className="flex-1 bg-white border border-slate-300 rounded-full h-12 px-4 text-sm font-bold text-slate-500 text-left hover:bg-slate-50 transition-colors">
            Start a post
          </button>
        </div>
        <div className="flex items-center justify-between px-2">
          <PostTool icon={<ImageIcon className="w-5 h-5 text-blue-500" />} label="Media" />
          <PostTool icon={<PlayCircle className="w-5 h-5 text-emerald-600" />} label="Video" />
          <PostTool icon={<Calendar className="w-5 h-5 text-amber-600" />} label="Event" />
          <PostTool icon={<FileText className="w-5 h-5 text-rose-500" />} label="Write article" />
        </div>
      </div>

      {/* Feed Divider */}
      <div className="flex items-center gap-2 mb-2">
        <div className="h-px flex-1 bg-slate-300"></div>
        <div className="flex items-center gap-1 cursor-pointer">
          <span className="text-[11px] text-slate-400">Sort by:</span>
          <span className="text-[11px] font-bold text-slate-600">Top</span>
          <div className="w-2 h-2 border-b border-r border-slate-600 rotate-45 -translate-y-0.5"></div>
        </div>
      </div>

      {/* Posts */}
      {posts.map(post => (
        <PostCard key={post.id} {...post} />
      ))}

    </div>
  );
};

const PostTool = ({ icon, label }) => (
  <button className="flex items-center gap-3 px-3 py-3 rounded hover:bg-slate-100 transition-colors group">
    {icon}
    <span className="text-sm font-bold text-slate-500 group-hover:text-slate-600">{label}</span>
  </button>
);

export default DashboardFeed;
