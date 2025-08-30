import { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  Sliders,
  ArrowLeft,
  Check,
  X,
  Truck,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  User
} from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    minPrice: '',
    maxPrice: '',
    startDate: '',
    endDate: '',
    paymentMethod: 'all',
    deliveryType: 'all'
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, usersRes] = await Promise.all([
          fetch('http://localhost:3000/narudzbe'),
          fetch('http://localhost:3000/korisnici')
        ]);
        const ordersData = await ordersRes.json();
        const usersData = await usersRes.json();
        setOrders(ordersData);
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error('Greška pri učitavanju podataka:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedOrders = () => {
    if (!sortConfig.key) return orders;
    return [...orders].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const applyFilters = (order) => {
    const matchesSearch =
      order.id.toString().includes(searchTerm) ||
      (getUserName(order.korisnik_id)?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.adresa_dostave.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status === 'all' || order.status === filters.status;
    const matchesPrice =
      (filters.minPrice === '' || order.ukupna_cijena >= Number(filters.minPrice)) &&
      (filters.maxPrice === '' || order.ukupna_cijena <= Number(filters.maxPrice));

    const orderDate = new Date(order.datum_narudzbe);
    const startDate = filters.startDate ? new Date(filters.startDate) : null;
    const endDate = filters.endDate ? new Date(filters.endDate) : null;

    const matchesDate =
      (!startDate || orderDate >= startDate) &&
      (!endDate || orderDate <= new Date(endDate.setHours(23, 59, 59, 999)));

    const matchesPayment = filters.paymentMethod === 'all' || order.nacin_placanja === filters.paymentMethod;
    const matchesDelivery = filters.deliveryType === 'all' || order.tip_dostave === filters.deliveryType;

    return matchesSearch && matchesStatus && matchesPrice && matchesDate && matchesPayment && matchesDelivery;
  };

  const filteredOrders = getSortedOrders().filter(applyFilters);

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.ime} ${user.prezime}` : 'Nepoznati korisnik';
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      minPrice: '',
      maxPrice: '',
      startDate: '',
      endDate: '',
      paymentMethod: 'all',
      deliveryType: 'all'
    });
    setSearchTerm('');
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/narudzbe/${orderId}`);
      if (!response.ok) throw new Error('Narudžba nije pronađena');
      const currentOrder = await response.json();

      const updateData = {
        korisnik_id: currentOrder.korisnik_id,
        datum_narudzbe: currentOrder.datum_narudzbe,
        ukupna_cijena: currentOrder.ukupna_cijena,
        status: newStatus,
        nacin_placanja: currentOrder.nacin_placanja,
        tip_dostave: currentOrder.tip_dostave || 'standardna',
        adresa_dostave: currentOrder.adresa_dostave
      };

      const updateResponse = await fetch(`http://localhost:3000/narudzbe/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || 'Greška pri ažuriranju narudžbe');
      }

      const updatedOrder = await updateResponse.json();
      setOrders(orders.map(o => o.id === orderId ? updatedOrder : o));
      if (selectedOrder?.id === orderId) setSelectedOrder(updatedOrder);
      return true;
    } catch (error) {
      console.error('Greška u updateOrderStatus:', error.message);
      alert(`Greška pri ažuriranju: ${error.message}`);
      return false;
    }
  };

  const confirmOrder = async () => {
    const success = await updateOrderStatus(selectedOrder.id, 'poslano');
    if (success) setIsConfirming(false);
  };

  const cancelOrder = async () => {
    const success = await updateOrderStatus(selectedOrder.id, 'otkazano');
    if (success) setIsCanceling(false);
  };

  const markAsDelivered = async () => {
    await updateOrderStatus(selectedOrder.id, 'dostavljeno');
  };

  const statusBadge = (status) => {
    const statusMap = {
      'u obradi': { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      'poslano': { color: 'bg-purple-100 text-purple-800', icon: Truck },
      'dostavljeno': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      'otkazano': { color: 'bg-red-100 text-red-800', icon: XCircle }
    };

    const { color, icon: Icon } = statusMap[status] || {};
    return (
      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status}
      </span>
    );
  };

  const paymentBadge = (method) => {
    const methodMap = {
      'pouzece': { color: 'bg-gray-100 text-gray-800', text: 'Pouzeće' },
      'kartica': { color: 'bg-blue-100 text-blue-800', text: 'Kartica' },
      'paypal': { color: 'bg-yellow-100 text-yellow-800', text: 'PayPal' },
      'virman': { color: 'bg-green-100 text-green-800', text: 'Virman' }
    };

    const { color, text } = methodMap[method] || {};
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
        <CreditCard className="w-3 h-3 mr-1" />
        {text}
      </span>
    );
  };

  const deliveryBadge = (type) => {
    const typeMap = {
      'standardna': { color: 'bg-gray-100 text-gray-800', text: 'Standardna' },
      'ekspresna': { color: 'bg-purple-100 text-purple-800', text: 'Ekspresna' },
      'preuzimanje': { color: 'bg-blue-100 text-blue-800', text: 'Preuzimanje' }
    };

    const { color, text } = typeMap[type] || {};
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${color}`}>
        <Truck className="w-3 h-3 mr-1" />
        {text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="ml-64 pt-16 p-6 flex justify-center items-center h-screen">
        <div className="text-xl">Učitavanje narudžbi...</div>
      </div>
    );
  }

  return (
    <div className="ml-64 pt-16 p-6">
      {selectedOrder ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <button
              onClick={() => setSelectedOrder(null)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Nazad na listu narudžbi
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">Narudžba #{selectedOrder.id}</h2>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedOrder.datum_narudzbe).toLocaleString()}
                  </p>
                </div>
                <div>{statusBadge(selectedOrder.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Ukupna cijena</p>
                  <p className="text-xl font-semibold">{selectedOrder.ukupna_cijena} KM</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Način plaćanja</p>
                  <div className="mt-1">{paymentBadge(selectedOrder.nacin_placanja)}</div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Tip dostave</p>
                <div className="mt-1">{deliveryBadge(selectedOrder.tip_dostave)}</div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Korisnik</p>
                <p className="font-medium">{getUserName(selectedOrder.korisnik_id)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Adresa dostave</p>
                <p className="font-medium">{selectedOrder.adresa_dostave}</p>
              </div>

              <div className="pt-4 space-y-3">
                {selectedOrder.status === 'u obradi' && (
                  <>
                    <button
                      onClick={() => setIsConfirming(true)}
                      className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 flex items-center justify-center"
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Označi kao poslano
                    </button>
                    <button
                      onClick={() => setIsCanceling(true)}
                      className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center justify-center"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Otkaži narudžbu
                    </button>
                  </>
                )}

                {selectedOrder.status === 'poslano' && (
                  <button
                    onClick={markAsDelivered}
                    className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center justify-center"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Označi kao dostavljeno
                  </button>
                )}
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Stavke narudžbe</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Proizvod 1</p>
                      <p className="text-sm text-gray-500">Količina: 2</p>
                    </div>
                    <p className="font-medium">50.20 KM</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Proizvod 2</p>
                      <p className="text-sm text-gray-500">Količina: 1</p>
                    </div>
                    <p className="font-medium">100.00 KM</p>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between">
                    <p className="font-medium">Ukupno:</p>
                    <p className="font-bold">{selectedOrder.ukupna_cijena} KM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isConfirming && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-bold mb-4">Potvrdi slanje narudžbe</h3>
                <p className="mb-6">Da li ste sigurni da želite označiti ovu narudžbu kao poslanu?</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsConfirming(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Odustani
                  </button>
                  <button
                    onClick={confirmOrder}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    Potvrdi
                  </button>
                </div>
              </div>
            </div>
          )}

          {isCanceling && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-bold mb-4">Otkaži narudžbu</h3>
                <p className="mb-6">Da li ste sigurni da želite otkazati ovu narudžbu?</p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsCanceling(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Odustani
                  </button>
                  <button
                    onClick={cancelOrder}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Otkaži
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Narudžbe</h1>
              <p className="text-sm text-gray-500">
                Ukupno narudžbi: {orders.length} | Prikazano: {filteredOrders.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pretraži narudžbe..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtri
                {showFilters ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  >
                    <option value="all">Svi statusi</option>
                    <option value="u obradi">U obradi</option>
                    <option value="poslano">Poslano</option>
                    <option value="dostavljeno">Dostavljeno</option>
                    <option value="otkazano">Otkazano</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Način plaćanja</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={filters.paymentMethod}
                    onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
                  >
                    <option value="all">Svi načini</option>
                    <option value="pouzece">Pouzeće</option>
                    <option value="kartica">Kartica</option>
                    <option value="paypal">PayPal</option>
                    <option value="virman">Virman</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tip dostave</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={filters.deliveryType}
                    onChange={(e) => setFilters({ ...filters, deliveryType: e.target.value })}
                  >
                    <option value="all">Svi tipovi</option>
                    <option value="standardna">Standardna</option>
                    <option value="ekspresna">Ekspresna</option>
                    <option value="preuzimanje">Preuzimanje</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cijena (KM)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Datum od</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Datum do</label>
                  <input
                    type="date"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={resetFilters}
                  className="text-gray-600 hover:text-gray-800 mr-4 flex items-center"
                >
                  <Sliders className="h-4 w-4 mr-1 rotate-90" />
                  Resetuj filtre
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('id')}
                  >
                    <div className="flex items-center">
                      ID
                      {sortConfig.key === 'id' && (
                        sortConfig.direction === 'asc' ?
                          <ChevronUp className="h-4 w-4 ml-1" /> :
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('datum_narudzbe')}
                  >
                    <div className="flex items-center">
                      Datum
                      {sortConfig.key === 'datum_narudzbe' && (
                        sortConfig.direction === 'asc' ?
                          <ChevronUp className="h-4 w-4 ml-1" /> :
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Korisnik
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('ukupna_cijena')}
                  >
                    <div className="flex items-center">
                      Iznos
                      {sortConfig.key === 'ukupna_cijena' && (
                        sortConfig.direction === 'asc' ?
                          <ChevronUp className="h-4 w-4 ml-1" /> :
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Način plaćanja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcije
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(order.datum_narudzbe).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(order.datum_narudzbe).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {getUserName(order.korisnik_id)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.ukupna_cijena} KM
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {statusBadge(order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {paymentBadge(order.nacin_placanja)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Detalji
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <Package className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Nema pronađenih narudžbi</h3>
                      <p className="mt-1 text-sm text-gray-500">Pokušajte da promijenite kriterijume pretrage ili filtra.</p>
                      <button
                        onClick={resetFilters}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        Resetuj filtre
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredOrders.length > 0 && (
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <div>Prikazano {filteredOrders.length} od {orders.length} narudžbi</div>
              <div className="flex space-x-4">
                <button className="px-3 py-1 border rounded-md hover:bg-gray-50">Prethodna</button>
                <button className="px-3 py-1 border rounded-md bg-blue-50 text-blue-600">1</button>
                <button className="px-3 py-1 border rounded-md hover:bg-gray-50">Sljedeća</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;