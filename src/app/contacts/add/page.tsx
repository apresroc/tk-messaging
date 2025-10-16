"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, ArrowLeft, Phone, Mail, User } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  lastSeen?: string;
  isOnline?: boolean;
  messageCount?: number;
}

const AddContactPage = () => {
  const [contact, setContact] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!contact.name || !contact.phone) {
      toast.error('Name and phone number are required');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(contact.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    // Validate email if provided
    if (contact.email && !contact.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Create new contact
    const newContact: Contact = {
      id: `contact_${Date.now()}`,
      name: contact.name,
      phone: contact.phone,
      email: contact.email || undefined,
      isOnline: false,
      messageCount: 0,
      lastSeen: new Date().toISOString()
    };

    // Get existing contacts from localStorage
    const existingContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
    
    // Check if contact with same phone already exists
    const existingContact = existingContacts.find((c: Contact) => c.phone === contact.phone);
    if (existingContact) {
      toast.error('A contact with this phone number already exists');
      return;
    }

    // Add new contact
    const updatedContacts = [...existingContacts, newContact];
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));

    toast.success('Contact added successfully!');
    router.push('/contacts');
  };

  const handleInputChange = (field: string, value: string) => {
    setContact(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-blue-200 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <UserPlus className="h-8 w-8 text-blue-400" />
              <h1 className="text-3xl font-bold">Add New Contact</h1>
            </div>
          </div>

          {/* Add Contact Form */}
          <Card className="bg-slate-800/50 border-slate-700/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5 text-blue-400" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white font-medium">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      value={contact.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter full name"
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white font-medium">Phone Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={contact.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1234567890"
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">Email Address (Optional)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      value={contact.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="contact@example.com"
                      className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1 border-slate-600 text-white hover:bg-slate-700 bg-slate-800"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Contact
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddContactPage;
