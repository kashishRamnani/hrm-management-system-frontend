import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Performance as PerformanceReview } from "../../../utils/Performance";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";


export default function PerformanceEmp() {
  const { user } = useAuth();
  const [performances, setPerformances] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const setCurrentUserPR = (data) => {
    const filteredPR = data.filter(
      (item) => item.employee.email === user.creds.email
    );
    setPerformances(filteredPR); 
  };

  useEffect(() => {
    PerformanceReview.all(user.token, setCurrentUserPR, setLoading);
  }, [user.token, user.role]);

  const formatPerformanceData = (data) => {
    return data.map((record) => ({
      date: record.review_date,
      
      kpi_score: parseFloat(record.kpi_score ?? 0).toFixed(1),
    }));
  };

  return (
    <>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border" role="status" aria-label="Loading">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="performance-chart">
          <h3 className="chart-title">Performance Review</h3>
          {performances.length > 0 ? (
            <LineChart
              width={400}
              height={200}
              data={ formatPerformanceData(performances)}
            >
              <Line
                type="monotone"
                dataKey="kpi_score"
                stroke="#00c853"
                strokeWidth={3}
                name="KPI Score"
              />
              <CartesianGrid stroke="#ddd" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
            </LineChart>
          ) : (
            <p>No performance data available.</p>
          )}
        </div>
      )}
      {message && <p className="error-message">{message}</p>}
    </>
  );
}
