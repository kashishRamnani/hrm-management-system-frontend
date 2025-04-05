import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../../src/context/AuthContext";
import BackButton from "../../../src/Components/Backbutton/Backbutton";
const SingleEmployee = () => {
  const [employee, setEmployee] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setIsLoading(true)
        const token = user.token
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_HOST}/employees/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setEmployee(response.data.employee)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching employee data:", error)
        setIsLoading(false)
      }
    }

    fetchEmployeeData()
  }, [id, user.token])

  const handleDelete = async (empId) => {
    try {
      const token = import.meta.env.VITE_AUTH_TOKEN
      await axios.delete(
        `${import.meta.env.VITE_API_HOST}/employees/${empId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      navigate("/employees")
    } catch (error) {
      console.error("Error deleting employee:", error)
    }
  }

  const handleClose = () => {
    navigate("/employees"); // Navigate back to the employees list when close button is clicked
  }

  return (
    <div className="d-flex justify-content-center mt-2">
      <BackButton/>
      <div className="card shadow-lg employee-details-card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h2 className="mb-0 text-center flex-grow-1">Employee Details</h2>
          {/* Close button aligned to the right side in the header */}
          <button 
            type="button" 
            className="btn btn-close btn-close-white" 
            onClick={handleClose}
          ></button>
        </div>
        {isLoading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "300px" }}
          >
            <div className="spinner-border" role="status">
              <span className="sr-only"></span>
            </div>
          </div>
        ) : (
          <div className="card-body">
            <div className="employee-info-section">
              <div className="employee-info-group">
                <span className="label">First Name:</span>
                <span className="info">{employee.first_name}</span>
              </div>
              <div className="employee-info-group">
                <span className="label">Last Name:</span>
                <span className="info">{employee.last_name}</span>
              </div>
              <div className="employee-info-group">
                <span className="label">Email:</span>
                <span className="info">{employee.email}</span>
              </div>
              <div className="employee-info-group">
                <span className="label">Phone:</span>
                <span className="info">{employee.phone}</span>
              </div>

              <div className="employee-info-group">
                <span className="label">Date of Joining:</span>
                <span className="info">{employee.date_of_joining}</span>
              </div>
              <div className="employee-info-group">
                <span className="label"> Office In Timing:</span>
                <span className="info">{employee.office_in_timing}</span>
              </div>
              <div className="employee-info-group">
                <span className="label">Office Out Timing:</span>
                <span className="info">{employee.office_out_timing}</span>
              </div>

              <div className="employee-info-group">
                <span className="label">Status:</span>
                <span className="info">{employee.status}</span>
              </div>
              <div className="employee-info-group">
                <span className="label">Added by:</span>
                <span className="info">
                  {employee.user ? employee.user.name : "N/A"}
                </span>
              </div>
              <div className="employee-info-group">
                <span className="label">Address:</span>
                <span className="info">{employee.address}</span>
              </div>
            </div>
          </div>
        )}
        <div className="card-footer">
          <button
            className="primary-btn"
            onClick={() => navigate(`/employee/update/${employee.id}`)}
          >
            Edit
          </button>
          <button
            className="red-btn"
            onClick={() => handleDelete(employee.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default SingleEmployee
