import React from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import Header from '@/components/layout/Header';

const Admin = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container py-6 flex-1">
        <AdminDashboard />
      </div>
    </div>
  );
};

export default Admin;