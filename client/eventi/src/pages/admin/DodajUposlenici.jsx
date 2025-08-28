import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiUserPlus, FiArrowLeft, FiCheckCircle, FiPhone, FiMail, FiBriefcase, FiCalendar } from 'react-icons/fi';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const DodajUposlenika = () => {
  const [formData, setFormData] = useState({
    ime: '',
    prezime: '',
    uloga: '',
    kontakt: '',
    email: '',
    event_id: ''
  });
  const [dogadjaji, setDogadjaji] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDogadjaji = async () => {
      try {
        const response = await fetch('http://localhost:3000/events');
        if (!response.ok) throw new Error('Neuspješno učitavanje događaja');
        const data = await response.json();
        setDogadjaji(data);
      } catch (err) {
        console.error('Greška pri učitavanju događaja:', err);
      }
    };
    fetchDogadjaji();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        event_id: formData.event_id || null
      };

      const response = await fetch('http://localhost:3000/uposlenici', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Neuspješno dodavanje uposlenika');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/PregledUposlenici');
      }, 1500);
    } catch (err) {
      console.error('Greška pri dodavanju:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <button 
            onClick={() => navigate('/PregledUposlenici')}
            className="mb-4 px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 flex items-center"
          >
            <FiArrowLeft className="mr-2" /> Nazad
          </button>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FiUserPlus className="mr-2" /> Dodaj novog uposlenika
          </h1>

          {success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
              <div className="flex items-center">
                <FiCheckCircle className="mr-2" />
                <span>Uposlenik uspješno dodan!</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            {/* Existing fields */}
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

            {/* New event selection field */}
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
              {loading ? 'Dodavanje...' : (
                <>
                  <FiUserPlus className="mr-2" /> Dodaj uposlenika
                </>
              )}
            </button>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DodajUposlenika;