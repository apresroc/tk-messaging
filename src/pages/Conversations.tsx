import React from 'react';
import UserDashboard from '@/components/user/UserDashboard';
import Header from '@/components/layout/Header';

const Conversations = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container py-6 flex-1">
        <UserDashboard />
      </div>
    </div>
  );
};

export default Conversations;