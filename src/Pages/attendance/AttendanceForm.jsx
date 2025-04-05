import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import "bootstrap/dist/css/bootstrap.min.css"
import axios from "axios"
import formatTime from "../../utils/formatTime"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useAuth } from "../../../src/context/AuthContext";
import BackButton from "../../Components/Backbutton/Backbutton"


const schema = yup.object().shape({
  employee_id: yup.string().required("Employee is required"),
  date: yup
    .date()
    .required("Date is required")
    .typeError("Invalid date format")
    .default(() => {
      const today = new Date()
      const year = today.getFullYear()
      const month = String(today.getMonth() + 1).padStart(2, "0")
      const day = String(today.getDate()).padStart(2, "0")
      return `${year}-${month}-${day}`
    }),
  status: yup
    .string()
    .required("Status is required")
    .oneOf(["present", "absent", "OnLeave"], "Invalid status"),
  time: yup
    .string()
    .nullable()
    .when("status", {
      is: (status) => status.includes("present"),
      then: () =>
        yup
          .string()
          .required("Time is required when status is Present")
          .matches(
            /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
            "Time must be in 24-hour HH:MM format"
          ),
      otherwise: () => yup.string().nullable(),
    }),
})

const AttendanceForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0], 
    },
  })
  const { user } = useAuth();

  const [employees, setEmployees] = useState([])

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching employee data:", error)
      }
    }

    fetchEmployeeData()
  }, [])

  const onSubmit = async (data) => {
    if (data.date) {
      const date = new Date(data.date)
      date.setHours(0, 0, 0, 0)
      const formattedDate = date.toLocaleDateString("en-CA")
      data.date = formattedDate
    }

    if (data.time) {
      // Convert time to 12-hour format
      data.time = formatTime(data.time)
    }

    try {
      const token = import.meta.env.VITE_AUTH_TOKEN
      const response = await axios.post(
        `${import.meta.env.VITE_API_HOST}/attendance`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      toast.success("Attendance recorded successfully!")
      reset()
    } catch (error) {
      if (error.response && error.response.status === 422) {
        const errorMessage = error.response.data.message || "Error occurred"
        toast.error(errorMessage) // Show toast with error message
      } else {
        toast.error("An unexpected error occurred. Please try again.")
      }
      console.error("Error recording attendance:", error)
    }
  }

  const watchStatus = watch("status");

  return (
    <div className="container my-2">
      <BackButton/>
      <div className="d-flex row justify-content-center">
        <div className="col-lg-8 col-md-6 col-sm-8">
          <div className="card shadow border">
            <div className="card-body py-4 shadow">
              <h4 className="text-center fw-bold " style={{ color: "#49266a" }}>
                Attendance Form
              </h4>

              <ToastContainer />

              <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label htmlFor="employee_id" className="form-label fw-semibold" style={{ fontSize: "0.875rem" }}>
                    Employee
                  </label>
                  <select id="employee_id" {...register("employee_id")} className={`form-select ${errors.employee_id ? "is-invalid" : ""}`}>
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.first_name}</option>
                    ))}
                  </select>
                  {errors.employee_id && <small className="text-danger">{errors.employee_id.message}</small>}
                </div>

                <div className="mb-3">
                  <label htmlFor="date" className="form-label fw-semibold" style={{ fontSize: "0.875rem" }}>
                    Date
                  </label>
                  <input disabled type="date" id="date" {...register("date")} className={`form-control ${errors.date ? "is-invalid" : ""}`} />
                  {errors.date && <small className="text-danger">{errors.date.message}</small>}
                </div>

                <div className="mb-3">
                  <label htmlFor="status" className="form-label fw-semibold" style={{ fontSize: "0.875rem" }}>
                    Status
                  </label>
                  <select id="status" {...register("status")} className={`form-select ${errors.status ? "is-invalid" : ""}`}>
                    <option value="">Select Status</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="OnLeave">On Leave</option>
                  </select>
                  {errors.status && <small className="text-danger">{errors.status.message}</small>}
                </div>

                <div className="mb-3">
                  <label htmlFor="time" className="form-label fw-semibold" style={{ fontSize: "0.875rem" }}>
                    Time
                  </label>
                  <input type="time" id="time" {...register("time")} className={`form-control ${errors.time ? "is-invalid" : ""}`} disabled={watchStatus !== "present"} />
                  {errors.time && <small className="text-danger">{errors.time.message}</small>}
                </div>

                <div className="d-flex justify-content-center">
                  <button className="btn w-50 text-white shadow-sm" style={{ backgroundColor: "#49266a", cursor: "pointer", fontWeight: "bold" }} type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;