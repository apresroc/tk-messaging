import React from 'react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import { User, Home, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
    <header className="border-b border-slate-700/50">
      <div className="flex h-16 items-center px-4">
        <motion.div 
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button variant="ghost" size="icon" onClick={goToHome} className="text-white hover:bg-slate-800/50">
            <MessageSquare className="h-6 w-6 text-blue-400" />
          </Button>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            {getTitle()}
          </span>
        </motion.div>
        
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="text-slate-400 hover:text-white hover:bg-slate-800/50"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;