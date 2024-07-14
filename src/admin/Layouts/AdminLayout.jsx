import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Shared/sidebar";

const AdminLayout = () => {
  return (
    <div className="admin-layout h-dvh flex">
      <div className="w-full max-w-[15rem]">
        <Sidebar />
      </div>
      <div className="admin-content flex-1 p-4 h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
