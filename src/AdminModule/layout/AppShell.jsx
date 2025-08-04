// src/components/layout/AppShell.jsx
import React, { useState } from "react";
import RoleSidebar from "./RoleSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const AppShell = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="h-full">
              <RoleSidebar />
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
          <RoleSidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <DashboardHeader onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;