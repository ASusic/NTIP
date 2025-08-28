import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTag, FiCalendar, FiPlus, FiArrowLeft } from 'react-icons/fi';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const DodajKategoriju = () => {
  const [dogadjaji, setDogadjaji] = useState([]);
  const [selectedDogadjaj, setSelectedDogadjaj] = useState('');
  const [vrstaKategorije, setVrstaKategorije] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDogadjaji = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:3000/events');
        if (!response.ok) throw new Error('Neuspješno učitavanje događaja');

        const data = await response.json();
        setDogadjaji(data);
      } catch (err) {
        console.error('Greška pri dohvatanju događaja:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDogadjaji();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!vrstaKategorije || !selectedDogadjaj) {
      setError('Molimo popunite sva polja');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/kategorije', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vrsta: vrstaKategorije,
          event_id: parseInt(selectedDogadjaj)
        })
      });

      if (!response.ok) throw new Error('Neuspješno dodavanje kategorije');

      setVrstaKategorije('');
      setSelectedDogadjaj('');
      setSuccessMessage('Kategorija uspješno dodana!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Greška pri dodavanju kategorije:', err);
      setError(err.message);
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
            <strong className="font-bold">Greška!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center"
          >
            <FiArrowLeft className="mr-2" /> Nazad
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
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center"
          >
            <FiArrowLeft className="mr-2" /> Nazad
          </button>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <FiTag className="mr-2" /> Dodaj novu kategoriju
          </h1>
          
          {successMessage && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiCalendar className="mr-2" /> Događaj
              </label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedDogadjaj}
                onChange={(e) => setSelectedDogadjaj(e.target.value)}
                required
              >
                <option value="">Odaberite događaj</option>
                {dogadjaji.map(dogadjaj => (
                  <option key={`event-${dogadjaj.ID}`} value={dogadjaj.ID}>
                    {dogadjaj.naziv} ({new Date(dogadjaj.datum).toLocaleDateString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FiTag className="mr-2" /> Vrsta kategorije
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Npr. VIP, Standard, Studentska..."
                value={vrstaKategorije}
                onChange={(e) => setVrstaKategorije(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
            >
              <FiPlus className="mr-2" /> Dodaj kategoriju
            </button>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DodajKategoriju;