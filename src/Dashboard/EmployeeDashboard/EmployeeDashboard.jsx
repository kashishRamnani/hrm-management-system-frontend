import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Employee } from "../../utils/Compensation"; 
import CompensationEmp from "../EmployeeDashboard/compenstion/compensation";
import PreforamceEmp from "../EmployeeDashboard/PreofamanceEmp/PreofamanceEmp";
import AttendenceChart from "../../Components/Attendence/AttendenceChart";
import JOBS from "../../Components/allJobsTable/AllJobsTable";
import { useAuth } from "../../context/AuthContext"; 

const EmployDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { token } = user;

  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!token) {
        setError("Authentication token is missing.");
        setLoading(false);
        return;
      }

      try {
        await Employee.all(token, (data) => {
          setEmployeeData(data);
        });
      } catch (err) {
        setError("Failed to fetch employee data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [token]);

  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border" role="status" aria-label="Loading">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="gap-4 mx-2 d-flex justify-content-between mb-3">
        {/* Leave Form */}
        <div className="form-box" onClick={() => handleNavigation("/LeaveForm")}>
          <h3>Leave Form</h3>
          <p>Apply for leave quickly.</p>
        </div>

        {/* Complaint Form Box */}
        <div
          className="form-box"
          onClick={() => handleNavigation("/ComplaintForm")}
        >
          <h3>Complaint Form</h3>
          <p>Submit your complaint.</p>
        </div>
      </div>

      <div className="dashboard-container">
        <CompensationEmp
         
        />
        <AttendenceChart />
      </div>
      <div className="dashboard-container">
        <JOBS />
        <PreforamceEmp />
      </div>
    </div>
  );
};

export default EmployDashboard;
