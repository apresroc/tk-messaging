import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageCircle, Mail, MoreHorizontal, ArrowLeft, Trash2, UserPlus, User, Paperclip, Image, Video } from 'lucide-react';
import { Message, Conversation } from '@/lib/types';
import { twilioClient } from '@/lib/twilio-client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const MessageThread = ({ 
  conversation,
  messages,
  onSendMessage,
  onBack,
  contacts = []
}: { 
  conversation: Conversation | null;
  messages: Message[];
  onSendMessage: (content: string, mediaUrl?: string[]) => void;
  onBack?: () => void;
  contacts?: any[];
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if ((!newMessage.trim() && mediaFiles.length === 0) || !conversation) return;
    
    // In a real app, you would upload media files to a server and get URLs
    // For this demo, we'll just use placeholder URLs
    const mediaUrls = mediaFiles.length > 0 ? [
      'https://placehold.co/600x400',
      'https://placehold.co/800x600'
    ] : undefined;
    
    onSendMessage(newMessage.trim(), mediaUrls);
    setNewMessage('');
    setMediaFiles([]);
    setMediaPreviews([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newFiles = Array.from(files);
    setMediaFiles(prev => [...prev, ...newFiles]);
    
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
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteConversation = () => {
    if (!conversation) return;
    toast.success(`Conversation with ${conversation.contactName} deleted`);
    // In a real app, this would delete the conversation from the backend
    if (onBack) onBack();
  };


  const handleAddToContacts = () => {
    if (!conversation) return;
    
    // Check if contact already exists
    const existingContact = contacts.find(contact => contact.phone === conversation.contactPhone);
    if (existingContact) {
      toast.info(`${conversation.contactName} is already in your contacts`);
      return;
    }
    
    // Add to contacts
    const newContact = {
      id: `contact_${Date.now()}`,
      name: conversation.contactName,
      phone: conversation.contactPhone,
      email: ''
    };
    
    const updatedContacts = [...contacts, newContact];
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    toast.success(`${conversation.contactName} added to contacts`);
  };

  // Check if contact already exists
  const isContactAlreadyAdded = conversation ? 
    contacts.some(contact => contact.phone === conversation.contactPhone) : false;

  if (!conversation) {
    return (
      <Card className="h-full flex items-center justify-center bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
        <motion.div 
          className="text-center p-8 text-slate-500 dark:text-slate-400"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <MessageCircle className="mx-auto h-16 w-16 mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No conversation selected</h3>
          <p>Select a conversation from the list to start messaging</p>
        </motion.div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/50">
      {/* Header with back button */}
      <CardHeader className="border-b border-slate-200 dark:border-slate-700/50 p-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack}
              className="text-slate-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white lg:hidden"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <Avatar className="border-2 border-slate-300 dark:border-slate-600">
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {conversation.contactName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{conversation.contactName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-slate-500 dark:text-slate-400 truncate">{conversation.contactPhone}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-slate-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleDeleteConversation}>
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Conversation</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleAddToContacts}
                disabled={isContactAlreadyAdded}
                className={isContactAlreadyAdded ? "opacity-50 cursor-not-allowed" : ""}
              >
                <User className="mr-2 h-4 w-4" />
                <span>{isContactAlreadyAdded ? "Already in Contacts" : "Add to Contacts"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <motion.div 
            className="flex items-center justify-center h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-slate-500 dark:text-slate-400">No messages yet. Start a conversation!</p>
          </motion.div>
        ) : (
          messages.map((message, index) => (
            <motion.div 
              key={message.id}
              className={`flex ${message.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div 
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-2 ${
                  message.direction === 'outbound' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none' 
                    : 'bg-slate-100 dark:bg-slate-700/50 text-gray-900 dark:text-slate-200 rounded-bl-none'
                }`}
              >
                {message.content && (
                  <p className="whitespace-pre-wrap break-words">{message.content}</p>
                )}
                
                {/* Media previews */}
                {message.media && message.media.length > 0 && (
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {message.media.map((media, idx) => (
                      <div key={idx} className="relative">
                        {media.type.startsWith('image/') ? (
                          <img 
                            src={media.url} 
                            alt="Attachment" 
                            className="rounded-lg max-h-40 object-cover"
                          />
                        ) : media.type.startsWith('video/') ? (
                          <div className="relative">
                            <video 
                              src={media.url} 
                              className="rounded-lg max-h-40 object-cover"
                            />
                            <Video className="absolute inset-0 m-auto h-8 w-8 text-white opacity-70" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 p-2 bg-black/10 rounded-lg">
                            <Paperclip className="h-4 w-4" />
                            <span className="text-sm truncate">Attachment</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className={`text-xs mt-1 flex items-center gap-2 ${
                  message.direction === 'outbound' ? 'text-blue-100/70' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  {message.direction === 'outbound' && (
                    <span className="flex items-center gap-1">
                      {message.status === 'sent' && '✓'}
                      {message.status === 'delivered' && '✓✓'}
                      {message.status === 'failed' && '⚠️'}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>
      
      <CardFooter className="border-t border-slate-200 dark:border-slate-700/50 p-4">
        <div className="flex w-full flex-col gap-2">
          {/* Media previews */}
          {mediaPreviews.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {mediaPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img 
                    src={preview} 
                    alt="Preview" 
                    className="h-16 w-16 rounded-lg object-cover border border-slate-300 dark:border-slate-600"
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
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
            >
              <Paperclip className="h-4 w-4" />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
              />
            </Button>
            
            <Textarea
              placeholder="Type a message..."
              className="min-h-[44px] max-h-[120px] resize-none bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-slate-400 flex-1"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            
            <Button 
              size="icon"
              onClick={handleSend}
              disabled={!newMessage.trim() && mediaFiles.length === 0}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MessageThread;