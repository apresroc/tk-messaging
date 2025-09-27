import React from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

const Admin = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="container py-6 flex-1">
          <AdminDashboard />
        </div>
      </div>
    </div>
  );
};

export default Admin;