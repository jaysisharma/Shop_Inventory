// import React, { useRef, useEffect } from 'react';
// import { Chart as ChartJS, Bar } from 'react-chartjs-2'; // or other types like Line, Pie, etc.
// import { Chart } from 'chart.js';

// const Charts = () => {
//   const chartRef = useRef(null); // Ref to the canvas element

//   const data = {
//     labels: ['January', 'February', 'March', 'April', 'May'],
//     datasets: [
//       {
//         label: 'Monthly Sales',
//         data: [10, 20, 30, 40, 50],
//         backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         borderColor: 'rgba(75, 192, 192, 1)',
//         borderWidth: 1,
//       },
//     ],
//   };

//   const options = {
//     responsive: true,
//     scales: {
//       x: {
//         beginAtZero: true,
//       },
//     },
//   };

//   useEffect(() => {
//     // Cleanup previous chart before creating a new one
//     if (chartRef.current) {
//       const chartInstance = chartRef.current.chartInstance;
//       if (chartInstance) {
//         chartInstance.destroy();
//       }
//     }
//   }, [data]); // Run this whenever data changes

//   return <Bar ref={chartRef} data={data} options={options} />;
// };

// export default Charts;
  