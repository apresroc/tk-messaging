import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

  // Toggle button component for on/off states
  const ToggleButton = ({ 
    isOn, 
    onToggle,
    onLabel = "On",
    offLabel = "Off"
  }: { 
    isOn: boolean; 
    onToggle: () => void;
    onLabel?: string;
    offLabel?: string;
  }) => (
    <Button
      variant="outline"
      onClick={onToggle}
      className={`w-16 h-8 rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 shadow-sm ${
        isOn 
          ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' 
          : 'bg-red-500 hover:bg-red-600 text-white border-red-500'
      }`}
    >
      {isOn ? onLabel : offLabel}
    </Button>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Settings</h1>
          <p className="text-slate-600 dark:text-slate-300">Manage your preferences and account settings</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/conversations')}
          className="border-slate-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <User className="h-5 w-5 text-blue-400" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-blue-100">Full Name</Label>
                <Input
                  id="name"
                  value={settings.profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  placeholder="Your name"
                  className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-blue-100">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 dark:text-blue-100">Phone Number</Label>
                <Input
                  id="phone"
                  value={settings.profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  placeholder="+1234567890"
                  className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Account Security */}
        <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
              <Shield className="h-5 w-5 text-purple-400" />
              Account Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full border-slate-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Change Password
              </Button>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full border-slate-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Two-Factor Authentication
              </Button>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full border-slate-300 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Active Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Notification Settings */}
      <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Bell className="h-5 w-5 text-amber-400" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-700 dark:text-blue-100">Email Notifications</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">Receive notifications via email</p>
            </div>
            <ToggleButton
              isOn={settings.notifications.email}
              onToggle={() => handleNotificationChange('email', !settings.notifications.email)}
            />
          </div>
          
          <Separator className="bg-slate-200 dark:bg-slate-700" />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-700 dark:text-blue-100">SMS Notifications</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">Receive notifications via SMS</p>
            </div>
            <ToggleButton
              isOn={settings.notifications.sms}
              onToggle={() => handleNotificationChange('sms', !settings.notifications.sms)}
            />
          </div>
          
          <Separator className="bg-slate-200 dark:bg-slate-700" />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-700 dark:text-blue-100">Push Notifications</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">Receive push notifications on your devices</p>
            </div>
            <ToggleButton
              isOn={settings.notifications.push}
              onToggle={() => handleNotificationChange('push', !settings.notifications.push)}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Sound Settings */}
      <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Volume2 className="h-5 w-5 text-green-400" />
            Sound Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-700 dark:text-blue-100">Message Sounds</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">Play sound when receiving messages</p>
            </div>
            <ToggleButton
              isOn={settings.sounds.message}
              onToggle={() => handleSoundChange('message', !settings.sounds.message)}
            />
          </div>
          
          <Separator className="bg-slate-200 dark:bg-slate-700" />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-700 dark:text-blue-100">Notification Sounds</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">Play sound for notifications</p>
            </div>
            <ToggleButton
              isOn={settings.sounds.notification}
              onToggle={() => handleSoundChange('notification', !settings.sounds.notification)}
            />
          </div>
          
          <Separator className="bg-slate-200 dark:bg-slate-700" />
          
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-blue-100">Volume Level</Label>
            <Input
              type="range"
              min="0"
              max="100"
              value={settings.sounds.volume}
              onChange={(e) => handleSoundChange('volume', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400">
              <span>0%</span>
              <span>{settings.sounds.volume}%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Theme Settings */}
      <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Palette className="h-5 w-5 text-pink-400" />
            Theme Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-700 dark:text-blue-100">Light Theme</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">Use light color scheme</p>
            </div>
            <ToggleButton
              isOn={settings.theme.mode === 'light'}
              onToggle={() => handleThemeChange(settings.theme.mode === 'light' ? 'dark' : 'light')}
              onLabel="On"
              offLabel="Off"
            />
          </div>
          
          <Separator className="bg-slate-200 dark:bg-slate-700" />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-700 dark:text-blue-100">Dark Theme</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">Use dark color scheme</p>
            </div>
            <ToggleButton
              isOn={settings.theme.mode === 'dark'}
              onToggle={() => handleThemeChange(settings.theme.mode === 'dark' ? 'light' : 'dark')}
              onLabel="On"
              offLabel="Off"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Privacy Settings */}
      <Card className="bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-700 dark:text-blue-100">Read Receipts</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">Allow others to see when you've read their messages</p>
            </div>
            <ToggleButton
              isOn={settings.privacy.readReceipts}
              onToggle={() => handlePrivacyChange('readReceipts', !settings.privacy.readReceipts)}
            />
          </div>
          
          <Separator className="bg-slate-200 dark:bg-slate-700" />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-700 dark:text-blue-100">Typing Indicators</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">Show when you're typing to others</p>
            </div>
            <ToggleButton
              isOn={settings.privacy.typingIndicators}
              onToggle={() => handlePrivacyChange('typingIndicators', !settings.privacy.typingIndicators)}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettings;