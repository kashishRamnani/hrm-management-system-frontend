import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useAuth } from "../../../src/context/AuthContext";

const SingleJob = () => {
  const [job, setJob] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { id } = useParams()
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setIsLoading(true)
        const token = user.token
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_HOST}/jobs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setJob(response.data.job)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching job data:", error)
        setIsLoading(false)
      }
    }

    fetchJobData()
  }, [id])

  const handleDelete = async (id) => {
    try {
      const token = user.token
      await axios.delete(`${import.meta.env.VITE_REACT_APP_API_HOST}/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success("job deleted successfully")
      navigate("/jobs")
    } catch (error) {
      console.error("Error deleting job:", error)
      toast.success("could not delete the job")
    }
  }

  return (
    <div className="d-flex justify-content-center mt-5 ">
      <div
        className="card shadow employee-details-card"
        style={{ width: "50rem" }}
      >
        <div className="card-header custom-header text-center ">
          Job Details
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
            <div className="job-details-grid">
              <div className="employee-info-group">
                <span className="label">Title:</span>
                <span className="info">{job.title}</span>
              </div>
              <div className="employee-info-group">
                <span className="label">Experience:</span>
                <span className="info">{job.experience}</span>
              </div>
              <div className="employee-info-group">
                <span className="label">Skills Required:</span>
                <span className="info">
                  {job.skills_required ? job.skills_required.join(", ") : "N/A"}
                </span>
              </div>
              <div className="employee-info-group">
                <span className="label">Employment Type:</span>
                <span className="info">{job.employment_type}</span>
              </div>
              <div className="employee-info-group">
                <span className="label">Location:</span>
                <span className="info">{job.job_location}</span>
              </div>
              <div className="employee-info-group">
                <span className="label">Salary Range:</span>
                <span className="info">{job.salary_range}</span>
              </div>
              <div className="employee-info-group">
                <span className="label">Qualifications:</span>
                <span className="info">{job.qualifications}</span>
              </div>
              <div className="employee-info-group">
                <span className="label">Benefits:</span>
                <span className="info">
                  {job.benefits ? job.benefits.join(", ") : "N/A"}
                </span>
              </div>
              <div className="employee-info-group">
                <span className="label">Status:</span>
                <span className="info">{job.status}</span>
              </div>
              <div className="employee-info-group">
                <span className="label">Posting Date:</span>
                <span className="info">   {new Date(job.created_at).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}</span>
              </div>
              <div className="employee-info-group">
                <span className="label">Description:</span>
                <span className="info">{job.description}</span>
              </div>
            </div>
          </div>
        )}
        <div className="card-footer text-center">
          <button
            className=" primary-btn mx-2"
            onClick={() => navigate(`/job/update/${job.id}`)}
          >
            Edit
          </button>
          <button
            className=" red-btn mx-2"
            onClick={() => handleDelete(job.id)}
          >
            Delete
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default SingleJob
