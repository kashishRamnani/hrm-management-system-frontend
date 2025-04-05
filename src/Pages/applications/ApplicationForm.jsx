import React from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import { useParams } from "react-router-dom"
import { useAuth } from "../../../src/context/AuthContext";
import BackButton from "../../../src/Components/Backbutton/Backbutton"
const ApplicationForm = () => {

  const { user } = useAuth();
  const { id } = useParams()
  const token = user.token

  // Validation schema using Yup
  const schema = yup.object().shape({
    candidate_name: yup
      .string()
      .required("Candidate name is required")
      .min(4, "Must be at least 4 characters")
      .max(255, "Cannot exceed 255 characters")
      .matches(/^[a-zA-Z]+[a-zA-Z\s]*$/, "Only letters and spaces are allowed"),
    email: yup
      .string()
      .required("Email is required")
      .email("Must be a valid email"),
    contact_number: yup
      .string()
      .required("Contact number is required")
      .matches(/^\+?[0-9]{10,12}$/, "Must be a valid phone number"),
    cover_letter: yup
      .string()
      .required("Cover letter is required")
      .min(10, "Must be at least 10 characters"),
    portfolio_link: yup.string().url("Must be a valid URL").nullable(),
    expected_salary: yup
      .number()
      .required("Expected salary is required")
      .typeError("Expected salary must be a number"),
    notice_period: yup
      .string()
      .required("Notice period is required")
      .matches(
        /^(1 week|15 days|1 month)$/,
        "Must be one of the following: 1 week, 15 days, or 1 month"
      ),
    resume: yup
      .mixed()
      .required("Resume is required")
      .test("fileType", "Only PDF files are allowed", (value) =>
        value ? value[0]?.type === "application/pdf" : false
      )
      .test(
        "fileSize",
        "File size cannot exceed 3MB",
        (value) => value && value[0]?.size <= 3072 * 1024
      ),
    status: yup.string().default("pending"), // Add default value for status
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  // Form submission handler
  const onSubmit = async (data) => {
    const formData = new FormData()
    formData.append("job_id", id) // Add job_id from params
    formData.append("candidate_name", data.candidate_name)
    formData.append("email", data.email)
    formData.append("contact_number", data.contact_number)
    formData.append("cover_letter", data.cover_letter)
    if (data.portfolio_link)
      formData.append("portfolio_link", data.portfolio_link)
    formData.append("expected_salary", data.expected_salary)
    formData.append("notice_period", data.notice_period)
    formData.append("resume", data.resume[0])
    formData.append("status", "pending") // Append status as pending

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_HOST}/applications`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      alert("Application submitted successfully!")
      reset()
    } catch (error) {
      alert("Failed to submit application.")
    }
  }

  return (
    <div className="container mt-2">
      <BackButton/>
      <h2>Job Application</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Hidden Status Field */}
        <input type="hidden" value="pending" {...register("status")} />

        {/* Row 1: Candidate Name and Email */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Candidate Name</label>
            <input
              type="text"
              className={`form-control ${
                errors.candidate_name ? "is-invalid" : ""
              }`}
              {...register("candidate_name")}
            />
            {errors.candidate_name && (
              <div className="invalid-feedback">
                {errors.candidate_name.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              {...register("email")}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>
        </div>

        {/* Row 2: Contact Number and Cover Letter */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Contact Number</label>
            <input
              type="text"
              className={`form-control ${
                errors.contact_number ? "is-invalid" : ""
              }`}
              {...register("contact_number")}
            />
            {errors.contact_number && (
              <div className="invalid-feedback">
                {errors.contact_number.message}
              </div>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Portfolio Link</label>
            <input
              type="url"
              className={`form-control ${
                errors.portfolio_link ? "is-invalid" : ""
              }`}
              {...register("portfolio_link")}
            />
            {errors.portfolio_link && (
              <div className="invalid-feedback">
                {errors.portfolio_link.message}
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Notice Period and Expected Salary */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Notice Period</label>
            <select
              className={`form-select ${
                errors.notice_period ? "is-invalid" : ""
              }`}
              {...register("notice_period")}
            >
              <option value="" hidden>
                Select Notice Period
              </option>
              <option value="1 week">1 week</option>
              <option value="15 days">15 days</option>
              <option value="1 month">1 month</option>
            </select>
            {errors.notice_period && (
              <div className="invalid-feedback">
                {errors.notice_period.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label">Expected Salary</label>
            <input
              type="text"
              min="0"
              step="any"
              inputMode="numeric"
              className={`form-control ${
                errors.expected_salary ? "is-invalid" : ""
              }`}
              {...register("expected_salary")}
              style={{
                appearance: "none", // Ensures arrows are removed across browsers
              }}
            />
            {errors.expected_salary && (
              <div className="invalid-feedback">
                {errors.expected_salary.message}
              </div>
            )}
          </div>
        </div>

        {/* Row 4: Resume and Cover Letter */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Resume (PDF only, max 3MB)</label>
            <input
              type="file"
              className={`form-control ${errors.resume ? "is-invalid" : ""}`}
              {...register("resume")}
            />
            {errors.resume && (
              <div className="invalid-feedback">{errors.resume.message}</div>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Cover Letter</label>
            <textarea
              className={`form-control ${
                errors.cover_letter ? "is-invalid" : ""
              }`}
              {...register("cover_letter")}
            />
            {errors.cover_letter && (
              <div className="invalid-feedback">
                {errors.cover_letter.message}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          Submit Application
        </button>
      </form>
    </div>
  )
}

export default ApplicationForm
