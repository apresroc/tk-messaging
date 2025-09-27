import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, MessageCircle, Clock, Phone } from 'lucide-react';
import { Conversation } from '@/lib/types';
import { motion } from 'framer-motion';

const ConversationList = ({ 
  conversations, 
  onSelectConversation 
}: { 
  conversations: Conversation[]; 
  onSelectConversation: (id: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>(conversations);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredConversations(conversations);
      return;
    }

    const filtered = conversations.filter(conv => 
      conv.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.contactPhone.includes(searchTerm) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setFilteredConversations(filtered);
  }, [searchTerm, conversations]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      return 'Just now';
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card className="h-full flex flex-col bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Conversations</CardTitle>
          <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
            {conversations.length}
          </Badge>
        </div>
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-0">
        {filteredConversations.length === 0 ? (
          <motion.div 
            className="text-center py-8 text-slate-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <MessageCircle className="mx-auto h-12 w-12 opacity-50 mb-4" />
            <p className="mt-2">No conversations found</p>
          </motion.div>
        ) : (
          <div className="divide-y divide-slate-700/50">
            {filteredConversations.map((conversation, index) => (
              <motion.div 
                key={conversation.id}
                className="p-4 hover:bg-slate-800/50 cursor-pointer transition-all duration-200 group"
                onClick={() => onSelectConversation(conversation.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="border-2 border-slate-600 group-hover:border-blue-500 transition-colors">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                      {conversation.contactName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-white truncate">{conversation.contactName}</h3>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {formatTime(conversation.lastMessageTime)}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 truncate mt-1">
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span className="text-xs text-slate-400">
                          {conversation.contactPhone}
                        </span>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <Badge className="bg-blue-500/20 text-blue-300 border-0">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConversationList;