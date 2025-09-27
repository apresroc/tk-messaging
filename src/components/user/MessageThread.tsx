import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageCircle, Phone, Mail, MoreHorizontal, ArrowLeft } from 'lucide-react';
import { Message, Conversation } from '@/lib/types';
import { twilioClient } from '@/lib/twilio-client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const MessageThread = ({ 
  conversation,
  messages,
  onSendMessage,
  onBack
}: { 
  conversation: Conversation | null;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onBack?: () => void;
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !conversation) return;
    
    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
      <CardHeader className="border-b border-slate-200 dark:border-slate-700/50 p-4">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="lg:hidden text-slate-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="border-2 border-slate-300 dark:border-slate-600">
            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              {conversation.contactName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{conversation.contactName}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Phone className="h-3 w-3 text-slate-400 dark:text-slate-500" />
              <span className="text-sm text-slate-500 dark:text-slate-400 truncate">{conversation.contactPhone}</span>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
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
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
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
        <div className="flex w-full gap-2">
          <Textarea
            placeholder="Type a message..."
            className="min-h-[44px] max-h-[120px] resize-none bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-slate-400"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <Button 
            size="icon"
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MessageThread;