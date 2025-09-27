import React from 'react';
import { Button } from '@/components/ui/button';
import { User, LogOut, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    toast.success('You have been logged out');
    navigate('/');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  const getPageTitle = () => {
    if (location.pathname === '/admin') {
      return 'Manage Twilio settings and customers';
    } else if (location.pathname === '/conversations') {
      return 'Messaging Dashboard';
    } else if (location.pathname === '/customers') {
      return 'Contact Management';
    } else if (location.pathname === '/settings') {
      return 'User Settings';
    }
    return '';
  };

  // Show settings button only on user dashboard pages
  const showSettingsButton = location.pathname !== '/admin' && location.pathname !== '/settings';

  return (
    <header className="border-b border-slate-700/50">
      <div className="flex h-16 items-center px-4">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-white">
            {getPageTitle()}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {showSettingsButton && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSettings}
              className="text-slate-400 hover:text-white hover:bg-slate-800/50"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="text-slate-400 hover:text-white hover:bg-slate-800/50"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;