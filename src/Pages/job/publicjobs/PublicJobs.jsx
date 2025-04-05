import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../../../src/context/AuthContext";

const PublicJobs = () => {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useAuth();

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q") || ""
    setSearchTerm(query)
  }, [location])

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_HOST}/jobs`,
          {
            params: { q: searchTerm },
          }
        )
        setJobs(response.data.jobs)
        setIsLoading(false)
      } catch (error) {
        setErrors(error)
        console.error("Error fetching jobs data:", error)
        setIsLoading(false)
      }
    }

    fetchJobs()
  }, [searchTerm])

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchTerm(query)
    navigate(`?q=${query}`)
  }

  if (errors) {
    return <h1>Something went wrong</h1>
  }

  return (
    <div className="container-fluid mt-4 p-3">
      <div className="mb-4">
        <input
          type="text"
          className="form-control rounded-pill px-4 py-2"
          placeholder="Search jobs"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>

      {isLoading ? (
        <div className="text-center d-flex align-items-center justify-content-center">
          <div className="spinner-border " role="status">
            <span className="sr-only"></span>
          </div>
        </div>
      ) : (
        <div className="row">
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div className="col-12 col-md-6 col-lg-4 mb-4" key={job.id}>
                <div className=" card  h-100 shadow-sm border-0">
                  <div className="job-card card-body d-flex flex-column">
                    <h5 className="text-white card-title text-uppercase fw-bold">
                      {job.title}
                    </h5>

                    <p className="card-text text-white mb-4">
                      {job.description.slice(0, 100)}...
                    </p>

                    <span
                      className={`job-badge badge ${
                        job.status.toLowerCase() === "open"
                          ? "bg-success"
                          : "bg-danger"
                      } mb-3`}
                    >
                      {job.status}
                    </span>

                    <p className="job-date  mb-4 ">
                      Posted on:{" "}
                      {new Date(job.created_at).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </p>

                    {/* Buttons */}
                    <div className="mt-auto d-flex justify-content-between">
                      <button
                        className=" btn btn-secondary btn-sm px-4 py-2"
                        onClick={() => navigate(`/public/job/${job.id}`)}
                      >
                        View
                      </button>
                      <button
                        className="green-btn btn-sm px-4 py-2"
                        onClick={() => navigate(`/job/application/${job.id}`)}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted">No jobs found.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default PublicJobs
