"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Users, UserPlus, Phone, Mail, Edit, ArrowLeft } from 'lucide-react';
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

const ContactsPage = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Load contacts from localStorage (in a real app, this would be from an API)
  useEffect(() => {
    const savedContacts = localStorage.getItem('contacts');
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm) ||
    (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );


  const handleDeleteContact = (contactId: string) => {
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    setContacts(updatedContacts);
    localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    toast.success('Contact deleted successfully');
  };

  const handleEditContact = (contact: Contact) => {
    // Navigate to edit page with contact data
    router.push(`/contacts/edit/${contact.id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold">Contacts</h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => router.push('/contacts/add')}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="text-blue-200 hover:text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="bg-slate-800/50 border-slate-700/50 mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 pl-10"
              />
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </CardContent>
        </Card>

        {/* Contacts List */}
        <Card className="bg-slate-800/50 border-slate-700/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Users className="h-5 w-5 text-blue-400" />
              All Contacts ({filteredContacts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredContacts.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-400 mb-4">
                  {searchTerm ? 'No contacts found matching your search.' : 'No contacts added yet.'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => router.push('/contacts/add')}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Your First Contact
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-white">Name</TableHead>
                    <TableHead className="text-white">Phone</TableHead>
                    <TableHead className="text-white">Email</TableHead>
                    <TableHead className="text-white">Status</TableHead>
                    <TableHead className="text-white">Messages</TableHead>
                    <TableHead className="text-white">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContacts.map((contact) => (
                    <TableRow key={contact.id} className="border-slate-700">
                      <TableCell className="font-medium text-white">{contact.name}</TableCell>
                      <TableCell className="text-white">{contact.phone}</TableCell>
                      <TableCell className="text-white">{contact.email || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={contact.isOnline ? "bg-green-500/20 text-green-300 border-0" : "bg-slate-500/20 text-slate-300 border-0"}
                        >
                          {contact.isOnline ? 'Online' : 'Offline'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white">{contact.messageCount || 0}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditContact(contact)}
                            className="border-slate-600 text-white hover:bg-slate-700"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteContact(contact.id)}
                            className="bg-red-500/20 text-red-300 hover:bg-red-500/30 border-0"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactsPage;
