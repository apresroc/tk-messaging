"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Smartphone } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    if (email === "sysad@techkrafted.com" && password === "123") {
      toast.success("Admin login successful");
      router.push("/admin");
      return;
    }

    if (email === "apresroc@gmail.com" && password === "123") {
      toast.success("User login successful");
      router.push("/conversations");
      return;
    }

    toast.success("Login successful");
    router.push("/conversations");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 text-white flex flex-col">
      <header className="px-6 py-8">
        <div className="container mx-auto">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl relative">
              <Smartphone className="h-6 w-6 text-white" />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">TK</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">Messaging</span>
          </div>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 text-white">
            <CardHeader className="text-center">
              <div className="mx-auto bg-gradient-to-r from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 relative">
                <Smartphone className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-3xl font-bold">Welcome to TK Messaging</CardTitle>
              <CardDescription className="text-blue-200">Sign in to start revolutionizing your customer conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-blue-100">
                    Email
                  </Label>
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
                    <Label htmlFor="password" className="text-blue-100">
                      Password
                    </Label>
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
                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 rounded-xl">
                  Sign In
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-2 text-slate-500">Or continue with</span>
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 border-slate-700 text-white hover:bg-slate-800">
                  Google
                </Button>
                <Button variant="outline" className="flex-1 border-slate-700 text-white hover:bg-slate-800">
                  Microsoft
                </Button>
              </div>
            </CardFooter>
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