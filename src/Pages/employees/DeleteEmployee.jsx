// DeleteEmployeeModal.js
import React from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import { useAuth } from "../../../src/context/AuthContext";

const DeleteEmployee = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth();

  const onClose = () => {
    navigate("/employees")
  }

  const handleDelete = async () => {
    try {
      const token = user.token
      await axios.delete(`${import.meta.env.VITE_REACT_APP_API_HOST}/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success("Employee record deleted succesfully!")
      navigate("/employees")
    } catch (error) {
      toast.error("Error deleting employee")
    }
  }

  return (
    <div className="modal show d-block" tabIndex="-1">
      <ToastContainer />
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header custom-header">
            <h5 className="modal-title ">Confirm Delete</h5>
            <button
              type="button"
              className=" btn-close "
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this employee?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              No
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteEmployee
