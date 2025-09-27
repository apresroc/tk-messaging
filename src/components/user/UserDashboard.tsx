import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Contact, Conversation, Message } from '@/lib/types';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import { twilioClient } from '@/lib/twilio-client';
import { toast } from 'sonner';

const UserDashboard = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: ''
  });

  // Load data from localStorage
  useEffect(() => {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
    
    // Initialize with mock conversations for demo
    const mockConversations: Conversation[] = [
      {
        id: 'conv_1',
        contactId: 'cont_1',
        contactName: 'John Smith',
        contactPhone: '+1234567890',
        lastMessage: 'Hello, I have a question about my order',
        lastMessageTime: new Date(Date.now() - 3600000),
        unreadCount: 2
      },
      {
        id: 'conv_2',
        contactId: 'cont_2',
        contactName: 'Sarah Johnson',
        contactPhone: '+1234567891',
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
          contactId: 'cont_1',
          content: 'Hello, I have a question about my order',
          direction: 'inbound',
          timestamp: new Date(Date.now() - 3600000),
          status: 'delivered'
        },
        {
          id: 'msg_2',
          contactId: 'cont_1',
          content: 'Sure, I\'d be happy to help. What is your order number?',
          direction: 'outbound',
          timestamp: new Date(Date.now() - 3500000),
          status: 'delivered'
        },
        {
          id: 'msg_3',
          contactId: 'cont_1',
          content: 'It\'s #12345. I haven\'t received a shipping confirmation yet.',
          direction: 'inbound',
          timestamp: new Date(Date.now() - 3400000),
          status: 'delivered'
        }
      ],
      conv_2: [
        {
          id: 'msg_4',
          contactId: 'cont_2',
          content: 'I just wanted to say thanks for the quick response yesterday!',
          direction: 'inbound',
          timestamp: new Date(Date.now() - 86400000),
          status: 'delivered'
        },
        {
          id: 'msg_5',
          contactId: 'cont_2',
          content: 'You\'re welcome! Is there anything else I can help with?',
          direction: 'outbound',
          timestamp: new Date(Date.now() - 86300000),
          status: 'delivered'
        },
        {
          id: 'msg_6',
          contactId: 'cont_2',
          content: 'Thanks for the quick response!',
          direction: 'inbound',
          timestamp: new Date(Date.now() - 86200000),
          status: 'delivered'
        }
      ]
    };
    
    setMessages(mockMessages);
  }, []);

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error('Name and phone number are required');
      return;
    }
    
    const contact: Contact = {
      id: `cont_${Date.now()}`,
      name: newContact.name,
      phone: newContact.phone
    };
    
    setContacts(prev => [...prev, contact]);
    setNewContact({ name: '', phone: '' });
    toast.success('Contact added successfully');
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
      contactId: conversation.contactId,
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
      const result = await twilioClient.sendMessage(conversation.contactPhone, content);
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
        <p className="text-muted-foreground">Manage your conversations</p>
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
          <CardTitle>Add New Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Name</Label>
              <Input
                id="contactName"
                value={newContact.name}
                onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number</Label>
              <Input
                id="contactPhone"
                value={newContact.phone}
                onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                placeholder="+1234567890"
              />
            </div>
          </div>
          
          <Button onClick={handleAddContact}>Add Contact</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDashboard;