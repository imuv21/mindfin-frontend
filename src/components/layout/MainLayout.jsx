// src/components/layout/MainLayout.jsx
import React from "react";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import RoleSidebar from "../../DataEntry/layout/RoleSidebar";

const MainLayout = ({ children }) => {

  const user = useSelector((state) => state.user.user);
  const role = user?.designation?.designation;

  const renderSidebar = () => {
    switch (role) {
      case "SUPERADMIN":
        return <Sidebar />;
      case "ADMIN":
        return <Sidebar />;
      case "HR":
        return <Sidebar />;
      case "TELECALLER":
        return <Sidebar />;
      case "CREDITMANAGER":
        return <RoleSidebar />;
      case "BRANCHMANAGER":
        return <RoleSidebar />;
      default:
        return <Sidebar />;
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-60 hidden md:block">

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