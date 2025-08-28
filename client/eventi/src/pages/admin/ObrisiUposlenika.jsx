import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiTrash2, FiArrowLeft, FiCheckCircle, FiAlertCircle, FiCalendar, FiUsers } from 'react-icons/fi';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ObrisiUposlenika = () => {
  const [uposlenici, setUposlenici] = useState([]);
  const [selectedUposlenik, setSelectedUposlenik] = useState(null);
  const [dogadjaj, setDogadjaj] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUposlenici = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('http://localhost:3000/uposlenici');
        const text = await response.text();
        
        if (!text) throw new Error('Prazan odgovor od servera');
        const data = JSON.parse(text);
        
        if (!response.ok) {
          throw new Error(data.message || 'Neuspješno učitavanje uposlenika');
        }

        setUposlenici(data);
      } catch (err) {
        console.error('Greška pri učitavanju:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUposlenici();
  }, []);

  const handleSelectUposlenik = async (uposlenik) => {
    try {
      setLoading(true);
      setSelectedUposlenik(uposlenik);
      setShowConfirm(false);
      setDogadjaj(null);

      // Fetch event if assigned
      if (uposlenik.event_id) {
        const eventRes = await fetch(`http://localhost:3000/events/${uposlenik.event_id}`);
        const eventText = await eventRes.text();
        if (eventText) {
          const eventData = JSON.parse(eventText);
          if (eventRes.ok) {
            setDogadjaj(eventData);
          }
        }
      }
    } catch (err) {
      console.error('Greška pri učitavanju događaja:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUposlenik) return;
    
    try {
      const response = await fetch(`http://localhost:3000/uposlenici/${selectedUposlenik.id}`, {
        method: 'DELETE'
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(responseText ? JSON.parse(responseText).message : 'Neuspješno brisanje uposlenika');
      }

      setSuccess(true);
      setUposlenici(uposlenici.filter(u => u.id !== selectedUposlenik.id));
      setSelectedUposlenik(null);
      setShowConfirm(false);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Greška pri brisanju:', err);
      setError(err.message);
    }
  };

  if (loading && !selectedUposlenik) {
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
            onClick={() => navigate('/PregledUposlenici')}
            className="mt-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center"
          >
            <FiArrowLeft className="mr-2" /> Nazad na listu
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
            onClick={() => navigate('/PregledUposlenici')}
            className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center"
          >
            <FiArrowLeft className="mr-2" /> Nazad
          </button>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiTrash2 className="mr-2 text-red-600" /> Brisanje uposlenika
          </h1>

          {success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <div className="flex items-center">
                <FiCheckCircle className="mr-2" />
                <span>Uposlenik uspješno obrisan!</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employee selection panel */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <FiUsers className="mr-2" /> Odaberite uposlenika
              </h2>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {uposlenici.map(uposlenik => (
                  <div 
                    key={uposlenik.id}
                    onClick={() => handleSelectUposlenik(uposlenik)}
                    className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                      selectedUposlenik?.id === uposlenik.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="font-medium">{uposlenik.ime} {uposlenik.prezime}</div>
                    <div className="text-sm text-gray-500">{uposlenik.uloga}</div>
                    {uposlenik.event_id && (
                      <div className="text-xs text-gray-400">Događaj ID: {uposlenik.event_id}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Delete confirmation */}
            {selectedUposlenik && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Brisanje: {selectedUposlenik.ime} {selectedUposlenik.prezime}
                </h2>
                
                <div className="mb-6 flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                    <FiUser className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <div className="font-medium">{selectedUposlenik.ime} {selectedUposlenik.prezime}</div>
                    <div className="text-sm text-gray-500">ID: {selectedUposlenik.id}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <p><span className="font-medium">Uloga:</span> {selectedUposlenik.uloga}</p>
                  <p><span className="font-medium">Kontakt:</span> {selectedUposlenik.kontakt}</p>
                  {selectedUposlenik.email && <p><span className="font-medium">Email:</span> {selectedUposlenik.email}</p>}
                  {dogadjaj && (
                    <p className="flex items-center">
                      <FiCalendar className="mr-1" />
                      <span className="font-medium">Događaj:</span> {dogadjaj.naziv} (ID: {dogadjaj.ID})
                    </p>
                  )}
                </div>

                {!showConfirm ? (
                  <button
                    onClick={() => setShowConfirm(true)}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 flex items-center justify-center"
                  >
                    <FiTrash2 className="mr-2" /> Obriši uposlenika
                  </button>
                ) : (
                  <>
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
                      <p className="text-red-700 font-medium">
                        Jeste li sigurni da želite obrisati ovog uposlenika? Ova radnja je nepovratna!
                      </p>
                    </div>

                    <div className="flex justify-between">
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
                        <FiTrash2 className="inline mr-2" /> Potvrdi brisanje
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ObrisiUposlenika;