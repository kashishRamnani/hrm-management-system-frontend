import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Compensation } from "../../../utils/Compensation";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function CompensationEmp() {
  const { user } = useAuth();
  const [compensations, setCompensations] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

 
  const CurrentUserCP = (data) => {
    
    const filteredCP = data.filter(
      (item) => item.employee.email === user.creds.email
    );
    setCompensations(filteredCP);
  };

  useEffect(() => {
    if (user.token) {
      setLoading(true);
      Compensation.all(user.token, CurrentUserCP, setMessage, setLoading).catch(
        (err) => setMessage("Failed to load data: " + err.message)
      );
    }
  }, [user.token, user.role]);

  const formatCompensationData = (data) => {
   
    return data.map((item) => ({
      date: new Date(item.payment_date).toLocaleDateString(), 
      basic_salary: parseFloat(item.base_salary), 
      bonus: parseFloat(item.bonus),
      total: parseFloat(item.base_salary) + parseFloat(item.bonus), 
    }));
  };

  return (
    <>
      {loading ? (
        <div className="loading-overlay">
        <div className="spinner-border " role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
      ) : (
        <div className="compensation-chart">
          {compensations.length > 0 ? (
            <LineChart
              width={600}
              height={300}
              data={formatCompensationData(compensations)}
            >
              <Line
                type="monotone"
                dataKey="basic_salary"
                stroke="#6c3483"
                strokeWidth={3}
                name="Basic Salary"
              />
              <Line
                type="monotone"
                dataKey="bonus"
                stroke="#9777d2"
                strokeWidth={3}
                name="Bonus"
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="#ff6600"
                strokeWidth={3}
                name="Total Compensation"
              />
              <CartesianGrid stroke="#ddd" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          ) : (
            <p>No compensation data available.</p>
          )}
        </div>
      )}
      {message && <p className="error-message">{message}</p>}
    </>
  );
}
