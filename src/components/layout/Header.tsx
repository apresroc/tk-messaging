"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Settings as SettingsIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    toast.success("You have been logged out");
    router.push("/");
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const getPageTitle = () => {
    if (pathname === "/admin") {
      return "Manage Twilio settings and customers";
    } else if (pathname === "/conversations") {
      return "Messaging Dashboard";
    } else if (pathname === "/customers") {
      return "Contact Management";
    } else if (pathname === "/settings") {
      return "User Settings";
    }
    return "";
  };

  const showSettingsButton = pathname !== "/admin" && pathname !== "/settings";

  return (
    <header className="border-b border-white/20">
      <div className="flex h-16 items-center px-4">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-white">{getPageTitle()}</h1>
        </div>
        <div className="flex items-center space-x-4">
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