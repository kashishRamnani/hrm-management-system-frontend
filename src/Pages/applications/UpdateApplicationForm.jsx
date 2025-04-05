import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify" // Import Toastify
import "react-toastify/dist/ReactToastify.css" // Import the styles for Toastify
import { useAuth } from "../../../src/context/AuthContext";

const UpdateApplicationForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const { user } = useAuth();
  const navigate = useNavigate()
  const token = user.token
  const [applicationData, setApplicationData] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    // Fetch application data
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_HOST}/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        const application = response.data.application
        setApplicationData(application)

        // Set form data for other fields
        setValue("candidate_name", application.candidate_name)
        setValue("email", application.email)
        setValue("expected_salary", application.expected_salary)
        setValue("notice_period", application.notice_period)
        setValue("status", application.status)
        setValue("cover_letter", application.cover_letter)
      })
      .catch((error) => console.error(error))
  }, [id, setValue])

  const onSubmit = (data) => {
    const formData = new FormData()

    // Append the updated fields
    formData.append("candidate_name", data.candidate_name)
    formData.append("email", data.email)
    formData.append("expected_salary", data.expected_salary)
    formData.append("notice_period", data.notice_period)
    formData.append("status", data.status)
    formData.append("cover_letter", data.cover_letter)

    formData.append("_method", "PUT")

    // Send the form data to the backend (you can replace the URL as per your API)
    axios
      .post(
        `${import.meta.env.VITE_REACT_APP_API_HOST}/applications/${id}`,
        formData,

        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        // Display success notification using React Toastify
        toast.success("Application updated successfully!")
        setTimeout(() => {
          navigate("/all/applications")
        }, 2000)
      })
      .catch((error) => {
        // Display error notification using React Toastify
        toast.error("Error updating application. Please try again.")
      })
  }

  return (
    <div className="container mt-5">
      <ToastContainer />
      <h2>Update Job Application</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Candidate Name */}
        <div className="mb-3">
          <label className="form-label">Candidate Name</label>
          <input
            type="text"
            className={`form-control ${
              errors.candidate_name ? "is-invalid" : ""
            }`}
            {...register("candidate_name", {
              required: "Candidate name is required",
            })}
          />
          {errors.candidate_name && (
            <div className="invalid-feedback">
              {errors.candidate_name.message}
            </div>
          )}
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>

        {/* Expected Salary */}
        <div className="mb-3">
          <label className="form-label">Expected Salary</label>
          <input
            type="number"
            className={`form-control ${
              errors.expected_salary ? "is-invalid" : ""
            }`}
            {...register("expected_salary", {
              required: "Expected salary is required",
            })}
          />
          {errors.expected_salary && (
            <div className="invalid-feedback">
              {errors.expected_salary.message}
            </div>
          )}
        </div>

        {/* Notice Period */}
        <div className="mb-3">
          <label className="form-label">Notice Period</label>
          <input
            type="text"
            className={`form-control ${
              errors.notice_period ? "is-invalid" : ""
            }`}
            {...register("notice_period", {
              required: "Notice period is required",
            })}
          />
          {errors.notice_period && (
            <div className="invalid-feedback">
              {errors.notice_period.message}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            className={`form-control ${errors.status ? "is-invalid" : ""}`}
            {...register("status", { required: "Status is required" })}
          >
            <option value="pending">Pending</option>
            <option value="interview">Interview</option>
            <option value="hired">Hired</option>
            <option value="rejected">Rejected</option>
          </select>
          {errors.status && (
            <div className="invalid-feedback">{errors.status.message}</div>
          )}
        </div>

        {/* Cover Letter */}
        <div className="mb-3">
          <label className="form-label">Cover Letter</label>
          <textarea
            className={`form-control ${
              errors.cover_letter ? "is-invalid" : ""
            }`}
            {...register("cover_letter", {
              required: "Cover letter is required",
            })}
          />
          {errors.cover_letter && (
            <div className="invalid-feedback">
              {errors.cover_letter.message}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          Update Application
        </button>
      </form>
    </div>
  )
}

export default UpdateApplicationForm
