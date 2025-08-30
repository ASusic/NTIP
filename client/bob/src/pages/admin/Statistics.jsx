import { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Download, 
  Filter, 
  BarChart2, 
  PieChart, 
  LineChart,
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  Loader2
} from 'lucide-react';

// Date formatting function
const formatDateLabel = (dateStr, timeRange) => {
  const date = new Date(dateStr);
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };
  
  switch (timeRange) {
    case 'day':
      return date.toLocaleDateString('bs-BA', options);
    case 'week':
      return `Tjedan ${Math.ceil(date.getDate() / 7)}, ${date.toLocaleDateString('bs-BA', { month: 'long', year: 'numeric' })}`;
    case 'month':
      return date.toLocaleDateString('bs-BA', { month: 'long', year: 'numeric' });
    case 'year':
      return date.getFullYear();
    default:
      return date.toLocaleDateString('bs-BA', options);
  }
};

// Beautiful Bar Chart Component
const BarChart = ({ data, timeRange }) => {
  const maxValue = Math.max(...data.map(item => item.rawRevenue)) * 1.1;
  const colors = ['#4ade80', '#22d3ee', '#818cf8', '#f472b6', '#fb923c'];
  
  return (
    <div className="flex h-full">
      <div className="flex flex-col justify-between mr-2">
        {[0, 0.25, 0.5, 0.75, 1].map((value) => (
          <div key={value} className="text-xs text-gray-500">
            {(maxValue * value).toFixed(0)} KM
          </div>
        ))}
      </div>
      
      <div className="flex-1 flex items-end gap-1">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-full rounded-t-md hover:opacity-90 transition-all"
              style={{ 
                height: `${(item.rawRevenue / maxValue) * 100}%`,
                minHeight: '2px',
                background: `linear-gradient(to top, ${colors[index % colors.length]}, ${colors[(index + 2) % colors.length]})`
              }}
              title={`${formatDateLabel(item.date, timeRange)}\n${item.rawRevenue.toFixed(2)} KM`}
            />
            <div className="text-xs mt-1 text-gray-500 text-center px-1">
              {formatDateLabel(item.date, timeRange).split(',')[0]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Elegant Line Chart Component
const LineChartComponent = ({ data, timeRange }) => {
  const maxValue = Math.max(...data.map(item => item.rawRevenue)) * 1.1;
  const minValue = Math.min(0, ...data.map(item => item.rawRevenue)) * 0.9;
  
  const points = data.map((item, index) => ({
    x: (index / (data.length - 1)) * 100,
    y: ((item.rawRevenue - minValue) / (maxValue - minValue)) * 100
  }));

  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          points={points.map(p => `${p.x},${100 - p.y}`).join(' ')}
        />
        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={100 - point.y}
            r="3"
            fill="white"
            stroke="#3b82f6"
            strokeWidth="1.5"
          />
        ))}
      </svg>
      
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
        {data.map((item, index) => (
          <div key={index} className="text-xs text-gray-500">
            {index % 2 === 0 ? formatDateLabel(item.date, timeRange).split(',')[0] : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

// Modern Pie Chart Component
const PieChartComponent = ({ data, timeRange }) => {
  const total = data.reduce((sum, item) => sum + item.rawRevenue, 0);
  let cumulativePercent = 0;
  
  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {data.map((item, index) => {
          const percent = (item.rawRevenue / total) * 100;
          const startX = 50 + 50 * Math.cos(2 * Math.PI * cumulativePercent / 100);
          const startY = 50 + 50 * Math.sin(2 * Math.PI * cumulativePercent / 100);
          cumulativePercent += percent;
          const endX = 50 + 50 * Math.cos(2 * Math.PI * cumulativePercent / 100);
          const endY = 50 + 50 * Math.sin(2 * Math.PI * cumulativePercent / 100);
          
          const largeArcFlag = percent > 50 ? 1 : 0;
          
          return (
            <path
              key={index}
              d={`M 50 50 L ${startX} ${startY} A 50 50 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
              fill={`hsl(${index * 360 / data.length}, 70%, 60%)`}
              stroke="#fff"
              strokeWidth="1"
              className="hover:opacity-90 transition-opacity"
            />
          );
        })}
        <circle cx="50" cy="50" r="30" fill="#fff" />
        <text 
          x="50" 
          y="50" 
          textAnchor="middle" 
          dominantBaseline="middle" 
          className="text-sm font-bold fill-gray-700"
        >
          {total.toFixed(2)} KM
        </text>
      </svg>
      
      <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-2 p-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center bg-white bg-opacity-80 rounded px-2 py-1 shadow-xs">
            <div 
              className="w-3 h-3 mr-1 rounded-sm" 
              style={{ backgroundColor: `hsl(${index * 360 / data.length}, 70%, 60%)` }}
            />
            <span className="text-xs font-medium">
              {formatDateLabel(item.date, timeRange)}: {(item.rawRevenue / total * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// SalesChart component
const SalesChart = ({ data, timeRange, chartType = 'bar' }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const groupedData = {};
    
    data.forEach(item => {
      const key = item.date;
      if (!groupedData[key]) {
        groupedData[key] = {
          date: key,
          revenue: 0,
          orders: 0,
          items: 0,
          rawRevenue: 0
        };
      }
      
      const revenue = parseFloat(item.revenue.replace(' KM', '').replace(',', ''));
      groupedData[key].revenue += revenue;
      groupedData[key].rawRevenue += revenue;
      groupedData[key].orders += item.orders;
      groupedData[key].items += item.sold;
    });

    return Object.values(groupedData).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">Nema podataka za prikaz</p>
      </div>
    );
  }

  return (
    <div className="h-96 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      {chartType === 'bar' && <BarChart data={chartData} timeRange={timeRange} />}
      {chartType === 'line' && <LineChartComponent data={chartData} timeRange={timeRange} />}
      {chartType === 'pie' && <PieChartComponent data={chartData} timeRange={timeRange} />}
    </div>
  );
};

// Main Statistics Component
const Statistics = () => {
  const [orders, setOrders] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [dateFilter, setDateFilter] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [stats, setStats] = useState([]);
  const [filteredStats, setFilteredStats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, itemsRes, productsRes] = await Promise.all([
          fetch('http://localhost:3000/narudzbe'),
          fetch('http://localhost:3000/stavkenarudzbe'),
          fetch('http://localhost:3000/artikli')
        ]);
        
        const ordersData = await ordersRes.json();
        const itemsData = await itemsRes.json();
        const productsData = await productsRes.json();
        
        setOrders(ordersData);
        setOrderItems(itemsData);
        setProducts(productsData);
        setLoading(false);
      } catch (error) {
        console.error('Greška pri učitavanju podataka:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (orders.length > 0 && orderItems.length > 0 && products.length > 0) {
      processStatistics();
    }
  }, [orders, orderItems, products, timeRange, dateFilter]);

  useEffect(() => {
    if (stats.length > 0) {
      let filtered = [...stats];
      
      if (searchTerm) {
        filtered = filtered.filter(item => 
          item.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.productCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.date.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setFilteredStats(filtered);
    }
  }, [stats, searchTerm]);

  const processStatistics = () => {
    const itemsByDateAndProduct = {};

    orderItems.forEach(item => {
      const order = orders.find(o => o.id === item.narudzba_id);
      if (!order) return;

      const product = products.find(p => p.id === item.artikl_id);
      if (!product) return;

      const orderDate = new Date(order.datum_narudzbe);
      let dateKey;

      switch (timeRange) {
        case 'day':
          dateKey = orderDate.toISOString().split('T')[0];
          break;
        case 'week':
          const weekStart = new Date(orderDate);
          weekStart.setDate(orderDate.getDate() - orderDate.getDay());
          dateKey = weekStart.toISOString().split('T')[0];
          break;
        case 'month':
          dateKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'year':
          dateKey = orderDate.getFullYear().toString();
          break;
        default:
          dateKey = orderDate.toISOString().split('T')[0];
      }

      if (dateFilter && !dateKey.includes(dateFilter)) return;

      if (!itemsByDateAndProduct[dateKey]) {
        itemsByDateAndProduct[dateKey] = {};
      }

      if (!itemsByDateAndProduct[dateKey][item.artikl_id]) {
        itemsByDateAndProduct[dateKey][item.artikl_id] = {
          productId: `P-${item.artikl_id}`,
          productName: product.naziv,
          productCategory: product.kategorija,
          orders: 0,
          sold: 0,
          revenue: 0,
          profit: 0
        };
      }

      itemsByDateAndProduct[dateKey][item.artikl_id].orders += 1;
      itemsByDateAndProduct[dateKey][item.artikl_id].sold += item.kolicina;
      itemsByDateAndProduct[dateKey][item.artikl_id].revenue += item.kolicina * item.cijena_po_komadu;
      itemsByDateAndProduct[dateKey][item.artikl_id].profit += item.kolicina * (item.cijena_po_komadu - product.cijena);
    });

    const processedStats = [];
    Object.keys(itemsByDateAndProduct).forEach(date => {
      Object.keys(itemsByDateAndProduct[date]).forEach(productId => {
        const item = itemsByDateAndProduct[date][productId];
        processedStats.push({
          date,
          productId: item.productId,
          productName: item.productName,
          productCategory: item.productCategory,
          orders: item.orders,
          sold: item.sold,
          revenue: item.revenue.toFixed(2) + ' KM',
          profit: item.profit.toFixed(2) + ' KM',
          rawRevenue: item.revenue,
          rawProfit: item.profit
        });
      });
    });

    setStats(processedStats);
  };

  const handleExport = async (type = 'csv') => {
    setExportLoading(true);
    
    try {
      if (type === 'csv') {
        const csvContent = [
          ['Datum', 'ID artikla', 'Naziv artikla', 'Kategorija', 'Broj narudžbi', 'Prodatih jedinica', 'Ukupna prodaja', 'Profit'],
          ...filteredStats.map(item => [
            item.date,
            item.productId,
            `"${item.productName}"`,
            `"${item.productCategory}"`,
            item.orders,
            item.sold,
            item.revenue,
            item.profit
          ])
        ].map(e => e.join(",")).join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `statistika_prodaje_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Greška pri izvozu:', error);
      alert('Došlo je do greške prilikom izvoza podataka');
    } finally {
      setExportLoading(false);
    }
  };

  const resetFilters = () => {
    setTimeRange('week');
    setDateFilter('');
    setSearchTerm('');
    setChartType('bar');
  };

  const getTopProducts = (count = 5) => {
    const productMap = {};
    
    filteredStats.forEach(item => {
      if (!productMap[item.productId]) {
        productMap[item.productId] = {
          ...item,
          rawRevenue: parseFloat(item.rawRevenue),
          rawProfit: parseFloat(item.rawProfit)
        };
      } else {
        productMap[item.productId].orders += item.orders;
        productMap[item.productId].sold += item.sold;
        productMap[item.productId].rawRevenue += parseFloat(item.rawRevenue);
        productMap[item.productId].rawProfit += parseFloat(item.rawProfit);
      }
    });
    
    return Object.values(productMap)
      .sort((a, b) => b.rawRevenue - a.rawRevenue)
      .slice(0, count)
      .map(item => ({
        ...item,
        revenue: item.rawRevenue.toFixed(2) + ' KM',
        profit: item.rawProfit.toFixed(2) + ' KM'
      }));
  };

  const getSalesByCategory = () => {
    const categoryMap = {};
    
    filteredStats.forEach(item => {
      if (!categoryMap[item.productCategory]) {
        categoryMap[item.productCategory] = {
          category: item.productCategory,
          revenue: parseFloat(item.rawRevenue),
          count: 1
        };
      } else {
        categoryMap[item.productCategory].revenue += parseFloat(item.rawRevenue);
        categoryMap[item.productCategory].count += 1;
      }
    });
    
    return Object.values(categoryMap)
      .sort((a, b) => b.revenue - a.revenue)
      .map(item => ({
        ...item,
        revenue: item.revenue.toFixed(2) + ' KM',
        avgRevenue: (item.revenue / item.count).toFixed(2) + ' KM'
      }));
  };

  const getTimeSeriesData = () => {
    const timeSeries = {};
    
    filteredStats.forEach(item => {
      if (!timeSeries[item.date]) {
        timeSeries[item.date] = {
          date: item.date,
          revenue: parseFloat(item.rawRevenue),
          orders: item.orders,
          items: item.sold
        };
      } else {
        timeSeries[item.date].revenue += parseFloat(item.rawRevenue);
        timeSeries[item.date].orders += item.orders;
        timeSeries[item.date].items += item.sold;
      }
    });
    
    return Object.values(timeSeries)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(item => ({
        ...item,
        revenue: item.revenue.toFixed(2) + ' KM',
        avgOrderValue: (item.revenue / item.orders).toFixed(2) + ' KM'
      }));
  };

  if (loading) {
    return (
      <div className="ml-64 pt-16 p-6 flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
        <p className="mt-4 text-lg">Učitavanje podataka...</p>
      </div>
    );
  }

  return (
    <div className="ml-64 pt-16 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Statistika prodaje</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={(e) => setDateFilter(e.target.value)}
              value={dateFilter}
            />
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="day">Dnevno</option>
            <option value="week">Sedmično</option>
            <option value="month">Mjesečno</option>
            <option value="year">Godišnje</option>
          </select>
          <div className="relative">
            <button 
              onClick={() => handleExport('csv')}
              disabled={exportLoading}
              className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-green-300"
            >
              {exportLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Izvoz
            </button>
          </div>
        </div>
      </div>

      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'overview' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('overview')}
        >
          Pregled
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'products' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('products')}
        >
          Artikli
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'categories' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('categories')}
        >
          Kategorije
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeTab === 'time' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-500'}`}
          onClick={() => setActiveTab('time')}
        >
          Vremenska analiza
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <div className="flex items-center">
                <ShoppingCart className="h-6 w-6 text-green-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Ukupno narudžbi</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <div className="flex items-center">
                <Package className="h-6 w-6 text-blue-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Ukupno artikala</p>
                  <p className="text-2xl font-bold">
                    {orderItems.reduce((sum, item) => sum + item.kolicina, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 text-yellow-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Ukupna prodaja</p>
                  <p className="text-2xl font-bold">
                    {orderItems
                      .reduce((sum, item) => sum + (item.kolicina * item.cijena_po_komadu), 0)
                      .toFixed(2)} KM
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-purple-500 mr-2" />
                <div>
                  <p className="text-sm text-gray-500">Prosjek po narudžbi</p>
                  <p className="text-2xl font-bold">
                    {orders.length > 0 
                      ? (orderItems.reduce((sum, item) => sum + (item.kolicina * item.cijena_po_komadu), 0) / orders.length).toFixed(2) 
                      : '0.00'} KM
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Grafikon prodaje</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => setChartType('bar')}
                  className={`p-2 rounded ${chartType === 'bar' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                  title="Stupčasti dijagram"
                >
                  <BarChart2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`p-2 rounded ${chartType === 'line' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                  title="Linijski dijagram"
                >
                  <LineChart className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setChartType('pie')}
                  className={`p-2 rounded ${chartType === 'pie' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                  title="Pita dijagram"
                >
                  <PieChart className="h-5 w-5" />
                </button>
              </div>
            </div>
            <SalesChart data={filteredStats} timeRange={timeRange} chartType={chartType} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Najprodavaniji artikli</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {getTopProducts(3).map((product, index) => (
                <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                  <h3 className="font-bold text-lg">{product.productName}</h3>
                  <p className="text-sm text-gray-500 mb-2">{product.productCategory}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">Narudžbi</p>
                      <p className="font-medium">{product.orders}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prodanih</p>
                      <p className="font-medium">{product.sold}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Prodaja</p>
                      <p className="font-medium">{product.revenue}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Profit</p>
                      <p className="font-medium">{product.profit}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {activeTab === 'products' && (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Statistika po artiklima</h2>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Pretraži artikle..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID artikla</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naziv</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategorija</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Narudžbi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prodanih</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prodaja</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStats.length > 0 ? (
                  filteredStats.map((item, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedProduct(item)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{item.productId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.productName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.productCategory}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.orders}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.sold}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.revenue}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.profit}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <Search className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Nema pronađenih artikala</h3>
                      <p className="mt-1 text-sm text-gray-500">Pokušajte da promijenite kriterijume pretrage</p>
                      <button
                        onClick={resetFilters}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
                      >
                        Resetuj filtere
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Statistika po kategorijama</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Prodaja po kategorijama</h3>
              <div className="h-96">
                <SalesChart 
                  data={filteredStats} 
                  timeRange={timeRange} 
                  chartType="pie" 
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Top kategorije</h3>
              <div className="space-y-4">
                {getSalesByCategory().map((category, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white">
                    <h4 className="font-bold">{category.category}</h4>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div>
                        <p className="text-sm text-gray-500">Ukupna prodaja</p>
                        <p className="font-medium">{category.revenue}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Broj artikala</p>
                        <p className="font-medium">{category.count}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Prosjek po artiklu</p>
                        <p className="font-medium">{category.avgRevenue}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'time' && (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-100">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Vremenska analiza</h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Prodaja kroz vrijeme</h3>
              <div className="h-96">
                <SalesChart 
                  data={filteredStats} 
                  timeRange={timeRange} 
                  chartType="line" 
                />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Detalji po periodima</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Narudžbi</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artikala</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prodaja</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prosjek po narudžbi</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {getTimeSeriesData().map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{formatDateLabel(item.date, timeRange)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.orders}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.items}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.revenue}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.avgOrderValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold">Detalji artikla: {selectedProduct.productName}</h3>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500">ID artikla</p>
                <p className="font-medium">{selectedProduct.productId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kategorija</p>
                <p className="font-medium">{selectedProduct.productCategory}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Broj narudžbi</p>
                <p className="font-medium">{selectedProduct.orders}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Prodanih jedinica</p>
                <p className="font-medium">{selectedProduct.sold}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ukupna prodaja</p>
                <p className="font-medium">{selectedProduct.revenue}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ukupni profit</p>
                <p className="font-medium">{selectedProduct.profit}</p>
              </div>
            </div>
            <div className="h-64">
              <SalesChart 
                data={stats.filter(item => item.productId === selectedProduct.productId)} 
                timeRange={timeRange} 
                chartType="bar" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;