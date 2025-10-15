"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { Users } from "lucide-react";

const Header = () => {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";

  const handleLogout = () => {
    toast.success("You have been logged out");
    if (typeof window !== "undefined") window.location.href = "/";
  };

  const handleSettings = () => {
    if (typeof window !== "undefined") window.location.href = "/settings";
  };

  const handleContacts = () => {
    if (typeof window !== "undefined") window.location.href = "/customers";
  };

  const getPageTitle = () => {
    if (pathname === "/admin") {
      return "Manage Twilio settings and customers";
    } else if (pathname === "/dashboard") {
      return "Conversations";
    } else if (pathname === "/customers") {
      return "Contact Management";
    } else if (pathname === "/settings") {
      return "User Settings";
    }
    return "";
  };

  const showSettingsButton = pathname !== "/admin" && pathname !== "/settings";
  const showContactsButton = pathname !== "/customers" && pathname !== "/admin";

  return (
    <header className="border-b border-white/20">
      <div className="flex h-16 items-center px-4">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-white">{getPageTitle()}</h1>
        </div>
        <div className="flex items-center space-x-4">
          {showContactsButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleContacts}
              className="text-blue-200 hover:text-white hover:bg-white/10"
              title="Contacts"
            >
              <Users className="h-5 w-5" />
            </Button>
          )}
          {showSettingsButton && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSettings}
              className="text-blue-200 hover:text-white hover:bg-white/10"
              title="Settings"
            >
              <SettingsIcon className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-blue-200 hover:text-white hover:bg-white/10"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;