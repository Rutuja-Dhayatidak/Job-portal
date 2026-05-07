import React from 'react';
import { MoreHorizontal, X, ThumbsUp, MessageCircle, Repeat2, Send, Globe2 } from 'lucide-react';

const PostCard = ({ author, content, image, timestamp, likes, comments }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-2 font-sans">

      {/* Header */}
      <div className="p-3 pb-2 flex items-start justify-between">
        <div className="flex gap-2">
          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 cursor-pointer">
            <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 group cursor-pointer">
              <span className="font-bold text-sm text-slate-800 group-hover:text-[#0a66c2] group-hover:underline">{author.name}</span>
              <span className="text-slate-400 text-xs font-normal">• 1st</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium leading-none mt-0.5">{author.title}</span>
            <div className="flex items-center gap-1 text-slate-400 text-[10px] mt-1 font-medium">
              <span>{timestamp}</span>
              <span>•</span>
              <Globe2 className="w-2.5 h-2.5" />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="p-1 hover:bg-slate-100 rounded-full transition-colors"><MoreHorizontal className="w-5 h-5 text-slate-500" /></button>
          <button className="p-1 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 pb-3">
        <p className="text-sm text-slate-800 leading-relaxed font-normal">
          {content}
        </p>
      </div>

      {/* Post Media */}
      {image && (
        <div className="w-full bg-slate-100 border-y border-slate-100 cursor-pointer overflow-hidden">
          <img src={image} alt="Post Content" className="w-full h-auto max-h-[500px] object-cover hover:scale-[1.01] transition-transform duration-500" />
        </div>
      )}

      {/* Social Stats */}
      <div className="px-3 py-2 flex items-center justify-between border-b border-slate-100 mx-3">
        <div className="flex items-center gap-1 cursor-pointer hover:underline decoration-blue-600">
          <div className="flex -space-x-1">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border border-white"><ThumbsUp className="w-2 h-2 text-white fill-white" /></div>
            <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border border-white"><div className="w-1.5 h-1.5 bg-white rounded-full" /></div>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">{likes}</span>
        </div>
        <div className="text-[11px] text-slate-500 font-medium hover:text-blue-600 hover:underline cursor-pointer">
          {comments} comments • 12 shares
        </div>
      </div>

      {/* Actions */}
      <div className="px-3 py-1 flex items-center justify-around h-11">
        <PostAction icon={<ThumbsUp className="w-5 h-5" />} label="Like" />
        <PostAction icon={<MessageCircle className="w-5 h-5" />} label="Comment" />
        <PostAction icon={<Repeat2 className="w-5 h-5" />} label="Repost" />
        <PostAction icon={<Send className="w-5 h-5" />} label="Send" />
      </div>

    </div>
  );
};

const PostAction = ({ icon, label }) => (
  <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 transition-colors text-slate-500 group flex-1 justify-center">
    {icon}
    <span className="text-[13px] font-bold group-hover:text-slate-700">{label}</span>
  </button>
);

export default PostCard;
