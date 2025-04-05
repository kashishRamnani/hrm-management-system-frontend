import React, { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../../src/context/AuthContext";
import { ToastContainer, toast } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for styling
import BackButton from "../../../src/Components/Backbutton/Backbutton";
const AllJobs = () => {
  const [jobs, setJobs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth();

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
        toast.error("Something went wrong while fetching the jobs data. Please try again."); // Show error toast
      }
    }

    fetchJobs()
  }, [searchTerm])

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchTerm(query)
    navigate(`?q=${query}`)
  }

  return (
    <div className="container mt-2 ">
         <BackButton/>
      <div className="mb-3">
        <input
          type="text"
          className="form-control border-lg"
          placeholder="Search job title"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>
      <div className="table-responsive">
     
<div className="card ">
        <h4  className=" text-center fw-bold my-2"  style={{ color: "#49266a" }}>All Job Details</h4>
        <table className="table table-bordered table-striped align-middle text-nowrap">
          <thead>
            <tr>
              <th className="equal-width-column">Title</th>
              <th className="equal-width-column">Experience</th>
              <th className="equal-width-column">Skills Required</th>
            
              <th className="equal-width-column">Salary Range</th>
              <th className="equal-width-column">Status</th>
              <th className="equal-width-column">Posting Date</th>
              <th className="equal-width-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="12" className="text-center">
                  <div className="loader">
                    <div className="spinner-border" role="status">
                      <span className="sr-only"></span>
                    </div>
                  </div>
                </td>
              </tr>
            ) : jobs.length > 0 ? (
              jobs.map((job) => (
                <tr key={job.id}>
                  <td className="equal-width-column">{job.title}</td>
                  <td className="equal-width-column">{job.experience}</td>
                  <td className="equal-width-column">
                     { job.skills_required && job.skills_required.join(", ")}
                  </td>
                  
                  <td className="equal-width-column">{job.salary_range}</td>
                  <td className="equal-width-column">{job.status}</td>
                  <td className="equal-width-column">
                    {new Date(job.created_at).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </td>
                  <td className="equal-width-column">
                    <button
                      className="green-btn btn-sm"
                      onClick={() => navigate(`/job/${job.id}`)}
                    >
                      View
                    </button>
                    <button
                      className="primary-btn btn-sm mx-2"
                      onClick={() => navigate(`/job/update/${job.id}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="red-btn btn-sm"
                      onClick={() => navigate(`/job/delete/${job.id}`)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="12" className="text-center">
                  No Jobs Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>
      <ToastContainer /> 
    </div>
  )
}

export default AllJobs
