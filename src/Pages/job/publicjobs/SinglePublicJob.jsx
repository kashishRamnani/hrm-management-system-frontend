import React, { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"

const SinglePublicJob = () => {
  const [job, setJob] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setIsLoading(true)
        const token = "76|BfitO4ng8PVpQ41AOS9TCONyTxgCyCG9Opm0K3HX961134cd" // Static token
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

  return (
    <div className="single-job-container container d-flex justify-content-center align-items-center mt-1">
      <div
        className="card single-job-card shadow-lg"
        style={{ backgroundColor: "#482668", color: "#fff" }}
      >
        {isLoading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "300px" }}
          >
            <div className="spinner-border text-light" role="status">
              <span className="sr-only"></span>
            </div>
          </div>
        ) : (
          <>
            <div className="single-job-title text-center mb-4">
              <h1>{job.title}</h1>
              <hr className="title-line" />
            </div>

            <div
              className="d-flex flex-column gap-4"
              style={{ padding: "1rem 2rem" }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <span
                  className={`public-job-status badge ${
                    job.status === "open" ? "bg-success" : "bg-danger"
                  } px-4 py-2`}
                >
                  {job.status}
                </span>
                <span
                  className="text-light"
                  style={{
                    fontStyle: "italic",
                    fontSize: "1rem",
                  }}
                >
                  Posted on:{" "}
                  {new Date(job.created_at).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
              </div>

              <div>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex gap-5">
                    <div>
                      <strong>Experience:</strong> <p>{job.experience}</p>
                    </div>
                    <div>
                      <strong>Employment Type:</strong>
                      <p>{job.employment_type}</p>
                    </div>
                    <div>
                      <strong>Location:</strong> <p>{job.job_location}</p>
                    </div>
                    <div>
                      <strong>Salary Range:</strong>
                      <p> {job.salary_range}</p>
                    </div>
                  </div>

                  <div className="d-flex gap-5">
                    <div className="mb-3">
                      <strong>Skills Required:</strong>
                      <div className="mt-2">
                        {job.skills_required &&
                        job.skills_required.length > 0 ? (
                          job.skills_required.map((skill, index) => (
                            <span
                              key={index}
                              className="badge bg-primary me-2 mb-2"
                              style={{
                                fontSize: "0.9rem",
                                padding: "0.5rem 0.75rem",
                                borderRadius: "10px",
                              }}
                            >
                              {skill.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-light">N/A</span>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <strong>Benefits:</strong>
                      <div className="mt-2 ">
                        {job.benefits && job.benefits.length > 0 ? (
                          job.benefits.map((benefit, index) => (
                            <span
                              key={index}
                              className="badge bg-primary me-2 mb-2"
                              style={{
                                fontSize: "0.9rem",
                                padding: "0.5rem 0.75rem",
                                borderRadius: "10px",
                              }}
                            >
                              {benefit.trim()}
                            </span>
                          ))
                        ) : (
                          <span className="text-light">N/A</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <strong>Description:</strong> <p> {job.description}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-5">
              <button
                className="btn btn-success px-5 py-3 fw-bold"
                style={{
                  fontSize: "1.2rem",
                  borderRadius: "30px",
                  letterSpacing: "0.5px",
                  boxShadow: "0 4px 10px rgba(40, 167, 69, 0.4)",
                  transition: "all 0.3s ease-in-out",
                }}
                onClick={() => navigate(`/job/apply/${job.id}`)}
                onMouseOver={(e) => {
                  e.target.style.transform = "scale(1.05)"
                  e.target.style.boxShadow = "0 6px 15px rgba(40, 167, 69, 0.6)"
                  e.target.style.backgroundColor = "#218838"
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = "scale(1)"
                  e.target.style.boxShadow = "0 4px 10px rgba(40, 167, 69, 0.4)"
                  e.target.style.backgroundColor = ""
                }}
              >
                Apply Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SinglePublicJob
