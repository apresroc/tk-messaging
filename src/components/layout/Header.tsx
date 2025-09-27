import React from 'react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { User, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, you would clear authentication tokens here
    toast.success('You have been logged out');
    navigate('/');
  };

  const goToHome = () => {
    // Check if user is admin to determine home route
    const isAdmin = window.location.pathname.includes('admin');
    navigate(isAdmin ? '/admin' : '/conversations');
  };

  // Determine title based on current path
  const getTitle = () => {
    if (window.location.pathname.includes('admin')) {
      return 'TK Messaging Admin';
    }
    return 'TK Messaging';
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={goToHome}>
            <Home className="h-6 w-6 text-primary" />
          </Button>
          <span className="text-xl font-bold">{getTitle()}</span>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;