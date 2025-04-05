import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import { useAuth } from "../../../src/context/AuthContext";
import BackButton from "../../../src/Components/Backbutton/Backbutton"
const validationSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(10, "Title must be at least 10 characters")
    .max(255, "Title cannot exceed 255 characters")
    .matches(
      /^[a-zA-Z]+[a-zA-Z\s]*$/,
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

const PostJob = () => {
  const [message, setMessage] = useState("")
  const { user } = useAuth();


  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  })

  const onSubmit = async (data) => {
    try {
      const token = user.token

      data.benefits = data.benefits?.split(",").map((item) => item.trim()) || []
      data.skills_required =
        data.skills_required?.split(",").map((item) => item.trim()) || []

      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_HOST}/jobs`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      console.log(data)
      toast.success("Job advertisement published successfully!")

      reset()
    } catch (error) {
      toast.error("Error posting job advertisement!")
    }
  }

 return (
    <div className="container my-2">
      <BackButton />
      <ToastContainer />
  
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow-lg rounded p-4 border"
        style={{ maxWidth: "800px", margin: "auto" }}
      >
        <h4 className="text-center mb-4 fw-bold" style={{ color: "#49266a" }}>
          Add Job Post
        </h4>
  
        <div className="row">
          {/* Title */}
          <div className="col-md-6 mb-3">
            <label htmlFor="title" className="form-label fw-semibold">
              Title
            </label>
            <input
              type="text"
              id="title"
              className={`form-control ${errors.title ? "is-invalid" : ""}`}
              {...control.register("title")}
            />
            {errors.title && (
              <div className="invalid-feedback">{errors.title.message}</div>
            )}
          </div>
  
          {/* Experience */}
          <div className="col-md-6 mb-3">
            <label htmlFor="experience" className="form-label fw-semibold">
              Experience
            </label>
            <input
              type="text"
              id="experience"
              className={`form-control ${errors.experience ? "is-invalid" : ""}`}
              {...control.register("experience")}
            />
            {errors.experience && (
              <div className="invalid-feedback">{errors.experience.message}</div>
            )}
          </div>
        </div>
  
        <div className="row">
          {/* Employment Type */}
          <div className="col-md-6 mb-3">
            <label htmlFor="employment_type" className="form-label fw-semibold">
              Employment Type
            </label>
            <select
              id="employment_type"
              className={`form-control ${errors.employment_type ? "is-invalid" : ""}`}
              {...control.register("employment_type")}
              defaultValue="full-time"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
            {errors.employment_type && (
              <div className="invalid-feedback">{errors.employment_type.message}</div>
            )}
          </div>
  
          {/* Job Location */}
          <div className="col-md-6 mb-3">
            <label htmlFor="job_location" className="form-label fw-semibold">
              Job Location
            </label>
            <input
              type="text"
              id="job_location"
              className={`form-control ${errors.job_location ? "is-invalid" : ""}`}
              {...control.register("job_location")}
            />
            {errors.job_location && (
              <div className="invalid-feedback">{errors.job_location.message}</div>
            )}
          </div>
        </div>
  
        <div className="row">
          {/* Salary Range */}
          <div className="col-md-6 mb-3">
            <label htmlFor="salary_range" className="form-label fw-semibold">
              Salary Range
            </label>
            <input
              type="text"
              id="salary_range"
              className={`form-control ${errors.salary_range ? "is-invalid" : ""}`}
              {...control.register("salary_range")}
            />
            {errors.salary_range && (
              <div className="invalid-feedback">{errors.salary_range.message}</div>
            )}
          </div>
  
          {/* Qualifications */}
          <div className="col-md-6 mb-3">
            <label htmlFor="qualifications" className="form-label fw-semibold">
              Qualifications
            </label>
            <input
              type="text"
              id="qualifications"
              className={`form-control ${errors.qualifications ? "is-invalid" : ""}`}
              {...control.register("qualifications")}
            />
            {errors.qualifications && (
              <div className="invalid-feedback">{errors.qualifications.message}</div>
            )}
          </div>
        </div>
  
        <div className="row">
          {/* Benefits */}
          <div className="col-md-6 mb-3">
            <label htmlFor="benefits" className="form-label fw-semibold">
              Benefits (comma-separated)
            </label>
            <input
              type="text"
              id="benefits"
              className={`form-control ${errors.benefits ? "is-invalid" : ""}`}
              {...control.register("benefits")}
            />
            {errors.benefits && (
              <div className="invalid-feedback">{errors.benefits.message}</div>
            )}
          </div>
  
          {/* Skills Required */}
          <div className="col-md-6 mb-3">
            <label htmlFor="skills_required" className="form-label fw-semibold">
              Skills Required (comma-separated)
            </label>
            <input
              type="text"
              id="skills_required"
              className={`form-control ${errors.skills_required ? "is-invalid" : ""}`}
              {...control.register("skills_required")}
            />
            {errors.skills_required && (
              <div className="invalid-feedback">{errors.skills_required.message}</div>
            )}
          </div>
        </div>
  
        <div className="row">
          {/* Status */}
          <div className="col-md-6 mb-3">
            <label htmlFor="status" className="form-label fw-semibold">
              Status
            </label>
            <select
              id="status"
              className={`form-control ${errors.status ? "is-invalid" : ""}`}
              {...control.register("status")}
              defaultValue="open"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            {errors.status && (
              <div className="invalid-feedback">{errors.status.message}</div>
            )}
          </div>
  
          {/* Description */}
          <div className="col-md-12 mb-3">
            <label htmlFor="description" className="form-label fw-semibold">
              Description
            </label>
            <textarea
              id="description"
              className={`form-control ${errors.description ? "is-invalid" : ""}`}
              {...control.register("description")}
              rows="4"
            ></textarea>
            {errors.description && (
              <div className="invalid-feedback">{errors.description.message}</div>
            )}
          </div>
        </div>
  
        {/* Submit Button */}
        <div className="text-center mt-4">
          <button
            type="submit"
            className="btn text-white shadow-sm w-50"
            style={{
              backgroundColor: "#49266a",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Post Job
          </button>
        </div>
      </form>
    </div>
  );

}

export default PostJob
