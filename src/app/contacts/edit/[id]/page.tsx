"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, ArrowLeft, Phone, Mail, User } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter, useParams } from 'next/navigation';

interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  lastSeen?: string;
  isOnline?: boolean;
  messageCount?: number;
}

const EditContactPage = () => {
  const [contact, setContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const contactId = params.id as string;

  // Load contact data on component mount
  useEffect(() => {
    const loadContact = () => {
      try {
        const savedContacts = localStorage.getItem('contacts');
        if (savedContacts) {
          const contacts = JSON.parse(savedContacts);
          const foundContact = contacts.find((c: Contact) => c.id === contactId);
          
          if (foundContact) {
            setContact(foundContact);
            setFormData({
              name: foundContact.name,
              phone: foundContact.phone,
              email: foundContact.email || ''
            });
          } else {
            toast.error('Contact not found');
            router.push('/contacts');
          }
        } else {
          toast.error('No contacts found');
          router.push('/contacts');
        }
      } catch (error) {
        console.error('Error loading contact:', error);
        toast.error('Error loading contact');
        router.push('/contacts');
      } finally {
        setIsLoading(false);
      }
    };

    loadContact();
  }, [contactId, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      toast.error('Name and phone number are required');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    // Validate email if provided
    if (formData.email && !formData.email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      // Get existing contacts
      const existingContacts = JSON.parse(localStorage.getItem('contacts') || '[]');
      
      // Check if another contact with same phone already exists (excluding current contact)
      const duplicateContact = existingContacts.find((c: Contact) => 
        c.phone === formData.phone && c.id !== contactId
      );
      
      if (duplicateContact) {
        toast.error('A contact with this phone number already exists');
        return;
      }

      // Update the contact
      const updatedContacts = existingContacts.map((c: Contact) => 
        c.id === contactId 
          ? { 
              ...c, 
              name: formData.name, 
              phone: formData.phone, 
              email: formData.email || undefined 
            }
          : c
      );

      localStorage.setItem('contacts', JSON.stringify(updatedContacts));
      toast.success('Contact updated successfully!');
      router.push('/contacts');
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Error updating contact');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-200">Loading contact...</p>
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Contact not found</p>
          <Button onClick={() => router.push('/contacts')} className="bg-blue-500 hover:bg-blue-600 text-white">
            Back to Contacts
          </Button>
        </div>
      </div>
    );
  }

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
              <Edit className="h-8 w-8 text-blue-400" />
              <h1 className="text-3xl font-bold">Edit Contact</h1>
            </div>
          </div>

          {/* Edit Contact Form */}
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
                      value={formData.name}
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
                      value={formData.phone}
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
                      value={formData.email}
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
                    <Edit className="h-4 w-4 mr-2" />
                    Update Contact
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

export default EditContactPage;
