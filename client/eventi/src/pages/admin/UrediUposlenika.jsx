import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiEdit2, FiArrowLeft, FiCheckCircle, FiPhone, FiMail, FiBriefcase, FiCalendar, FiUsers } from 'react-icons/fi';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const UrediUposlenika = () => {
  const [uposlenici, setUposlenici] = useState([]);
  const [selectedUposlenik, setSelectedUposlenik] = useState(null);
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    uloga: '',
    kontakt: '',
    email: '',
    event_id: ''
  });
  const [dogadjaji, setDogadjaji] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [uposleniciRes, dogadjajiRes] = await Promise.all([
          fetch('http://localhost:3000/uposlenici'),
          fetch('http://localhost:3000/events')
        ]);

        // Handle employees response
        const uposleniciText = await uposleniciRes.text();
        if (!uposleniciText) throw new Error('Prazan odgovor za uposlenike');
        const uposleniciData = JSON.parse(uposleniciText);
        if (!uposleniciRes.ok) throw new Error('Neuspješno učitavanje uposlenika');

        // Handle events response
        const dogadjajiText = await dogadjajiRes.text();
        if (!dogadjajiText) throw new Error('Prazan odgovor za događaje');
        const dogadjajiData = JSON.parse(dogadjajiText);
        if (!dogadjajiRes.ok) throw new Error('Neuspješno učitavanje događaja');

        setUposlenici(uposleniciData);
        setDogadjaji(dogadjajiData);
      } catch (err) {
        console.error('Greška pri učitavanju:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectUposlenik = (uposlenik) => {
    setSelectedUposlenik(uposlenik);
    setFormData({
      ime: uposlenik.ime || '',
      prezime: uposlenik.prezime || '',
      uloga: uposlenik.uloga || '',
      kontakt: uposlenik.kontakt || '',
      email: uposlenik.email || '',
      event_id: uposlenik.event_id || ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUposlenik) return;
    
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        event_id: formData.event_id || null
      };

      const response = await fetch(`http://localhost:3000/uposlenici/${selectedUposlenik.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(responseText ? JSON.parse(responseText).message : 'Neuspješna izmjena uposlenika');
      }

      // Update local state
      const updatedUposlenici = uposlenici.map(u => 
        u.id === selectedUposlenik.id ? { ...u, ...payload } : u
      );
      setUposlenici(updatedUposlenici);
      setSelectedUposlenik({ ...selectedUposlenik, ...payload });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Greška pri ažuriranju:', err);
      setError(err.message);
    } finally {
      setLoading(false);
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
            <FiEdit2 className="mr-2" /> Uređivanje uposlenika
          </h1>

          {success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <div className="flex items-center">
                <FiCheckCircle className="mr-2" />
                <span>Promjene uspješno sačuvane!</span>
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

            {/* Edit form */}
            {selectedUposlenik && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Uređivanje: {selectedUposlenik.ime} {selectedUposlenik.prezime}
                </h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiUser className="mr-2" /> Ime
                    </label>
                    <input
                      type="text"
                      name="ime"
                      value={formData.ime}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiUser className="mr-2" /> Prezime
                    </label>
                    <input
                      type="text"
                      name="prezime"
                      value={formData.prezime}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiBriefcase className="mr-2" /> Uloga
                    </label>
                    <input
                      type="text"
                      name="uloga"
                      value={formData.uloga}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiPhone className="mr-2" /> Kontakt
                    </label>
                    <input
                      type="text"
                      name="kontakt"
                      value={formData.kontakt}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiMail className="mr-2" /> Email (opcionalno)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FiCalendar className="mr-2" /> Događaj (opcionalno)
                    </label>
                    <select
                      name="event_id"
                      value={formData.event_id}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Nije dodijeljen događaju</option>
                      {dogadjaji.map(dogadjaj => (
                        <option key={dogadjaj.ID} value={dogadjaj.ID}>
                          {dogadjaj.naziv} (ID: {dogadjaj.ID})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    {loading ? 'Spremanje...' : (
                      <>
                        <FiSave className="mr-2" /> Spremi promjene
                      </>
                    )}
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

export default UrediUposlenika;