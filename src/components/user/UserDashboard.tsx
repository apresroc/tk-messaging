import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Contact, Conversation, Message } from '@/lib/types';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import { twilioClient } from '@/lib/twilio-client';
import { toast } from 'sonner';
import { Plus, MessageSquare, Settings, UserPlus, ArrowLeft, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserDashboard = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: ''
  });
  const [showAddContact, setShowAddContact] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      },
      {
        id: 'conv_3',
        contactId: 'cont_3',
        contactName: 'Mike Wilson',
        contactPhone: '+1234567892',
        lastMessage: 'When will my package arrive?',
        lastMessageTime: new Date(Date.now() - 7200000),
        unreadCount: 1
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
        }
      ],
      conv_3: [
        {
          id: 'msg_6',
          contactId: 'cont_3',
          content: 'When will my package arrive?',
          direction: 'inbound',
          timestamp: new Date(Date.now() - 7200000),
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
    setShowAddContact(false);
    toast.success('Contact added successfully');
  };

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
  };

  const handleBackToConversations = () => {
    setSelectedConversationId(null);
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
        toast.success('Message sent successfully');
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
    <div className="space-y-0">
      {/* Action Bar - Only visible on mobile */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold text-white">Messages</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Add Message Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {/* Add message functionality */}}
              className="text-blue-200 hover:text-white hover:bg-white/10"
              title="New Message"
            >
              <Plus className="h-5 w-5" />
            </Button>
            
            {/* Add Contact Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowAddContact(true)}
              className="text-blue-200 hover:text-white hover:bg-white/10"
              title="Add Contact"
            >
              <UserPlus className="h-5 w-5" />
            </Button>
            
            {/* Settings Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {/* Navigate to settings */}}
              className="text-blue-200 hover:text-white hover:bg-white/10"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Back Button */}
      {isMobile && selectedConversationId && (
        <div className="lg:hidden mb-4">
          <Button 
            onClick={handleBackToConversations}
            variant="outline"
            className="w-full border-white/20 text-blue-100 hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Conversations
          </Button>
        </div>
      )}

      {/* Main Content - Same for both mobile and desktop */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Conversations List - Always visible on desktop, hidden on mobile when conversation is selected */}
        <div className={`${isMobile && selectedConversationId ? 'hidden' : 'block'} lg:col-span-1`}>
          <ConversationList 
            conversations={conversations} 
            onSelectConversation={handleSelectConversation} 
          />
        </div>
        
        {/* Message Thread - Hidden on mobile when no conversation is selected */}
        <div className={`${isMobile && !selectedConversationId ? 'hidden' : 'block'} lg:col-span-2`}>
          {selectedConversationId ? (
            <MessageThread 
              conversation={selectedConversation}
              messages={selectedMessages}
              onSendMessage={handleSendMessage}
              onBack={handleBackToConversations}
            />
          ) : (
            <Card className="h-full flex items-center justify-center bg-white/10 backdrop-blur-sm border-white/20">
              <div className="text-center p-8 text-blue-200">
                <MessageSquare className="mx-auto h-16 w-16 mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-white mb-2">No conversation selected</h3>
                <p className="mb-4">Select a conversation to start messaging</p>
              </div>
            </Card>
          )}
        </div>
      </motion.div>

      {/* Add Contact Modal - Mobile Optimized */}
      <AnimatePresence>
        {showAddContact && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 w-full max-w-md mx-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <CardHeader className="p-0 mb-4 flex flex-row items-center justify-between">
                <CardTitle className="text-gray-900 dark:text-white">Add New Contact</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowAddContact(false)}
                  className="text-slate-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-blue-100">Name</Label>
                  <Input
                    value={newContact.name}
                    onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    placeholder="John Doe"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-blue-100">Phone Number</Label>
                  <Input
                    value={newContact.phone}
                    onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    placeholder="+1234567890"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-gray-900 dark:text-white"
                  />
                </div>
              </CardContent>
              <div className="p-0 mt-6 flex flex-col sm:flex-row justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddContact(false)}
                  className="w-full sm:w-auto border-slate-300 dark:border-slate-700 text-gray-700 dark:text-slate-300"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddContact}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  Add Contact
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;