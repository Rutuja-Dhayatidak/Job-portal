import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import FinanceSidebar from '../components/FinanceSidebar';
import FinanceHeader from '../components/FinanceHeader';
import { motion } from 'framer-motion';

const FinanceLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sidebarTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 0.8
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans">
      {/* Sidebar */}
      <FinanceSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      {/* Main Content Area */}
      <motion.div 
        initial={false}
        animate={{ marginLeft: isCollapsed ? '80px' : '280px' }}
        transition={sidebarTransition}
        className="flex-1 flex flex-col min-h-screen"
      >
        <FinanceHeader />
        <main className="p-8 max-w-[1600px] mx-auto w-full">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
};

export default FinanceLayout;
