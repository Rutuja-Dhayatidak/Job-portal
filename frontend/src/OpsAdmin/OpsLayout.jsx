import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import OpsSidebar from '../components/OpsSidebar';
import OpsHeader from '../components/OpsHeader';
import { motion } from 'framer-motion';

const OpsLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.8
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      <OpsSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <motion.div 
        initial={false}
        animate={{ marginLeft: isCollapsed ? '80px' : '280px' }}
        transition={sidebarTransition}
        className="flex-1 flex flex-col min-h-screen"
      >
        <OpsHeader />
        <main className="p-8 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
};

export default OpsLayout;
