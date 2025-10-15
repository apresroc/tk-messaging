import React from 'react';
import UserDashboard from '@/components/user/UserDashboard';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 text-white">
      <div className="container py-6 flex-1 relative z-10">
        <UserDashboard />
      </div>
    </div>
  );
};

export default Dashboard;