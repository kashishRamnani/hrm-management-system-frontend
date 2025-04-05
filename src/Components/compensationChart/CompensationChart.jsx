import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Compensation } from "../../utils/Compensation";
import "./CompensationChart.css";
import {
  BarChart,
  Rectangle,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const CompensationChart = () => {
  const { user: { token } } = useAuth();
  const [compensations, setCompensations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    token && Compensation.all(token, setCompensations, setMessage, setIsLoading);
  }, [token]);

  useEffect(() => {
    if (compensations.length) {
      const extractedEmployees = [...new Map(compensations.map(item => [item.employee.id, item.employee])).values()];
      setEmployees(extractedEmployees);

      setChartData([{
        name: compensations[0].payment_month,
        BasicSalary: parseFloat(compensations[0].base_salary) ?? 0.00,
        Bonus: parseFloat(compensations[0].bonus) ?? 0.00,
        Total: (parseFloat(compensations[0].base_salary) ?? 0.00) + (parseFloat(compensations[0].bonus) ?? 0.00),
      }]);
    }
  }, [compensations]);

  const handleEmployeeChange = e => {
    const compensation = compensations.find(compensation => compensation.employee.id === parseInt(e.target.value));
    setChartData([{
      name: compensation.payment_month,
      BasicSalary: parseFloat(compensation.base_salary) ?? 0.00,
      Bonus: parseFloat(compensation.bonus) ?? 0.00,
      Total: (parseFloat(compensation.base_salary) ?? 0.00) + (parseFloat(compensation.bonus) ?? 0.00),
    }]);
  };

  if (isLoading) return <div></div>;
  if (message) return <div></div>;

  return (
    <div className="dashboard-chart-container hover-container">
      <h2 className="chart-title">Employee Monthly Compensation</h2>

      <div className="employee-selector">
        <label htmlFor="employee">Select Employee: </label>
        <select onChange={handleEmployeeChange}>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.first_name} {employee.last_name}
            </option>
          ))}
        </select>
      </div>

      {employees.length ? (
        <ResponsiveContainer width="98%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" label={{ position: "insideBottom", offset: -5 }} />
            <YAxis
              tickFormatter={(value) => `${value.toLocaleString()}`}
              label={{
                value: "Salary (PKR)",
                angle: -90,
                position: "insideLeft",
                dx: -18,
              }}
            />
            <Tooltip />
            <Legend />

            <Bar
              dataKey="BasicSalary"
              name="Basic Salary"
              fill="#6c3483"

            />
            <Bar
              dataKey="Bonus"
              name="Bonus"
              fill="#9777d2"

            />
            <Bar dataKey="Total" name="Total Compensation" fill="#ff6600" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div>No employee data available</div>
      )}
    </div>
  );
};

export default CompensationChart;
