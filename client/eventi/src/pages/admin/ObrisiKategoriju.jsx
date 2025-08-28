import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrash2, FiArrowLeft, FiCheckCircle, FiAlertCircle, FiList } from 'react-icons/fi';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ObrisiKategoriju = () => {
  const [kategorije, setKategorije] = useState([]);
  const [selectedKategorija, setSelectedKategorija] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKategorije = async () => {
      try {
        const response = await fetch('http://localhost:3000/kategorije');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : [];
        
        if (!data.length) {
          throw new Error('Nema dostupnih kategorija');
        }

        setKategorije(data);
      } catch (err) {
        console.error('Greška pri učitavanju kategorija:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchKategorije();
  }, []);

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/kategorije/${selectedKategorija.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSuccess(true);
      setShowConfirm(false);
      setKategorije(kategorije.filter(k => k.id !== selectedKategorija.id));
      setSelectedKategorija(null);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Greška pri brisanju:', err);
      setError(err.message);
      setShowConfirm(false);
    }
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
            <div className="flex items-center">
              <FiAlertCircle className="mr-2" size={20} />
              <span className="block sm:inline">{error}</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/admin')}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center"
          >
            <FiArrowLeft className="mr-2" /> Nazad na admin panel
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
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => navigate('/PregledKategorija')}
            className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center"
          >
            <FiArrowLeft className="mr-2" /> Nazad
          </button>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiTrash2 className="mr-2 text-red-600" /> Brisanje kategorije
          </h1>

          {success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <div className="flex items-center">
                <FiCheckCircle className="mr-2" size={20} />
                <span>Kategorija "{selectedKategorija?.vrsta}" uspješno obrisana</span>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
              <FiList className="mr-2" /> Odaberite kategoriju za brisanje
            </h2>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {kategorije.map(kategorija => (
                <div 
                  key={kategorija.id}
                  onClick={() => {
                    setSelectedKategorija(kategorija);
                    setShowConfirm(true);
                  }}
                  className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                    selectedKategorija?.id === kategorija.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                  }`}
                >
                  <div className="font-medium">{kategorija.vrsta}</div>
                  <div className="text-sm text-gray-500">ID događaja: {kategorija.event_id}</div>
                </div>
              ))}
            </div>
          </div>

          {showConfirm && selectedKategorija && (
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Potvrda brisanja</h2>
              <p className="mb-4">Jeste li sigurni da želite obrisati kategoriju:</p>
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <div className="font-medium">{selectedKategorija.vrsta}</div>
                <div className="text-sm text-gray-500">ID: {selectedKategorija.id}</div>
              </div>
              <p className="mb-4 text-red-600 font-medium">Ova radnja je nepovratna!</p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  Odustani
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Potvrdi brisanje
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ObrisiKategoriju;