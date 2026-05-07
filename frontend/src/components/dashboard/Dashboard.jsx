import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Feed from './Feed';
import RightPanel from './RightPanel';
import { getMyProfile } from '../../services/api';
import { AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMyProfile();
        if (data.success) {
          setProfile(data.profile);
        }
      } catch (error) {
        console.error("Error fetching profile in dashboard", error);
      }
    };
    fetchProfile();
  }, []);

  const isPendingCompany = profile?.userId?.company_id?.status === 'pending';
  return (
    <div className="min-h-screen bg-[#f3f2ef] font-sans text-slate-900 selection:bg-blue-100">
      <Navbar />

      <main className="max-w-[1128px] mx-auto pt-[4.5rem] px-4">
        {isPendingCompany && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3 shadow-sm">
            <AlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-amber-800 font-bold text-sm">Your company registration request is under review (24–48 hrs)</h4>
              <p className="text-amber-700/80 text-xs mt-1 font-medium">You will be notified once our team approves your request. Employer dashboard access is currently disabled.</p>
            </div>
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Left Sidebar */}
          <Sidebar />

          {/* Center Feed */}
          <Feed />

          {/* Right Sidebar */}
          <RightPanel />

        </div>

        {/* Mobile Navbar Spacer */}
        <div className="h-20 lg:hidden" />
      </main>
    </div>
  );
};

export default Dashboard;
