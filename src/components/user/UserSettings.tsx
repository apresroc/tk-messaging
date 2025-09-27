import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bell, Volume2, Palette, User, Shield } from 'lucide-react';
import { toast } from 'sonner';

const UserSettings = () => {
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
      mode: 'system',
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
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

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
      <div>
        <h1 className="text-3xl font-bold">User Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and account settings</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={settings.profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  placeholder="Your name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={settings.profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  placeholder="+1234567890"
                />
              </div>
            </div>
            
            <Button onClick={handleSaveSettings}>Save Profile</Button>
          </CardContent>
        </Card>
        
        {/* Account Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Account Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </div>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Two-Factor Authentication
              </Button>
            </div>
            
            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                Active Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              checked={settings.notifications.email}
              onCheckedChange={(checked) => handleNotificationChange('email', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label>SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
            </div>
            <Switch
              checked={settings.notifications.sms}
              onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
            </div>
            <Switch
              checked={settings.notifications.push}
              onCheckedChange={(checked) => handleNotificationChange('push', checked)}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Sound Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            Sound Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Message Sounds</Label>
              <p className="text-sm text-muted-foreground">Play sound when receiving messages</p>
            </div>
            <Switch
              checked={settings.sounds.message}
              onCheckedChange={(checked) => handleSoundChange('message', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Notification Sounds</Label>
              <p className="text-sm text-muted-foreground">Play sound for notifications</p>
            </div>
            <Switch
              checked={settings.sounds.notification}
              onCheckedChange={(checked) => handleSoundChange('notification', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label>Volume Level</Label>
            <Input
              type="range"
              min="0"
              max="100"
              value={settings.sounds.volume}
              onChange={(e) => handleSoundChange('volume', parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
              <span>{settings.sounds.volume}%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Theme Mode</Label>
            <Select value={settings.theme.mode} onValueChange={(value) => handleThemeChange('mode', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select theme mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System Default</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="flex gap-2">
              {['blue', 'green', 'red', 'purple', 'yellow'].map((color) => (
                <Button
                  key={color}
                  variant="outline"
                  size="icon"
                  className={`w-8 h-8 rounded-full ${
                    settings.theme.color === color ? 'ring-2 ring-offset-2 ring-primary' : ''
                  } bg-${color}-500`}
                  onClick={() => handleThemeChange('color', color)}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Read Receipts</Label>
              <p className="text-sm text-muted-foreground">Allow others to see when you've read their messages</p>
            </div>
            <Switch
              checked={settings.privacy.readReceipts}
              onCheckedChange={(checked) => handlePrivacyChange('readReceipts', checked)}
            />
          </div>
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <div>
              <Label>Typing Indicators</Label>
              <p className="text-sm text-muted-foreground">Show when you're typing to others</p>
            </div>
            <Switch
              checked={settings.privacy.typingIndicators}
              onCheckedChange={(checked) => handlePrivacyChange('typingIndicators', checked)}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save All Settings</Button>
      </div>
    </div>
  );
};

export default UserSettings;