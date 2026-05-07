import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Briefcase,
  Bookmark,
  Bell,
  FileText,
  Settings,
  LogOut,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Download,
  Pencil,
  GraduationCap,
  Link as LinkIcon,
  Target,
  Code,
  ArrowLeft
} from 'lucide-react';
import { getMyProfile } from '../services/api';
import toast from 'react-hot-toast';
import CandidateNavbar from '../components/dashboard/Navbar';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completion, setCompletion] = useState(0);
  const [activeTab, setActiveTab] = useState('Overview');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();
      if (data.success) {
        setProfile(data.profile);
        setCompletion(data.completionPercentage);
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-black text-emerald-600 animate-pulse">LOADING...</div>;

  const user = profile?.userId || {};

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <CandidateNavbar />
      
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 pt-24 pb-12">
        {/* ⬅️ Go Back Button */}
        <button 
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors mb-6 text-sm font-bold group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
            <ArrowLeft size={16} />
          </div>
          Go Back
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* 🌑 GitHub Sidebar (Left) */}
          <aside className="lg:w-[296px] shrink-0">
            <div className="relative group mb-4">
              <div className="w-full aspect-square rounded-full overflow-hidden border border-slate-200 shadow-sm relative z-10">
                {profile?.profileImage ? (
                  <img src={profile.profileImage} alt={user.firstName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#1a2e24] flex items-center justify-center text-emerald-400 text-6xl font-black italic">
                    {user.firstName?.charAt(0)}
                  </div>
                )}
              </div>
              <button className="absolute bottom-4 right-4 z-20 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-50 transition-colors">
                <Pencil size={14} className="text-slate-500" />
              </button>
            </div>

            <div className="mb-4">
              <h1 className="text-[26px] font-bold leading-tight">{user.firstName} {user.lastName}</h1>
              <p className="text-xl text-slate-500 font-light tracking-tight">{user.firstName?.toLowerCase()}-{user.lastName?.toLowerCase()}</p>
            </div>

            <p className="text-sm text-slate-700 mb-4 leading-relaxed font-medium">
              {profile?.about || "Full Stack Developer. Exploring new opportunities in tech."}
            </p>

            <button 
              onClick={() => navigate("/profile/edit")}
              className="w-full py-1.5 bg-slate-50 border border-slate-200 rounded-md text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors mb-4"
            >
              Edit profile
            </button>

            <div className="space-y-1.5 text-sm text-slate-700">
              <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-400" /> {profile?.location || "India"}</div>
              <div className="flex items-center gap-2"><Mail size={16} className="text-slate-400" /> {user.email}</div>
              {profile?.links?.linkedin && (
                <a href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-emerald-600 transition-colors">
                  <LinkIcon size={16} className="text-slate-400" /> LinkedIn
                </a>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center justify-between">
                Profile Strength
                <span className="text-emerald-600 italic">{Math.round(completion)}%</span>
              </h3>
              
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-1000" 
                  style={{ width: `${completion}%` }}
                ></div>
              </div>

              <div className="flex gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-inner transition-colors ${completion >= 80 ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-300'}`} title="Profile 80%+ Completed">
                  <CheckCircle2 size={16} />
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-inner transition-colors ${profile?.resumeUrl ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-300'}`} title="Resume Uploaded">
                  <FileText size={16} />
                </div>
              </div>
            </div>
          </aside>

          {/* 🚀 Main Content (Right) */}
          <div className="flex-1 min-w-0">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6 sticky top-16 bg-white z-20 pt-2">
              <GithubTab label="Overview" icon={<FileText size={16} />} active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} />
              <GithubTab label="Jobs" icon={<Briefcase size={16} />} active={activeTab === 'Jobs'} onClick={() => setActiveTab('Jobs')} badge="12" />
              <GithubTab label="Applications" icon={<Target size={16} />} active={activeTab === 'Applications'} onClick={() => setActiveTab('Applications')} badge="4" />
              <GithubTab label="Saved" icon={<Bookmark size={16} />} active={activeTab === 'Saved'} onClick={() => setActiveTab('Saved')} />
            </div>

            <div className="space-y-10">
              {activeTab === 'Overview' && (
                <>
                  {/* About Section */}
                  <section>
                    <h2 className="text-base font-semibold mb-3">About</h2>
                    <div className="p-4 border border-slate-200 rounded-md bg-slate-50/30">
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {profile?.about || "No bio provided yet."}
                      </p>
                    </div>
                  </section>

                  {/* Pinned Projects */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-base font-semibold">Pinned Projects</h2>
                      <button onClick={() => navigate("/profile/edit")} className="text-xs text-emerald-600 hover:underline">Edit</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(profile?.projects || []).map((proj, i) => (
                        <div key={i} className="p-4 border border-slate-200 rounded-md hover:border-emerald-200 transition-colors group">
                          <div className="flex items-center gap-2 mb-2">
                            <Code size={14} className="text-slate-400" />
                            <h4 className="text-sm font-bold text-emerald-600 group-hover:underline">{proj.title}</h4>
                          </div>
                          <p className="text-[11px] text-slate-500 mb-4 line-clamp-2">{proj.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {(proj.technologies_used || []).map(tech => (
                              <span key={tech} className="text-[9px] px-2 py-0.5 bg-slate-100 rounded-full text-slate-500 font-bold">{tech}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Experience, Internships & Education Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Experience & Internships */}
                    <section>
                      <h2 className="text-base font-semibold mb-4">Professional Journey</h2>
                      <div className="space-y-6">
                        {/* Work Experience */}
                        {(profile?.experience || []).map((exp, i) => (
                          <div key={`exp-${i}`} className="relative pl-6 pb-4 border-l border-slate-100 last:border-0">
                            <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-emerald-500"></div>
                            <h4 className="text-sm font-bold">{exp.role}</h4>
                            <p className="text-xs text-slate-500">{exp.company}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-wider">{exp.duration}</p>
                            {exp.responsibilities && <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">{exp.responsibilities}</p>}
                          </div>
                        ))}
                        
                        {/* Internships */}
                        {(profile?.internships || []).map((intern, i) => (
                          <div key={`intern-${i}`} className="relative pl-6 pb-4 border-l border-slate-100 last:border-0">
                            <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-orange-400"></div>
                            <h4 className="text-sm font-bold">{intern.role} <span className="text-[10px] bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded ml-2">Internship</span></h4>
                            <p className="text-xs text-slate-500">{intern.company}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-wider">{intern.duration}</p>
                          </div>
                        ))}
                        
                        {(!profile?.experience?.length && !profile?.internships?.length) && <p className="text-xs text-slate-400 italic">No professional history added.</p>}
                      </div>
                    </section>

                    {/* Education */}
                    <section>
                      <h2 className="text-base font-semibold mb-4">Education</h2>
                      <div className="space-y-6">
                        {(profile?.education || []).map((edu, i) => (
                          <div key={i} className="relative pl-6 pb-4 border-l border-slate-100 last:border-0">
                            <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-blue-500"></div>
                            <h4 className="text-sm font-bold">{edu.degree}</h4>
                            <p className="text-xs text-slate-500">{edu.college}</p>
                            <p className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-wider">Class of {edu.year}</p>
                          </div>
                        ))}
                        {!profile?.education?.length && <p className="text-xs text-slate-400 italic">No education details added.</p>}
                      </div>
                    </section>
                  </div>

                  {/* Skills Section */}
                  <section>
                    <h2 className="text-base font-semibold mb-4">Core Skills</h2>
                    <div className="flex flex-wrap gap-2">
                      {(profile?.skills || []).map(skill => (
                        <span key={skill} className="px-3 py-1 bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-bold rounded-full hover:border-emerald-300 hover:text-emerald-700 transition-colors cursor-default">
                          {skill}
                        </span>
                      ))}
                      {!profile?.skills?.length && <p className="text-xs text-slate-400 italic">No skills listed yet.</p>}
                    </div>
                  </section>

                  {/* Job Preferences & Personal Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Job Preferences */}
                    <section className="p-5 border border-slate-200 rounded-xl bg-slate-50/50">
                      <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
                        <Target size={16} className="text-emerald-600" /> Job Preferences
                      </h2>
                      <div className="space-y-3">
                        <PreferenceRow label="Desired Role" value={profile?.job_preferences?.role} />
                        <PreferenceRow label="Job Type" value={profile?.job_preferences?.type} />
                        <PreferenceRow label="Expected Salary" value={profile?.job_preferences?.salary} />
                      </div>
                    </section>

                    {/* Personal Details */}
                    <section className="p-5 border border-slate-200 rounded-xl">
                      <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
                        <User size={16} className="text-blue-600" /> Personal Details
                      </h2>
                      <div className="space-y-3">
                        <PreferenceRow label="Phone" value={user.phone} />
                        <PreferenceRow label="Gender" value={profile?.gender} />
                        <PreferenceRow label="Date of Birth" value={profile?.dob ? new Date(profile.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : null} />
                        <div className="pt-2 border-t border-slate-50">
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Languages</p>
                          <div className="flex flex-wrap gap-1.5">
                            {(profile?.languages || []).map(lang => (
                              <span key={lang} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-bold rounded-md">{lang}</span>
                            ))}
                            {(!profile?.languages || profile?.languages.length === 0) && <span className="text-[10px] text-slate-400 italic">Not specified</span>}
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  {/* Resume Card */}
                  <section className="p-6 border border-slate-200 rounded-xl bg-[#1a2e24] text-white shadow-xl shadow-emerald-900/10">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center text-emerald-400">
                          <FileText size={24} />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold">Professional Resume</h3>
                          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-1">
                            {profile?.resumeUrl ? "Verified & Ready" : "No resume uploaded"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {profile?.resumeUrl && (
                          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md text-xs font-bold transition-all">View</a>
                        )}
                        <button onClick={() => navigate("/profile/edit")} className="px-4 py-2 bg-emerald-500 text-[#1a2e24] rounded-md text-xs font-black hover:bg-emerald-400 transition-all">
                          {profile?.resumeUrl ? "Update" : "Upload Now"}
                        </button>
                      </div>
                    </div>
                  </section>
                </>
              )}

              {activeTab === 'Jobs' && (
                <div className="py-20 text-center text-slate-400">
                  <Briefcase size={40} className="mx-auto mb-4 opacity-20" />
                  <p className="text-sm font-medium">No active jobs found in your preferences.</p>
                </div>
              )}

              {activeTab === 'Applications' && (
                <div className="py-20 text-center text-slate-400">
                  <Target size={40} className="mx-auto mb-4 opacity-20" />
                  <p className="text-sm font-medium">You haven't applied to any jobs yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PreferenceRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-[11px]">
    <span className="text-slate-500 font-medium uppercase tracking-wider">{label}</span>
    <span className="text-slate-900 font-bold">{value || "Not specified"}</span>
  </div>
);

const GithubTab = ({ label, icon, active, onClick, badge }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${active ? 'text-slate-900 border-b-2 border-orange-500' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-t-md'}`}
  >
    <span className={`${active ? 'text-slate-900' : 'text-slate-400'}`}>{icon}</span>
    {label}
    {badge && <span className="px-1.5 py-0.5 bg-slate-100 text-[10px] text-slate-500 rounded-full font-bold">{badge}</span>}
  </button>
);

export default Profile;

