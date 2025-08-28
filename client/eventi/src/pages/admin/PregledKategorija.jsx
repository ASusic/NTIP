import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTag, FiCalendar, FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const PregledKategorija = () => {
  const [kategorije, setKategorije] = useState([]);
  const [dogadjaji, setDogadjaji] = useState([]);
  const [selectedDogadjaj, setSelectedDogadjaj] = useState('');
  const [novaKategorija, setNovaKategorija] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [editMode, setEditMode] = useState(null);
  const [editValue, setEditValue] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [kategorijeRes, dogadjajiRes] = await Promise.all([
          fetch('http://localhost:3000/kategorije'),
          fetch('http://localhost:3000/events')
        ]);

        if (!kategorijeRes.ok) throw new Error('Neuspješno učitavanje kategorija');
        if (!dogadjajiRes.ok) throw new Error('Neuspješno učitavanje događaja');

        const [kategorijeData, dogadjajiData] = await Promise.all([
          kategorijeRes.json(),
          dogadjajiRes.json()
        ]);

        setKategorije(kategorijeData);
        setDogadjaji(dogadjajiData);
      } catch (err) {
        console.error('Greška pri dohvatanju podataka:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddCategory = async () => {
    if (!novaKategorija || !selectedDogadjaj) {
      setError('Molimo unesite vrstu kategorije i odaberite događaj');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/kategorije', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vrsta: novaKategorija,
          event_id: parseInt(selectedDogadjaj)
        })
      });

      if (!response.ok) throw new Error('Neuspješno dodavanje kategorije');

      const newCategory = await response.json();
      setKategorije([...kategorije, newCategory]);
      setNovaKategorija('');
      setSuccessMessage('Kategorija uspješno dodana!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Greška pri dodavanju kategorije:', err);
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Da li ste sigurni da želite obrisati ovu kategoriju?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/kategorije/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Neuspješno brisanje kategorije');

      setKategorije(kategorije.filter(k => k.id !== id));
      setSuccessMessage('Kategorija uspješno obrisana!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Greška pri brisanju kategorije:', err);
      setError(err.message);
    }
  };

  const handleEditCategory = async (id) => {
    if (!editValue) {
      setError('Molimo unesite vrstu kategorije');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/kategorije/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vrsta: editValue,
          event_id: kategorije.find(k => k.id === id).event_id
        })
      });

      if (!response.ok) throw new Error('Neuspješna izmjena kategorije');

      const updatedCategory = await response.json();
      setKategorije(kategorije.map(k => k.id === id ? updatedCategory : k));
      setEditMode(null);
      setSuccessMessage('Kategorija uspješno izmijenjena!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Greška pri izmjeni kategorije:', err);
      setError(err.message);
    }
  };

  const filteredKategorije = kategorije.filter(kategorija => {
    return selectedDogadjaj ? kategorija.event_id === parseInt(selectedDogadjaj) : true;
  });

  const getNazivDogadjaja = (eventId) => {
    const dogadjaj = dogadjaji.find(d => d.ID === eventId);
    return dogadjaj ? dogadjaj.naziv : `Nepoznat događaj (ID: ${eventId})`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Greška!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Nazad
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Pregled kategorija</h1>
        
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <FiCalendar className="mr-2" /> Odabir događaja
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Događaj</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedDogadjaj}
                onChange={(e) => setSelectedDogadjaj(e.target.value)}
              >
                <option value="">Svi događaji</option>
                {dogadjaji.map(dogadjaj => (
                  <option key={`event-${dogadjaj.ID}`} value={dogadjaj.ID}>
                    {dogadjaj.naziv} ({new Date(dogadjaj.datum).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <FiPlus className="mr-2" /> Dodaj novu kategoriju
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Vrsta kategorije</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Unesite vrstu kategorije..."
                value={novaKategorija}
                onChange={(e) => setNovaKategorija(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleAddCategory}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Dodaj kategoriju
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center">
              <FiTag className="mr-2" /> 
              {selectedDogadjaj ? 
                `Kategorije za događaj: ${getNazivDogadjaja(parseInt(selectedDogadjaj))}` : 
                'Sve kategorije'}
              <span className="ml-auto bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {filteredKategorije.length} kategorija
              </span>
            </h2>
          </div>
          
          {filteredKategorije.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nema pronađenih kategorija za odabrani događaj.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vrsta</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Događaj</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredKategorije.map(kategorija => (
                    <tr key={`category-${kategorija.id}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {kategorija.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {editMode === kategorija.id ? (
                          <input
                            type="text"
                            className="p-1 border border-gray-300 rounded-md"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            defaultValue={kategorija.vrsta}
                          />
                        ) : (
                          kategorija.vrsta
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getNazivDogadjaja(kategorija.event_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {editMode === kategorija.id ? (
                            <>
                              <button
                                onClick={() => handleEditCategory(kategorija.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Sačuvaj
                              </button>
                              <button
                                onClick={() => setEditMode(null)}
                                className="text-gray-600 hover:text-gray-900"
                              >
                                Odustani
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditMode(kategorija.id);
                                  setEditValue(kategorija.vrsta);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 flex items-center"
                              >
                                <FiEdit className="mr-1" />
                                Izmijeni
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(kategorija.id)}
                                className="text-red-600 hover:text-red-900 flex items-center"
                              >
                                <FiTrash2 className="mr-1" />
                                Obriši
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PregledKategorija;