import React from 'react';
import { Bar } from 'react-chartjs-2';
import './Dashboard.css';

function Dashboard() {
  // Dữ liệu cho đồ thị
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Messages Sent',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Tùy chọn cho đồ thị
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <div className="stats">
        <div className="stat-box">
          <h3>Total Messages</h3>
          <p>1000</p>
        </div>
        <div className="stat-box">
          <h3>Active Users</h3>
          <p>150</p>
        </div>
      </div>
      <div className="chart-container">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}

export default Dashboard;
