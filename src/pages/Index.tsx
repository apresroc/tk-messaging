import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    // In a real app, you would authenticate with a backend here
    // For demo purposes, we'll just navigate to the dashboard
    toast.success('Login successful');
    navigate('/conversations');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Twilio Messenger</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button variant="link" className="text-sm text-muted-foreground">
              Forgot password?
            </Button>
            <div className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button variant="link" className="p-0 h-auto text-sm">
                Sign up
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;