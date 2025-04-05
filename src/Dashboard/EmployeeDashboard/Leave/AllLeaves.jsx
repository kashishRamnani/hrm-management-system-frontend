import React, { useState, useEffect } from "react";
import { Leaves } from "../../../utils/Leave"; 
import { useAuth } from "../../../context/AuthContext"; 
import DeleteConfirmationModal from "../../../Components/DelectModel"; // Adjust the import path
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import BackButton from "../../../Components/Backbutton/Backbutton";
export default function AllLeaves() {
  const { user} = useAuth();
  const [leaveData, setLeaveData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeletePage, setShowDeletePage] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [viewLeave, setViewLeave] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [message,setMessage] = useState("")
  // Fetch leaves data
 useEffect(() => {
     if (user?.token) {
    
       Leaves
         .all(user.token, setLeaveData, setMessage, setLoading)
         .catch((err) => console.error("Error fetching complaints:", err));
     }
   }, [user?.token]);
  

  // Handle delete confirmation modal
  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setShowDeletePage(true);
  };

  const handleDeleteLeave = async () => {
    if (deleteIndex !== null) {
      try {
        setIsDeleting(true);
        await Leaves.delete(leaveData[deleteIndex].id, user.token,message);
        setLeaveData((prev) => prev.filter((_, index) => index !== deleteIndex));
        
      } catch (error) {
        toast.error(error.message, {theme:'colored'});
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

  const handleViewClick = (leave) => {
    setViewLeave(leave);
  };

  const handleCloseView = () => {
    setViewLeave(null);
  };

  return (
    <div className="container my-2">
      <BackButton/>
      <div className="card shadow">
        <div className="card-body">
          <h4 className=" text-center mb-3 fw-bold" style={{ color: "#49266a" }}>
            Employee Leaves
          </h4>

          {loading ? (
            <div className="loading-overlay">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : leaveData.length === 0 ? (
            <p className="text-center"></p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped align-middle">
                <thead className="text-white" style={{ backgroundColor: "#49266a" }}>
                  <tr>
                    <th>Employee Name</th>
                    <th>Leave Date</th>
                    <th>Reason</th>
                   
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveData.map((leave, index) => (
                    <tr key={leave.id}>
                      <td>
                        {leave.employee
                          ? `${leave.employee.first_name} ${leave.employee.last_name}`
                          : "Unknown Employee"}
                      </td>
                      <td>{leave.leave_date}</td>
                      <td>{leave.leave_reason}</td>
                     
                      <td>
                        <div className="d-flex">
                          <button
                            onClick={() => handleViewClick(leave)}
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

      {/* View Leave Details Modal */}
      {viewLeave && (
        <div className="modal show d-block vh-100" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div
                className="modal-header text-white"
                style={{ backgroundColor: "#49266a", justifyContent: "center" }}
              >
                <h5 className="modal-title">Leave Details</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseView}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  <strong>Employee Name:</strong>{" "}
                  {viewLeave.employee
                    ? `${viewLeave.employee.first_name} ${viewLeave.employee.last_name}`
                    : "Unknown Employee"}
                </p>
                <p>
                  <strong>Leave Date:</strong> {viewLeave.leave_date}
                </p>
                <p>
                  <strong>Reason:</strong> {viewLeave.reason}
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
        onConfirm={handleDeleteLeave}
      />

      <ToastContainer />
    </div>
  );
}
