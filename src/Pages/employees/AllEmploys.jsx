import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../src/context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "../../../src/Components/Backbutton/Backbutton";
const AllEmploys = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setIsLoading(true);
        const token = user.token;
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_HOST}/employees`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEmployees(response.data.employees);
        setIsLoading(false);
        if (response.data.employees.length === 0) {
          toast.info("No records found.");
        }
      } catch (error) {
        setErrors(error);
        toast.error("Something went wrong while fetching data.");
        setIsLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  const handleDelete = (id) => {
    try {
     
      toast.success("Employee deleted successfully!");
    
    } catch (error) {
      toast.error("Failed to delete employee.");
    }
  };

  return (
    <div className="container my-4">
      <BackButton/>
      <ToastContainer /> 
   
        <div className="card table-responsive ">
        <h4 className=" text-center fw-bold pt-2" style={{ color: "#49266a" }}>
           All Employees
          </h4>
        
            <table className="table table-bordered table-striped align-middle text-nowrap">
              <thead>
                <tr>
                  <th>First Name</th>
                 <th>Email</th>
                 
                  <th>Phone</th>
                  
                  <th>Office in Timing</th>
                  <th>Office out Timing</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="10" className="text-center">
                      <div className="spinner-border" role="status">
                        <span className="sr-only"></span>
                      </div>
                    </td>
                  </tr>
                ) : employees.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center">
                      No records found
                    </td>
                  </tr>
                ) : (
                  employees.map((emp) => (
                    <tr key={emp.id}>
                      <td>{emp.first_name}</td>
                      <td>{emp.email.slice(0,5) + "..."}</td>
                      <td>{emp.last_name}</td>
                      <td>{emp.phone}</td>
                      
                      <td>{emp.office_in_timing}</td>
                      <td>{emp.office_out_timing}</td>
                      <td>{emp.status}</td>
                      <td>
                        <button
                          className="green-btn btn-sm"
                          onClick={() => navigate(`/employee/${emp.id}`)}
                        >
                          View
                        </button>
                        <button
                          className="primary-btn btn-sm mx-2 "
                          onClick={() => navigate(`/employee/update/${emp.id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="red-btn btn-sm"
                          onClick={() => navigate(`/employee/delete/${emp.id}`)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
        
        </div>
     
    </div>
  );
};

export default AllEmploys;
