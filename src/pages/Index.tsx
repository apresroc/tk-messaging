import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { MadeWithDyad } from "@/components/made-with-dyad";
import { MessageSquare, Shield, Smartphone, Zap, Users, Settings, ArrowRight, Star, CheckCircle, Play } from 'lucide-react';
import { motion } from 'framer-motion';

const Index = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    if (email === 'sysad@techkrafted.com' && password === '123') {
      toast.success('Admin login successful');
      navigate('/admin');
      return;
    }
    
    if (email === 'apresroc@gmail.com' && password === '123') {
      toast.success('User login successful');
      navigate('/conversations');
      return;
    }
    
    toast.success('Login successful');
    navigate('/conversations');
  };

  const features = [
    {
      icon: <Smartphone className="h-6 w-6" />,
      title: "Instant Messaging",
      description: "Real-time SMS conversations with your customers"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Deliver messages in milliseconds"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Bank-grade Security",
      description: "End-to-end encrypted communications"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Smart Contacts",
      description: "AI-powered contact management"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      content: "This platform transformed our customer support. Response times dropped by 80% and satisfaction scores skyrocketed.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "E-commerce Owner",
      content: "The automation features saved us 20+ hours per week. Now we focus on growing our business instead of managing messages.",
      rating: 5
    },
    {
      name: "Alex Rodriguez",
      role: "Customer Success",
      content: "Our team collaboration improved dramatically. The shared inbox and assignment features are game-changers.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-2/3 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <div className="container mx-auto flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
              TK Messaging
            </span>
          </motion.div>
          
          <motion.nav 
            className="hidden md:flex items-center gap-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <a href="#features" className="text-blue-100 hover:text-white transition-colors font-medium">Features</a>
            <a href="#pricing" className="text-blue-100 hover:text-white transition-colors font-medium">Pricing</a>
            <a href="#testimonials" className="text-blue-100 hover:text-white transition-colors font-medium">Testimonials</a>
          </motion.nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                <span className="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                  Revolutionize
                </span>
                <br />
                Your Customer
                <br />
                <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  Conversations
                </span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                The next-generation messaging platform that combines AI-powered automation with 
                human touch. Connect with your customers like never before.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 px-8 rounded-xl"
                  onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Floating Message Cards */}
              <div className="relative space-y-6">
                <motion.div 
                  className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-700"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-cyan-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold">Customer Support</p>
                      <p className="text-sm text-slate-400">Online • 2 min ago</p>
                    </div>
                  </div>
                  <p className="text-slate-200">Hey! I need help with my order #12345. When will it ship?</p>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-blue-800 to-blue-900 rounded-3xl p-6 shadow-2xl border border-blue-700 ml-12"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold">You</p>
                      <p className="text-sm text-blue-400">Just now</p>
                    </div>
                  </div>
                  <p className="text-blue-200">I'll check that for you right away! 🔍</p>
                </motion.div>
                
                <motion.div 
                  className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-3xl p-6 shadow-2xl border border-purple-700"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"></div>
                    <div>
                      <p className="font-semibold">AI Assistant</p>
                      <p className="text-sm text-purple-400">Automated</p>
                    </div>
                  </div>
                  <p className="text-purple-200">Order #12345 is scheduled for shipment tomorrow! 🚚</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-20 px-6 bg-black/20">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Everything you need to deliver exceptional customer experiences through messaging
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-2xl p-8 backdrop-blur-sm border border-slate-700/50 hover:border-blue-500/30 transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Active Users" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" },
              { number: "1.2s", label: "Avg Response" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-blue-100 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="relative z-10 py-20 px-6">
        <div className="container mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Loved by Teams
              </span>
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 border border-slate-700"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="h-5 w-5 fill-yellow-400 text-yellow-400" 
                    />
                  ))}
                </div>
                <p className="text-slate-200 mb-6 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-slate-400">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Login Section */}
      <section id="login-section" className="relative z-10 py-20 px-6">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-white">
              <CardHeader className="text-center">
                <div className="mx-auto bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl font-bold">Welcome to TK Messaging</CardTitle>
                <CardDescription className="text-blue-200">
                  Sign in to start revolutionizing your customer conversations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-blue-100">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 py-6 rounded-xl"
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label htmlFor="password" className="text-blue-100">Password</Label>
                      <Button variant="link" className="p-0 h-auto text-sm text-blue-300 hover:text-blue-200">
                        Forgot?
                      </Button>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 py-6 rounded-xl"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 rounded-xl"
                  >
                    Sign In
                  </Button>
                </form>
                
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <p className="text-sm text-blue-200 text-center">
                    <strong>Demo Credentials:</strong><br />
                    Admin: sysad@techkrafted.com / 123<br />
                    User: apresroc@gmail.com / 123
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-slate-800">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                  TK Messaging
                </span>
              </div>
              <p className="text-slate-400">
                Revolutionizing customer conversations with AI-powered messaging.
              </p>
            </div>
            
            {['Product', 'Resources', 'Company', 'Support'].map((category) => (
              <div key={category}>
                <h3 className="font-semibold text-white mb-4">{category}</h3>
                <ul className="space-y-2 text-slate-400">
                  {['Features', 'Pricing', 'Case Studies', 'Docs'].map((item) => (
                    <li key={item}>
                      <a href="#" className="hover:text-blue-300 transition-colors">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 TK Messaging. All rights reserved.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-blue-300 transition-colors text-sm">Privacy</a>
              <a href="#" className="text-slate-400 hover:text-blue-300 transition-colors text-sm">Terms</a>
            </div>
          </div>
        </div>
      </footer>
      
      <div className="relative z-10 py-6">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default Index;