import React, { useState, useEffect } from "react";
import { useAuth } from "../../../src/context/AuthContext";
import { Performance as PerformanceReview } from "../../../src/utils/Performance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import DeleteConfirmationModal from "../../../src/Components/DelectModel"; // Assuming you have this component
import BackButton from "../../../src/Components/Backbutton/Backbutton";
export default function Performance() {
  const { user } = useAuth();
  const [performances, setPerformances] = useState([]);
  const [message, setMessage] = useState("");
  const [editingPerformance, setEditingPerformance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [performanceToDelete, setPerformanceToDelete] = useState(null);

  const handleEditClick = (performance) => {
    setEditingPerformance({ ...performance });
  };

  const handleChange = (e) => {
    setEditingPerformance((prev) => ({
      ...prev,
      [e.target.name]: e.target.name === "kpi_score" ? parseFloat(e.target.value) : e.target.value,
    }));
  };

  const handleSaveChanges = () => {
    PerformanceReview.update(user.token, editingPerformance, (message) => {
      setMessage(message);
      toast.success("Performance review updated successfully!");
  
      
      setPerformances((prevPerformances) =>
        prevPerformances.map((performance) =>
          performance.id === editingPerformance.id ? editingPerformance : performance
        )
      );
  
      setEditingPerformance(null); 
    });
  };
  

  const handleDeletePerformance = (id) => {
    PerformanceReview.delete(id, user.token, (message) => {
      setMessage(message);
      toast.error("Performance review deleted."); 
    });
    setIsDeleteModalVisible(false); 
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false); 
  };

  const handleDeleteHR = (id) => {
    handleDeletePerformance(id);
  };

  useEffect(() => {
    if (user.token) {
      PerformanceReview.all(user.token, setPerformances, setMessage, setLoading);
    }
  }, [user.token]);

  return (
    <div className="container my-4">
    <BackButton/>

    {loading ? (
          <div className="text-center">
            
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
        <div className="card shadow">
           
          <div className="card-body">
            <h4 className=" text-center mb-3 fw-bold" style={{ color: "#49266a" }}>
           All   Employees Performance
            </h4>
            <div className="table-responsive">
              <table className="table table-bordered table-striped align-middle">
                <thead className="text-white" style={{ backgroundColor: "#49266a" }}>
                  <tr>
                    <th>Employee Name</th>
                    <th>Review Date</th>
                    <th>KPI Score</th>
                    <th>Feedback</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {performances.map((performance) => (
                    <tr key={performance.id}>
                      <td>
                        {performance.employee ? (
                          `${performance.employee.first_name} ${performance.employee.last_name}`
                        ) : (
                          "N/A"
                        )}
                      </td>
                      <td>{performance.review_date}</td>
                      <td>
                        {editingPerformance?.id === performance.id ? (
                          <input
                            type="number"
                            name="kpi_score"
                            value={editingPerformance.kpi_score}
                            onChange={handleChange}
                            className="form-control form-control-sm"
                          />
                        ) : (
                          performance.kpi_score ?? "N/A"
                        )}
                      </td>
                      <td>
                        {editingPerformance?.id === performance.id ? (
                          <input
                            type="text"
                            name="feedback"
                            value={editingPerformance.feedback}
                            onChange={handleChange}
                            className="form-control form-control-sm"
                          />
                        ) : (
                          performance.feedback ?? "N/A"
                        )}
                      </td>
                      <td>
                        {editingPerformance?.id === performance.id ? (
                          <>
                            <button onClick={handleSaveChanges} className="primary-btn btn-sm me-2">
                              Save
                            </button>
                            <button
                              onClick={() => setEditingPerformance(null)}
                              className="btn btn-secondary btn-sm"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleEditClick(performance)}
                              className=" primary-btn btn-sm me-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                setPerformanceToDelete(performance);
                                setIsDeleteModalVisible(true);
                              }}
                              className="btn btn-danger btn-sm"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      
      <DeleteConfirmationModal
        isVisible={isDeleteModalVisible}
        onCancel={handleDeleteCancel}
        onConfirm={() => handleDeleteHR(performanceToDelete.id)}
      />

      
      <ToastContainer />
    </div>
  );
}
