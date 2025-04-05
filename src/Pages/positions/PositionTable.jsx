import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../../src/context/AuthContext";
import BackButton from "../../../src/Components/Backbutton/Backbutton";
const PositionTable = () => {
  const [positions, setPositions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState(null)
  const navigate = useNavigate()
  const { user } = useAuth();

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setIsLoading(true)
        const token = user.token
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_HOST}/positions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setPositions(response.data.position) 
        setIsLoading(false)
      } catch (error) {
        setErrors(error)
        console.error("Error fetching positions:", error)
        setIsLoading(false)
      }
    }

    fetchPositions()
  }, [])

  
  const positionCounts = positions.reduce((acc, curr) => {
    const jobPosition = curr.job_position
    acc[jobPosition] = acc[jobPosition] || { count: 0, employees: [] }
    acc[jobPosition].count += 1
    acc[jobPosition].employees.push(curr.employee)
    return acc
  }, {})

  const handleViewAll = (position) => {
    const positionData = positionCounts[position]
    navigate("/position-details", {
      state: { position, employees: positionData.employees },
    })
  }

  return (
    <div className="container mt-2">
      <BackButton/>
      <div className="card card-body">
      <h4 className=" text-center mb-3 fw-bold" style={{ color: "#49266a" }}>
     All Employees Positions
          </h4>
      
          {isLoading ? (
                  <tr>
                    <td colSpan="10" className="text-center">
                      <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                      </div>
                    </td>
                  </tr>
                ) : errors ? (
        <p className="text-danger">Error loading data: {errors.message}</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle text-nowrap">
            <thead>
              <tr>
                <th>Position</th>
                <th>Number of Employees</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(positionCounts).map(([position, data]) => (
                <tr key={position}>
                  <td>{position}</td>
                  <td>{data.count}</td>
                  <td>
                    <button
                      className="primary-btn"
                      onClick={() => handleViewAll(position)}
                    >
                      View All
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  )
}

export default PositionTable
