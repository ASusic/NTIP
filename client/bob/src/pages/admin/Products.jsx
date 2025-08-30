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
  X
} from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    category: 'all'
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newProduct, setNewProduct] = useState({
    naziv: '',
    cijena: 0,
    kolicina_na_stanju: 0,
    opis: '',
    kategorija_id: '',
    slika_url: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('http://localhost:3000/artikli'),
          fetch('http://localhost:3000/kategorije')
        ]);
        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();
        setProducts(productsData);
        setCategories(categoriesData);
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

  const getSortedProducts = (items) => {
    if (!sortConfig.key) return items;
    
    return [...items].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const applyFilters = (product) => {
  if (!product) return false;
  
  const productNaziv = product.naziv || '';
  const productOpis = product.opis || '';
  const searchTermLower = searchTerm ? searchTerm.toLowerCase() : '';
  
  const matchesSearch = productNaziv.toLowerCase().includes(searchTermLower) ||
                       productOpis.toLowerCase().includes(searchTermLower);
  
  const matchesStatus = filters.status === 'all' || 
                       (filters.status === 'available' && (product.kolicina_na_stanju || 0) > 0) ||
                       (filters.status === 'unavailable' && (product.kolicina_na_stanju || 0) <= 0);
  
  const productCijena = product.cijena || 0;
  const minPrice = filters.minPrice === '' ? -Infinity : Number(filters.minPrice);
  const maxPrice = filters.maxPrice === '' ? Infinity : Number(filters.maxPrice);
  
  const matchesPrice = productCijena >= minPrice && productCijena <= maxPrice;
  
  const productStock = product.kolicina_na_stanju || 0;
  const minStock = filters.minStock === '' ? -Infinity : Number(filters.minStock);
  
  const matchesStock = productStock >= minStock;
  
  const productCategory = product.kategorija_id ? product.kategorija_id.toString() : '';
  const filterCategory = filters.category || 'all';
  
  const matchesCategory = filterCategory === 'all' || productCategory === filterCategory;
  
  return matchesSearch && matchesStatus && matchesPrice && matchesStock && matchesCategory;
};

  const filteredProducts = getSortedProducts(products.filter(applyFilters));

  const handleDelete = async (id) => {
    if (window.confirm('Da li ste sigurni da želite obrisati ovaj artikl?')) {
      try {
        await fetch(`http://localhost:3000/artikli/${id}`, {
          method: 'DELETE'
        });
        setProducts(products.filter(product => product.id !== id));
        if (selectedProduct?.id === id) {
          setSelectedProduct(null);
        }
      } catch (error) {
        console.error('Greška pri brisanju artikla:', error);
      }
    }
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      minPrice: '',
      maxPrice: '',
      minStock: '',
      category: 'all'
    });
    setSearchTerm('');
  };

  const startEditing = (product) => {
    setEditingProduct(product);
    setEditForm({
      naziv: product.naziv,
      cijena: product.cijena,
      kolicina_na_stanju: product.kolicina_na_stanju,
      opis: product.opis || '',
      kategorija_id: product.kategorija_id || '',
      slika_url: product.slika_url || ''
    });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: name === 'cijena' || name === 'kolicina_na_stanju' ? Number(value) : value
    }));
  };

  const saveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/artikli/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });
      
      const updatedProduct = await response.json();
      
      setProducts(products.map(p => 
        p.id === updatedProduct.id ? updatedProduct : p
      ));
      
      if (selectedProduct?.id === updatedProduct.id) {
        setSelectedProduct(updatedProduct);
      }
      
      setEditingProduct(null);
      setEditForm({});
    } catch (error) {
      console.error('Greška pri ažuriranju artikla:', error);
    }
  };

  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'cijena' || name === 'kolicina_na_stanju' ? Number(value) : value
    }));
  };

  const saveNewProduct = async () => {
    try {
      const response = await fetch('http://localhost:3000/artikli', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct)
      });
      
      const createdProduct = await response.json();
      setProducts([...products, createdProduct]);
      setIsAddingNew(false);
      setNewProduct({
        naziv: '',
        cijena: 0,
        kolicina_na_stanju: 0,
        opis: '',
        kategorija_id: '',
        slika_url: ''
      });
    } catch (error) {
      console.error('Greška pri kreiranju artikla:', error);
    }
  };

  const getCategoryName = (id) => {
    const category = categories.find(cat => cat.id === id);
    return category ? category.naziv : 'Nedefinisano';
  };

  if (loading) {
    return (
      <div className="ml-64 pt-16 p-6 flex justify-center items-center h-screen">
        <div className="text-xl">Učitavanje artikala...</div>
      </div>
    );
  }

  return (
    <div className="ml-64 pt-16 p-6">
      {isAddingNew ? (
        <div className="bg-white rounded-lg shadow overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Dodaj novi artikl</h2>
            <button
              onClick={() => setIsAddingNew(false)}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Nazad na listu artikala
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {newProduct.slika_url ? (
                <img
                  src={newProduct.slika_url.startsWith('http') ? newProduct.slika_url : `/images/${newProduct.slika_url}`}
                  alt="Novi artikl"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder-product.jpg';
                  }}
                />
              ) : (
                <Package className="h-16 w-16 text-gray-400" />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Naziv*</label>
                <input
                  type="text"
                  name="naziv"
                  value={newProduct.naziv}
                  onChange={handleNewProductChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cijena (KM)*</label>
                  <input
                    type="number"
                    name="cijena"
                    value={newProduct.cijena}
                    onChange={handleNewProductChange}
                    className="w-full border rounded-lg px-3 py-2"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Količina*</label>
                  <input
                    type="number"
                    name="kolicina_na_stanju"
                    value={newProduct.kolicina_na_stanju}
                    onChange={handleNewProductChange}
                    className="w-full border rounded-lg px-3 py-2"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategorija</label>
                <select
                  name="kategorija_id"
                  value={newProduct.kategorija_id}
                  onChange={handleNewProductChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="">Odaberi kategoriju</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.naziv}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slika URL</label>
                <input
                  type="text"
                  name="slika_url"
                  value={newProduct.slika_url}
                  onChange={handleNewProductChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="naziv-slike.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
                <textarea
                  name="opis"
                  value={newProduct.opis}
                  onChange={handleNewProductChange}
                  className="w-full border rounded-lg px-3 py-2 h-24"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={saveNewProduct}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                  disabled={!newProduct.naziv || !newProduct.cijena || !newProduct.kolicina_na_stanju}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Sačuvaj artikl
                </button>
                <button
                  onClick={() => setIsAddingNew(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Odustani
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : selectedProduct ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Nazad na listu artikala
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="w-full h-64 bg-gray-100 rounded-t-xl md:rounded-l-xl md:rounded-tr-none overflow-hidden">
              <img
                src={selectedProduct.slika_url ? `/images/${selectedProduct.slika_url}` : '/images/placeholder-product.jpg'}
                alt={selectedProduct.naziv}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/placeholder-product.jpg';
                }}
              />
            </div>
            
            <div>
              {editingProduct?.id === selectedProduct.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Naziv</label>
                    <input
                      type="text"
                      name="naziv"
                      value={editForm.naziv}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cijena (KM)</label>
                      <input
                        type="number"
                        name="cijena"
                        value={editForm.cijena}
                        onChange={handleEditChange}
                        className="w-full border rounded-lg px-3 py-2"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Količina</label>
                      <input
                        type="number"
                        name="kolicina_na_stanju"
                        value={editForm.kolicina_na_stanju}
                        onChange={handleEditChange}
                        className="w-full border rounded-lg px-3 py-2"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Kategorija</label>
                    <select
                      name="kategorija_id"
                      value={editForm.kategorija_id}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">Odaberi kategoriju</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.naziv}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slika URL</label>
                    <input
                      type="text"
                      name="slika_url"
                      value={editForm.slika_url}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
                    <textarea
                      name="opis"
                      value={editForm.opis}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2 h-24"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={saveEdit}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Sačuvaj
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Odustani
                    </button>
                    <button
                      onClick={() => handleDelete(selectedProduct.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Obriši
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold">{selectedProduct.naziv}</h2>
                    <button
                      onClick={() => startEditing(selectedProduct)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Uredi
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Cijena</p>
                      <p className="text-xl font-semibold">{selectedProduct.cijena} KM</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Stanje zaliha</p>
                      <p className="text-xl font-semibold">{selectedProduct.kolicina_na_stanju}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Kategorija</p>
                    <p className="font-medium">{getCategoryName(selectedProduct.kategorija_id)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedProduct.kolicina_na_stanju > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedProduct.kolicina_na_stanju > 0 ? 'Dostupno' : 'Nedostupno'}
                    </span>
                  </div>
                  
                  {selectedProduct.opis && (
                    <div>
                      <p className="text-sm text-gray-500">Opis</p>
                      <p className="whitespace-pre-line">{selectedProduct.opis}</p>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <button
                      onClick={() => handleDelete(selectedProduct.id)}
                      className="text-red-600 hover:text-red-800 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Obriši artikl
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold">Artikli</h1>
              <p className="text-sm text-gray-500">
                Ukupno artikala: {products.length} | Prikazano: {filteredProducts.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pretraži artikle..."
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
              <button
                onClick={() => setIsAddingNew(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Dodaj artikl
              </button>
            </div>
          </div>

          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                  >
                    <option value="all">Svi statusi</option>
                    <option value="available">Dostupno</option>
                    <option value="unavailable">Nedostupno</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. cijena (KM)</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({...filters, minPrice: e.target.value})}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max. cijena (KM)</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min. količina</label>
                  <input
                    type="number"
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={filters.minStock}
                    onChange={(e) => setFilters({...filters, minStock: e.target.value})}
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategorija</label>
                  <select
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                  >
                    <option value="all">Sve kategorije</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.naziv}</option>
                    ))}
                  </select>
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
                    onClick={() => requestSort('naziv')}
                  >
                    <div className="flex items-center">
                      Naziv
                      {sortConfig.key === 'naziv' && (
                        sortConfig.direction === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('cijena')}
                  >
                    <div className="flex items-center">
                      Cijena
                      {sortConfig.key === 'cijena' && (
                        sortConfig.direction === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => requestSort('kolicina_na_stanju')}
                  >
                    <div className="flex items-center">
                      Količina
                      {sortConfig.key === 'kolicina_na_stanju' && (
                        sortConfig.direction === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategorija</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => setSelectedProduct(product)}
                        >
                          {product.slika_url ? (
                            <img 
                              src={`/images/${product.slika_url}`} 
                              alt={product.naziv} 
                              className="h-12 w-12 rounded-lg mr-3 object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/placeholder-product.jpg';
                              }}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-100 mr-3 flex items-center justify-center">
                              <Package className="text-gray-400 h-5 w-5" />
                            </div>
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{product.naziv}</div>
                            {product.opis && (
                              <div className="text-xs text-gray-500 line-clamp-1 max-w-xs">{product.opis}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.cijena} KM</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.kolicina_na_stanju}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{getCategoryName(product.kategorija_id)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.kolicina_na_stanju > 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.kolicina_na_stanju > 0 ? 'Dostupno' : 'Nedostupno'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center px-3 py-1 border border-blue-200 rounded-md hover:bg-blue-50"
                        >
                          Detalji
                        </button>
                        <button
                          onClick={() => startEditing(product)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center px-3 py-1 border border-blue-200 rounded-md hover:bg-blue-50"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Uredi
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <Package className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Nema pronađenih artikala</h3>
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

          {filteredProducts.length > 0 && (
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <div>Prikazano {filteredProducts.length} od {products.length} artikala</div>
              <div className="flex space-x-4">
                <button className="px-3 py-1 border rounded-md hover:bg-gray-50">Prethodna</button>
                <button className="px-3 py-1 border rounded-md bg-blue-50 text-blue-600">1</button>
                <button className="px-3 py-1 border rounded-md hover:bg-gray-50">Sledeća</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;