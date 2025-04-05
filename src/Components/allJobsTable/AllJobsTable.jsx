import React, { useState, useEffect } from "react";
import { JOB } from "../../utils/Job"; // Ensure JOB.all is implemented correctly
import "../employePerformance/EmpPerformanceChart.css";
import "./alljobs.css";
import { useAuth } from "../../context/AuthContext";

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]); 
  const [expandedJobId, setExpandedJobId] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [message, setMessage] = useState(""); 

  useEffect(() => {
    if (user?.token) {
      setLoading(true); 
      JOB.all(user.token)
        .then((data) => {
          setJobs(data); 
          setMessage(""); 
        })
        .catch((err) => setMessage("Failed to load data: " + err.message))
        .finally(() => setLoading(false)); 
    }
  }, [user.token]);

  const toggleJobDetails = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  return (
    <div className="jobtable-container container">
      <h2 className="chart-title text-center mb-3">Jobs Application Section</h2>

      {loading ? (
        <p className="text-center">Loading jobs...</p>
      ) : message ? (
        <p className="text-center text-danger">{message}</p>
      ) : jobs.length === 0 ? (
        <p className="text-center text-warning">No jobs available at the moment.</p>
      ) : (
        <div className="table-container rounded-4">
          <table className="small table table-striped table-hover text-center align-middle">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Location</th>
                <th>Experience</th>
                <th>Qualifications</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <React.Fragment key={job.id}>
                  <tr>
                    <td>{job.title || "N/A"}</td>
                    <td>{job.employment_type || "N/A"}</td>
                    <td>{job.job_location || "N/A"}</td>
                    <td>{job.experience || "N/A"}</td>
                    <td>{job.qualifications || "N/A"}</td>
                    <td>
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => toggleJobDetails(job.id)}
                      >
                        <i
                          className={`fas ${
                            expandedJobId === job.id ? "fa-eye-slash" : "fa-eye"
                          }`}
                        ></i>
                      </button>
                    </td>
                  </tr>

                  {expandedJobId === job.id && (
                    <tr>
                      <td colSpan="6">
                        <div className="description-box rounded-4 p-3">
                          <h4>Job Details</h4>
                          <p><strong>Position:</strong> {job.title || "N/A"}</p>
                          <p><strong>Type:</strong> {job.employment_type || "N/A"}</p>
                          <p><strong>Location:</strong> {job.job_location || "N/A"}</p>
                          <p><strong>Experience:</strong> {job.experience || "N/A"}</p>
                          <p><strong>Qualifications:</strong> {job.qualifications || "N/A"}</p>
                          <p><strong>Salary Range:</strong> {job.salary_range || "N/A"}</p>
                          <p><strong>Description:</strong> {job.description || "N/A"}</p>
                          <p><strong>Skills Required:</strong> {job.skills_required?.join(", ") || "N/A"}</p>
                          <p><strong>Benefits:</strong> {job.benefits?.join(", ") || "N/A"}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
