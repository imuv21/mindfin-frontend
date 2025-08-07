// src/components/layout/MainLayout.jsx
import React from "react";
// import RoleSidebar from "../layout/RoleSidebar";
import RoleSidebar from "../layout/Sidebar(HR)";

const MainLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <div className="w-50 hidden md:block">
        <RoleSidebar />
      </div>
      
      <div className="flex-1 overflow-auto">
        <main className="">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;