import React, { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import { useAuth } from "../../../src/context/AuthContext";

// Validation Schema using Yup
const validationSchema = yup.object({
  first_name: yup
    .string()
    .required("First Name is required")
    .test("min-length", "First Name must be at least 3 characters", (value) => {
      return value && value.replace(/\s/g, "").length >= 3
    })
    .max(100, "First Name cannot exceed 100 characters")
    .matches(
      /^[a-zA-Z]+[a-zA-Z\s]*/,
      "First Name can only contain letters and spaces"
    ),
  last_name: yup
    .string()
    .required("Last Name is required")
    .test("min-length", "Last Name must be at least 2 characters", (value) => {
      return value && value.replace(/\s/g, "").length >= 2
    })
    .max(100, "Last Name cannot exceed 100 characters")
    .matches(
      /^[a-zA-Z]+[a-zA-Z\s]*/,
      "Last Name can only contain letters and spaces"
    ),
  email: yup
    .string()
    .required("Email is required")
    .email("Please enter a valid email address")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email format is invalid"
    ),
  phone: yup
    .string()
    .required("Phone is required")
    .matches(/\+?[0-9]{10,12}$/, "Phone number must be 10 to 11 digits"),
  address: yup
    .string()
    .required("Address is required")
    .min(10, "Address must be at least 10 characters")
    .max(255, "Address cannot exceed 255 characters"),
  date_of_joining: yup
    .date()
    .required("Date of Joining is required")
    .typeError("Please select a valid date"),
  office_in_timing: yup.string().required("In time is required"),
  office_out_timing: yup.string().required("Out time is required"),
})

const UpdateEmployeeForm = () => {
  const { id } = useParams()
  const [initialData, setInitialData] = useState(null)
  const [message, setMessage] = useState("")
  const navigate = useNavigate()
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

  // here im Fetching employee data on component mount
  useEffect(() => {
    const convertTo24Hour = (time) => {
      if (!time) return "" // Handling  empty time
      const [timePart, modifier] = time.split(" ")
      let [hours, minutes] = timePart.split(":")
      if (modifier === "PM" && hours !== "12") {
        hours = parseInt(hours, 10) + 12
      }
      if (modifier === "AM" && hours === "12") {
        hours = "00"
      }
      return `${hours}:${minutes}`
    }

    const fetchEmployeeData = async () => {
      try {
        const token = user.token
        const endpoint = `${import.meta.env.VITE_REACT_APP_API_HOST}/employees/${id}`

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const employeeData = response.data.employee

        //here im  Converting  to 24-hour format
        const formattedData = {
          ...employeeData,
          office_in_timing: convertTo24Hour(employeeData.office_in_timing), // Convert to 24-hour
          office_out_timing: convertTo24Hour(employeeData.office_out_timing), // Convert to 24-hour
        }

        setInitialData(formattedData)
        reset(formattedData) // Pre-filling form with formatted data
      } catch (error) {
        toast.error("Error fetching employee data")
      }
    }

    fetchEmployeeData()
  }, [id, reset])

  const onUpdateSuccess = () => {
    navigate("/employees")
  }

  function formatTimeTo12Hour(time24) {
    const [hour, minute] = time24.split(":")
    const hourInt = parseInt(hour, 10)
    const amPm = hourInt >= 12 ? "PM" : "AM"
    const hour12 = hourInt % 12 || 12
    return `${hour12}:${minute} ${amPm}`
  }

  const onSubmit = async (data) => {
    if (data.date_of_joining) {
      const formattedDate = data.date_of_joining.toISOString().split("T")[0]
      data.date_of_joining = formattedDate
    }

    if (data.office_in_timing && data.office_out_timing) {
      const formattedData = {
        office_in_timing: formatTimeTo12Hour(data.office_in_timing),
        office_out_timing: formatTimeTo12Hour(data.office_out_timing),
      }
      data.office_in_timing = formattedData.office_in_timing
      data.office_out_timing = formattedData.office_out_timing
    }

    try {
      const token = user.token
      const endpoint = `${import.meta.env.VITE_REACT_APP_API_HOST}/employees/${id}`

      const response = await axios.put(endpoint, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      toast.success("Employee data updated successfully")
      console.log("Employee updated successfully:", response.data)
      reset()
      onUpdateSuccess && onUpdateSuccess()
    } catch (error) {
      if (error.response && error.response.data) {
        const { data } = error.response

        // here I'm Checking for email uniqueness
        if (data.errors && data.errors.email) {
          setError("email", { type: "server", message: data.errors.email })
        } else {
          toast.error("Error updating employee data!")
        }
      } else {
        toast.error("Error updating employee data!")
      }
    }
  }

  return (
    <div className="container mt-5 employee-form-container">
      <ToastContainer />
      <h2 className="mb-4 text-center">Update Employee Information</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow p-4 rounded border"
      >
        <div className="row row-cols-auto">
          <div className="col-md-4 mb-3">
            <label htmlFor="firstName" className="form-label">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              className={`form-control ${
                errors.first_name ? "is-invalid" : ""
              }`}
              {...control.register("first_name")}
              defaultValue={initialData?.first_name || ""}
            />
            {errors.first_name && (
              <div className="invalid-feedback">
                {errors.first_name.message}
              </div>
            )}
          </div>

          <div className="col-md-4 mb-3">
            <label htmlFor="lastName" className="form-label">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
              {...control.register("last_name")}
              defaultValue={initialData?.last_name || ""}
            />
            {errors.last_name && (
              <div className="invalid-feedback">{errors.last_name.message}</div>
            )}
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              {...control.register("email")}
              defaultValue={initialData?.email || ""}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>
        </div>

        <div className="row row-cols-auto">
          <div className="col-md-4 mb-3">
            <label htmlFor="phone" className="form-label">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              {...control.register("phone")}
              defaultValue={initialData?.phone || ""}
            />
            {errors.phone && (
              <div className="invalid-feedback">{errors.phone.message}</div>
            )}
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="address" className="form-label">
              Address
            </label>
            <input
              type="text"
              id="address"
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              {...control.register("address")}
              defaultValue={initialData?.address || ""}
            />
            {errors.address && (
              <div className="invalid-feedback">{errors.address.message}</div>
            )}
          </div>

          <div className="col-md-4 mb-3 d-flex flex-column">
            <label htmlFor="date_of_joining" className="form-label">
              Date of Joining
            </label>
            <Controller
              control={control}
              name="date_of_joining"
              defaultValue={initialData?.date_of_joining || ""}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  className={`form-control ${
                    errors.date_of_joining ? "is-invalid" : ""
                  }`}
                  selected={field.value ? new Date(field.value) : null}
                  dateFormat="yyyy-MM-dd"
                />
              )}
            />
            {errors.date_of_joining && (
              <div className="invalid-feedback">
                {errors.date_of_joining.message}
              </div>
            )}
          </div>
        </div>

        <div className="row row-cols-auto">
          <div className="col-md-4 mb-3">
            <label htmlFor="office_in_timing" className="form-label">
              Office In Time
            </label>
            <input
              type="time"
              id="office_in_timing"
              className={`form-control ${
                errors.office_in_timing ? "is-invalid" : ""
              }`}
              {...control.register("office_in_timing")}
              defaultValue={initialData?.office_in_timing || ""}
            />
            {errors.office_in_timing && (
              <div className="invalid-feedback">
                {errors.office_in_timing.message}
              </div>
            )}
          </div>

          <div className="col-md-4 mb-3">
            <label htmlFor="office_out_timing" className="form-label">
              Office Out Time
            </label>
            <input
              type="time"
              id="office_out_timing"
              className={`form-control ${
                errors.office_out_timing ? "is-invalid" : ""
              }`}
              {...control.register("office_out_timing")}
              defaultValue={initialData?.office_out_timing || ""}
            />
            {errors.office_out_timing && (
              <div className="invalid-feedback">
                {errors.office_out_timing.message}
              </div>
            )}
          </div>
          <div className="col-md-4 mb-3">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              className={`form-control ${errors.status ? "is-invalid" : ""}`}
              {...control.register("status")}
              defaultValue="open"
            >
              <option value="active">active</option>
              <option value="terminate">terminate</option>
            </select>
            {errors.status && (
              <div className="invalid-feedback">{errors.status.message}</div>
            )}
          </div>
        </div>

        {/* {message && toast.info(message)} */}
        <button type="submit" className="primary-btn w-100">
          Update Employee
        </button>
      </form>
    </div>
  )
}

export default UpdateEmployeeForm
