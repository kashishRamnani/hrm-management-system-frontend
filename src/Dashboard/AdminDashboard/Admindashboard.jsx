import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CompensationChart from "../../Components/compensationChart/CompensationChart";
import PayRollChart from "../../Components/Payroll/PayRollChart";
import Cards from "../../Components/Containers/Cards";
import "../../components/Layout/DashboardLayout.css";
import EmpPerformanceChart from "../../Components/employePerformance/EmpPerformanceChart";
import AttendenceChart from "../../Components/Attendence/AttendenceChart";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (!user || user.role !== "admin") {
        navigate("/signin");
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <p className="unauthorized-message">Access Denied. Please log in as an admin.</p>;
  }

  return (
    <>
      <Cards />
      <div className="dashboard-container">
        <CompensationChart />
        <PayRollChart />
      </div>
      <div className="dashboard-container">
        <EmpPerformanceChart />
        <AttendenceChart />
      </div>
    </>
  );
};

export default AdminDashboard;
