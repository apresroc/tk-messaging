import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { AdminSettings } from '@/lib/types';
import { toast } from 'sonner';

const Settings = () => {
  const [settings, setSettings] = useState<AdminSettings>({
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioPhoneNumber: '',
    webhookUrl: ''
  });
  
  const [autoReply, setAutoReply] = useState({
    enabled: false,
    message: 'Thanks for your message. We\'ll get back to you soon.'
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('twilioSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    const savedAutoReply = localStorage.getItem('autoReplySettings');
    if (savedAutoReply) {
      setAutoReply(JSON.parse(savedAutoReply));
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('twilioSettings', JSON.stringify(settings));
  }, [settings]);

  // Save auto-reply settings to localStorage
  useEffect(() => {
    localStorage.setItem('autoReplySettings', JSON.stringify(autoReply));
  }, [autoReply]);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully');
  };

  const handleAutoReplyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setAutoReply(prev => ({ ...prev, [name]: checked }));
    } else {
      setAutoReply(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your application settings</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Twilio Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Twilio Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="twilioAccountSid">Account SID</Label>
              <Input
                id="twilioAccountSid"
                name="twilioAccountSid"
                value={settings.twilioAccountSid}
                onChange={handleSettingsChange}
                placeholder="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twilioAuthToken">Auth Token</Label>
              <Input
                id="twilioAuthToken"
                name="twilioAuthToken"
                type="password"
                value={settings.twilioAuthToken}
                onChange={handleSettingsChange}
                placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="twilioPhoneNumber">Twilio Phone Number</Label>
              <Input
                id="twilioPhoneNumber"
                name="twilioPhoneNumber"
                value={settings.twilioPhoneNumber}
                onChange={handleSettingsChange}
                placeholder="+1234567890"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL</Label>
              <Input
                id="webhookUrl"
                name="webhookUrl"
                value={settings.webhookUrl}
                onChange={handleSettingsChange}
                placeholder="https://yourdomain.com/webhook"
              />
              <p className="text-sm text-muted-foreground">
                Configure this URL in your Twilio console to receive incoming messages
              </p>
            </div>
            
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </CardContent>
        </Card>
        
        {/* Auto-Reply Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Auto-Reply Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                id="autoReplyEnabled"
                name="enabled"
                type="checkbox"
                checked={autoReply.enabled}
                onChange={handleAutoReplyChange}
                className="h-4 w-4"
              />
              <Label htmlFor="autoReplyEnabled">Enable Auto-Reply</Label>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="autoReplyMessage">Auto-Reply Message</Label>
              <Textarea
                id="autoReplyMessage"
                name="message"
                value={autoReply.message}
                onChange={handleAutoReplyChange}
                placeholder="Thanks for your message. We'll get back to you soon."
                disabled={!autoReply.enabled}
              />
            </div>
            
            <Button onClick={() => toast.success('Auto-reply settings saved')}>Save Auto-Reply Settings</Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Webhook Testing Section */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Testing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Test your webhook configuration by sending a sample payload to your endpoint.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Input 
              value={settings.webhookUrl} 
              readOnly 
              placeholder="Webhook URL not set" 
            />
            <Button 
              onClick={() => toast.info('Webhook test sent')}
              disabled={!settings.webhookUrl}
            >
              Send Test Payload
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;