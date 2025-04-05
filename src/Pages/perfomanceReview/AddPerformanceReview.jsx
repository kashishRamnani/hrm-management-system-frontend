import React, { useEffect, useState } from "react";
import { useAuth } from "../../../src/context/AuthContext";
import { Employee } from "../../../src/utils/Compensation";
import { Performance } from "../../../src/utils/Performance";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BackButton from "../../../src/Components/Backbutton/Backbutton";
export default function CreatePerformanceReview() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [newPR, setNewPR] = useState({
    employee_id: '',
    review_date: '',
    kpi_score: '',
    feedback: '',
  });

  const handleChange = (e) => {
    setNewPR((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    const { employee_id, review_date, kpi_score, feedback } = newPR;

    if (!employee_id || !review_date || !kpi_score || !feedback) {
      toast.error("All fields are required!");
      return;
    }

    if (kpi_score < 0 || kpi_score > 100) {
      toast.error("KPI Score must be between 0 and 100!");
      return;
    }

    Performance.add(user.token, newPR, (message) => {
      if (message?.success) {
        toast.success(message.success);
        setNewPR({
          employee_id: '',
          review_date: '',
          kpi_score: '',
          feedback: '',
        });
        
        setTimeout(() => {
          navigate("/admin/performance");
        }, 2000);
      } else if (message?.error) {
        toast.error(message.error);
      }
    });
  };

  useEffect(() => {
    Employee.all(user.token, (data) => {
      if (data?.error) {
        toast.error("Failed to load employees.");
      } else {
        setEmployees(data);
      }
      setLoading(false);
    });
  }, [user.token]);

  return (
    <div className="container my-2">
      <BackButton/>
      <div className="d-flex row justify-content-center">
        <div className="col-lg-8 col-md-6 col-sm-8">
          <div className="card shadow border">
            <div className="card-body py-4 shadow">
              {/* Heading for Add Performance Form */}
              <h4 className="text-center fw-bold" style={{ color: "#49266a" }}>
                Add Performance Review
              </h4>
  
              <ToastContainer />
  
              {/* Form to Add Performance */}
              <form className="mt-4" onSubmit={handleSubmit}>
                {/* Employee Select */}
                <div className="mb-3">
                  <label htmlFor="employee-select" className="form-label fw-semibold" style={{ fontSize: "0.875rem" }}>
                    Select Employee
                  </label>
                  <select
                    id="employee-select"
                    value={newPR.employee_id}
                    name="employee_id"
                    onChange={handleChange}
                    className="form-select"
                    disabled={loading}
                    aria-label="Select an employee"
                  >
                    <option value="">
                      {loading ? "Loading employees..." : "Choose an employee"}
                    </option>
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name}
                      </option>
                    ))}
                  </select>
                </div>
  
                {/* Date Input */}
                <div className="mb-3">
                  <label htmlFor="date-select" className="form-label fw-semibold" style={{ fontSize: "0.875rem" }}>
                    Select Date
                  </label>
                  <input
                    id="date-select"
                    type="date"
                    value={newPR.review_date}
                    name="review_date"
                    onChange={handleChange}
                    className="form-control"
                    aria-label="Select review date"
                  />
                </div>
  
                {/* KPI Score */}
                <div className="mb-3">
                  <label htmlFor="kpi-score" className="form-label fw-semibold" style={{ fontSize: "0.875rem" }}>
                    KPI Score
                  </label>
                  <input
                    id="kpi-score"
                    type="number"
                    min="0"
                    max="100"
                    value={newPR.kpi_score}
                    name="kpi_score"
                    onChange={handleChange}
                    placeholder="Enter KPI Score (0-100)"
                    className="form-control"
                    aria-label="Enter KPI score"
                  />
                </div>
  
                {/* Feedback */}
                <div className="mb-3">
                  <label htmlFor="feedback" className="form-label fw-semibold" style={{ fontSize: "0.875rem" }}>
                    Feedback
                  </label>
                  <textarea
                    id="feedback"
                    value={newPR.feedback}
                    name="feedback"
                    onChange={handleChange}
                    placeholder="Enter your feedback"
                    className="form-control"
                    aria-label="Enter feedback"
                  />
                </div>
  
                {/* Submit Button */}
                <div className="d-flex justify-content-center">
                  <button onClick={handleSubmit} className="btn w-50 text-white shadow-sm" style={{ backgroundColor: "#49266a", cursor: "pointer", fontWeight: "bold" }}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}
