"use client";

import React from "react";
import Header from "@/components/layout/Header";

export default function CustomersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="container py-6 flex-1">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Contacts</h1>
          <p className="text-muted-foreground mb-8">Contact management functionality will be implemented here.</p>
          <div className="bg-muted rounded-lg p-8 max-w-2xl mx-auto">
            <p className="text-muted-foreground">This page will allow users to manage their contacts. Features will include:</p>
            <ul className="list-disc list-inside text-left mt-4 text-muted-foreground">
              <li>Add new contacts</li>
              <li>View contact list</li>
              <li>Search and filter contacts</li>
              <li>Edit contact information</li>
              <li>Delete contacts</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}