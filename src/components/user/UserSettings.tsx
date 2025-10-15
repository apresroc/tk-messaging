import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Bell, Volume2, Palette, User, Shield, ArrowLeft, Play } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      messageSound: 'default',
      notificationSound: 'chime',
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

  // Sound presets configuration
  const soundPresets = {
    default: { frequency: 600, duration: 0.2, type: 'sine' },
    chime: { frequency: 800, duration: 0.3, type: 'sine' },
    bell: { frequency: 1000, duration: 0.4, type: 'sine' },
    click: { frequency: 400, duration: 0.1, type: 'square' },
    whistle: { frequency: 1200, duration: 0.25, type: 'sine' },
    beep: { frequency: 500, duration: 0.15, type: 'square' },
    ding: { frequency: 900, duration: 0.2, type: 'sine' },
    pop: { frequency: 300, duration: 0.1, type: 'sawtooth' },
  };

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

  const handleSoundChange = (key: string, value: boolean | number | string) => {
    setSettings(prev => ({
      ...prev,
      sounds: {
        ...prev.sounds,
        [key]: value,
      },
    }));
  };

  const playTestSound = () => {
    if (!settings.sounds.notification) {
      toast.info('Notification sounds are disabled');
      return;
    }
    
    const soundConfig = soundPresets[settings.sounds.notificationSound as keyof typeof soundPresets];
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(soundConfig.frequency, audioContext.currentTime);
      oscillator.type = soundConfig.type as OscillatorType;
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(settings.sounds.volume / 100, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + soundConfig.duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + soundConfig.duration);
      
      toast.success('Test sound played');
    } catch (error) {
      toast.error('Could not play test sound');
    }
  };

  const playMessageSound = () => {
    if (!settings.sounds.message) {
      toast.info('Message sounds are disabled');
      return;
    }
    
    const soundConfig = soundPresets[settings.sounds.messageSound as keyof typeof soundPresets];
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(soundConfig.frequency, audioContext.currentTime);
      oscillator.type = soundConfig.type as OscillatorType;
      
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(settings.sounds.volume / 100, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + soundConfig.duration);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + soundConfig.duration);
      
      toast.success('Message sound played');
    } catch (error) {
      toast.error('Could not play message sound');
    }
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

  // Single box toggle button component showing either ON or OFF
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
        <Label className="text-white cursor-pointer font-medium">{label}</Label>
        {description && (
          <p className="text-sm text-blue-100 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={onToggle}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
          isOn 
            ? 'bg-green-200 text-green-900 border-4 border-green-700' 
            : 'bg-red-200 text-red-900 border-4 border-red-700'
        }`}
      >
        {isOn ? 'ON' : 'OFF'}
      </button>
    </div>
  );

  return (
    <div className="space-y-6 dark">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">User Settings</h1>
          <p className="text-blue-100">Manage your preferences and account settings</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/conversations')}
          className="border-blue-400 text-white hover:bg-blue-400 hover:text-white font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <User className="h-5 w-5 text-blue-400" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white font-medium">Full Name</Label>
                <Input
                  id="name"
                  value={settings.profile.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  placeholder="Your name"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={settings.profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  value={settings.profile.phone}
                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                  placeholder="+1234567890"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Account Security */}
        <Card className="bg-slate-800 border-slate-700">
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
                className="w-full border-slate-600 text-white hover:bg-slate-700 font-medium"
              >
                Change Password
              </Button>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full border-slate-600 text-white hover:bg-slate-700 font-medium"
              >
                Two-Factor Authentication
              </Button>
            </div>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full border-slate-600 text-white hover:bg-slate-700 font-medium"
              >
                Active Sessions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Notification Settings */}
      <Card className="bg-slate-800 border-slate-700">
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
          
          <Separator className="bg-slate-700" />
          
          <ToggleSwitch
            isOn={settings.notifications.sms}
            onToggle={() => handleNotificationChange('sms', !settings.notifications.sms)}
            label="SMS Notifications"
            description="Receive notifications via SMS"
          />
          
          <Separator className="bg-slate-700" />
          
          <ToggleSwitch
            isOn={settings.notifications.push}
            onToggle={() => handleNotificationChange('push', !settings.notifications.push)}
            label="Push Notifications"
            description="Receive push notifications on your devices"
          />
        </CardContent>
      </Card>
      
      {/* Sound Settings */}
      <Card className="bg-slate-800 border-slate-700">
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
          <div className="flex items-center justify-between mt-2">
            <Label className="text-white text-sm">Message Sound</Label>
            <Select
              value={settings.sounds.messageSound}
              onValueChange={(value) => handleSoundChange('messageSound', value)}
              disabled={!settings.sounds.message}
            >
              <SelectTrigger className="w-32 h-8 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="chime">Chime</SelectItem>
                <SelectItem value="bell">Bell</SelectItem>
                <SelectItem value="click">Click</SelectItem>
                <SelectItem value="whistle">Whistle</SelectItem>
                <SelectItem value="beep">Beep</SelectItem>
                <SelectItem value="ding">Ding</SelectItem>
                <SelectItem value="pop">Pop</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={playMessageSound}
              className="border-slate-600 text-white hover:bg-slate-700"
              disabled={!settings.sounds.message}
            >
              <Play className="h-4 w-4 mr-2" />
              Test Message Sound
            </Button>
          </div>
          
          <Separator className="bg-slate-700" />
          
          <ToggleSwitch
            isOn={settings.sounds.notification}
            onToggle={() => handleSoundChange('notification', !settings.sounds.notification)}
            label="Notification Sounds"
            description="Play sound for notifications"
          />
          <div className="flex items-center justify-between mt-2">
            <Label className="text-white text-sm">Notification Sound</Label>
            <Select
              value={settings.sounds.notificationSound}
              onValueChange={(value) => handleSoundChange('notificationSound', value)}
              disabled={!settings.sounds.notification}
            >
              <SelectTrigger className="w-32 h-8 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chime">Chime</SelectItem>
                <SelectItem value="bell">Bell</SelectItem>
                <SelectItem value="whistle">Whistle</SelectItem>
                <SelectItem value="ding">Ding</SelectItem>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="click">Click</SelectItem>
                <SelectItem value="beep">Beep</SelectItem>
                <SelectItem value="pop">Pop</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end mt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={playTestSound}
              className="border-slate-600 text-white hover:bg-slate-700"
              disabled={!settings.sounds.notification}
            >
              <Play className="h-4 w-4 mr-2" />
              Test Notification Sound
            </Button>
          </div>
          
          <Separator className="bg-slate-700" />
          
          <div className="space-y-2">
            <Label className="text-white font-medium">Volume Level</Label>
            <div className="flex items-center gap-3">
              <Input
                type="range"
                min="0"
                max="100"
                value={settings.sounds.volume}
                onChange={(e) => handleSoundChange('volume', parseInt(e.target.value))}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={playTestSound}
                className="border-slate-600 text-white hover:bg-slate-700"
                disabled={!settings.sounds.notification && !settings.sounds.message}
              >
                <Play className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex justify-between text-sm text-slate-400">
              <span>0%</span>
              <span>{settings.sounds.volume}%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Theme Settings */}
      <Card className="bg-slate-800 border-slate-700">
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
          
          <Separator className="bg-slate-700" />
          
          <ToggleSwitch
            isOn={settings.theme.mode === 'dark'}
            onToggle={() => handleThemeChange(settings.theme.mode === 'dark' ? 'light' : 'dark')}
            label="Dark Theme"
            description="Use dark color scheme"
          />
        </CardContent>
      </Card>
      
      {/* Privacy Settings */}
      <Card className="bg-slate-800 border-slate-700">
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
          
          <Separator className="bg-slate-700" />
          
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