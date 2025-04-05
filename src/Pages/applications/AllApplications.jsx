import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../src/context/AuthContext";
import BackButton from "../../../src/Components/Backbutton/Backbutton";
const ApplicationsTable = () => {
  const [data, setData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const { user } = useAuth();
  const token = user.token;

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(false);
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_HOST}/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const groupedData = response.data.applications.reduce((acc, app) => {
        const job = app.job || {};
        const jobId = job.id;
        if (!jobId) return acc;
        if (!acc[jobId]) {
          acc[jobId] = { job, applications: [] };
        }
        acc[jobId].applications.push(app);
        return acc;
      }, {});
      setData(Object.values(groupedData));
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [token]);

  return (
    <div className="container mt-2">
      <BackButton/>
      
      
      <div className="table-responsive card card-body">
      
      <h4
        className="text-center mb-3 fw-bold"
        style={{ color: "#49266a" }}
      >
        Job Applications
      </h4>
     
        <table className="table table-bordered table-striped align-middle text-nowrap">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Number of Applications</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {isLoading ? (
              <tr>
                <td colSpan="3" className="text-center">
                  <div className="spinner-border " role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </td>
              </tr>
            ) :  error ? (
              <tr>
                <td colSpan="3" className="text-center text-danger">
                  Something went wrong. Please try again later.
                  
                </td>
              </tr>
            ) : data.length > 0 ? (
              data.map(({ job, applications }) => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{applications.length}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/job/applications/${job.id}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No applications available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationsTable;
