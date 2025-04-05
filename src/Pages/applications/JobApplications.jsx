import React, { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../../context/AuthContext";

const JobApplications = ({ onClose }) => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth();

  const token = user.token
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchJobApplications = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_HOST}/applications?job_id=${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setApplications(response.data.applications)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching job applications:", error)
        setLoading(false)
      }
    }

    fetchJobApplications()
  }, [id])

  const handleDelete = async (applicationId) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_REACT_APP_API_HOST}/applications/${applicationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setApplications((prevApplications) =>
          prevApplications.filter((app) => app.id !== applicationId)
        )

        alert("Application deleted successfully.")
      } catch (error) {
        console.error("Error deleting application:", error)
        alert("Failed to delete application.")
      }
    }
  }

  const handleUpdate = (applicationId) => {
    // Placeholder function for update logic
    alert(`Update functionality for application ID: ${applicationId}`)
  }

  const jobTitle = applications.map((app) => app.job.title)

  return (
    <div className="mt-4">
      <h3 className="text-center text-lg font-bold">
        Applications for {jobTitle[0]}
      </h3>
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        Back
      </button>
      {loading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : applications.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-bordered table-responsive w-full">
            <thead className="bg-gray-200 text-sm">
              <tr>
                <th>Candidate Name</th>
                <th>Email</th>
                <th>Contact Number</th>
                <th>Cover Letter</th>
                <th>Expected Salary</th>
                <th>Notice Period</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.candidate_name}</td>
                  <td>{app.email}</td>
                  <td>{app.contact_number}</td>
                  <td>{app.cover_letter}</td>
                  <td>{app.expected_salary}</td>
                  <td>{app.notice_period}</td>
                  <td>
                    <a
                      href={`${import.meta.env.VITE_API_HOST}/${app.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Resume
                    </a>
                  </td>
                  <td>{app.status}</td>
                  <td>
                    <button
                      className="btn btn-warning mr-2 text-sm"
                      onClick={() =>
                        navigate(`/job/application/update/${app.id}`)
                      }
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger text-sm"
                      onClick={() => handleDelete(app.id)}
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
        <p>No applications found for this job.</p>
      )}
    </div>
  )
}

export default JobApplications
