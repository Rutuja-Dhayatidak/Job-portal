import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';

const ModeratorLayout = () => {
  return (
    <div className="flex bg-[#050505] min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default ModeratorLayout;
