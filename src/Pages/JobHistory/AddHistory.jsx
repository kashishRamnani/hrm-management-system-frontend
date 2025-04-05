import React, { useEffect, useState } from "react";
import { useAuth } from "../../../src/context/AuthContext";
import { Employee } from "../../../src/utils/Compensation";
import { Department } from "../../../src/utils/Department";
import { JobHistory, Positions } from "../../../src/utils/JobHistory";
import BackButton from "../../../src/Components/Backbutton/Backbutton";
export default function AddJobHistory({ setMessage, message }) {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedJoiningDate, setSelectedJoiningDate] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.token) {
      setLoading(true);

      Employee.all(user.token, setEmployees).catch((err) => {
        setMessage("Failed to load employees: " + err.message);
        setLoading(false);
      });

      Department.all(user.token, setDepartments, setMessage, setLoading).catch((err) => {
        setMessage("Failed to load departments: " + err.message);
        setLoading(false);
      });

      Positions.all(user.token, setPositions).catch((err) => {
        setMessage("Failed to load positions: " + err.message);
        setLoading(false);
      });
    }
  }, [user, setMessage]);

  const handleEmployeeChange = (e) => {
    const employeeId = e.target.value;
    setSelectedEmployee(employeeId);
    const employee = employees.find(emp => emp.id === employeeId);
    if (employee) {
      setSelectedStatus(employee.status);
      setSelectedJoiningDate(employee.date_of_joining);
    }
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handlePositionChange = (e) => {
    setSelectedPosition(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleJoiningDateChange = (e) => {
    setSelectedJoiningDate(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedEmployee || !selectedDepartment || !selectedPosition || !selectedStatus || !selectedJoiningDate) {
      setMessage("All fields are required.");
      return;
    }

    const newJobHistory = {
      employee_id: selectedEmployee,
      department_id: selectedDepartment,
      position_id: selectedPosition,
      status: selectedStatus,
      employment_from: selectedJoiningDate,
    };

    console.log("New job history data:", newJobHistory);

    JobHistory.add(user.token, newJobHistory, setMessage)
      .then(() => {
        setMessage("Job History added successfully!");
      })
      .catch((err) => setMessage("Failed to add job history: " + err.message));
  };

  return (
    <div className="container my-2">
    <BackButton />
    <div className=" d-flex justify-content-center align-items-center">
    
    
      <div className="col-lg-8 col-md-10 col-sm-10 card shadow-lg p-3">
        <h4 className="text-center fw-bold" style={{ color: "#49266a" }}>
          Add Job History
        </h4>
  
        {message && <p className="text-danger">{message}</p>}
        {loading && <p>Loading data...</p>}
  
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="employee-select" className="form-label">Select Employee</label>
            <select
              id="employee-select"
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              className="form-select"
            >
              <option value="">Choose an employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name}
                </option>
              ))}
            </select>
          </div>
  
          <div className="mb-3">
            <label htmlFor="department-select" className="form-label">Select Department</label>
            <select
              id="department-select"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              className="form-select"
            >
              <option value="">Choose a department</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.title}
                </option>
              ))}
            </select>
          </div>
  
          <div className="mb-3">
            <label htmlFor="position-select" className="form-label">Select Position</label>
            <select
              id="position-select"
              value={selectedPosition}
              onChange={handlePositionChange}
              className="form-select"
            >
              <option value="">Choose a position</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.job_position}
                </option>
              ))}
            </select>
          </div>
  
          <div className="mb-3">
            <label htmlFor="status-input" className="form-label">Employee Status</label>
            <select onChange={handleStatusChange} className="form-control">
              <option disabled={true} defaultChecked={true}>Choose the status</option>
              <option value="latest">Latest</option>
              <option value="previous">Previous</option>
            </select>
          </div>
  
          <div className="mb-3">
            <label htmlFor="joining-date-input" className="form-label">Joining Date</label>
            <input
              type="date"
              id="joining-date-input"
              value={selectedJoiningDate}
              onChange={handleJoiningDateChange}
              className="form-control"
            />
          </div>
  
          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={() => {
              setSelectedEmployee("");
              setSelectedDepartment("");
              setSelectedPosition("");
              setSelectedStatus("");
              setSelectedJoiningDate("");
            }}>
              Clear
            </button>
  
            <button
              type="submit"
              className="btn text-white shadow"
              style={{
                backgroundColor: "#49266a",
                cursor: "pointer",
              }}
            >
              Add Job History
            </button>
          </div>
        </form>
      
      </div>
  
      {message && (
        <div
          className="alert alert-light"
          role="alert"
          style={{
            position: "fixed",
            top: "100px",
            right: "10px",
            zIndex: 1050,
            padding: "10px 40px 10px 10px",
            animation: "fadeIn 0.5s ease, slideIn 0.5s ease",
          }}
        >
          {message}
        </div>
      )}
    </div>
    </div>
  );
  
}
