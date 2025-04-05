import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Employee } from "../../../utils/Compensation";
import { Leaves } from "../../../utils/Leave";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function LeaveForm() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [newLeave, setNewLeave] = useState({
    employee_id: "",
    leave_date: "",
    leave_reason: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewLeave((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (newLeave.employee_id && newLeave.leave_date && newLeave.leave_reason) {
      try {
        await Leaves.add(user.token, newLeave);
        setNewLeave({
          employee_id: "",
          leave_date: "",
          leave_reason: "",
        });

        
        setTimeout(() => {
          navigate("/employee-dashboard");
        }, 2000); 
      } catch (error) {
        toast.error("Failed to submit leave: " + error.message);
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
          Leave Application Form
        </h4>

        <form onSubmit={handleSubmitLeave}>
          <div className="mb-3">
            <label htmlFor="employeeSelect" className="form-label">
              Select Employee
            </label>
            <select
              id="employeeSelect"
              name="employee_id"
              className="form-select"
              value={newLeave.employee_id}
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
            <label htmlFor="leaveDate" className="form-label">
              Leave Date:
            </label>
            <input
              id="leaveDate"
              name="leave_date"
              type="date"
              value={newLeave.leave_date}
              onChange={handleInputChange}
              className="form-control"
              required
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="leaveReason" className="form-label">
              Leave Reason:
            </label>
            <textarea
              id="leaveReason"
              name="leave_reason"
              value={newLeave.leave_reason}
              onChange={handleInputChange}
              placeholder="Enter leave reason"
              className="form-control"
              required
              disabled={loading}
            />
          </div>

          <div className="d-flex justify-content-center">
            <button type="submit" className="primary-btn w-50" disabled={loading}>
              {loading ? "Submitting..." : "Submit Leave"}
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
