import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS elements and plugins
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsDashboard = ({ data }) => {
  // Guard against undefined or null data
  if (!data || !data.labels || !data.values) {
    return (
      <div>
        <h2>Analytics Dashboard</h2>
        <p>No analytics data available yet.</p>
      </div>
    );
  }
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Notes Analytics',
        data: data.values,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div>
      <h2>Analytics Dashboard</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default AnalyticsDashboard;