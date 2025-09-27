import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  Users, 
  Settings, 
  Shield 
} from 'lucide-react';
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const features = [
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
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Twilio Messaging Platform</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your customer communications seamlessly with our integrated Twilio messaging solution
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon className="text-white h-6 w-6" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <Button asChild className="w-full">
                    <Link to={feature.href}>Go to {feature.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">1</div>
              <div>
                <h3 className="font-semibold">Configure Twilio Settings</h3>
                <p className="text-gray-600">Go to the Admin section to enter your Twilio credentials and phone number</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">2</div>
              <div>
                <h3 className="font-semibold">Add Customers</h3>
                <p className="text-gray-600">Add your customer contacts in the Customers section</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1 flex-shrink-0">3</div>
              <div>
                <h3 className="font-semibold">Start Messaging</h3>
                <p className="text-gray-600">Navigate to Conversations to send and receive messages</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;