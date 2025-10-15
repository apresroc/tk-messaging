import React, { useEffect, useMemo, useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Contact } from '@/lib/types';
import { toast } from 'sonner';
import { MessageSquare, Plus, Edit, Trash2, Search } from 'lucide-react';

const Customers = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [form, setForm] = useState<{ name: string; phone: string }>({ name: '', phone: '' });

  // Load and persist contacts in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('contacts');
    if (saved) {
      try {
        setContacts(JSON.parse(saved));
      } catch {
        // ignore parse errors
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const filtered = useMemo(() => {
    if (!search.trim()) return contacts;
    const term = search.toLowerCase();
    return contacts.filter(
      c =>
        (c.name || '').toLowerCase().includes(term) ||
        (c.phone || '').toLowerCase().includes(term)
    );
  }, [contacts, search]);

  const openAdd = () => {
    setEditingContact(null);
    setForm({ name: '', phone: '' });
    setIsDialogOpen(true);
  };

  const openEdit = (c: Contact) => {
    setEditingContact(c);
    setForm({ name: c.name || '', phone: c.phone || '' });
    setIsDialogOpen(true);
  };

  const saveContact = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Name and phone are required');
      return;
    }
    if (editingContact) {
      setContacts(prev =>
        prev.map(c =>
          c.id === editingContact.id ? { ...c, name: form.name.trim(), phone: form.phone.trim() } : c
        )
      );
      toast.success('Contact updated');
    } else {
      const newContact: Contact = {
        id: `cont_${Date.now()}`,
        name: form.name.trim(),
        phone: form.phone.trim(),
      };
      setContacts(prev => [newContact, ...prev]);
      toast.success('Contact added');
    }
    setIsDialogOpen(false);
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
    toast.success('Contact deleted');
  };

  const messageContact = (phone: string) => {
    if (typeof window !== 'undefined') {
      window.location.href = `/dashboard?phone=${encodeURIComponent(phone)}`;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 text-white">
      <Header />
      <div className="container py-6 flex-1">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-white">Contacts</CardTitle>
            <div className="w-full sm:w-auto flex gap-2">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                <Input
                  placeholder="Search contacts..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-slate-900/60 border-slate-700 text-white placeholder:text-slate-400"
                />
              </div>
              <Button onClick={openAdd} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filtered.length === 0 ? (
              <div className="text-center py-10 text-blue-200">
                <p className="mb-4">No contacts found</p>
                <Button onClick={openAdd} variant="outline" className="border-slate-700 text-white hover:bg-slate-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first contact
                </Button>
              </div>
            ) : (
              <div className="rounded-md border border-white/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow>
                      <TableHead className="text-blue-200">Name</TableHead>
                      <TableHead className="text-blue-200">Phone</TableHead>
                      <TableHead className="text-right text-blue-200">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map(c => (
                      <TableRow key={c.id} className="hover:bg-white/5">
                        <TableCell className="text-white">{c.name || 'Unnamed'}</TableCell>
                        <TableCell className="text-blue-200">{c.phone}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-200 hover:text-white hover:bg-white/10"
                              onClick={() => messageContact(c.phone)}
                              title="Message"
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-blue-200 hover:text-white hover:bg-white/10"
                              onClick={() => openEdit(c)}
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-300 hover:text-white hover:bg-red-500/20"
                              onClick={() => deleteContact(c.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-white">
              {editingContact ? 'Edit Contact' : 'Add Contact'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-blue-100">Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="John Doe"
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-blue-100">Phone Number</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1234567890"
                className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              className="border-slate-300 dark:border-slate-700 text-gray-700 dark:text-slate-300"
            >
              Cancel
            </Button>
            <Button
              onClick={saveContact}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              {editingContact ? 'Save Changes' : 'Add Contact'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;