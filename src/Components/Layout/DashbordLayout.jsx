import React, { useState, useEffect } from "react";
import Sidebar from "../../Components/Sidebar/sidebar";
import Header from "../Header/Header";
import "./DashboardLayout.css";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [userRole, setUserRole] = useState(null); // Store the role in state

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  
  useEffect(() => {
    const storedRole = localStorage.getItem("user_role");
    if (storedRole) {
      setUserRole(storedRole);
    }
  }, []); 

  

  if (userRole === null) {
    return <div>Loading...</div>; 
  }

  return (
    <div
      className={`dashboard-layout ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}
    >
     
      {userRole !== "employee" && (
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />
      )}

      <div className={`main-content ${userRole === "employee" ? "no-sidebar" : ""}`}>
        <Header />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
