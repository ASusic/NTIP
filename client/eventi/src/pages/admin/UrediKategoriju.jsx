import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTag, FiCalendar, FiSave, FiArrowLeft, FiEdit, FiList } from 'react-icons/fi';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const UrediKategoriju = () => {
  const [kategorije, setKategorije] = useState([]);
  const [dogadjaji, setDogadjaji] = useState([]);
  const [selectedKategorija, setSelectedKategorija] = useState(null);
  const [vrsta, setVrsta] = useState('');
  const [eventId, setEventId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
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

        // Handle kategorije response
        const kategorijeText = await kategorijeRes.text();
        const kategorijeData = kategorijeText ? JSON.parse(kategorijeText) : [];
        
        if (!kategorijeRes.ok) {
          throw new Error('Neuspješno učitavanje kategorija');
        }

        // Handle dogadjaji response
        const dogadjajiText = await dogadjajiRes.text();
        const dogadjajiData = dogadjajiText ? JSON.parse(dogadjajiText) : [];
        
        if (!dogadjajiRes.ok) {
          throw new Error('Neuspješno učitavanje događaja');
        }

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

  const handleSelectKategorija = (kategorija) => {
    setSelectedKategorija(kategorija);
    setVrsta(kategorija.vrsta);
    setEventId(kategorija.event_id);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!vrsta || !eventId || !selectedKategorija) {
      setError('Molimo popunite sva polja');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/kategorije/${selectedKategorija.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vrsta,
          event_id: parseInt(eventId)
        })
      });

      if (!response.ok) {
        throw new Error('Neuspješna izmjena kategorije');
      }

      // Update local state
      const updatedKategorije = kategorije.map(k => 
        k.id === selectedKategorija.id ? { ...k, vrsta, event_id: parseInt(eventId) } : k
      );
      
      setKategorije(updatedKategorije);
      setSelectedKategorija({ ...selectedKategorija, vrsta, event_id: parseInt(eventId) });
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Greška pri ažuriranju:', err);
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
            <span className="block sm:inline">{error}</span>
          </div>
          <button 
            onClick={() => navigate('/PregledKategorija')}
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
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate('/PregledKategorija')}
            className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center"
          >
            <FiArrowLeft className="mr-2" /> Nazad
          </button>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiEdit className="mr-2" /> Uređivanje kategorije
          </h1>

          {success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <span>Kategorija "{selectedKategorija?.vrsta}" uspješno ažurirana</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <FiList className="mr-2" /> Odaberite kategoriju
              </h2>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {kategorije.map(kategorija => (
                  <div 
                    key={kategorija.id}
                    onClick={() => handleSelectKategorija(kategorija)}
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

            {selectedKategorija && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Uređivanje: {selectedKategorija.vrsta}
                </h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vrsta kategorije
                    </label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      value={vrsta}
                      onChange={(e) => setVrsta(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Događaj
                    </label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      value={eventId}
                      onChange={(e) => setEventId(e.target.value)}
                      required
                    >
                      <option value="">Odaberite događaj</option>
                      {dogadjaji.map(dogadjaj => (
                        <option key={dogadjaj.ID} value={dogadjaj.ID}>
                          {dogadjaj.naziv} (ID: {dogadjaj.ID})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    <FiSave className="mr-2" /> Sačuvaj promjene
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UrediKategoriju;