import { useState, useEffect } from 'react';
import { User, Building, Shield, Edit, Trash2, Search, Plus, ArrowLeft, Check, X } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newUser, setNewUser] = useState({
    ime: '',
    prezime: '',
    email: '',
    telefon: '',
    adresa: '',
    tip_korisnika: 'fizicko',
    naziv_firme: '',
    pib: ''
  });

  // Učitavanje korisnika
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/korisnici');
        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Greška pri učitavanju korisnika:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filtriraj korisnike
  const filteredUsers = users.filter(user => {
    // Pretraga po svim tekstualnim poljima
    const matchesSearch = 
      user.ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.prezime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.telefon && user.telefon.includes(searchTerm)) ||
      (user.adresa && user.adresa.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.naziv_firme && user.naziv_firme.toLowerCase().includes(searchTerm.toLowerCase()));

    // Filter po tipu korisnika
    const matchesType = 
      userTypeFilter === 'all' || 
      (userTypeFilter === 'fizicko' && user.tip_korisnika === 'fizicko') ||
      (userTypeFilter === 'pravno' && user.tip_korisnika === 'pravno') ||
      (userTypeFilter === 'admin' && user.tip_korisnika === 'admin');

    return matchesSearch && matchesType;
  });

  // Obriši korisnika
  const handleDelete = async (id) => {
    if (window.confirm('Da li ste sigurni da želite obrisati ovog korisnika?')) {
      try {
        await fetch(`http://localhost:3000/korisnici/${id}`, {
          method: 'DELETE'
        });
        setUsers(users.filter(user => user.id !== id));
        if (selectedUser?.id === id) {
          setSelectedUser(null);
        }
      } catch (error) {
        console.error('Greška pri brisanju korisnika:', error);
      }
    }
  };

  // Zapocni editovanje
  const startEditing = (user) => {
    setEditingUser(user);
    setEditForm({
      ime: user.ime,
      prezime: user.prezime,
      email: user.email,
      telefon: user.telefon || '',
      adresa: user.adresa || '',
      tip_korisnika: user.tip_korisnika,
      naziv_firme: user.naziv_firme || '',
      pib: user.pib || ''
    });
  };

  // Otkazi editovanje
  const cancelEditing = () => {
    setEditingUser(null);
    setEditForm({});
  };

  // Promjena u formi za editovanje
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Sačuvaj izmjene
  const saveEdit = async () => {
    try {
      const response = await fetch(`http://localhost:3000/korisnici/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm)
      });
      
      const updatedUser = await response.json();
      
      setUsers(users.map(u => 
        u.id === updatedUser.id ? updatedUser : u
      ));
      
      if (selectedUser?.id === updatedUser.id) {
        setSelectedUser(updatedUser);
      }
      
      setEditingUser(null);
      setEditForm({});
    } catch (error) {
      console.error('Greška pri ažuriranju korisnika:', error);
    }
  };

  // Promjena u formi za novog korisnika
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Dodaj novog korisnika
  const saveNewUser = async () => {
    try {
      const response = await fetch('http://localhost:3000/korisnici', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser)
      });
      
      const createdUser = await response.json();
      setUsers([...users, createdUser]);
      setIsAddingNew(false);
      setNewUser({
        ime: '',
        prezime: '',
        email: '',
        telefon: '',
        adresa: '',
        tip_korisnika: 'fizicko',
        naziv_firme: '',
        pib: ''
      });
    } catch (error) {
      console.error('Greška pri kreiranju korisnika:', error);
    }
  };

  // Badge za tip korisnika
  const userTypeBadge = (type) => {
    const typeMap = {
      'fizicko': { color: 'bg-blue-100 text-blue-800', icon: User, text: 'Fizičko lice' },
      'pravno': { color: 'bg-purple-100 text-purple-800', icon: Building, text: 'Pravno lice' },
      'admin': { color: 'bg-green-100 text-green-800', icon: Shield, text: 'Administrator' }
    };
    
    const { color, icon: Icon, text } = typeMap[type] || {};
    return (
      <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="ml-64 pt-16 p-6 flex justify-center items-center h-screen">
        <div className="text-xl">Učitavanje korisnika...</div>
      </div>
    );
  }

  return (
    <div className="ml-64 pt-16 p-6">
      {isAddingNew ? (
        <div className="bg-white rounded-lg shadow overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Dodaj novog korisnika</h2>
            <button
              onClick={() => setIsAddingNew(false)}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Nazad na listu korisnika
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tip korisnika*</label>
                <select
                  name="tip_korisnika"
                  value={newUser.tip_korisnika}
                  onChange={handleNewUserChange}
                  className="w-full border rounded-lg px-3 py-2"
                >
                  <option value="fizicko">Fizičko lice</option>
                  <option value="pravno">Pravno lice</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ime*</label>
                  <input
                    type="text"
                    name="ime"
                    value={newUser.ime}
                    onChange={handleNewUserChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prezime*</label>
                  <input
                    type="text"
                    name="prezime"
                    value={newUser.prezime}
                    onChange={handleNewUserChange}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleNewUserChange}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                <input
                  type="text"
                  name="telefon"
                  value={newUser.telefon}
                  onChange={handleNewUserChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              {newUser.tip_korisnika === 'pravno' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Naziv firme*</label>
                    <input
                      type="text"
                      name="naziv_firme"
                      value={newUser.naziv_firme}
                      onChange={handleNewUserChange}
                      className="w-full border rounded-lg px-3 py-2"
                      required={newUser.tip_korisnika === 'pravno'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">PIB*</label>
                    <input
                      type="text"
                      name="pib"
                      value={newUser.pib}
                      onChange={handleNewUserChange}
                      className="w-full border rounded-lg px-3 py-2"
                      required={newUser.tip_korisnika === 'pravno'}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresa</label>
                <input
                  type="text"
                  name="adresa"
                  value={newUser.adresa}
                  onChange={handleNewUserChange}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={saveNewUser}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center"
                  disabled={!newUser.ime || !newUser.prezime || !newUser.email || 
                    (newUser.tip_korisnika === 'pravno' && (!newUser.naziv_firme || !newUser.pib))}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Sačuvaj korisnika
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
      ) : selectedUser ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <button 
              onClick={() => setSelectedUser(null)}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Nazad na listu korisnika
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="w-full h-64 bg-gray-100 rounded-t-xl md:rounded-l-xl md:rounded-tr-none overflow-hidden flex items-center justify-center">
              <User className="h-32 w-32 text-gray-400" />
            </div>
            
            <div>
              {editingUser?.id === selectedUser.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tip korisnika</label>
                    <select
                      name="tip_korisnika"
                      value={editForm.tip_korisnika}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="fizicko">Fizičko lice</option>
                      <option value="pravno">Pravno lice</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ime</label>
                      <input
                        type="text"
                        name="ime"
                        value={editForm.ime}
                        onChange={handleEditChange}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prezime</label>
                      <input
                        type="text"
                        name="prezime"
                        value={editForm.prezime}
                        onChange={handleEditChange}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <input
                      type="text"
                      name="telefon"
                      value={editForm.telefon}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>

                  {editForm.tip_korisnika === 'pravno' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Naziv firme</label>
                        <input
                          type="text"
                          name="naziv_firme"
                          value={editForm.naziv_firme}
                          onChange={handleEditChange}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">PIB</label>
                        <input
                          type="text"
                          name="pib"
                          value={editForm.pib}
                          onChange={handleEditChange}
                          className="w-full border rounded-lg px-3 py-2"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adresa</label>
                    <input
                      type="text"
                      name="adresa"
                      value={editForm.adresa}
                      onChange={handleEditChange}
                      className="w-full border rounded-lg px-3 py-2"
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
                      onClick={() => handleDelete(selectedUser.id)}
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
                    <h2 className="text-2xl font-bold">
                      {selectedUser.ime} {selectedUser.prezime}
                      {selectedUser.tip_korisnika === 'pravno' && ` (${selectedUser.naziv_firme})`}
                    </h2>
                    <button
                      onClick={() => startEditing(selectedUser)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Uredi
                    </button>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Tip korisnika</p>
                    <div className="mt-1">
                      {userTypeBadge(selectedUser.tip_korisnika)}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Telefon</p>
                      <p className="font-medium">{selectedUser.telefon || '-'}</p>
                    </div>
                  </div>
                  
                  {selectedUser.tip_korisnika === 'pravno' && (
                    <div>
                      <p className="text-sm text-gray-500">PIB</p>
                      <p className="font-medium">{selectedUser.pib || '-'}</p>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm text-gray-500">Adresa</p>
                    <p className="font-medium">{selectedUser.adresa || '-'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Datum registracije</p>
                    <p className="font-medium">
                      {new Date(selectedUser.datum_registracije).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      onClick={() => handleDelete(selectedUser.id)}
                      className="text-red-600 hover:text-red-800 flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Obriši korisnika
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
              <h1 className="text-2xl font-bold">Korisnici</h1>
              <p className="text-sm text-gray-500">
                Ukupno korisnika: {users.length} | Prikazano: {filteredUsers.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Pretraži korisnike..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                className="border rounded-lg px-3 py-2 text-sm"
                value={userTypeFilter}
                onChange={(e) => setUserTypeFilter(e.target.value)}
              >
                <option value="all">Svi tipovi</option>
                <option value="fizicko">Fizička lica</option>
                <option value="pravno">Pravna lica</option>
                <option value="admin">Administratori</option>
              </select>
              <button
                onClick={() => setIsAddingNew(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Dodaj korisnika
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Korisnik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kontakt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tip
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Firma
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcije
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div 
                          className="flex items-center cursor-pointer"
                          onClick={() => setSelectedUser(user)}
                        >
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <User className="text-gray-500 w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.ime} {user.prezime}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(user.datum_registracije).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.telefon || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {userTypeBadge(user.tip_korisnika)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.tip_korisnika === 'pravno' ? user.naziv_firme : '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center px-3 py-1 border border-blue-200 rounded-md hover:bg-blue-50"
                        >
                          Detalji
                        </button>
                        <button
                          onClick={() => startEditing(user)}
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
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <User className="h-12 w-12 mx-auto text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Nema pronađenih korisnika</h3>
                      <p className="mt-1 text-sm text-gray-500">Pokušajte da promijenite kriterijume pretrage ili filtra.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredUsers.length > 0 && (
            <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
              <div>Prikazano {filteredUsers.length} od {users.length} korisnika</div>
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

export default Users;