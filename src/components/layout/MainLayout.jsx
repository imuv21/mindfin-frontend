import React from "react";
import Sidebar from "./Sidebar";


const MainLayout = ({ children }) => {

  return (
    <div className="flex h-screen">
      <div className="w-60 hidden md:block">
        <Sidebar />
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