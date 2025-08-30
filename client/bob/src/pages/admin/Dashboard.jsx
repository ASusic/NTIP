import { useState, useEffect } from 'react';
import { 
  ArrowUp, 
  ArrowDown, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp 
} from 'lucide-react';
import StatsCard from '../../components/admin/UI/StatsCard';
import UsersPieChart from '../../components/Charts/UsersPieChart';
import SalesChart from '../../components/Charts/SalesChart';

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [statsData, setStatsData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [userTypes, setUserTypes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableMonths, setAvailableMonths] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [articlesRes, ordersRes, usersRes, orderItemsRes] = await Promise.all([
          fetch('http://localhost:3000/artikli'),
          fetch('http://localhost:3000/narudzbe'),
          fetch('http://localhost:3000/korisnici'),
          fetch('http://localhost:3000/stavkenarudzbe')
        ]);

        const [articles, ordersData, users, orderItems] = await Promise.all([
          articlesRes.json(),
          ordersRes.json(),
          usersRes.json(),
          orderItemsRes.json()
        ]);

        setOrders(ordersData);

        const months = [...new Set(
          ordersData.map(order => new Date(order.datum_narudzbe).getMonth() + 1)
        )].sort((a, b) => a - b);
        
        setAvailableMonths(months);
        if (months.length > 0 && !months.includes(selectedMonth)) {
          setSelectedMonth(months[0]);
        }

        const userTypeCounts = users.reduce((acc, user) => {
          acc[user.tip_korisnika] = (acc[user.tip_korisnika] || 0) + 1;
          return acc;
        }, {});

        const userTypesData = Object.entries(userTypeCounts).map(([type, count]) => ({
          name: type === 'admin' ? 'Administratori' : type === 'fizicko' ? 'Korisnici' : type,
          value: count
        }));

        setUserTypes(userTypesData);

        const currentMonthOrders = ordersData.filter(order => 
          new Date(order.datum_narudzbe).getMonth() + 1 === selectedMonth
        );

        const totalRevenue = currentMonthOrders.reduce((sum, order) => sum + order.ukupna_cijena, 0);
        const totalOrders = currentMonthOrders.length;
        const totalUsers = users.filter(user => user.tip_korisnika !== 'admin').length;
        const totalSoldItems = orderItems.reduce((sum, item) => sum + item.kolicina, 0);

        const productSales = {};
        orderItems.forEach(item => {
          productSales[item.artikl_id] = (productSales[item.artikl_id] || 0) + item.kolicina;
        });

        const sortedProducts = articles
          .map(article => ({
            ...article,
            sold: productSales[article.id] || 0
          }))
          .sort((a, b) => b.sold - a.sold)
          .slice(0, 5)
          .map(product => ({
            id: product.id,
            name: product.naziv || 'Nepoznat proizvod',
            sold: product.sold,
            stock: product.kolicina_na_stanju > 0 ? 'Dostupno' : 'Nedostupno',
            stockQuantity: product.kolicina_na_stanju,
            image: product.slika || ''
          }));

        setStatsData([
          {
            title: 'Ukupna zarada',
            value: `${totalRevenue.toFixed(2)} KM`,
            change: 12.5,
            icon: TrendingUp,
            color: 'bg-[#10B981]'
          },
          {
            title: 'Broj narudžbi',
            value: totalOrders,
            change: -3.2,
            icon: ShoppingCart,
            color: 'bg-[#3B82F6]'
          },
          {
            title: 'Broj korisnika',
            value: totalUsers,
            change: 8.7,
            icon: Users,
            color: 'bg-[#8B5CF6]'
          },
          {
            title: 'Prodani artikli',
            value: totalSoldItems,
            change: 15.3,
            icon: Package,
            color: 'bg-[#F59E0B]'
          }
        ]);

        setTopProducts(sortedProducts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  if (loading) {
    return (
      <div className="ml-64 pt-16 p-6 flex justify-center items-center h-screen">
        <div className="text-xl">Učitavanje podataka...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ml-64 pt-16 p-6">
        <div className="text-red-500">Greška: {error}</div>
      </div>
    );
  }

  return (
    <div className="ml-64 pt-16 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border rounded-lg px-3 py-1 text-sm bg-white"
          >
            <option value="day">Dnevni prikaz (24h)</option>
            <option value="week">Sedmični prikaz</option>
            <option value="month">Mjesečni prikaz</option>
          </select>
          {timeRange === 'month' && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="border rounded-lg px-3 py-1 text-sm bg-white"
            >
              {availableMonths.map(month => (
                <option key={month} value={month}>{month}. mjesec</option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <SalesChart 
            timeRange={timeRange} 
            orders={orders} 
            selectedMonth={timeRange === 'month' ? selectedMonth : null} 
          />
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Struktura korisnika</h2>
          <UsersPieChart userTypes={userTypes} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Top 5 artikala</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artikal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prodatih jedinica</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status zaliha</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {product.image ? (
                        <img className="h-10 w-10 rounded-full mr-3" src={product.image} alt={product.name} />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                          <Package className="text-gray-500" />
                        </div>
                      )}
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sold}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${product.stock === 'Dostupno' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {product.stock} ({product.stockQuantity})
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;