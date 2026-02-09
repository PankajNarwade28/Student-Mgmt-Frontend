import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar/Sidebar';
import Navbar from './Navbar/Navbar';

const Layout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (userId && token) {
      console.log(`Current User ID: ${userId}`);
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main Container: margin-left (ml-64) matches the sidebar width (w-64) on desktop */}
      <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out lg:ml-64">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />
        
        {/* Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="mx-auto h-full w-full max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;