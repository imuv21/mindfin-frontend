// src/components/layout/MainLayout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import RoleSidebar from "../../DataEntry/layout/RoleSidebar";

const MainLayout = ({ children }) => {

  const user = useSelector((state) => state.user);
  const role = user?.user?.designation?.designation

  const renderSidebar = () => {
    switch (role) {
      case "HR":
        return <Sidebar />;
      case "Data entry":
        return <RoleSidebar />;
      // Add more roles as needed
      case "Admin":
        return <Sidebar />; // Example: Admin uses Sidebar
      case "Finance":
        return <RoleSidebar />; // Example: Finance uses RoleSidebar
      default:
        return <Sidebar />; // Fallback UI
    }
  }

  return (
    <div className="flex h-screen">
      <div className="w-60 hidden md:block">
        {/* <Sidebar /> */}
        {renderSidebar()}

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