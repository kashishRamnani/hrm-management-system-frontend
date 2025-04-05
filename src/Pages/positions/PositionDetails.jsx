import React, { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "../../../src/context/AuthContext";


const PositionDetails = () => {
  const location = useLocation()
  const { user } = useAuth();
  const navigate = useNavigate()
  const { position, employees } = location.state || {
    position: "",
    employees: [],
  }

  const [editedPosition, setEditedPosition] = useState(null)
  const [newPosition, setNewPosition] = useState("")
  const [employeeList, setEmployeeList] = useState(employees)

  const handleEdit = (employee) => {
    setEditedPosition(employee)
    setNewPosition(position)
  }

  const handleSave = async () => {
    try {
      const token = user.token
      await axios.put(
        `${import.meta.env.VITE_REACT_APP_API_HOST}/positions/${editedPosition.id}`,
        {
          employee_id: editedPosition.id,
          job_position: newPosition,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setEmployeeList((prev) =>
        prev.filter((emp) => emp.id !== editedPosition.id)
      )

      toast.success("Position updated successfully!")

      setEditedPosition(null)
      setNewPosition("")
    } catch (error) {
      toast.error("Failed to update position.")
      console.error("Error updating position:", error)
    }
  }

  const handleDelete = async (employeeId) => {
    try {
      const token = user.token
      await axios.delete(
        `${import.meta.env.VITE_REACT_APP_API_HOST}/positions/${employeeId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setEmployeeList((prev) => prev.filter((emp) => emp.id !== employeeId))
      toast.success("Position deleted successfully!")
    } catch (error) {
      toast.error("Failed to delete position.")
      console.error("Error deleting position:", error)
    }
  }

  return (
    <div className="container mt-2">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        Back
      </button>
      <div className="card card-body">
      <h4
        className="text-center mb-3 fw-bold"
        style={{ color: "#49266a" }}>{position}Employees Details</h4>
      
      
      {employeeList.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Position</th>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employeeList.map((employee) => (
                <tr key={employee.id}>
                  <td>{position}</td>
                  <td>{`${employee.first_name} ${employee.last_name}`}</td>
                  <td>{employee.email}</td>
                  <td>
                    <button
                      className="primary-btn me-2"
                      onClick={() => handleEdit(employee)}
                    >
                      Edit
                    </button>
                    <button
                      className="red-btn"
                      onClick={() => handleDelete(employee.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No employees found for this position.</p>
      )}

      {/* the Edit Modal */}
      {editedPosition && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Position</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditedPosition(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="positionInput" className="form-label">
                    New Position
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="positionInput"
                    value={newPosition}
                    onChange={(e) => setNewPosition(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditedPosition(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={handleSave}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer />
      </div>
    </div>
  )
}

export default PositionDetails
