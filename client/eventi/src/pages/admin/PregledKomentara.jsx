import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMessageSquare, FiCalendar, FiUser, FiStar, FiTrash2 } from 'react-icons/fi';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const PregledKomentara = () => {
  const [dogadjaji, setDogadjaji] = useState([]);
  const [komentari, setKomentari] = useState([]);
  const [korisnici, setKorisnici] = useState([]);
  const [selectedDogadjaj, setSelectedDogadjaj] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [dogadjajiRes, komentariRes, korisniciRes] = await Promise.all([
          fetch('http://localhost:3000/events'),
          fetch('http://localhost:3000/komentari'),
          fetch('http://localhost:3000/korisnici')
        ]);

        if (!dogadjajiRes.ok) throw new Error('Neuspješno učitavanje događaja');
        if (!komentariRes.ok) throw new Error('Neuspješno učitavanje komentara');
        if (!korisniciRes.ok) throw new Error('Neuspješno učitavanje korisnika');

        const [dogadjajiData, komentariData, korisniciData] = await Promise.all([
          dogadjajiRes.json(),
          komentariRes.json(),
          korisniciRes.json()
        ]);

        setDogadjaji(dogadjajiData);
        setKomentari(komentariData);
        setKorisnici(korisniciData);
      } catch (err) {
        console.error('Greška pri dohvatanju podataka:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Da li ste sigurni da želite obrisati ovaj komentar?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/komentari/${commentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Neuspješno brisanje komentara');

      // Update local state by removing the deleted comment
      setKomentari(komentari.filter(k => k.id !== commentId));
      setSuccessMessage('Komentar uspješno obrisan!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Greška pri brisanju komentara:', err);
      setError(err.message);
    }
  };

  const filteredKomentari = komentari.filter(komentar => {
    return selectedDogadjaj ? komentar.event_id === parseInt(selectedDogadjaj) : true;
  });

  const getNazivDogadjaja = (eventId) => {
    const dogadjaj = dogadjaji.find(d => d.ID === eventId);
    return dogadjaj ? dogadjaj.naziv : `Nepoznat događaj (ID: ${eventId})`;
  };

  const getKorisnikInfo = (korisnikId) => {
    const korisnik = korisnici.find(k => k.id === korisnikId);
    return korisnik ? korisnik.username : `Nepoznat korisnik (ID: ${korisnikId})`;
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
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Pregled komentara</h1>
        
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
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 flex items-center">
              <FiMessageSquare className="mr-2" /> 
              {selectedDogadjaj ? 
                `Komentari za događaj: ${getNazivDogadjaja(parseInt(selectedDogadjaj))}` : 
                'Svi komentari'}
              <span className="ml-auto bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {filteredKomentari.length} komentara
              </span>
            </h2>
          </div>
          
          {filteredKomentari.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Nema pronađenih komentara za odabrani događaj.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredKomentari.map(komentar => {
                const korisnik = korisnici.find(k => k.id === komentar.korisnik_id);
                const dogadjaj = dogadjaji.find(d => d.ID === komentar.event_id);
                
                return (
                  <div key={`comment-${komentar.id}`} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-1">
                        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <FiUser className="h-5 w-5 text-indigo-600" />
                        </div>
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {getKorisnikInfo(komentar.korisnik_id)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(komentar.datum).toLocaleDateString()} | 
                              Događaj: {getNazivDogadjaja(komentar.event_id)}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <FiStar className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-medium text-gray-900">
                              {komentar.ocjena}/5
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-700">
                          <p>{komentar.opis}</p>
                        </div>
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => handleDeleteComment(komentar.id)}
                            className="text-red-600 hover:text-red-900 flex items-center text-sm"
                          >
                            <FiTrash2 className="mr-1" />
                            Obriši
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PregledKomentara;