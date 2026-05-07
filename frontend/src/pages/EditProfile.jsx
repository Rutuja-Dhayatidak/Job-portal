import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Layout } from 'lucide-react';
import ProfileForm from '../components/ProfileForm';
import { getMyProfile } from '../services/api';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();
      if (data.success) {
        setProfileData(data.profile);
      }
    } catch (error) {
      toast.error("Failed to fetch profile data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold text-sm">Fetching your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 font-sans">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-colors group"
          >
            <div className="p-2 bg-white border border-slate-200 rounded-lg group-hover:border-emerald-200 group-hover:bg-emerald-50">
              <ArrowLeft size={18} />
            </div>
            Back to Profile
          </button>
          
          <div className="flex items-center gap-3">
             <div className="text-right hidden md:block">
                <h1 className="text-xl font-black text-slate-900 leading-none">Edit Profile</h1>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Professional Identity</p>
             </div>
             <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-600/20">
                <Layout size={20} />
             </div>
          </div>
        </div>

        {/* Form Section */}
        <ProfileForm initialData={profileData} />

      </div>
    </div>
  );
};

export default EditProfile;
