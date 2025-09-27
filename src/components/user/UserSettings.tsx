import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, Volume2, Palette, User, Shield, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';

const UserSettings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: true,
      push: true,
    },
    sounds: {
      message: true,
      notification: true,
      volume: 80,
    },
    theme: {
      mode: 'light',
    },
    privacy: {
      readReceipts: true,
      typingIndicators: true,
    },
    profile: {
      name: '',
      email: '',
      phone: '',
    },
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
    }
  }, []);

  // Update settings when theme changes from outside (e.g., mode toggle)
  useEffect(() => {
    setSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        mode: theme
      }
    }));
  }, [theme]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));
  };

  const handleSoundChange = (key: string, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      sounds: {
        ...prev.sounds,
        [key]: value,
      },
    }));
  };

  const handleThemeChange = (value: "light" | "dark") => {
    // Apply theme change immediately
    setTheme(value);
    
    setSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        mode: value,
      },
    }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }));
  };

  const handleProfileChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: value,
      },
    }));
  };

  // iOS-style toggle button component
  const ToggleSwitch = ({ 
    isOn, 
    onToggle,
    label,
    description
  }: { 
    isOn: boolean; 
    onToggle: () => void;
    label: string;
    description?: string;
  }) => (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <Label className="text-blue-100 cursor-pointer" onClick={onToggle}>{label}</Label>
        {description && (
          <p className="text-sm text-blue-200 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-200 ${
          isOn ? 'bg-blue-500' : 'bg-gray-400'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 shadow-md ${
            isOn ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">User Settings</h1>
          <p className="text-blue-100">Manage your preferences and account settings</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/conversations')}
          className="border-blue-400 text-blue-100 hover:bg-blue-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5 text-blue-400" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-blue-100">Full Name</Label>
                <Input
                  id="name"
                  value={settings.profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  placeholder="Your name"
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-100">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-blue-100">Phone Number</Label>
                <Input
                  id="phone"
                  value={settings.profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  placeholder="+1234567890"
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Account Security */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Shield className="h-5 w-5 text-purple-400" />
              Account Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full border-white/20 text-blue-100 hover:bg-white/20"
              >
                Change Password
              </Button>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full border-white/20 text-blue-100 hover:bg-white/20"
              >
                Two-Factor Authentication
              </Button>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full border-white/20 text-blue-100 hover:bg-white/20"
              >
                Active Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Notification Settings */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Bell className="h-5 w-5 text-amber-400" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleSwitch
            isOn={settings.notifications.email}
            onToggle={() => handleNotificationChange('email', !settings.notifications.email)}
            label="Email Notifications"
            description="Receive notifications via email"
          />
          
          <Separator className="bg-white/20" />
          
          <ToggleSwitch
            isOn={settings.notifications.sms}
            onToggle={() => handleNotificationChange('sms', !settings.notifications.sms)}
            label="SMS Notifications"
            description="Receive notifications via SMS"
          />
          
          <Separator className="bg-white/20" />
          
          <ToggleSwitch
            isOn={settings.notifications.push}
            onToggle={() => handleNotificationChange('push', !settings.notifications.push)}
            label="Push Notifications"
            description="Receive push notifications on your devices"
          />
        </CardContent>
      </Card>
      
      {/* Sound Settings */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Volume2 className="h-5 w-5 text-green-400" />
            Sound Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleSwitch
            isOn={settings.sounds.message}
            onToggle={() => handleSoundChange('message', !settings.sounds.message)}
            label="Message Sounds"
            description="Play sound when receiving messages"
          />
          
          <Separator className="bg-white/20" />
          
          <ToggleSwitch
            isOn={settings.sounds.notification}
            onToggle={() => handleSoundChange('notification', !settings.sounds.notification)}
            label="Notification Sounds"
            description="Play sound for notifications"
          />
          
          <Separator className="bg-white/20" />
          
          <div className="space-y-2">
            <Label className="text-blue-100">Volume Level</Label>
            <Input
              type="range"
              min="0"
              max="100"
              value={settings.sounds.volume}
              onChange={(e) => handleSoundChange('volume', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-blue-200">
              <span>0%</span>
              <span>{settings.sounds.volume}%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Theme Settings */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Palette className="h-5 w-5 text-pink-400" />
            Theme Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleSwitch
            isOn={settings.theme.mode === 'light'}
            onToggle={() => handleThemeChange(settings.theme.mode === 'light' ? 'dark' : 'light')}
            label="Light Theme"
            description="Use light color scheme"
          />
          
          <Separator className="bg-white/20" />
          
          <ToggleSwitch
            isOn={settings.theme.mode === 'dark'}
            onToggle={() => handleThemeChange(settings.theme.mode === 'dark' ? 'light' : 'dark')}
            label="Dark Theme"
            description="Use dark color scheme"
          />
        </CardContent>
      </Card>
      
      {/* Privacy Settings */}
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ToggleSwitch
            isOn={settings.privacy.readReceipts}
            onToggle={() => handlePrivacyChange('readReceipts', !settings.privacy.readReceipts)}
            label="Read Receipts"
            description="Allow others to see when you've read their messages"
          />
          
          <Separator className="bg-white/20" />
          
          <ToggleSwitch
            isOn={settings.privacy.typingIndicators}
            onToggle={() => handlePrivacyChange('typingIndicators', !settings.privacy.typingIndicators)}
            label="Typing Indicators"
            description="Show when you're typing to others"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;