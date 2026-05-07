import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { motion } from 'framer-motion';

const AdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const role = localStorage.getItem('role');

  if (role !== 'Platform Admin') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />

      {/* Main Content Area */}
      <motion.div
        initial={false}
        animate={{ marginLeft: isCollapsed ? '80px' : '280px' }}
        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.8 }}
        className="flex-1 flex flex-col min-h-screen"
      >
        <Header />
        <main className="p-8">
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
};

export default AdminLayout;
