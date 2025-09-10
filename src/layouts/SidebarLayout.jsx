import React from 'react';
import Sidebar from '../components/Sidebar';

const SidebarLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
};

export default SidebarLayout;
