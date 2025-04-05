import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CompensationChart from "../../Components/compensationChart/CompensationChart";
import PayRollChart from "../../Components/Payroll/PayRollChart";
import Cards from "../../Components/Containers/Cards";
import "../../components/Layout/DashboardLayout.css";
import EmpPerformanceChart from "../../Components/employePerformance/EmpPerformanceChart";
import AttendenceChart from "../../Components/Attendence/AttendenceChart";

const HRDashboard = () => {
  const { user, revokeAuth } = useAuth(); 
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    
    if (!user) {
      navigate('/signin'); 
    } else if (user.role !== 'hr') {
      navigate('/signin'); 
    } else {
      setLoading(false); 
    }
  }, [user, navigate]); 

  

  if (loading) {
    return (
      <div className="loading-overlay">
              <div className="spinner-border " role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
    );
  }

  

  return (
    <div>
      
      <Cards />
      <div className="dashboard-container">
        <CompensationChart />
        <PayRollChart />
      </div>
      <div className="dashboard-container">
        <EmpPerformanceChart />
        <AttendenceChart />
      </div>
    </div>
  );
};

export default HRDashboard;
