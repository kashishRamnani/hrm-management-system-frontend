import React, { useState, useEffect } from "react";
import { useAuth } from "../../../src/context/AuthContext";
import { Compensation } from "../../../src/utils/Compensation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmationModal from "../../../src/Components/DelectModel";
import BackButton from "../../../src/Components/Backbutton/Backbutton";
export default function AllCompensation() {
  const { user } = useAuth();
  const [compensations, setCompensations] = useState([]);
  const [message, setMessage] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [editingCompensation, setEditingCompensation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [compensationToDelete, setCompensationToDelete] = useState(null);

  const calculateTotalCompensation = (baseSalary, bonus) =>
    parseFloat(baseSalary ?? 0) + parseFloat(bonus ?? 0);

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditingCompensation({ ...compensations[index] });
  };

  const handleInputChange = (e) => {
    setEditingCompensation((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveClick = async () => {
    try {
      await Compensation.update(user.token, editingCompensation, setMessage);
      const updatedCompensations = [...compensations];
      updatedCompensations[editIndex] = editingCompensation;
      setCompensations(updatedCompensations);
      setEditIndex(null);
      setEditingCompensation(null);
      toast.success("Compensation updated successfully");
    } catch (err) {
      toast.error("Failed to save changes: " + err.message);
    }
  };

  const handleDeleteClick = (compensation) => {
    setCompensationToDelete(compensation);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!compensationToDelete) return;
    try {
      await Compensation.delete(compensationToDelete.id, user.token, setMessage);
      setCompensations(compensations.filter((comp) => comp.id !== compensationToDelete.id));
      setDeleteModalVisible(false);
      toast.success("Compensation deleted successfully");
    } catch (err) {
      toast.error("Failed to delete compensation");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalVisible(false);
  };

  const getMonthName = (monthNumber) => {
    const date = new Date(0);
    date.setMonth(monthNumber - 1);
    return date.toLocaleString("default", { month: "long" });
  };

  const formatPaymentMonth = (paymentMonth) => {
    if (!paymentMonth) return "N/A";
    const [year, month] = paymentMonth.split("-");
    const monthName = getMonthName(parseInt(month, 10));
    return `${monthName} ${year}`;
  };

  useEffect(() => {
    if (user.token) {
      setIsLoading(true);
      Compensation.all(user.token, setCompensations, setMessage, setIsLoading)
        .then(() => setIsLoading(false))
        .catch((err) => {
          setMessage("Failed to load data: " + err.message);
          toast.error("Failed to fetch compensations");
          setIsLoading(false);
        });
    }
  }, [user.token]);
  
  

  return (
    <div className="container my-4">
       <BackButton/>
      <div className="card shadow">
        <div className="card-body">
          <h4 className="text-center mb-3 fw-bold" 
          style={{ color: "#49266a" }}
          >
            Employee Compensation
          </h4>

          {isLoading && (
            <div className="loading-overlay">
              <div className="spinner-border " role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!isLoading && (
            <div className="table-responsive">
              <table className="table table-bordered table-striped align-middle">
                <thead className="text-white small">
                  <tr>
                    <th>Employee Name</th>
                    <th>Base Salary</th>
                    <th>Bonus</th>
                    <th>Total Compensation</th>
                    <th>Payment Date</th>
                    <th>Payment Month</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {compensations.map((compensation, index) => (
                    <tr key={compensation.id}>
                      <td>
                        {compensation.employee
                          ? `${compensation.employee.first_name} ${compensation.employee.last_name}`
                          : "N/A"}
                      </td>
                      <td>
                        {editIndex === index ? (
                          <input
                            type="number"
                            name="base_salary"
                            value={editingCompensation.base_salary || 0}
                            onChange={handleInputChange}
                            className="form-control form-control-sm"
                          />
                        ) : (
                          compensation.base_salary || "N/A"
                        )}
                      </td>
                      <td>
                        {editIndex === index ? (
                          <input
                            type="number"
                            name="bonus"
                            value={editingCompensation.bonus || 0}
                            onChange={handleInputChange}
                            className="form-control form-control-sm"
                          />
                        ) : (
                          compensation.bonus || "N/A"
                        )}
                      </td>
                      <td>
                        {calculateTotalCompensation(
                          compensation.base_salary,
                          compensation.bonus
                        )}
                      </td>
                      <td>
                        {editIndex === index ? (
                          <input
                            type="date"
                            name="payment_date"
                            value={editingCompensation.payment_date || ""}
                            onChange={handleInputChange}
                            className="form-control form-control-sm"
                          />
                        ) : (
                          compensation.payment_date || "N/A"
                        )}
                      </td>
                      <td>
                        {editIndex === index ? (
                          <input
                            type="month"
                            name="payment_month"
                            value={editingCompensation.payment_month ?? ""}
                            onChange={handleInputChange}
                            className="form-control form-control-sm"
                          />
                        ) : (
                          formatPaymentMonth(compensation.payment_month)
                        )}
                      </td>
                      <td>
                        {editIndex === index ? (
                          <div className="d-flex gap-2">
                            <button
                              onClick={handleSaveClick}
                              className="primary-btn btn-sm"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditIndex(null)}
                              className="btn btn-secondary btn-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="d-flex gap-2">
                            <button
                              onClick={() => handleEditClick(index)}
                              className="btn text-white btn-sm rounded-3"
                              style={{ backgroundColor: "#49266a" }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteClick(compensation)}
                              className="btn btn-danger btn-sm rounded-3"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isVisible={isDeleteModalVisible}
        compensationToDelete={compensationToDelete}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      <ToastContainer />
    </div>
  );
}
