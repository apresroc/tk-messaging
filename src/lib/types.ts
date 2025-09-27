export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
}

export interface AdminSettings {
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
  webhookUrl: string;
}

export interface Message {
  id: string;
  customerId: string;
  content: string;
  direction: 'inbound' | 'outbound';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'failed';
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
}