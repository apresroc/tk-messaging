import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Customer, Conversation, Message } from '@/lib/types';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import { twilioClient } from '@/lib/twilio-client';
import { toast } from 'sonner';

const UserDashboard = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: ''
  });

  // Load data from localStorage
  useEffect(() => {
    const savedCustomers = localStorage.getItem('customers');
    if (savedCustomers) {
      setCustomers(JSON.parse(savedCustomers));
    }
    
    // Initialize with mock conversations for demo
    const mockConversations: Conversation[] = [
      {
        id: 'conv_1',
        customerId: 'cust_1',
        customerName: 'John Smith',
        customerPhone: '+1234567890',
        lastMessage: 'Hello, I have a question about my order',
        lastMessageTime: new Date(Date.now() - 3600000),
        unreadCount: 2
      },
      {
        id: 'conv_2',
        customerId: 'cust_2',
        customerName: 'Sarah Johnson',
        customerPhone: '+1234567891',
        lastMessage: 'Thanks for the quick response!',
        lastMessageTime: new Date(Date.now() - 86400000),
        unreadCount: 0
      }
    ];
    
    setConversations(mockConversations);
    
    // Initialize with mock messages for demo
    const mockMessages: Record<string, Message[]> = {
      conv_1: [
        {
          id: 'msg_1',
          customerId: 'cust_1',
          content: 'Hello, I have a question about my order',
          direction: 'inbound',
          timestamp: new Date(Date.now() - 3600000),
          status: 'delivered'
        },
        {
          id: 'msg_2',
          customerId: 'cust_1',
          content: 'Sure, I\'d be happy to help. What is your order number?',
          direction: 'outbound',
          timestamp: new Date(Date.now() - 3500000),
          status: 'delivered'
        },
        {
          id: 'msg_3',
          customerId: 'cust_1',
          content: 'It\'s #12345. I haven\'t received a shipping confirmation yet.',
          direction: 'inbound',
          timestamp: new Date(Date.now() - 3400000),
          status: 'delivered'
        }
      ],
      conv_2: [
        {
          id: 'msg_4',
          customerId: 'cust_2',
          content: 'I just wanted to say thanks for the quick response yesterday!',
          direction: 'inbound',
          timestamp: new Date(Date.now() - 86400000),
          status: 'delivered'
        },
        {
          id: 'msg_5',
          customerId: 'cust_2',
          content: 'You\'re welcome! Is there anything else I can help with?',
          direction: 'outbound',
          timestamp: new Date(Date.now() - 86300000),
          status: 'delivered'
        },
        {
          id: 'msg_6',
          customerId: 'cust_2',
          content: 'Thanks for the quick response!',
          direction: 'inbound',
          timestamp: new Date(Date.now() - 86200000),
          status: 'delivered'
        }
      ]
    };
    
    setMessages(mockMessages);
  }, []);

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

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
  };

  const handleSendMessage = async (content: string) => {
    if (!selectedConversationId) return;
    
    const conversation = conversations.find(c => c.id === selectedConversationId);
    if (!conversation) return;
    
    // Create new message
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      customerId: conversation.customerId,
      content,
      direction: 'outbound',
      timestamp: new Date(),
      status: 'sent'
    };
    
    // Update messages state
    setMessages(prev => ({
      ...prev,
      [selectedConversationId]: [...(prev[selectedConversationId] || []), newMessage]
    }));
    
    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversationId 
        ? { 
            ...conv, 
            lastMessage: content,
            lastMessageTime: new Date(),
            unreadCount: 0
          } 
        : conv
    ));
    
    // Send via Twilio
    try {
      const result = await twilioClient.sendMessage(conversation.customerPhone, content);
      if (result.success) {
        // Update message status
        setMessages(prev => ({
          ...prev,
          [selectedConversationId]: prev[selectedConversationId].map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          )
        }));
      } else {
        // Update message status to failed
        setMessages(prev => ({
          ...prev,
          [selectedConversationId]: prev[selectedConversationId].map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'failed' } : msg
          )
        }));
        toast.error(`Failed to send message: ${result.error}`);
      }
    } catch (error) {
      // Update message status to failed
      setMessages(prev => ({
        ...prev,
        [selectedConversationId]: prev[selectedConversationId].map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'failed' } : msg
        )
      }));
      toast.error('Failed to send message');
      console.error(error);
    }
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId) || null;
  const selectedMessages = selectedConversationId ? messages[selectedConversationId] || [] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Messaging Dashboard</h1>
        <p className="text-muted-foreground">Manage your customer conversations</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ConversationList 
            conversations={conversations} 
            onSelectConversation={handleSelectConversation} 
          />
        </div>
        
        <div className="lg:col-span-2">
          <MessageThread 
            conversation={selectedConversation}
            messages={selectedMessages}
            onSendMessage={handleSendMessage}
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Add New Customer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          </div>
          
          <Button onClick={handleAddCustomer}>Add Customer</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;