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
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        background: 'rgba(30, 41, 59, 0.8)',
        borderRadius: '16px',
        border: '1px solid rgba(139, 92, 246, 0.2)',
      }}>
        <h2 style={{ color: '#f1f5f9', marginBottom: '16px' }}>Analytics Dashboard</h2>
        <p style={{ color: '#94a3b8' }}>No analytics data available yet.</p>
      </div>
    );
  }
  
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: 'Notes by Category',
        data: data.values,
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#f1f5f9',
          font: {
            size: 14,
            weight: 600,
          },
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1',
        borderColor: 'rgba(139, 92, 246, 0.5)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 700,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#94a3b8',
          font: {
            size: 12,
          },
        },
        grid: {
          color: 'rgba(139, 92, 246, 0.1)',
          borderColor: 'rgba(139, 92, 246, 0.2)',
        },
      },
      x: {
        ticks: {
          color: '#94a3b8',
          font: {
            size: 12,
            weight: 600,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div style={{ 
      padding: '16px',
      background: 'rgba(30, 41, 59, 0.8)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      <h2 style={{ 
        color: '#f1f5f9', 
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
        fontSize: '1.25rem',
        fontWeight: 700,
      }}>
        📊 Analytics Dashboard
      </h2>
      <div style={{ 
        width: '100%', 
        maxWidth: '100%', 
        overflow: 'hidden',
        position: 'relative',
      }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AnalyticsDashboard;