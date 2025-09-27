import React from 'react';
import UserSettings from '@/components/user/UserSettings';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';

const SettingsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <div className="container py-6 flex-1">
          <UserSettings />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;