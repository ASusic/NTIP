import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiCalendar, FiSearch } from 'react-icons/fi';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const PonisiUlaznicu = () => {
  const [dogadjaji, setDogadjaji] = useState([]);
  const [ulaznice, setUlaznice] = useState([]);
  const [selectedDogadjaj, setSelectedDogadjaj] = useState('');
  const [filterBrojUlaznice, setFilterBrojUlaznice] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [dogadjajiRes, ulazniceRes] = await Promise.all([
          fetch('http://localhost:3000/events'),
          fetch('http://localhost:3000/ulaznice')
        ]);

        if (!dogadjajiRes.ok) throw new Error('Neuspješno učitavanje događaja');
        if (!ulazniceRes.ok) throw new Error('Neuspješno učitavanje ulaznica');

        const [dogadjajiData, ulazniceData] = await Promise.all([
          dogadjajiRes.json(),
          ulazniceRes.json()
        ]);

        setDogadjaji(dogadjajiData);
        setUlaznice(ulazniceData);
      } catch (err) {
        console.error('Greška pri dohvatanju podataka:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePonistiUlaznicu = async (ulaznicaId) => {
    if (!window.confirm('Da li ste sigurni da želite poništiti ovu ulaznicu?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/ulaznice/${ulaznicaId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Neuspješno poništavanje ulaznice');

      // Update local state by removing the deleted ticket
      setUlaznice(ulaznice.filter(u => u.id !== ulaznicaId));
      setSuccessMessage('Ulaznica uspješno poništena!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Greška pri poništavanju ulaznice:', err);
      setError(err.message);
    }
  };

  const filteredUlaznice = ulaznice.filter(ulaznica => {
    const matchesDogadjaj = selectedDogadjaj ? ulaznica.event_id === parseInt(selectedDogadjaj) : true;
    const matchesBrojUlaznice = filterBrojUlaznice ? 
      ulaznica.broj_ulaznice.toString().includes(filterBrojUlaznice) : true;
    return matchesDogadjaj && matchesBrojUlaznice;
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Poništavanje ulaznica</h1>
        
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <FiSearch className="mr-2" /> Pretraga ulaznica
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Broj ulaznice</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Unesite broj ulaznice..."
                value={filterBrojUlaznice}
                onChange={(e) => setFilterBrojUlaznice(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">Pronađene ulaznice</h2>
          </div>
          
          {filteredUlaznice.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nema pronađenih ulaznica za odabrane kriterije.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broj ulaznice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Događaj</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum događaja</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUlaznice.map(ulaznica => {
                    const dogadjaj = dogadjaji.find(d => d.ID === ulaznica.event_id);
                    return (
                      <tr key={`ticket-${ulaznica.id}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {ulaznica.broj_ulaznice}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getNazivDogadjaja(ulaznica.event_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dogadjaj ? new Date(dogadjaj.datum).toLocaleDateString() : 'Nepoznato'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${ulaznica.status === 'kupljeno' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {ulaznica.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handlePonistiUlaznicu(ulaznica.id)}
                            className="text-red-600 hover:text-red-900 flex items-center"
                            disabled={ulaznica.status !== 'kupljeno'}
                          >
                            <FiTrash2 className="mr-1" />
                            Poništi
                          </button>
                        </td>
                      </tr>
                    );
                  })}
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

export default PonisiUlaznicu;