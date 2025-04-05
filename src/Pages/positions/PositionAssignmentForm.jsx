import React, { useState, useEffect } from "react"
import axios from "axios"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "../../../src/context/AuthContext";
import BackButton from "../../Components/Backbutton/Backbutton"
// Validation schema
const validationSchema = yup.object({
  employee_id: yup.string().required("Please select an employee"),
  job_position: yup
    .string()
    .required("job_position is required")
    .min(3, "job_position must be at least 3 characters")
    .max(100, "job_position cannot exceed 100 characters"),
})

const job_positionAssignmentForm = () => {
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState(null)
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors: formErrors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onSubmit",
  })

 
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true)
        const token = user.token
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_HOST}/employees`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setEmployees(response.data.employees)
        setIsLoading(false)
      } catch (error) {
        setErrors(error)
        console.error("Error fetching employees:", error)
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  const onSubmit = async (data) => {
    try {
      const token = user.token
      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_HOST}/positions`,
        {
          employee_id: data.employee_id,
          job_position: data.job_position,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      toast.success("job_position assigned successfully!")
      reset()
    } catch (error) {
      console.error("Error assigning job_position:", error)
      if (error.response && error.response.data) {
        const { data } = error.response
        if (data.errors && data.errors.employee_id) {
          setError("employee_id", {
            type: "server",
            message: data.errors.employee_id,
          })
        } else {
          toast.error("Failed to assign job_position!")
        }
      } else {
        toast.error("An unexpected error occurred!")
      }
    }
  }

  return (
    <div className="container mt-2">
      <BackButton/>
      <ToastContainer />
      
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow p-4 rounded border"
      >
        <h4 className=" text-center mb-3 fw-bold" style={{ color: "#49266a" }}>
          Add Job Position
          </h4>
         {isLoading ? (
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
          <>
            <div className="mb-3">
              <label htmlFor="employee_id" className="form-label">
                Select Employee
              </label>
              <select
                id="employee_id"
                className={`form-control ${
                  formErrors.employee_id ? "is-invalid" : ""
                }`}
                {...register("employee_id")}
              >
                <option value="">-- Select Employee --</option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.first_name} {employee.last_name}
                  </option>
                ))}
              </select>
              {formErrors.employee_id && (
                <div className="invalid-feedback">
                  {formErrors.employee_id.message}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="job_position" className="form-label">
                Job Position
              </label>
              <input
                type="text"
                id="job_position"
                className={`form-control ${
                  formErrors.job_position ? "is-invalid" : ""
                }`}
                {...register("job_position")}
              />
              {formErrors.job_position && (
                <div className="invalid-feedback">
                  {formErrors.job_position.message}
                </div>
              )}
            </div>

            <div className="text-center">
              <button type="submit" className="primary-btn px-5 py-2 fw-bold ">
                Submit
              </button>
            </div>
          
          </>
        )}
      </form>
      {errors && <p className="text-danger mt-3">{errors.message}</p>}
    </div>
  )
}

export default job_positionAssignmentForm
