import React from 'react';
import { Pie, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface ChartComponentProps {
  styleInfos: { buyerName: string }[];
}

const ChartComponent: React.FC<ChartComponentProps> = ({ styleInfos }) => {
  // Grouping styleInfos by buyerName
  const buyerData = styleInfos.reduce((acc: { [key: string]: number }, { buyerName }) => {
    if (!acc[buyerName]) {
      acc[buyerName] = 1;
    } else {
      acc[buyerName]++;
    }
    return acc;
  }, {});

  const labels = Object.keys(buyerData);
  const dataValues = Object.values(buyerData);

  // Updated vibrant colors without pink
  const backgroundColors = [
    'rgba(54, 162, 235, 0.6)', // Light blue
    'rgba(255, 205, 86, 0.6)', // Yellow
    'rgba(75, 192, 192, 0.6)', // Aqua
    'rgba(153, 102, 255, 0.6)', // Purple
    'rgba(255, 159, 64, 0.6)', // Orange
    'rgba(232, 99, 132, 0.6)', // Reddish
    'rgba(102, 255, 102, 0.6)', // Green
  ];

  // Hover effects and rounded bar options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const, // Position the legend at the bottom for a modern look
        labels: {
          color: '#333',
          font: {
            family: 'Arial',
            size: 14,
          },
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        cornerRadius: 10,
        titleFont: {
          family: 'Arial',
          size: 14,
        },
        bodyFont: {
          family: 'Arial',
          size: 12,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Hide grid lines for a cleaner look
        },
        ticks: {
          color: '#333',
          font: {
            family: 'Arial',
            size: 14,
          },
        },
      },
      y: {
        grid: {
          display: true,
          color: 'rgba(0,0,0,0.1)',
        },
        ticks: {
          color: '#333',
          font: {
            family: 'Arial',
            size: 14,
          },
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 5, // Rounded corners on the bar chart for a modern effect
        hoverBorderWidth: 2,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Requests per Buyer',
        data: dataValues,
        backgroundColor: backgroundColors,
        hoverBackgroundColor: backgroundColors.map((color) => color.replace('0.6', '1.0')), // Darker hover effect
        borderColor: 'rgba(255, 255, 255, 0.9)', // White border for modern, clean look
        borderWidth: 2,
        hoverBorderColor: '#fff',
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      <div className="bg-white shadow-lg rounded-lg p-4">
        <h3 className="text-center text-lg font-semibold mb-4">Pie Chart</h3>
        <div className="relative w-full h-64">
          <Pie data={data} options={chartOptions} />
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-4">
        <h3 className="text-center text-lg font-semibold mb-4">Doughnut Chart</h3>
        <div className="relative w-full h-64">
          <Doughnut data={data} options={chartOptions} />
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-lg p-4">
        <h3 className="text-center text-lg font-semibold mb-4">Bar Chart</h3>
        <div className="relative w-full h-64">
          <Bar data={data} options={chartOptions} />
        </div>
      </div>
    </div>
  );
};

export default ChartComponent;
