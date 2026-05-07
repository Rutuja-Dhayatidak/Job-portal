import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const SupportLayout = () => {
  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-80 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/[0.02] to-transparent pointer-events-none" />
        <Outlet />
      </main>
    </div>
  );
};

export default SupportLayout;
