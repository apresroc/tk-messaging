import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  Users, 
  Settings, 
  Shield,
  Send,
  Smartphone,
  Zap,
  Lock
} from 'lucide-react';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const features = [
    {
      title: "Seamless Messaging",
      description: "Send and receive SMS messages directly from your dashboard with our intuitive interface.",
      icon: MessageSquare,
    },
    {
      title: "Customer Management",
      description: "Organize and manage all your customer contacts in one centralized location.",
      icon: Users,
    },
    {
      title: "Secure Communication",
      description: "Enterprise-grade security ensures your conversations remain private and protected.",
      icon: Lock,
    },
    {
      title: "Real-time Updates",
      description: "Get instant notifications for new messages and conversation updates.",
      icon: Zap,
    }
  ];

  const actions = [
    {
      title: "Conversations",
      description: "Manage all your customer conversations in one place",
      icon: MessageSquare,
      href: "/conversations",
      color: "bg-blue-500"
    },
    {
      title: "Customers",
      description: "View and manage your customer contacts",
      icon: Users,
      href: "/customers",
      color: "bg-green-500"
    },
    {
      title: "Settings",
      description: "Configure your Twilio integration and preferences",
      icon: Settings,
      href: "/settings",
      color: "bg-purple-500"
    },
    {
      title: "Admin",
      description: "Administer the application and manage users",
      icon: Shield,
      href: "/admin",
      color: "bg-red-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Smartphone className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Twilio Messaging Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Streamline your customer communication with our powerful, easy-to-use messaging platform powered by Twilio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/conversations">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/settings">Configure Settings</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage customer communications effectively
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 bg-background/50 backdrop-blur">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Actions Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Access</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Jump straight to the tools you need most
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 bg-gradient-to-br from-background to-muted">
                <CardContent className="p-6">
                  <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="text-white h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{action.title}</h3>
                  <p className="text-muted-foreground mb-4">{action.description}</p>
                  <Button asChild className="w-full">
                    <Link to={action.href}>Go to {action.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Transform Your Communication?</h2>
          <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using our platform to connect with their customers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/conversations">
                <Send className="mr-2 h-5 w-5" />
                Start Messaging
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
              <Link to="/admin">View Demo</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <MadeWithDyad />
    </div>
  );
};

export default Index;