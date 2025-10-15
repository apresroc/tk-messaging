"use client";

import React from "react";
import UserSettings from "@/components/user/UserSettings";
import Header from "@/components/layout/Header";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 text-white">
      <Header />
      <div className="container py-6 flex-1 relative z-10">
        <UserSettings />
      </div>
    </div>
  );
}