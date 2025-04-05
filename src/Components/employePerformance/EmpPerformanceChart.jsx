import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Performance as PerformanceReview } from "../../utils/Performance";
import "./EmpPerformanceChart.css";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const EmpPerformanceChart = () => {
  const { user } = useAuth();
  const [performances, setPerformances] = useState([]);
  const [totalKPIScore, setTotalKPIScore] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  

  const fetchPerformanceData = () => {
    setLoading(true); 
    PerformanceReview.all(
      user.token,
      (data) => {
        const formattedData = formatPerformanceData(data);
        setPerformances(formattedData);
        setTotalKPIScore(calculateTotalKPIScore(formattedData));
        setLoading(false); 
      },
      setMessage,
      setLoading
    );
  };

  const formatPerformanceData = (data) => {
    let cumulativeKPI = 0;
    return data.map((record) => {
      const currentKPI = parseFloat(record.kpi_score ?? 0);
      cumulativeKPI += currentKPI;

      return {
        date: record.review_date,
        cumulative_kpi_score: parseFloat(cumulativeKPI.toFixed(2)),
        kpi_score: currentKPI.toFixed(2),
      };
    });
  };

  const calculateTotalKPIScore = (data) => {
    return data.reduce(
      (sum, record) => sum + parseFloat(record.kpi_score ?? 0),
      0
    ).toFixed(2);
  }; 
  useEffect(() => {
    if (user.token) {
      fetchPerformanceData();
    }
  }, [user.token]);
  return (
    <>
  {loading ? (
    <div className="text-center">
      <div role="status">
       
      </div>
    </div>
  ) : (
    <div className="performance-chart hover-container">
      <h3 className="chart-title">Performance Review</h3>
      <p className="text-center">
        Total KPI Score:{" "}
        <b style={{ color: "#00C853" }}>
          {Math.ceil(totalKPIScore)}
        </b>
      </p>
      <ResponsiveContainer height={265}>
      {performances.length > 0 ? (
        <LineChart data={performances}>
          <Line
            type="monotone"
            dataKey="cumulative_kpi_score"
            stroke="#00c853"
            strokeWidth={3}
            name="Cumulative KPI Score"
          />
          <CartesianGrid stroke="#0000001f" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
        </LineChart>
      ) : (
        <p>No performance data available.</p>
      )}
      </ResponsiveContainer>
    </div>
  )}

  {message && <p className="error-message">{message}</p>}
</>

  );
};

export default EmpPerformanceChart;
