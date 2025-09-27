import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { MessageSquare, Shield, Smartphone, Zap } from 'lucide-react';

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
    
    // Check for admin credentials
    if (email === 'sysad@techkrafted.com' && password === '123') {
      toast.success('Admin login successful');
      navigate('/admin');
      return;
    }
    
    // Check for user credentials
    if (email === 'apresroc@gmail.com' && password === '123') {
      toast.success('User login successful');
      navigate('/conversations');
      return;
    }
    
    // For demo purposes, any other valid login goes to conversations
    toast.success('Login successful');
    navigate('/conversations');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Hero Section */}
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="hidden lg:block">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Twilio Messaging <span className="text-primary">Platform</span>
              </h1>
              <p className="text-xl text-gray-600">
                Streamline your customer communication with our powerful, easy-to-use messaging platform.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">SMS Messaging</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Real-time Updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Secure Platform</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">Easy Integration</span>
                </div>
              </div>
              
              <div className="pt-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border">
                  <blockquote className="text-lg italic text-gray-700">
                    "This platform has transformed how we communicate with our customers. The automation features save us hours each week."
                  </blockquote>
                  <div className="mt-4 flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                    <div className="ml-4">
                      <p className="font-semibold">Alex Johnson</p>
                      <p className="text-gray-600">Customer Success Manager</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full max-w-md mx-auto">
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
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
                      className="py-6"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password">Password</Label>
                      <Button variant="link" className="p-0 h-auto text-sm text-primary">
                        Forgot?
                      </Button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="py-6"
                    />
                  </div>
                  <Button type="submit" className="w-full py-6 text-base">
                    Sign In
                  </Button>
                </form>
                
                {/* Demo credentials note */}
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Demo Credentials:</strong><br />
                    Admin: sysad@techkrafted.com / 123<br />
                    User: apresroc@gmail.com / 123<br />
                    Other: Any other valid email/password
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-4">
                <div className="text-sm text-muted-foreground">
                  Don't have an account?{' '}
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Sign up
                  </Button>
                </div>
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button variant="outline" className="py-5">
                    Google
                  </Button>
                  <Button variant="outline" className="py-5">
                    Microsoft
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="py-6">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;