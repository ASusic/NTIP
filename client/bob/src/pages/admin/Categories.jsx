// src/pages/admin/Categories.jsx
import { useState, useEffect } from "react";
import { List, Plus, Edit, Trash2, Search, ChevronDown, ChevronUp, Filter, Sliders, ArrowLeft, Check, X } from "lucide-react";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState({
    naziv: '',
    opis: '',
    slika_url: ''
  });

  // Učitavanje kategorija
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/kategorije');
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error('Greška pri učitavanju kategorija:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Sortiranje
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedCategories = () => {
    if (!sortConfig.key) return categories;
    
    return [...categories].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Pretraga
  const filteredCategories = getSortedCategories().filter(category => {
    const term = searchTerm.toLowerCase();
    return (
      category.naziv.toLowerCase().includes(term) ||
      (category.opis && category.opis.toLowerCase().includes(term))
    );
  });

  // Brisanje
  const handleDelete = async (id) => {
    if (window.confirm('Da li ste sigurni da želite obrisati ovu kategoriju?')) {
      try {
        await fetch(`http://localhost:3000/kategorije/${id}`, {
          method: 'DELETE'
        });
        setCategories(categories.filter(category => category.id !== id));
        if (selectedCategory?.id === id) {
          setSelectedCategory(null);
        }
      } catch (error) {
        console.error('Greška pri brisanju kategorije:', error);
      }
    }
  };

  // Editovanje
  const startEditing = (category) => {
    setEditingCategory(category);
    setEditForm({
      naziv: category.naziv,
      opis: category.opis || '',
      slika_url: category.slika_url || ''
    });
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/kategorije/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });
      
      const updatedCategory = await response.json();
      
      setCategories(categories.map(c => 
        c.id === updatedCategory.id ? updatedCategory : c
      ));
      
      if (selectedCategory?.id === updatedCategory.id) {
        setSelectedCategory(updatedCategory);
      }
      
      setEditingCategory(null);
      setEditForm({});
    } catch (error) {
      console.error('Greška pri ažuriranju kategorije:', error);
    }
  };

  // Dodavanje nove kategorije
  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveNewCategory = async () => {
    try {
      const response = await fetch('http://localhost:3000/kategorije', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory)
      });
      
      const createdCategory = await response.json();
      setCategories([...categories, createdCategory]);
      setIsAddingNew(false);
      setNewCategory({
        naziv: '',
        opis: '',
        slika_url: ''
      });
    } catch (error) {
      console.error('Greška pri kreiranju kategorije:', error);
    }
  };

  if (loading) {
    return (
      <div className="ml-64 pt-16 p-6 flex justify-center items-center h-screen">
        <div className="text-xl">Učitavanje kategorija...</div>
      </div>
    );
  }

  return (
    <div className="ml-64 pt-16 p-6">
      {isAddingNew ? (
        <div className="bg-white rounded-lg shadow overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Dodaj novu kategoriju</h2>
            <button
              onClick={() => setIsAddingNew(false)}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Nazad na listu kategorija
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {newCategory.slika_url ? (
                <img
                  src={newCategory.slika_url}
                  alt="Nova kategorija"
                  className="w-full h-full object-cover"
                />
              ) : (
                <List className="h-16 w-16 text-gray-400" />
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Naziv*</label>
                <input
                  type="text"
                  name="naziv"
                  value={newCategory.naziv}
                  onChange={handleNewCategoryChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slika URL</label>
                <input
                  type="text"
                  name="slika_url"
                  value={newCategory.slika_url}
                  onChange={handleNewCategoryChange}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="naziv-slike.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Opis</label>
                <textarea
                  name="opis"
                  value={newCategory.opis}
                  onChange={handleNewCategoryChange}
                  className="w-full border rounded-lg px-3 py-2 h-24"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={saveNewCategory}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                  disabled={!newCategory.naziv}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Sačuvaj kategoriju
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
      ) : selectedCategory ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <button 
              onClick={() => setSelectedCategory(null)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Nazad na listu kategorija
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="w-full h-64 bg-gray-100 rounded-t-xl md:rounded-l-xl md:rounded-tr-none overflow-hidden">
              <img
                src={selectedCategory.slika_url || '/images/placeholder-category.jpg'}
                alt={selectedCategory.naziv}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              {editingCategory?.id === selectedCategory.id ? (
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
                      onClick={() => handleDelete(selectedCategory.id)}
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
                    <h2 className="text-2xl font-bold">{selectedCategory.naziv}</h2>
                    <button
                      onClick={() => startEditing(selectedCategory)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Uredi
                    </button>
                  </div>
                  
                  {selectedCategory.opis && (
                    <div>
                      <p className="text-sm text-gray-500">Opis</p>
                      <p className="whitespace-pre-line">{selectedCategory.opis}</p>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <button
                      onClick={() => handleDelete(selectedCategory.id)}
                      className="text-red-600 hover:text-red-800 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Obriši kategoriju
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
              <h1 className="text-2xl font-bold">Kategorije</h1>
              <p className="text-sm text-gray-500">
                Ukupno kategorija: {categories.length} | Prikazano: {filteredCategories.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pretraži kategorije..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={() => setIsAddingNew(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Dodaj kategoriju
              </button>
            </div>
          </div>

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Opis</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{category.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div 
                          className="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category.naziv}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">{category.opis}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedCategory(category)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center px-3 py-1 border border-blue-200 rounded-md hover:bg-blue-50"
                        >
                          Detalji
                        </button>
                        <button
                          onClick={() => startEditing(category)}
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
                    <td colSpan="4" className="px-6 py-8 text-center">
                      <List className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Nema pronađenih kategorija</h3>
                      <p className="mt-1 text-sm text-gray-500">Pokušajte da promijenite kriterijume pretrage.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredCategories.length > 0 && (
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <div>Prikazano {filteredCategories.length} od {categories.length} kategorija</div>
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

export default Categories;