import React, { useState, useEffect } from "react";
import { complaints } from "../../../utils/Complaints"; 
import { useAuth } from "../../../context/AuthContext"; 
import DeleteConfirmationModal from "../../../Components/DelectModel"; // Adjust the import path
import { ToastContainer, toast } from 'react-toastify';
import BackButton from "../../../Components/Backbutton/Backbutton";
export default function AllComplaints() {
  const { user } = useAuth(); 
  const [complaintsData, setComplaintsData] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [showDeletePage, setShowDeletePage] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [viewComplaint, setViewComplaint] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); // New state for deletion in progress

  // Fetch complaints data
  useEffect(() => {
    if (user?.token) {
   
      complaints
        .all(user.token, setComplaintsData, setMessage, setLoading)
        .catch((err) => console.error("Error fetching complaints:", err));
    }
  }, [user?.token]);

  // Handle delete confirmation modal
  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setShowDeletePage(true);
  };

  const handleDeleteComplaint = async () => {
    if (deleteIndex !== null) {
      try {
        await complaints.delete(complaintsData[deleteIndex].id, user.token, setMessage);
        setComplaintsData((prev) => prev.filter((_, index) => index !== deleteIndex));
       
      } catch (error) {
        
      } finally {
        setIsDeleting(false);
        handleCloseDeletePage();
      }
    }
  };

  const handleCloseDeletePage = () => {
    setShowDeletePage(false);
    setDeleteIndex(null);
  };

  const handleViewClick = (complaint) => {
    setViewComplaint(complaint);
  };

  const handleCloseView = () => {
    setViewComplaint(null);
  };

  return (
    <div className="container my-2">
      <BackButton/>
      <div className="card shadow">
        <div className="card-body">
          <h4 className=" text-center mb-3 fw-bold" style={{ color: "#49266a" }}>
            Employee Complaints
          </h4>

          {loading ? (
            <div className="loading-overlay">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : complaintsData.length === 0 ? (
            <div className="loading-overlay">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped align-middle">
                <thead className="text-white" style={{ backgroundColor: "#49266a" }}>
                  <tr>
                    <th>Employee Name</th>
                    <th>Complaint Date</th>
                    <th>Complaint Text</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {complaintsData.map((complaint, index) => (
                    <tr key={complaint.id}>
                      <td>
                        {complaint.employee
                          ? `${complaint.employee.first_name} ${complaint.employee.last_name}`
                          : "Unknown Employee"}
                      </td>
                      <td>{complaint.complaint_date}</td>
                      <td>{complaint.complaint_text}</td>
                      <td>{complaint.status}</td>
                      <td>
                        <div className="d-flex">
                          <button
                            onClick={() => handleViewClick(complaint)}
                            className="btn text-white btn-sm rounded-3 me-2"
                            style={{ backgroundColor: "#49266a" }}
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteClick(index)}
                            className="btn btn-danger btn-sm rounded-3"
                          >
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Complaint Details Modal */}
      {viewComplaint && (
        <div className="modal show d-block vh-100" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header text-white"
                style={{ backgroundColor: "#49266a", justifyContent: "center" }}
              >
                <h5 className="modal-title">Complaint Details</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseView}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Employee Name:</strong>{" "}
                  {viewComplaint.employee
                    ? `${viewComplaint.employee.first_name} ${viewComplaint.employee.last_name}`
                    : "Unknown Employee"}
                </p>
                <p>
                  <strong>Complaint Date:</strong> {viewComplaint.complaint_date}
                </p>
                <p>
                  <strong>Complaint Text:</strong> {viewComplaint.complaint_text}
                </p>
                <p>
                  <strong>Status:</strong> {viewComplaint.status}
                </p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary btn-sm" onClick={handleCloseView}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isVisible={showDeletePage}
        onCancel={handleCloseDeletePage}
        onConfirm={handleDeleteComplaint}
      />
       <ToastContainer />
    </div>
  );
}
