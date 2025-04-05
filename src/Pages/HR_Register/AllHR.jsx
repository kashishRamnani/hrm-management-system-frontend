import React, { useEffect, useState } from 'react';
import { HR } from "../../utils/HRRegister";
import { useAuth } from '../../../src/context/AuthContext';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteConfirmationModal from "../../../src/Components/DelectModel";
import BackButton from '../../../src/Components/Backbutton/Backbutton';
import { useLocation, useParams } from 'react-router-dom';
import filterRecords from '../../utils/functions/filter.records';
export default function AllHR() {
  const { user } = useAuth();
  const [allHRS, setAllHRS] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteHRId, setDeleteHRId] = useState(null);
  const location = useLocation();

  useEffect(()=>{
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q"); 

    query && setAllHRS(preRecords => filterRecords(preRecords, query));
  },[location, location.search]);

  useEffect(() => {
    if (!user?.token) return;

    const fetchHRData = async () => {
      setIsLoading(true);
      try {
        await HR.all(user.token, setAllHRS, () => {}, setIsLoading);
        if (allHRS.length === 0) {
          
        }
      } catch (err) {
        console.error("Failed to load data:", err.message);
        setErrors({ fetch: [err.message] });
        toast.error("Failed to load HR records");
      } finally {
        setIsLoading(false);
      }
    };

    fetchHRData();
  }, [user.token ]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await HR.update(id, status, user.token, () => {});
      setAllHRS((prevHRS) =>
        prevHRS.map((hr) => (hr.id === id ? { ...hr, status } : hr))
      );
      toast.success("HR status updated successfully");
    } catch (err) {
      console.error("Error updating status:", err);
      setErrors({ status: [err.message] });
      toast.error("Failed to update HR status");
    }
  };

  const handleShowDeletePage = (id) => {
    setDeleteHRId(id);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setDeleteHRId(null);
  };

  const handleDeleteHR = async () => {
    if (!deleteHRId) return;
    try {
      await HR.delete(deleteHRId, user.token, setErrors);
      setAllHRS((prevHRS) => prevHRS.filter((hr) => hr.id !== deleteHRId));
      toast.success("HR deleted successfully");
      setIsDeleteModalVisible(false);
    } catch (err) {
      console.error("Failed to delete HR:", err);
      toast.error("Failed to delete HR");
      setIsDeleteModalVisible(false);
    }
  };

  return (
    <div className="container mt-4">
      <BackButton/>
      <div className='card card-body'>
      <h4 className="text-center fw-bold" style={{ color: "#49266a" }}>
        All HR Details
      </h4>

      {isLoading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <table className="table table-striped table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allHRS.map((hr) => (
              <tr key={hr.id}>
                <td>{hr.name}</td>
                <td>{hr.email}</td>
                <td>
                  <span
                    className={`badge ${
                      hr.status === "approved"
                        ? "bg-success"
                        : hr.status === "pending"
                        ? "bg-warning"
                        : "bg-secondary"
                    }`}
                  >
                    {hr.status.charAt(0).toUpperCase() + hr.status.slice(1)}
                  </span>
                </td>
                <td>
                  {hr.status === "pending" && (
                    <button
                      onClick={() => handleUpdateStatus(hr.id, "approved")}
                      className="primary-btn btn-sm me-2"
                    >
                      Approve
                    </button>
                  )}
                  {hr.status === "approved" && (
                    <button
                      onClick={() => handleUpdateStatus(hr.id, "blocked")}
                      className="primary-btn btn-sm me-2"
                    >
                      Lock
                    </button>
                  )}
                  {hr.status === "blocked" && (
                    <button
                      onClick={() => handleUpdateStatus(hr.id, "approved")}
                      className=" primary-btn btn-sm me-2"
                    >
                      Unlock
                    </button>
                  )}
                  <button
                    onClick={() => handleShowDeletePage(hr.id)}
                     className="btn btn-danger rounded-3"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <DeleteConfirmationModal
        isVisible={isDeleteModalVisible}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteHR}
      />

      <ToastContainer />
    </div>
    </div>
  );
}
