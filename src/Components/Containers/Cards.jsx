import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import CountUp from "react-countup";
import { useAuth } from "../../context/AuthContext";
import "./Cards.Module.css";
import { toast } from "react-toastify";

ChartJS.register(ArcElement, Tooltip, Legend);

const JobOverviewCard = ({ openJobs, closedJobs }) => {
  const data = {
    labels: ["Open Jobs", "Closed Jobs"],
    datasets: [
      {
        data: [openJobs, closedJobs],
        backgroundColor: ["#007bff", "#ffc107"],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        enabled: true,
      },
      legend: {
        display: false,
      },
    },
    cutout: "88%",
    rotation: -90,
    circumference: 180,
  };

  return (
    <div className={`text-center shadow py-2 card-container hover-container`}>
      <Row className="gx-2 align-items-center px-2">
        
      <h6 className="text-center fw-bold pt-lg-2 card-title">Job Overview</h6>
        <Col xs={7} md={7}>
          <div className="doughnut-wrapper">
            <Doughnut data={data} options={options} />
            <div className="doughnut-overlay">
              <h3>{openJobs + closedJobs}</h3>
              <p>Total Jobs</p>
            </div>
          </div>
        </Col>
        <Col xs={5} md={5} className="text-start job-description">
          <div>
            <small>
              <b style={{ color: "#007bff" }}>{openJobs}</b> Open Jobs
            </small>
            <br />
            <small>
              <b style={{ color: "#ffc107" }}>{closedJobs}</b> Closed Jobs
            </small>
          </div>
        </Col>
      </Row>
    </div>
  );
};

const Cards = () => {
  const { user } = useAuth();
  const [cardData, setCardData] = useState([
    { title: "Total Employees", value: 0, description: "Total Number of Employees" },
    { title: "Performance Analytics", value: 0, description: "Avg Performance Score", decimals: 1 },
    { title: "Payroll Details", value: 0, description: "Payroll" },
  ]);

  const [jobStats, setJobStats] = useState({
    openJobs: 0,
    closedJobs: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.token) {
      
      return;
    }

    setLoading(true);

    const fetchEmployeeData = axios.get(`${import.meta.env.VITE_REACT_APP_API_HOST}/employees/`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    const fetchPerformanceData = axios.get(`${import.meta.env.VITE_REACT_APP_API_HOST}/performance-reviews`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    const fetchTotalPositions = axios.get(`${import.meta.env.VITE_REACT_APP_API_HOST}/positions`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const fetchJobData = axios.get(`${import.meta.env.VITE_REACT_APP_API_HOST}/jobs`, {
      headers: { Authorization: `Bearer ${user.token}` },
    });

    Promise.all([fetchEmployeeData, fetchPerformanceData, fetchTotalPositions, fetchJobData])
      .then(([employeeRes, performanceRes, positionRes, jobRes]) => {
        const employees = employeeRes.data?.employees || [];
        const reviews = performanceRes.data?.review || [];
        const positions = positionRes.data?.position || [];
        const jobs = jobRes.data?.jobs || [];

        const openJobs = jobs.filter(job => job.status === "open").length;
        const closedJobs = jobs.filter(job => job.status === "closed").length;

        const totalKpiScore = reviews.reduce((acc, review) => acc + (review.kpi_score ?? 0.00), 0.00);

        const happinessIndex = reviews.length
          ? reviews.reduce((acc, review) => acc + (review.happiness_score ?? 0), 0) / reviews.length
          : 0;

        const totalPositions = positions.length;

        setCardData([
          { title: "Total Employees", value: employees.length, description: "Total Number of Employees" },
          { title: "Performance Analytics", value: totalKpiScore, description: "Total KPI Score", decimals: false },
          { title: "Payroll Details", value: totalPositions, description: "Total Payroll" },
        ]);

        setJobStats({
          openJobs,
          closedJobs,
        });

      })
      .catch((error) => {
        toast.error(error.message??'Error');
        setError(error);
      }).finally(() =>{
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <Container fluid className="py-2">
        <Row className="gy-2 gx-2">
          <Col xs={12} className="text-center">
          <div className="loading-overlay">
              <div className="spinner-border " role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error) {
    return null;
  }

  return (
    <Container fluid className="py-2">
      <Row className="gy-2 gx-2">
        {cardData.map((card, index) => (
          <Col key={index} xs={12} sm={6} md={3}>
            <div className="text-center px-3 py-3 shadow card-container hover-container">
              <h6 className="fw-bold card-title " >{card.title}</h6>
              <h2 className="my-2 fw-bold card-value">
                <CountUp
                  end={card.value}
                  duration={2}
                  decimals={card.decimals || 0}
                  prefix={card.prefix || ""}
                  suffix={card.suffix || ""}
                />
              </h2>
              <small className="text-muted card-description ">{card.description}</small>
            </div>
          </Col>
        ))}
        <Col xs={12} sm={6} md={3}>
          <JobOverviewCard openJobs={jobStats.openJobs} closedJobs={jobStats.closedJobs} />
        </Col>
      </Row>
    </Container>
  );
};

export default Cards;
