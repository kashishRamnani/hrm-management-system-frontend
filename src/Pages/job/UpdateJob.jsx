import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useAuth } from "../../../src/context/AuthContext";

const validationSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .test("min-length", "Title must be at least 10 characters", (value) => {
      return value && value.replace(/\s/g, "").length >= 10
    })
    .max(255, "Title cannot exceed 255 characters")
    .matches(
      /^[a-zA-Z]+[a-zAZ\s]*/,
      "Title can only contain letters and spaces"
    ),
  experience: yup
    .string()
    .required("Experience is required")
    .min(2, "Experience must be at least 2 characters")
    .max(255, "Experience cannot exceed 255 characters"),
  employment_type: yup
    .string()
    .required("Employment type is required")
    .oneOf(
      ["full-time", "part-time", "contract", "internship"],
      "Invalid employment type"
    ),
  job_location: yup
    .string()
    .required("Job location is required")
    .min(4, "Job location must be at least 4 characters")
    .max(255, "Job location cannot exceed 255 characters"),
  salary_range: yup
    .string()
    .required("Salary range is required")
    .matches(/^[567][0-9]*K$/i, "Invalid salary range format"),
  qualifications: yup
    .string()
    .required("Qualifications are required")
    .min(2, "Qualifications must be at least 2 characters")
    .max(255, "Qualifications cannot exceed 255 characters"),
  // benefits: yup.string().nullable(),
  // skills_required: yup.string().nullable(),
  status: yup
    .string()
    .required("Status is required")
    .oneOf(["open", "closed"], "Invalid status"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(255, "Description cannot exceed 255 characters"),
})

const UpdateJob = () => {
  const [message, setMessage] = useState("")
  const [jobData, setJobData] = useState(null)
  const { id } = useParams()
  const { user } = useAuth();
  const navigate = useNavigate()
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      experience: "",
      employment_type: "full-time",
      job_location: "",
      salary_range: "",
      qualifications: "",
      benefits: "[]",
      skills_required: "[]",
      status: "open",
    },
  })

  useEffect(() => {
    const fetchJobData = async () => {
      try {
        const token =user.token
        const response = await axios.get(
          `${import.meta.env.VITE_REACT_APP_API_HOST}/jobs/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setJobData(response.data.job)
      } catch (error) {
        console.log("Error fetching job data")
      }
    }

    fetchJobData()
  }, [id])

  useEffect(() => {
    if (jobData) {
      reset(jobData)
    }
  }, [jobData, reset])

  const onSubmit = async (data) => {
    try {
      console.log(data)
     
      const token = user.token
      await axios.put(`${import.meta.env.VITE_REACT_APP_API_HOST}/jobs/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      console.log(data)
      toast.success("Job advertisement updated successfully!")
      navigate("/jobs")
    } catch (error) {
      toast.error("Error updating job advertisement!")
    }
  }

  return (
    <div className="container mt-5">
      <div
        className="shadow-lg p-4 rounded bg-white"
        style={{ maxWidth: "800px", margin: "auto" }}
      >
        <h4 className="card-title text-center mb-3 fw-bold" style={{ color: "#49266a" }}>
        Update Job Advertisement
          </h4>
       
        <form onSubmit={handleSubmit(onSubmit)} className="row g-3">
          <div className="col-md-6">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  id="title"
                  className={`form-control ${errors.title ? "is-invalid" : ""}`}
                  {...field}
                />
              )}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title.message}</div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="experience" className="form-label">
              Experience
            </label>
            <Controller
              name="experience"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  id="experience"
                  className={`form-control ${
                    errors.experience ? "is-invalid" : ""
                  }`}
                  {...field}
                />
              )}
            />
            {errors.experience && (
              <div className="invalid-feedback">
                {errors.experience.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="employment_type" className="form-label">
              Employment Type
            </label>
            <Controller
              name="employment_type"
              control={control}
              render={({ field }) => (
                <select
                  id="employment_type"
                  className={`form-control ${
                    errors.employment_type ? "is-invalid" : ""
                  }`}
                  {...field}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              )}
            />
            {errors.employment_type && (
              <div className="invalid-feedback">
                {errors.employment_type.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="job_location" className="form-label">
              Job Location
            </label>
            <Controller
              name="job_location"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  id="job_location"
                  className={`form-control ${
                    errors.job_location ? "is-invalid" : ""
                  }`}
                  {...field}
                />
              )}
            />
            {errors.job_location && (
              <div className="invalid-feedback">
                {errors.job_location.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="salary_range" className="form-label">
              Salary Range
            </label>
            <Controller
              name="salary_range"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  id="salary_range"
                  className={`form-control ${
                    errors.salary_range ? "is-invalid" : ""
                  }`}
                  {...field}
                />
              )}
            />
            {errors.salary_range && (
              <div className="invalid-feedback">
                {errors.salary_range.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="qualifications" className="form-label">
              Qualifications
            </label>
            <Controller
              name="qualifications"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  id="qualifications"
                  className={`form-control ${
                    errors.qualifications ? "is-invalid" : ""
                  }`}
                  {...field}
                />
              )}
            />
            {errors.qualifications && (
              <div className="invalid-feedback">
                {errors.qualifications.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="benefits" className="form-label">
              Benefits
            </label>
            <Controller
              name="benefits"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  id="benefits"
                  className={`form-control ${
                    errors.benefits ? "is-invalid" : ""
                  }`}
                  {...field}
                />
              )}
            />
            {errors.benefits && (
              <div className="invalid-feedback">{errors.benefits.message}</div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="skills_required" className="form-label">
              Skills Required
            </label>
            <Controller
              name="skills_required"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  id="skills_required"
                  className={`form-control ${
                    errors.skills_required ? "is-invalid" : ""
                  }`}
                  {...field}
                />
              )}
            />
            {errors.skills_required && (
              <div className="invalid-feedback">
                {errors.skills_required.message}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select
                  id="status"
                  className={`form-control ${
                    errors.status ? "is-invalid" : ""
                  }`}
                  {...field}
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              )}
            />
            {errors.status && (
              <div className="invalid-feedback">{errors.status.message}</div>
            )}
          </div>

          <div className="col-md-6">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  id="description"
                  className={`form-control ${
                    errors.description ? "is-invalid" : ""
                  }`}
                  rows="3"
                  {...field}
                />
              )}
            />
            {errors.description && (
              <div className="invalid-feedback">
                {errors.description.message}
              </div>
            )}
          </div>

          <div className="col-12">
            <button type="submit" className=" primary-btn w-100">
              Update Job Advertisement
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>
    </div>
  )
}

export default UpdateJob
