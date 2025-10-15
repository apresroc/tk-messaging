import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Conversation, Message } from '@/lib/types';
import ConversationList from './ConversationList';
import MessageThread from './MessageThread';
import { twilioClient } from '@/lib/twilio-client';
import { toast } from 'sonner';
import { MessageSquare, MessageSquarePlus, Settings, X, LogOut, Paperclip, Image, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
// Using window.location for navigation to support both environments

const UserDashboard = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessage, setNewMessage] = useState({
    phone: '',
    content: '',
    media: [] as File[]
  });

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize data
  useEffect(() => {
    // Initialize with mock conversations for demo
    setConversations([]);
    setMessages({});
  }, []);

  // If a phone is passed via query param, open New Message prefilled
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const phone = params.get('phone');
    if (phone) {
      setNewMessage(prev => ({ ...prev, phone }));
      setShowNewMessage(true);
    }
  }, []);

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id);
  };

  const handleBackToConversations = () => {
    setSelectedConversationId(null);
    if (isMobile) {
      if (typeof window !== "undefined") window.location.href = "/dashboard";
    }
  };

  const handleSendMessage = async (content: string, mediaUrls?: string[]) => {
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
    
    // Add media to message if provided
    if (mediaUrls && mediaUrls.length > 0) {
      newMessage.media = mediaUrls.map(url => ({
        url,
        type: url.includes('.mp4') || url.includes('.mov') ? 'video/mp4' : 'image/jpeg'
      }));
    }
    
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
            lastMessage: content || (mediaUrls && mediaUrls.length > 0 ? 'Sent media' : 'Empty message'),
            lastMessageTime: new Date(),
            unreadCount: 0
          } 
        : conv
    ));
    
    // Send via Twilio
    try {
      const result = await twilioClient.sendMessage(conversation.contactPhone, content, mediaUrls);
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

  const handleNavigateToSettings = () => {
    if (typeof window !== 'undefined') window.location.href = '/settings';
  };

  const handleLogout = () => {
    toast.success('You have been logged out');
    if (typeof window !== 'undefined') window.location.href = '/';
  };

  const handleAddNewMessage = () => {
    setShowNewMessage(true);
  };

  const handleSendNewMessage = async () => {
    if (!newMessage.phone || (!newMessage.content && newMessage.media.length === 0)) {
      toast.error('Phone number and message content or media are required');
      return;
    }
    
    // In a real app, you would upload media files to a server and get URLs
    // For this demo, we'll just use placeholder URLs if media is attached
    const mediaUrls = newMessage.media.length > 0 ? [
      'https://placehold.co/600x400',
      'https://placehold.co/800x600'
    ] : undefined;
    
    try {
      const result = await twilioClient.sendMessage(newMessage.phone, newMessage.content, mediaUrls);
      if (result.success) {
        toast.success('Message sent successfully');
        setNewMessage({ phone: '', content: '', media: [] });
        setShowNewMessage(false);
      } else {
        toast.error(`Failed to send message: ${result.error}`);
      }
    } catch (error) {
      toast.error('Failed to send message');
      console.error(error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    setNewMessage(prev => ({
      ...prev,
      media: [...prev.media, ...Array.from(files)]
    }));
  };

  const removeMedia = (index: number) => {
    setNewMessage(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  const selectedConversation = conversations.find(c => c.id === selectedConversationId) || null;
  const selectedMessages = selectedConversationId ? messages[selectedConversationId] || [] : [];

  return (
    <div className="space-y-0">
      {/* Header - Visible only on desktop */}
      {!isMobile && (
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Messaging Dashboard</h1>
            <p className="text-blue-200">Manage your conversations and contacts</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAddNewMessage}
              className="text-blue-200 hover:text-white hover:bg-white/10"
              title="New Message"
            >
              <MessageSquarePlus className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNavigateToSettings}
              className="text-blue-200 hover:text-white hover:bg-white/10"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-blue-200 hover:text-white hover:bg-white/10"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

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
              onClick={handleAddNewMessage}
              className="text-blue-200 hover:text-white hover:bg-white/10"
              title="New Message"
            >
              <MessageSquarePlus className="h-5 w-5" />
            </Button>
            
            {/* Settings Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNavigateToSettings}
              className="text-blue-200 hover:text-white hover:bg-white/10"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
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

      {/* Contacts are now managed on /customers via the header button */}

      {/* New Message Modal */}
      <AnimatePresence>
        {showNewMessage && (
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
                <CardTitle className="text-gray-900 dark:text-white">New Message</CardTitle>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowNewMessage(false)}
                  className="text-slate-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-blue-100">Phone Number</Label>
                  <Input
                    value={newMessage.phone}
                    onChange={(e) => setNewMessage({...newMessage, phone: e.target.value})}
                    placeholder="+1234567890"
                    className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-gray-900 dark:text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-blue-100">Message</Label>
                  <textarea
                    value={newMessage.content}
                    onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                    placeholder="Type your message here..."
                    className="w-full min-h-[120px] bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-md p-3"
                  />
                </div>
                
                {/* Media attachment section */}
                <div className="space-y-2">
                  <Label className="text-gray-700 dark:text-blue-100">Attachments</Label>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => document.getElementById('media-input')?.click()}
                      className="border-slate-300 dark:border-slate-700 text-gray-700 dark:text-slate-300"
                    >
                      <Paperclip className="h-4 w-4 mr-2" />
                      Add Media
                    </Button>
                    <input
                      id="media-input"
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileSelect}
                    />
                    
                    {newMessage.media.length > 0 && (
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {newMessage.media.length} file(s) selected
                      </span>
                    )}
                  </div>
                  
                  {/* Media previews */}
                  {newMessage.media.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-2">
                      {newMessage.media.map((file, index) => (
                        <div key={index} className="relative">
                          {file.type.startsWith('image/') ? (
                            <div className="h-16 w-16 rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden">
                              <Image className="h-full w-full p-2 text-slate-500 dark:text-slate-400" />
                            </div>
                          ) : file.type.startsWith('video/') ? (
                            <div className="h-16 w-16 rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                              <Video className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                            </div>
                          ) : (
                            <div className="h-16 w-16 rounded-lg border border-slate-300 dark:border-slate-600 overflow-hidden bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                              <Paperclip className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                            </div>
                          )}
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
              </CardContent>
              <div className="p-0 mt-6 flex flex-col sm:flex-row justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewMessage(false)}
                  className="w-full sm:w-auto border-slate-300 dark:border-slate-700 text-gray-700 dark:text-slate-300"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSendNewMessage}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                >
                  Send Message
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