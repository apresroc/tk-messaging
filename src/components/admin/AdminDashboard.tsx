import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Customer, AdminSettings } from '@/lib/types';
import { twilioClient } from '@/lib/twilio-client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Settings, Users, MessageSquare, Zap, Shield, Key, Phone, Globe, Paperclip, Image, Video } from 'lucide-react';

const AdminDashboard = () => {
  const [settings, setSettings] = useState<AdminSettings>({
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioPhoneNumber: '',
    webhookUrl: ''
  });
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    username: '',
    password: ''
  });
  
  const [testMessage, setTestMessage] = useState({
    to: '',
    body: '',
    media: [] as File[]
  });
  
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);

  // Load settings and customers from API on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load settings
        const settingsResponse = await fetch('/api/admin/settings');
        if (settingsResponse.ok) {
          const savedSettings = await settingsResponse.json();
          setSettings(savedSettings);
          
          // Initialize Twilio client if settings are available
          if (savedSettings.twilioAccountSid && savedSettings.twilioAuthToken && savedSettings.twilioPhoneNumber) {
            twilioClient.initialize(
              savedSettings.twilioAccountSid,
              savedSettings.twilioAuthToken,
              savedSettings.twilioPhoneNumber
            );
          }
        }
        
        // Load customers
        const customersResponse = await fetch('/api/admin/customers');
        if (customersResponse.ok) {
          const savedCustomers = await customersResponse.json();
          setCustomers(savedCustomers);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      }
    };
    
    loadData();
  }, []);

  const handleSettingsChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newSettings = { ...settings, [name]: value };
    setSettings(newSettings);
    
    // Save to API
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });
      
      if (response.ok) {
        // Initialize Twilio client if all required fields are present
        if (newSettings.twilioAccountSid && newSettings.twilioAuthToken && newSettings.twilioPhoneNumber) {
          twilioClient.initialize(
            newSettings.twilioAccountSid,
            newSettings.twilioAuthToken,
            newSettings.twilioPhoneNumber
          );
        }
      } else {
        const errorData = await response.json();
        console.error('Settings save failed:', errorData);
        toast.error(`Failed to save settings: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings - network error');
    }
  };

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.username || !newCustomer.password) {
      toast.error('Name, phone number, username, and password are required');
      return;
    }
    
    try {
      const response = await fetch('/api/admin/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });
      
      if (response.ok) {
        const result = await response.json();
        setCustomers(prev => [...prev, result.customer]);
        setNewCustomer({ name: '', email: '', phone: '', username: '', password: '' });
        toast.success('Customer added successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to add customer');
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      toast.error('Failed to add customer');
    }
  };

  const handleTestMessage = async () => {
    if (!testMessage.to || (!testMessage.body && testMessage.media.length === 0)) {
      toast.error('Recipient and message body or media are required');
      return;
    }
    
    // In a real app, you would upload media files to a server and get URLs
    // For this demo, we'll just use placeholder URLs if media is attached
    const mediaUrls = testMessage.media.length > 0 ? [
      'https://placehold.co/600x400',
      'https://placehold.co/800x600'
    ] : undefined;
    
    try {
      const result = await twilioClient.sendMessage(testMessage.to, testMessage.body, mediaUrls);
      if (result.success) {
        toast.success('Test message sent successfully');
        setTestMessage({ to: '', body: '', media: [] });
        setMediaPreviews([]);
      } else {
        toast.error('Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/customers?id=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setCustomers(prev => prev.filter(customer => customer.id !== id));
        toast.success('Customer deleted');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to delete customer');
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newFiles = Array.from(files);
    setTestMessage(prev => ({
      ...prev,
      media: [...prev.media, ...newFiles]
    }));
    
    // Create previews for images
    newFiles.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setMediaPreviews(prev => [...prev, e.target?.result as string]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeMedia = (index: number) => {
    setTestMessage(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{customers.length}</p>
                <p className="text-white text-sm">Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <MessageSquare className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">1.2s</p>
                <p className="text-white text-sm">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">99.9%</p>
                <p className="text-white text-sm">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/20 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-white text-sm">Support</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Twilio Settings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="h-5 w-5 text-blue-400" />
                Twilio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twilioAccountSid" className="text-white">Account SID</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
                  <Input
                    id="twilioAccountSid"
                    name="twilioAccountSid"
                    value={settings.twilioAccountSid}
                    onChange={handleSettingsChange}
                    placeholder="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twilioAuthToken" className="text-white">Auth Token</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
                  <Input
                    id="twilioAuthToken"
                    name="twilioAuthToken"
                    type="password"
                    value={settings.twilioAuthToken}
                    onChange={handleSettingsChange}
                    placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twilioPhoneNumber" className="text-white">Twilio Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
                  <Input
                    id="twilioPhoneNumber"
                    name="twilioPhoneNumber"
                    value={settings.twilioPhoneNumber}
                    onChange={handleSettingsChange}
                    placeholder="+1234567890"
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhookUrl" className="text-white">Webhook URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white h-4 w-4" />
                  <Input
                    id="webhookUrl"
                    name="webhookUrl"
                    value={settings.webhookUrl}
                    onChange={handleSettingsChange}
                    placeholder="https://yourdomain.com/webhook"
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-white"
                  />
                </div>
                <p className="text-sm text-white">
                  Configure this URL in your Twilio console to receive incoming messages
                </p>
              </div>
              
              <div className="text-sm text-white text-center">
                Settings are automatically saved as you type
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Add Customer Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-purple-400" />
                Add New Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-white">Name</Label>
                <Input
                  id="customerName"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  placeholder="John Doe"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerEmail" className="text-white">Email</Label>
                <Input
                  id="customerEmail"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  placeholder="john@example.com"
                  type="email"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerPhone" className="text-white">Phone Number</Label>
                <Input
                  id="customerPhone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  placeholder="+1234567890"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerUsername" className="text-white">Username</Label>
                <Input
                  id="customerUsername"
                  value={newCustomer.username}
                  onChange={(e) => setNewCustomer({...newCustomer, username: e.target.value})}
                  placeholder="johndoe"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerPassword" className="text-white">Password</Label>
                <Input
                  id="customerPassword"
                  type="password"
                  value={newCustomer.password}
                  onChange={(e) => setNewCustomer({...newCustomer, password: e.target.value})}
                  placeholder="Enter password"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-white"
                />
              </div>
              
              <Button 
                onClick={handleAddCustomer} 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
              >
                Add Customer
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Test Message Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MessageSquare className="h-5 w-5 text-green-400" />
              Send Test Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testTo" className="text-white">To</Label>
                <Input
                  id="testTo"
                  value={testMessage.to}
                  onChange={(e) => setTestMessage({...testMessage, to: e.target.value})}
                  placeholder="+1234567890"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="testBody" className="text-white">Message</Label>
                <Textarea
                  id="testBody"
                  value={testMessage.body}
                  onChange={(e) => setTestMessage({...testMessage, body: e.target.value})}
                  placeholder="Hello, this is a test message"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-white"
                />
              </div>
            </div>
            
            {/* Media attachment section */}
            <div className="space-y-2">
              <Label className="text-white">Attachments</Label>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById('test-media-input')?.click()}
                  className="border-slate-600 text-white hover:bg-slate-700 hover:border-slate-500 bg-slate-800"
                >
                  <Paperclip className="h-4 w-4 mr-2" />
                  Add Media
                </Button>
                <input
                  id="test-media-input"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                />
                
                {testMessage.media.length > 0 && (
                  <span className="text-sm text-white">
                    {testMessage.media.length} file(s) selected
                  </span>
                )}
              </div>
              
              {/* Media previews */}
              {mediaPreviews.length > 0 && (
                <div className="flex gap-2 overflow-x-auto py-2">
                  {mediaPreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={preview} 
                        alt="Preview" 
                        className="h-16 w-16 rounded-lg object-cover border border-slate-600"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white rounded-full p-0"
                        onClick={() => removeMedia(index)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleTestMessage}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
            >
              Send Test Message
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Customers List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-amber-400" />
              Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customers.length === 0 ? (
              <p className="text-white text-center py-4">No customers added yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-slate-800/50">
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Email</TableHead>
                    <TableHead className="text-white">Phone</TableHead>
                    <TableHead className="text-white">Username</TableHead>
                    <TableHead className="text-white">Added</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-slate-800/30">
                      <TableCell className="font-medium text-white">{customer.name}</TableCell>
                      <TableCell className="text-white">{customer.email}</TableCell>
                      <TableCell className="text-white">{customer.phone}</TableCell>
                      <TableCell className="text-white">{customer.username}</TableCell>
                      <TableCell className="text-white">{new Date(customer.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-500/20 text-white border-0">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="bg-red-500/20 text-white hover:bg-red-500/30 border-0"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;