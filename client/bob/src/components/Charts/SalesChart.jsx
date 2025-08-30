import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SalesChart = ({ timeRange, orders, selectedMonth }) => {
  const filterOrdersByMonth = (month) => {
    return orders.filter(order => {
      const orderDate = new Date(order.datum_narudzbe);
      return orderDate.getMonth() + 1 === month;
    });
  };

  const getDaysInMonth = (month) => {
    const currentYear = new Date().getFullYear();
    return new Date(currentYear, month, 0).getDate();
  };

  const generateChartData = () => {
    let filteredOrders = orders;
    let labels = [];
    let dayCounts = [];
    let revenueData = [];

    if (timeRange === 'day') {
      labels = Array.from({length: 24}, (_, i) => `${i}h`);
      dayCounts = Array(24).fill(0);
      revenueData = Array(24).fill(0);

      filteredOrders.forEach(order => {
        const hour = new Date(order.datum_narudzbe).getHours();
        dayCounts[hour] += 1;
        revenueData[hour] += order.ukupna_cijena;
      });
    } 
    else if (timeRange === 'week') {
      labels = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];
      dayCounts = Array(7).fill(0);
      revenueData = Array(7).fill(0);

      filteredOrders.forEach(order => {
        const day = new Date(order.datum_narudzbe).getDay();
        const adjustedDay = day === 0 ? 6 : day - 1; 
        dayCounts[adjustedDay] += 1;
        revenueData[adjustedDay] += order.ukupna_cijena;
      });
    } 
    else if (timeRange === 'month') {
      if (selectedMonth) {
        filteredOrders = filterOrdersByMonth(selectedMonth);
      }
      const daysInMonth = selectedMonth ? getDaysInMonth(selectedMonth) : 31;
      labels = Array.from({length: daysInMonth}, (_, i) => `${i + 1}.`);
      dayCounts = Array(daysInMonth).fill(0);
      revenueData = Array(daysInMonth).fill(0);

      filteredOrders.forEach(order => {
        const day = new Date(order.datum_narudzbe).getDate() - 1;
        if (day < daysInMonth) {
          dayCounts[day] += 1;
          revenueData[day] += order.ukupna_cijena;
        }
      });
    }

    return {
      labels,
      datasets: [
        {
          label: 'Broj narudžbi',
          data: dayCounts,
          backgroundColor: '#3B82F6',
        },
        {
          label: 'Zarada (KM)',
          data: revenueData,
          backgroundColor: '#10B981',
        }
      ]
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) label += ': ';
            if (context.datasetIndex === 0) {
              label += `${context.raw} narudžbi`;
            } else {
              label += `${context.raw.toFixed(2)} KM`;
            }
            return label;
          }
        }
      },
      title: {
        display: true,
        text: `Statistika ${timeRange === 'day' ? 'po satima' : timeRange === 'week' ? 'po danima u sedmici' : `po danima u ${selectedMonth ? selectedMonth + '. mjesecu' : 'mjesecu'}`}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  return (
    <div className="h-[400px]">
      <Bar options={options} data={generateChartData()} />
    </div>
  );
};

export default SalesChart;