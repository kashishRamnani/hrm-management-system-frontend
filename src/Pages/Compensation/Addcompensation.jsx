import React, { useEffect, useState } from "react";
import { useAuth } from "../../../src/context/AuthContext";
import { Compensation, Employee } from "../../../src/utils/Compensation";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "../../../src/Components/Backbutton/Backbutton";
export default function AddCompensations() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [baseSalary, setBaseSalary] = useState("");
  const [bonus, setBonus] = useState("");
  const [message, setMessage] = useState("");

  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMonth, setPaymentMonth] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Handle clear form fields
  const handleClear = () => {
    setSelectedEmployee("");
    setBaseSalary("");
    setBonus("");
    setPaymentDate("");
    setPaymentMonth("");
    setMessage(""); // Clear message when form is reset
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      employee_id: selectedEmployee,
      base_salary: parseFloat(baseSalary),
      bonus: parseFloat(bonus),
      payment_date: paymentDate,
      payment_month: paymentMonth,
    };

    if (selectedEmployee && baseSalary && bonus && paymentDate && paymentMonth) {
      Compensation.add(user.token, data, setMessage) // Pass setMessage to Compensation.add
        .then(() => {
          toast.success("Compensation added successfully!");
          setTimeout(() => {
            navigate("/admin/all-compensation");
          }, 1000);
        })
        .catch((err) => {
          toast.error("Failed to add compensation: " + err.message);
        });
    } else {
      toast.error("Please fill out all fields.");
    }
  };

  // Fetch employees on component mount
  useEffect(() => {
    Employee.all(user.token, setEmployees, setMessage);
  }, [user.token]);

  return (
    <div className="mt-2">
    <BackButton/>
    <div className="container w-75">
      
      <div className="card shadow-lg p-4">
    
        <h4 className="text-center mb-3 fw-bold" style={{ color: "#49266a" }}>
          Add Compensation
        </h4>

        <form onSubmit={handleSubmit}>
          {/* Select Employee */}
          <div className="mb-3">
            <label htmlFor="employeeSelect" className="form-label">Select Employee</label>
            <select
              id="employeeSelect"
              className="form-select"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              required
            >
              <option value="">-- Select Employee --</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.first_name} {employee.last_name}
                </option>
              ))}
            </select>
          </div>

          {/* Base Salary */}
          <div className="mb-3">
            <label htmlFor="baseSalary" className="form-label">Base Salary</label>
            <input
              type="number"
              id="baseSalary"
              className="form-control"
              placeholder="Enter Base Salary"
              value={baseSalary}
              onChange={(e) => setBaseSalary(e.target.value)}
              required
              min="0"
            />
          </div>

          {/* Bonus */}
          <div className="mb-3">
            <label htmlFor="bonus" className="form-label">Bonus</label>
            <input
              type="number"
              id="bonus"
              className="form-control"
              placeholder="Enter Bonus"
              value={bonus}
              onChange={(e) => setBonus(e.target.value)}
              min="0"
            />
          </div>

          {/* Payment Date */}
          <div className="mb-3">
            <label htmlFor="paymentDate" className="form-label">Payment Date</label>
            <input
              type="date"
              id="paymentDate"
              className="form-control"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              required
            />
          </div>

          {/* Payment Month */}
          <div className="mb-3">
            <label htmlFor="paymentMonth" className="form-label">Payment Month</label>
            <input
              type="month"
              id="paymentMonth"
              className="form-control"
              value={paymentMonth}
              onChange={(e) => setPaymentMonth(e.target.value)}
              required
            />
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClear}
            >
              Clear
            </button>

            <button
              className="btn text-white shadow"
              style={{ backgroundColor: "#49266a" }}
              type="submit"
            >
              Add Compensation
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
     
    </div>
    </div>
  );
}
