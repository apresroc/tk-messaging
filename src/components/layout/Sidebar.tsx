"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageSquare, Settings, Users, Shield, Home, Contact } from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = () => {
  const pathname = usePathname();

  const isAdmin = pathname.includes("/admin");

  const navItems = isAdmin
    ? [
        { title: "Dashboard", href: "/admin", icon: Home },
        { title: "Customers", href: "/customers", icon: Users },
        { title: "Settings", href: "/settings", icon: Settings },
      ]
    : [
        { title: "Dashboard", href: "/dashboard", icon: Home },
        { title: "Contacts", href: "/customers", icon: Contact },
        { title: "Settings", href: "/settings", icon: Settings },
      ];

  return (
    <div className="pb-12 w-64 border-r">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{isAdmin ? "Admin Panel" : "Messaging"}</h2>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Button
                  key={item.title}
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", isActive && "bg-muted font-medium")}
                  asChild
                >
                  <Link href={item.href}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;