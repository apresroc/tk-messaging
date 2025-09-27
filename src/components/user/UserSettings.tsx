import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
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
      color: 'blue',
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
    } else {
      // Set initial theme from context
      setSettings(prev => ({
        ...prev,
        theme: {
          ...prev.theme,
          mode: theme
        }
      }));
    }
  }, [theme]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

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

  const handleThemeChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [key]: value,
      },
    }));
    
    // Apply theme change immediately for mode
    if (key === 'mode') {
      setTheme(value as "light" | "dark");
    }
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
            
            <Button 
              onClick={handleSaveSettings}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              Save Profile
            </Button>
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
            <Switch
              checked={settings.notifications.email}
              onCheckedChange={(checked) => handleNotificationChange('email', checked)}
            />
          </div>
          
          <Separator className="bg-slate-200 dark:bg-slate-700" />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-700 dark:text-blue-100">SMS Notifications</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">Receive notifications via SMS</p>
            </div>
            <Switch
              checked={settings.notifications.sms}
              onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
            />
          </div>
          
          <Separator className="bg-slate-200 dark:bg-slate-700" />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-700 dark:text-blue-100">Push Notifications</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">Receive push notifications on your devices</p>
            </div>
            <Switch
              checked={settings.notifications.push}
              onCheckedChange={(checked) => handleNotificationChange('push', checked)}
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
            <Switch
              checked={settings.sounds.message}
              onCheckedChange={(checked) => handleSoundChange('message', checked)}
            />
          </div>
          
          <Separator className="bg-slate-200 dark:bg-slate-700" />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-700 dark:text-blue-100">Notification Sounds</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">Play sound for notifications</p>
            </div>
            <Switch
              checked={settings.sounds.notification}
              onCheckedChange={(checked) => handleSoundChange('notification', checked)}
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
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-blue-100">Theme Mode</Label>
            <Select 
              value={settings.theme.mode} 
              onValueChange={(value) => {
                handleThemeChange('mode', value);
              }}
            >
              <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-gray-900 dark:text-white">
                <SelectValue placeholder="Select theme mode" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                <SelectItem value="light" className="text-gray-900 dark:text-white">Light</SelectItem>
                <SelectItem value="dark" className="text-gray-900 dark:text-white">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-gray-700 dark:text-blue-100">Accent Color</Label>
            <div className="flex gap-2">
              {['blue', 'green', 'red', 'purple', 'yellow'].map((color) => (
                <Button
                  key={color}
                  variant={settings.theme.color === color ? "default" : "outline"}
                  size="icon"
                  className={`w-8 h-8 rounded-full border-slate-300 dark:border-slate-700 ${
                    settings.theme.color === color 
                      ? 'ring-2 ring-offset-2 ring-primary' 
                      : ''
                  }`}
                  style={{ backgroundColor: settings.theme.color === color ? `var(--${color}-500)` : 'transparent' }}
                  onClick={() => handleThemeChange('color', color)}
                >
                  <div 
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: `var(--${color}-500)` }}
                  />
                </Button>
              ))}
            </div>
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
            <Switch
              checked={settings.privacy.readReceipts}
              onCheckedChange={(checked) => handlePrivacyChange('readReceipts', checked)}
            />
          </div>
          
          <Separator className="bg-slate-200 dark:bg-slate-700" />
          
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-gray-700 dark:text-blue-100">Typing Indicators</Label>
              <p className="text-sm text-slate-500 dark:text-slate-400">Show when you're typing to others</p>
            </div>
            <Switch
              checked={settings.privacy.typingIndicators}
              onCheckedChange={(checked) => handlePrivacyChange('typingIndicators', checked)}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSaveSettings}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default UserSettings;