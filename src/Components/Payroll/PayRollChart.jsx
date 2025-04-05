import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import "./PayrollChart.css";
import { useAuth } from "../../context/AuthContext";
import position from "../../utils/position";
import { Spinner } from "react-bootstrap";  // For the loading spinner

const PayRollChart = () => {
  const { user } = useAuth();
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [options, setOptions] = useState({
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      floating: false,
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    chart: {
      type: "donut",
    },
    labels: [],
    colors: [
      "#008FFB",
      "#49266a",
      "#FEB019",
      "#FF4560",
      "#775DD0",
    ],
  });

  useEffect(() => {
    if (user && user.token) {
      setLoading(true); 
      position.all(user.token, (data) => {
        setPositions(data);
        setLoading(false); // Set loading to false after data is fetched
      });
    }
  }, [user]);

  useEffect(() => {
    const labels = extract(positions);
    setOptions(prevOptions => ({ ...prevOptions, labels }));
  }, [positions]);

  const series = extract(positions, 'values');

  useEffect(() => {
    const updateTheme = () => {
      const isDarkMode =
        document.documentElement.getAttribute("data-bs-theme") === "dark";
      setOptions((prevOptions) => ({
        ...prevOptions,
        legend: {
          ...prevOptions.legend,
          labels: {
            colors: isDarkMode ? "#ffffff" : "#77", // White for dark mode, black for light mode
          },
        },
      }));
    };

    updateTheme(); // Initialize theme when component mounts
    // Listen for theme changes
    document.documentElement.addEventListener("themeChange", updateTheme);

    return () => {
      document.documentElement.removeEventListener(
        "themeChange",
        updateTheme
      );
    };
  }, []);



  return (
    <>
      {loading ? (
        
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          
        </div>
      ) : (
        
        <div className="Payroll-container hover-container">
          <h2 className="chart-title">Payroll Details</h2>
          <Chart
            options={options}
            series={series}
            type="donut"
            width="450"
            height={350}
          />
        </div>
      )}
    </>
  );
};

export default PayRollChart;

function extract(data, type = 'key') {
  const response = {};

  data.map(key => {
    if (Object.keys(response).includes(key.job_position)) {
      response[key.job_position] += 1;
    } else {
      response[key.job_position] = 1;
    }
  });

  if (type === 'values') {
    return Object.values(response);
  }

  return Object.keys(response);
}
