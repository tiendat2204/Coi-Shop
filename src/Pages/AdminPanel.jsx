import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";


const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/dashboard" />
        <Route path="/users" />
        <Route path="/products" />
        <Route path="/orders" />
      </Routes>
    </div>
  );
};

export default AdminPanel;
