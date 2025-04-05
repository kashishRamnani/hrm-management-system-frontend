import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import axios from "axios"
import formatTime from "../../utils/formatTime"
import { toast, ToastContainer } from "react-toastify"
import { useAuth } from "../../../src/context/AuthContext";
import "react-toastify/dist/ReactToastify.css"
import BackButton from "../../../src/Components/Backbutton/Backbutton"
// Validation schema
const validationSchema = yup.object({
  first_name: yup
    .string()
    .required("First Name is required")
    .test("min-length", "First Name must be at least 4 characters", (value) => {
      return value && value.replace(/\s/g, "").length >= 4
    })
    .max(100, "First Name cannot exceed 100 characters")
    .matches(
      /^[a-zA-Z]+[a-zA-Z\s]*/,
      "First Name can only contain letters and spaces"
    ),
  last_name: yup
    .string()
    .required("Last Name is required")
    .test("min-length", "First Name must be at least 2 characters", (value) => {
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
    .matches(/^[0-9]{10,11}$/, "Phone number must be 10 to 11 digits"),
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

const EmployeeForm = () => {
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

  const handlePhoneChange = (e) => {
    const { value } = e.target
    e.target.value = value.replace(/[^0-9]/g, "")
  }

  const onSubmit = async (data) => {
    if (data.date_of_joining) {
      const formattedDate = data.date_of_joining.toISOString().split("T")[0]
      data.date_of_joining = formattedDate
    }

    if (data.office_in_timing && data.office_out_timing) {
      // here im Converting time to 12-hour format
      data.office_in_timing = formatTime(data.office_in_timing)
      data.office_out_timing = formatTime(data.office_out_timing)
    }
    try {
      const token = user.token
      const response = await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_HOST}/employees`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )

      console.log(response)
      toast.success("Record added successfully!")
      reset()
    } catch (error) {
      if (error.response && error.response.data) {
        const { data } = error.response

        // here im Checking for email uniqueness error
        if (data.errors && data.errors.email) {
          setError("email", { type: "server", message: data.errors.email })
        } else {
          toast.error("Error adding employee data!")
        }
      } else {
        toast.error("Error adding employee data!")
      }
    }
  }

  return (
    <div className="container mt-4">
      <BackButton />
      <ToastContainer />
  
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow-lg rounded p-4  border"
        style={{ maxWidth: "800px", margin: "auto" }}
      >
       <h4 className="text-center mb-4 fw-bold" style={{ color: "#49266a" }}>
  Employee Registration Form
</h4>
  
        <div className="row">
          {/* First Name */}
          <div className="col-md-6 mb-3">
            <label htmlFor="first_name" className="form-label fw-semibold">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              className={`form-control ${errors.first_name ? "is-invalid" : ""}`}
              {...control.register("first_name")}
            />
            {errors.first_name && (
              <div className="invalid-feedback">{errors.first_name.message}</div>
            )}
          </div>
  
          {/* Last Name */}
          <div className="col-md-6 mb-3">
            <label htmlFor="last_name" className="form-label fw-semibold">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
              {...control.register("last_name")}
            />
            {errors.last_name && (
              <div className="invalid-feedback">{errors.last_name.message}</div>
            )}
          </div>
        </div>
  
        <div className="row">
          {/* Email */}
          <div className="col-md-6 mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              {...control.register("email")}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>
  
          {/* Phone */}
          <div className="col-md-6 mb-3">
            <label htmlFor="phone" className="form-label fw-semibold">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              onInput={handlePhoneChange}
              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
              {...control.register("phone")}
            />
            {errors.phone && (
              <div className="invalid-feedback">{errors.phone.message}</div>
            )}
          </div>
        </div>
  
        <div className="row">
          {/* Address */}
          <div className="col-md-12 mb-3">
            <label htmlFor="address" className="form-label fw-semibold">
              Address
            </label>
            <input
              type="text"
              id="address"
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              {...control.register("address")}
            />
            {errors.address && (
              <div className="invalid-feedback">{errors.address.message}</div>
            )}
          </div>
        </div>
  
        <div className="row">
          {/* Date of Joining */}
          <div className="col-md-6 mb-3">
            <label htmlFor="date_of_joining" className="form-label fw-semibold">
              Date of Joining
            </label><br/>
            <Controller
              name="date_of_joining"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  className={`form-control ${
                    errors.date_of_joining ? "is-invalid" : ""
                  }`}
                  selected={field.value}
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
  
          {/* Office Timings */}
          <div className="col-md-3 mb-3">
            <label htmlFor="office_in_timing" className="form-label fw-semibold">
              Office In Time
            </label>
            <input
              type="time"
              id="office_in_timing"
              className={`form-control ${
                errors.office_in_timing ? "is-invalid" : ""
              }`}
              {...control.register("office_in_timing")}
            />
            {errors.office_in_timing && (
              <div className="invalid-feedback">
                {errors.office_in_timing.message}
              </div>
            )}
          </div>
  
          <div className="col-md-3 mb-3">
            <label htmlFor="office_out_timing" className="form-label fw-semibold">
              Office Out Time
            </label>
            <input
              type="time"
              id="office_out_timing"
              className={`form-control ${
                errors.office_out_timing ? "is-invalid" : ""
              }`}
              {...control.register("office_out_timing")}
            />
            {errors.office_out_timing && (
              <div className="invalid-feedback">
                {errors.office_out_timing.message}
              </div>
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
    Register Employee
  </button>
</div>
      </form>
    </div>
  );
  
}

export default EmployeeForm
