import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Employee } from "../../../utils/Compensation";
import { complaints } from "../../../utils/Complaints";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function AllComplaints() {
  const [employees, setEmployees] = useState([]);
  const [newComplaint, setNewComplaint] = useState({
    employee_id: "",
    complaint_date: "",
    complaint_text: "",
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate(); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComplaint((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (
      newComplaint.employee_id &&
      newComplaint.complaint_date &&
      newComplaint.complaint_text
    ) {
      try {
        await complaints.add(user.token, newComplaint);
        
        setNewComplaint({
          employee_id: "",
          complaint_date: "",
          complaint_text: "",
        });

      

       
        setTimeout(() => {
          navigate("/employee-dashboard"); 
        }, 3000); 

      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to submit complaint: " + error.message);
      }
    } else {
      toast.error("Please fill out all fields.");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user.token) {
      Employee.all(user.token, setEmployees);
    }
  }, [user.token]);

  return (
    <div className="container mt-5 w-75">
      <div className="card shadow-lg p-4" style={{ minHeight: "80vh" }}>
        <h4 className="text-center mb-3 fw-bold" style={{ color: "#49266a" }}>
          Complaint Form
        </h4>

        <form onSubmit={handleSubmitComplaint}>
          <div className="mb-3">
            <label htmlFor="employeeSelect" className="form-label">
              Select Employee
            </label>
            <select
              id="employeeSelect"
              name="employee_id"
              className="form-select"
              value={newComplaint.employee_id}
              onChange={handleInputChange}
              required
              disabled={loading}
            >
              <option value="">-- Select Employee --</option>
              {employees.length === 0 ? (
                <option disabled>Loading employees...</option>
              ) : (
                employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="complaintDate" className="form-label">
              Date:
            </label>
            <input
              id="complaintDate"
              name="complaint_date"
              type="date"
              value={newComplaint.complaint_date}
              onChange={handleInputChange}
              className="form-control"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="complaintText" className="form-label">
              Complaint Description:
            </label>
            <textarea
              id="complaintText"
              name="complaint_text"
              value={newComplaint.complaint_text}
              onChange={handleInputChange}
              placeholder="Enter complaint description"
              className="form-control"
              required
              disabled={loading}
            />
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="primary-btn w-50 " disabled={loading}>
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>

      
      <ToastContainer />
    </div>
  );
}
