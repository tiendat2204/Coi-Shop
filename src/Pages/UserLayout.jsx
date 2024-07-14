import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/navbar"; 
import Footer from "../Components/Footer/Footer"; 

const UserLayout = ({ setSearchTerm }) => {
  return (
    <div>
      <Navbar setSearchTerm={setSearchTerm} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
