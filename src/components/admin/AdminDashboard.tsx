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
import { Separator } from '@/components/ui/separator';
import { Customer, AdminSettings } from '@/lib/types';
import { twilioClient } from '@/lib/twilio-client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Settings, Users, MessageSquare, Zap, Shield, Key, Phone, Globe } from 'lucide-react';

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
    phone: ''
  });
  
  const [testMessage, setTestMessage] = useState({
    to: '',
    body: ''
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('twilioSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
    
    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('twilioSettings', JSON.stringify(settings));
    
    // Initialize Twilio client when settings change
    if (settings.twilioAccountSid && settings.twilioAuthToken && settings.twilioPhoneNumber) {
      twilioClient.initialize(
        settings.twilioAccountSid,
        settings.twilioAuthToken,
        settings.twilioPhoneNumber
      );
    }
  }, [settings]);

  // Save customers to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customers', JSON.stringify(customers));
  }, [customers]);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error('Name and phone number are required');
      return;
    }
    
    const customer: Customer = {
      id: `cust_${Date.now()}`,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      createdAt: new Date()
    };
    
    setCustomers(prev => [...prev, customer]);
    setNewCustomer({ name: '', email: '', phone: '' });
    toast.success('Customer added successfully');
  };

  const handleTestMessage = async () => {
    if (!testMessage.to || !testMessage.body) {
      toast.error('Recipient and message body are required');
      return;
    }
    
    try {
      const result = await twilioClient.sendMessage(testMessage.to, testMessage.body);
      if (result.success) {
        toast.success('Test message sent successfully');
        setTestMessage({ to: '', body: '' });
      } else {
        toast.error(`Failed to send message: ${result.error}`);
      }
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    }
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
    toast.success('Customer deleted');
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-blue-100">Manage Twilio settings and customers</p>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 p-2 rounded-lg">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{customers.length}</p>
                <p className="text-blue-200 text-sm">Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 p-2 rounded-lg">
                <MessageSquare className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">1.2s</p>
                <p className="text-purple-200 text-sm">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-green-500/20 p-2 rounded-lg">
                <Zap className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">99.9%</p>
                <p className="text-green-200 text-sm">Uptime</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/20 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-amber-200 text-sm">Support</p>
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
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="h-5 w-5 text-blue-400" />
                Twilio Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="twilioAccountSid" className="text-blue-100">Account SID</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="twilioAccountSid"
                    name="twilioAccountSid"
                    value={settings.twilioAccountSid}
                    onChange={handleSettingsChange}
                    placeholder="ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twilioAuthToken" className="text-blue-100">Auth Token</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="twilioAuthToken"
                    name="twilioAuthToken"
                    type="password"
                    value={settings.twilioAuthToken}
                    onChange={handleSettingsChange}
                    placeholder="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="twilioPhoneNumber" className="text-blue-100">Twilio Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="twilioPhoneNumber"
                    name="twilioPhoneNumber"
                    value={settings.twilioPhoneNumber}
                    onChange={handleSettingsChange}
                    placeholder="+1234567890"
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="webhookUrl" className="text-blue-100">Webhook URL</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    id="webhookUrl"
                    name="webhookUrl"
                    value={settings.webhookUrl}
                    onChange={handleSettingsChange}
                    placeholder="https://yourdomain.com/webhook"
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                  />
                </div>
                <p className="text-sm text-slate-400">
                  Configure this URL in your Twilio console to receive incoming messages
                </p>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Add Customer Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Users className="h-5 w-5 text-purple-400" />
                Add New Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerName" className="text-blue-100">Name</Label>
                <Input
                  id="customerName"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  placeholder="John Doe"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerEmail" className="text-blue-100">Email</Label>
                <Input
                  id="customerEmail"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  placeholder="john@example.com"
                  type="email"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerPhone" className="text-blue-100">Phone Number</Label>
                <Input
                  id="customerPhone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  placeholder="+1234567890"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              
              <Button 
                onClick={handleAddCustomer} 
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
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
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MessageSquare className="h-5 w-5 text-green-400" />
              Send Test Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="testTo" className="text-blue-100">To</Label>
                <Input
                  id="testTo"
                  value={testMessage.to}
                  onChange={(e) => setTestMessage({...testMessage, to: e.target.value})}
                  placeholder="+1234567890"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="testBody" className="text-blue-100">Message</Label>
                <Textarea
                  id="testBody"
                  value={testMessage.body}
                  onChange={(e) => setTestMessage({...testMessage, body: e.target.value})}
                  placeholder="Hello, this is a test message"
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
            </div>
            
            <Button 
              onClick={handleTestMessage}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
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
        <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-amber-400" />
              Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {customers.length === 0 ? (
              <p className="text-slate-400 text-center py-4">No customers added yet</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-slate-800/50">
                    <TableHead className="text-blue-200">Name</TableHead>
                    <TableHead className="text-blue-200">Email</TableHead>
                    <TableHead className="text-blue-200">Phone</TableHead>
                    <TableHead className="text-blue-200">Added</TableHead>
                    <TableHead className="text-blue-200">Status</TableHead>
                    <TableHead className="text-blue-200">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} className="hover:bg-slate-800/30">
                      <TableCell className="font-medium text-white">{customer.name}</TableCell>
                      <TableCell className="text-slate-300">{customer.email}</TableCell>
                      <TableCell className="text-slate-300">{customer.phone}</TableCell>
                      <TableCell className="text-slate-300">{customer.createdAt.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-0">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteCustomer(customer.id)}
                          className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border-0"
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