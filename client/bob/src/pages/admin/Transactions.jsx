import { useState, useEffect } from 'react';
import { Check, Clock, X, Search, Filter, Download, ChevronDown, ChevronUp, Loader2, Edit, Save, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [amountRange, setAmountRange] = useState({ min: '', max: '' });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/transakcije');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Greška pri učitavanju transakcija');
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status) => {
    const statusMap = {
      'placeno': { 
        color: 'bg-green-100 text-green-800', 
        icon: Check,
        text: 'Plaćeno'
      },
      'na cekanju': { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: Clock,
        text: 'Na čekanju'
      },
      'neuspjelo': { 
        color: 'bg-red-100 text-red-800', 
        icon: X,
        text: 'Neuspjelo'
      }
    };
    
    const { color, icon: Icon, text } = statusMap[status] || {};
    return (
      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {text}
      </span>
    );
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toString().includes(searchTerm) ||
      transaction.narudzba_id.toString().includes(searchTerm);
    
    const matchesStatus = 
      statusFilter === 'all' || 
      transaction.status === statusFilter;
    
    const matchesDate = 
      !dateFilter || 
      new Date(transaction.datum).toISOString().split('T')[0] === dateFilter;
    
    const matchesAmount = 
      (!amountRange.min || transaction.iznos >= Number(amountRange.min)) &&
      (!amountRange.max || transaction.iznos <= Number(amountRange.max));
    
    return matchesSearch && matchesStatus && matchesDate && matchesAmount;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue === bValue) return 0;
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortConfig.direction === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortConfig.direction === 'asc' 
      ? aValue < bValue ? -1 : 1
      : aValue > bValue ? -1 : 1;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('bs-BA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExport = () => {
    const csvContent = [
      ['ID transakcije', 'ID narudžbe', 'Iznos', 'Datum', 'Status'],
      ...sortedTransactions.map(t => [
        t.id,
        t.narudzba_id,
        `${t.iznos} KM`,
        formatDate(t.datum),
        statusBadge(t.status).props.children[2]
      ])
    ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `transakcije_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Transakcije uspješno izvezene');
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('');
    setAmountRange({ min: '', max: '' });
    setSortConfig({ key: null, direction: 'asc' });
  };

  const startEditing = (transaction) => {
    setEditingId(transaction.id);
    setEditStatus(transaction.status);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditStatus('');
  };

  const saveStatus = async (transaction) => {
    try {
      setIsSaving(true);
      const response = await fetch(`http://localhost:3000/transakcije/${transaction.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          narudzba_id: transaction.narudzba_id,
          iznos: transaction.iznos,
          datum: transaction.datum,
          status: editStatus
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update transaction');
      }

      const updatedTransaction = await response.json();
      setTransactions(transactions.map(t => 
        t.id === updatedTransaction.id ? updatedTransaction : t
      ));
      setEditingId(null);
      toast.success('Status transakcije uspješno ažuriran');
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error(error.message || 'Greška pri ažuriranju statusa');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTransaction = async (id) => {
    if (!window.confirm('Da li ste sigurni da želite obrisati ovu transakciju?')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/transakcije/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete transaction');
      }

      setTransactions(transactions.filter(t => t.id !== id));
      toast.success('Transakcija uspješno obrisana');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error(error.message || 'Greška pri brisanju transakcije');
    }
  };

  const columns = [
    { 
      key: 'id', 
      title: 'ID transakcije',
      render: (value) => <span className="font-medium">TX-{value}</span>,
      sortable: true
    },
    { 
      key: 'narudzba_id', 
      title: 'ID narudžbe',
      render: (value) => <span className="text-blue-600">#{value}</span>,
      sortable: true
    },
    { 
      key: 'iznos', 
      title: 'Iznos',
      render: (value) => <span className="font-semibold">{value.toFixed(2)} KM</span>,
      sortable: true
    },
    { 
      key: 'datum', 
      title: 'Datum transakcije',
      render: (value) => formatDate(value),
      sortable: true
    },
    { 
      key: 'status', 
      title: 'Status',
      render: (value, row) => editingId === row.id ? (
        <select
          value={editStatus}
          onChange={(e) => setEditStatus(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="placeno">Plaćeno</option>
          <option value="na cekanju">Na čekanju</option>
          <option value="neuspjelo">Neuspjelo</option>
        </select>
      ) : statusBadge(value),
      sortable: true
    },
    {
      key: 'actions',
      title: 'Akcije',
      render: (_, row) => editingId === row.id ? (
        <div className="flex space-x-2">
          <button
            onClick={() => saveStatus(row)}
            disabled={isSaving}
            className="p-1 text-green-600 hover:text-green-800"
            title="Spremi"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          </button>
          <button
            onClick={cancelEditing}
            className="p-1 text-gray-600 hover:text-gray-800"
            title="Odustani"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <button
            onClick={() => startEditing(row)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Uredi status"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => deleteTransaction(row.id)}
            className="p-1 text-red-600 hover:text-red-800"
            title="Obriši"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return (
      <div className="ml-64 pt-16 p-6 flex flex-col items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-green-500" />
        <p className="mt-4 text-lg">Učitavanje transakcija...</p>
      </div>
    );
  }

  return (
    <div className="ml-64 pt-16 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Transakcije</h1>
          <p className="text-sm text-gray-500">
            Ukupno transakcija: {transactions.length} | Prikazano: {filteredTransactions.length}
          </p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleExport}
            className="flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Izvoz
          </button>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Pretraži</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="ID transakcije ili narudžbe"
                  className="pl-10 pr-4 py-2 w-full border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Svi statusi</option>
                <option value="placeno">Plaćeno</option>
                <option value="na cekanju">Na čekanju</option>
                <option value="neuspjelo">Neuspjelo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Datum</label>
              <input
                type="date"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Iznos (KM)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={amountRange.min}
                  onChange={(e) => setAmountRange({...amountRange, min: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  value={amountRange.max}
                  onChange={(e) => setAmountRange({...amountRange, max: e.target.value})}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={resetFilters}
              className="text-gray-600 hover:text-gray-800 mr-4 flex items-center"
            >
              Resetuj filtere
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => column.sortable && requestSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.title}
                    {column.sortable && sortConfig.key === column.key && (
                      <span className="ml-1">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTransactions.length > 0 ? (
              sortedTransactions.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={`${rowIndex}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                      {column.render(row[column.key], row)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Search className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nema pronađenih transakcija</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {searchTerm || statusFilter !== 'all' || dateFilter || amountRange.min || amountRange.max
                        ? 'Pokušajte promijeniti kriterije pretrage'
                        : 'Nema dostupnih transakcija'}
                    </p>
                    {(searchTerm || statusFilter !== 'all' || dateFilter || amountRange.min || amountRange.max) && (
                      <button
                        onClick={resetFilters}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
                      >
                        Resetuj filtere
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;