"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Smartphone, Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    console.log("Login attempt:", { email, password }); // Debug log

    // Check for admin login first
    if (email === "sysad@techkrafted.com" && password === "123") {
      console.log("Admin login detected"); // Debug log
      toast.success("Admin login successful");
      router.push("/admin");
      return;
    }

    // Try customer login (email can be username or email)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Customer login successful:", result.customer);
        
        // Store customer data in sessionStorage for profile display
        sessionStorage.setItem('currentUser', JSON.stringify(result.customer));
        
        toast.success("Login successful");
        router.push("/conversations");
        return;
      } else {
        const error = await response.json();
        console.log("Customer login failed:", error.error);
        toast.error(error.error || "Invalid credentials");
        return;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 text-white flex flex-col">
      <header className="px-6 py-8">
        <div className="container mx-auto">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">TK Messaging</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Welcome to TK Messaging</CardTitle>
              <CardDescription className="text-blue-200">Sign in to start revolutionizing your customer conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-blue-100">
                    Username or Email
                  </Label>
                  <Input
                    id="email"
                    type="text"
                    placeholder="username or name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 py-6 rounded-xl"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-blue-100">
                      Password
                    </Label>
                    <Button variant="link" className="p-0 h-auto text-sm text-blue-300 hover:text-blue-200">
                      Forgot?
                    </Button>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400 py-6 rounded-xl pr-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-slate-400 hover:text-slate-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 rounded-xl">
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="py-6">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default LoginPage;