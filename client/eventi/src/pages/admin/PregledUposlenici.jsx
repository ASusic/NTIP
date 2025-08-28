import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiUserPlus, FiEdit2, FiTrash2, FiSearch, FiPhone, FiMail, FiUser } from 'react-icons/fi';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const PregledUposlenici = () => {
  const [uposlenici, setUposlenici] = useState([]);
  const [filterIme, setFilterIme] = useState('');
  const [filterUloga, setFilterUloga] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUposlenici = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:3000/uposlenici');
        
        if (!response.ok) {
          throw new Error('Neuspješno učitavanje uposlenika');
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : [];
        
        setUposlenici(data);
      } catch (err) {
        console.error('Greška pri dohvatanju uposlenika:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUposlenici();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Da li ste sigurni da želite obrisati ovog uposlenika?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/uposlenici/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Neuspješno brisanje uposlenika');
      }

      setUposlenici(uposlenici.filter(u => u.id !== id));
      setSuccessMessage('Uposlenik uspješno obrisan!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Greška pri brisanju:', err);
      setError(err.message);
    }
  };

  const filteredUposlenici = uposlenici.filter(uposlenik => {
    const matchesIme = filterIme 
      ? `${uposlenik.ime} ${uposlenik.prezime}`.toLowerCase().includes(filterIme.toLowerCase())
      : true;
    const matchesUloga = filterUloga 
      ? uposlenik.uloga.toLowerCase().includes(filterUloga.toLowerCase())
      : true;
    return matchesIme && matchesUloga;
  });

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
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <FiUsers className="mr-2" /> Pregled uposlenika
        </h1>
        
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <FiSearch className="mr-2" /> Filteri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ime i prezime</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Unesite ime ili prezime..."
                value={filterIme}
                onChange={(e) => setFilterIme(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Uloga</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Unesite ulogu..."
                value={filterUloga}
                onChange={(e) => setFilterUloga(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate('/dodaj-uposlenika')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
          >
            <FiUserPlus className="mr-2" /> Dodaj novog uposlenika
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredUposlenici.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nema pronađenih uposlenika za odabrane filtere.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ime i prezime</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uloga</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kontakt</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUposlenici.map(uposlenik => (
                    <tr key={`employee-${uposlenik.id}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <FiUser className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {uposlenik.ime} {uposlenik.prezime}
                            </div>
                            <div className="text-sm text-gray-500">ID: {uposlenik.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {uposlenik.uloga}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 flex items-center">
                          <FiPhone className="mr-1" /> {uposlenik.kontakt}
                        </div>
                        {uposlenik.email && (
                          <div className="text-sm text-gray-500 flex items-center">
                            <FiMail className="mr-1" /> {uposlenik.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/uredi-uposlenika/${uposlenik.id}`)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          >
                            <FiEdit2 className="mr-1" /> Uredi
                          </button>
                          <button
                            onClick={() => handleDelete(uposlenik.id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                          >
                            <FiTrash2 className="mr-1" /> Obriši
                          </button>
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

export default PregledUposlenici;