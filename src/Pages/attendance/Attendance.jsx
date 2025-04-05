import React, { useState, useEffect } from "react"
import axios from "axios"
import * as yup from "yup"
import { useAuth } from "../../../src/context/AuthContext";
import BackButton from "../../Components/Backbutton/Backbutton";

const Attendance = () => {
  const [attendance, setAttendance] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editingRecord, setEditingRecord] = useState({})
  const [loading, setLoading] = useState(false)
  const { user } = useAuth();

  const currentMonth = new Date().toLocaleString("default", { month: "long" })
  const currentYear = new Date().getFullYear()

  // Define the validation schema for yup with HH:mm AM/PM format
  const attendanceSchema = yup.object().shape({
    status: yup.string().required("Status is required."),
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
              /^(0[1-9]|1[0-2]):([0-5][0-9]) (AM|PM)$/i,
              "Time must be in 12-hour HH:MM AM/PM format"
            ),
        otherwise: () => yup.string().nullable(),
      }),
  })

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true)
        const token = user.token
        const response = await axios.get(
          `${import.meta.env.VITE_API_HOST}/attendance`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setAttendance(response.data.attendance || [])
        setLoading(false)
      } catch (error) {
        console.error("Error fetching attendance data:", error)
        setLoading(false)
      }
    }

    fetchAttendance()
  }, [])

  const employees = attendance.reduce((acc, record) => {
    const employee = record.employee
    if (employee && !acc.find((e) => e.id === employee.id)) {
      acc.push(employee)
    }
    return acc
  }, [])

  const uniqueDates = Array.from(
    new Set(attendance.map((record) => new Date(record.date).toDateString()))
  ).map((dateString) => new Date(dateString))

  const uniqueMonths = Array.from(
    new Set(
      attendance.map((record) =>
        new Date(record.date).toLocaleString("default", { month: "long" })
      )
    )
  )

  const uniqueYears = Array.from(
    new Set(attendance.map((record) => new Date(record.date).getFullYear()))
  ).sort((a, b) => a - b)

  useEffect(() => {
    setSelectedYear(currentYear.toString())
    setSelectedMonth(currentMonth)
  }, [currentMonth, currentYear])

  const filteredAttendance = attendance.filter((record) => {
    const recordDate = new Date(record.date)
    const matchesYear = selectedYear
      ? recordDate.getFullYear() === parseInt(selectedYear)
      : true
    const matchesMonth = selectedMonth
      ? recordDate.toLocaleString("default", { month: "long" }) ===
        selectedMonth
      : true
    const matchesDate = selectedDate
      ? recordDate.getDate() === parseInt(selectedDate)
      : true

    return matchesYear && matchesMonth && matchesDate
  })

  const filteredEmployees = employees.filter((employee) =>
    [employee.first_name, employee.last_name, employee.email, employee.id]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        const token = user.token
        await axios.delete(
          `${import.meta.env.VITE_REACT_APP_API_HOST}/attendance/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setAttendance(attendance.filter((record) => record.id !== id))
      } catch (error) {
        console.error("Error deleting attendance record:", error)
      }
    }
  }

  const handleEdit = (record) => {
    setEditingId(record.id)
    setEditingRecord(record)
  }

  const handleUpdate = async () => {
    try {
      // Validate the record using yup
      await attendanceSchema.validate(editingRecord, { abortEarly: false })

      const token = user.token
      const requestBody = {
        ...editingRecord,
        _method: "PUT", // Add _method key to override the method
      }

      await axios.post(
        `${import.meta.env.VITE_REACT_APP_API_HOST}/attendance/${editingId}`,
        requestBody,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      // Update the state with the modified attendance record
      setAttendance(
        attendance.map((record) =>
          record.id === editingId ? { ...editingRecord } : record
        )
      )

      console.log("Updated record:", editingRecord)
      setEditingId(null)
      setEditingRecord({})
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        alert(error.errors.join(", "))
      } else {
        console.error("Error updating attendance record:", error)
      }
    }
  }

  const handleInputChange = (field, value) => {
    if (field === "status" && (value === "absent" || value === "OnLeave")) {
      setEditingRecord({ ...editingRecord, status: value, time: "" })
    } else {
      setEditingRecord({ ...editingRecord, [field]: value })
    }
  }

  if (loading) {
    return (
      <div className="text-center d-flex align-items-center justify-content-center mt-5">
        <div className="spinner-border " role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    )
  }

  return (
    <div className="container my-3">
     <BackButton/>
      {/* Filters */}
      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name, email, or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-control"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {uniqueYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-control"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">Select Month</option>
            {uniqueMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          >
            <option value="">Select Date</option>
            {uniqueDates
              .map((date) => date.getDate())
              .filter((date) => {
                return attendance.some(
                  (record) => new Date(record.date).getDate() === date
                )
              })
              .map((date) => (
                <option key={date} value={date}>
                  {date}
                </option>
              ))}
          </select>
        </div>
      </div>
      {/* Table */}
      <div className="table-responsive card card-body">
      <h4 className=" text-center mb-3 fw-bold" style={{ color: "#49266a" }}>
           Employees Attendance 
          </h4>
      
        <table className="table table-bordered table-striped align-middle">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Email</th>
              {uniqueDates.map((date) => (
                <th
                  key={date.toDateString()}
                  colSpan="3"
                  className="text-center"
                >
                  {date.toDateString()}
                </th>
              ))}
            </tr>
            <tr>
              <th></th>
              <th></th>
              {uniqueDates.map(() => (
                <>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Actions</th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length > 0 ? (
              map((employee) => (
                <tr key={employee.id}>
                  <td>
                    {employee.first_name} {employee.last_name}
                  </td>
                  <td>{employee.email}</td>
                  {uniqueDates.map((date) => {
                    const record = filteredAttendance.find(
                      (r) =>
                        new Date(r.date).toDateString() ===
                          date.toDateString() && r.employee_id === employee.id
                    )
                    return (
                      <>
                        <td>
                          {editingId === record?.id ? (
                            <select
                              className="form-control"
                              value={editingRecord.status || ""}
                              onChange={(e) =>
                                handleInputChange("status", e.target.value)
                              }
                            >
                              <option value="Present">Present</option>
                              <option value="absent">Absent</option>
                              <option value="on leave">On Leave</option>
                            </select>
                          ) : (
                            record?.status || ""
                          )}
                        </td>
                        <td>
                          {editingId === record?.id ? (
                            <input
                              type="text"
                              className="form-control"
                              value={editingRecord.time || ""}
                              onChange={(e) =>
                                handleInputChange("time", e.target.value)
                              }
                              disabled={
                                editingRecord.status === "Absent" ||
                                editingRecord.status === "Leave"
                              }
                            />
                          ) : (
                            record?.time || ""
                          )}
                        </td>
                        <td>
                          {editingId === record?.id ? (
                            <button
                              className="btn btn-primary"
                              onClick={handleUpdate}
                            >
                              Save
                            </button>
                          ) : (
                            <button
                              className="btn btn-warning"
                              onClick={() => handleEdit(record)}
                            >
                              Edit
                            </button>
                          )}
                          <button
                            className="btn btn-danger ml-2"
                            onClick={() => handleDelete(record?.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )
                  })}
                </tr>
              ))
            ) : (
              <p className="text-center">No Records Found</p>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Attendance
