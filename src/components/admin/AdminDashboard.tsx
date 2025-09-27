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
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage Twilio settings and customers</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Twilio Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Twilio Settings</CardTitle>
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
            
            <Button className="w-full">Save Settings</Button>
          </CardContent>
        </Card>
        
        {/* Add Customer Card */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Name</Label>
              <Input
                id="customerName"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerEmail">Email</Label>
              <Input
                id="customerEmail"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                placeholder="john@example.com"
                type="email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone Number</Label>
              <Input
                id="customerPhone"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                placeholder="+1234567890"
              />
            </div>
            
            <Button onClick={handleAddCustomer} className="w-full">Add Customer</Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Test Message Card */}
      <Card>
        <CardHeader>
          <CardTitle>Send Test Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testTo">To</Label>
              <Input
                id="testTo"
                value={testMessage.to}
                onChange={(e) => setTestMessage({...testMessage, to: e.target.value})}
                placeholder="+1234567890"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="testBody">Message</Label>
              <Textarea
                id="testBody"
                value={testMessage.body}
                onChange={(e) => setTestMessage({...testMessage, body: e.target.value})}
                placeholder="Hello, this is a test message"
              />
            </div>
          </div>
          
          <Button onClick={handleTestMessage}>Send Test Message</Button>
        </CardContent>
      </Card>
      
      {/* Customers List */}
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No customers added yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">Active</Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => handleDeleteCustomer(customer.id)}
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
    </div>
  );
};

export default AdminDashboard;