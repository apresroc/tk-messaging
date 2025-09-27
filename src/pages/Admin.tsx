import React from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import Header from '@/components/layout/Header';

const Admin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 text-white">
      <Header />
      <div className="container py-6 flex-1 relative z-10">
        <AdminDashboard />
      </div>
    </div>
  );
};

export default Admin;