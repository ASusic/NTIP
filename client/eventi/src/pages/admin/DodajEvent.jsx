import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiDollarSign,
  FiPlus,
  FiSave,
  FiX
} from 'react-icons/fi';

const DodajEvent = () => {
  const [formData, setFormData] = useState({
    naziv: '',
    opis: '',
    vrijeme: '',
    datum: '',
    lokacija_id: '',
    uposlenici_id: '',
    cijena: ''
  });
  const [lokacije, setLokacije] = useState([]);
  const [uposlenici, setUposlenici] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lokacijeResponse, uposleniciResponse] = await Promise.all([
          fetch('http://localhost:3000/lokacije'),
          fetch('http://localhost:3000/uposlenici')
        ]);

        if (!lokacijeResponse.ok) throw new Error('Greška pri dobavljanju lokacija');
        if (!uposleniciResponse.ok) throw new Error('Greška pri dobavljanju uposlenika');

        const [lokacijeData, uposleniciData] = await Promise.all([
          lokacijeResponse.json(),
          uposleniciResponse.json()
        ]);

        setLokacije(lokacijeData);
        setUposlenici(uposleniciData);
      } catch (err) {
        console.error('Došlo je do greške:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      const requiredFields = ['naziv', 'vrijeme', 'datum', 'lokacija_id', 'uposlenici_id'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Obavezna polja: ${missingFields.join(', ')}`);
      }

      // Prepare the data exactly as your server expects
      const eventData = {
        naziv: formData.naziv,
        opis: formData.opis,
        vrijeme: formData.vrijeme,
        datum: formData.datum,
        lokacija_id: parseInt(formData.lokacija_id),
        uposlenici_id: parseInt(formData.uposlenici_id),
        cijena: parseFloat(formData.cijena) || 0 // Default to 0 if not provided
      };

      const response = await fetch('http://localhost:3000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Greška pri dodavanju događaja');
      }

      navigate('/eventi');
    } catch (err) {
      console.error('Greška:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Dodaj novi događaj</h2>
            <button 
              onClick={() => navigate('/eventi')}
              className="p-2 rounded-full hover:bg-indigo-700 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 text-red-600 p-3 rounded-lg text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Naziv događaja */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Naziv događaja *
              </label>
              <input
                type="text"
                name="naziv"
                value={formData.naziv}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Unesite naziv događaja"
                required
              />
            </div>

            {/* Opis događaja */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Opis događaja
              </label>
              <textarea
                name="opis"
                value={formData.opis}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Detaljan opis događaja..."
              ></textarea>
            </div>

            {/* Datum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Datum *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="text-gray-400" />
                </div>
                <input
                  type="date"
                  name="datum"
                  value={formData.datum}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Vrijeme */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vrijeme *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiClock className="text-gray-400" />
                </div>
                <input
                  type="time"
                  name="vrijeme"
                  value={formData.vrijeme}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Lokacija */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokacija *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMapPin className="text-gray-400" />
                </div>
                <select
                  name="lokacija_id"
                  value={formData.lokacija_id}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                  required
                >
                  <option value="">Odaberite lokaciju</option>
                  {lokacije.map(lokacija => (
                    <option key={lokacija.id} value={lokacija.id}>
                      {lokacija.naziv}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Uposlenik */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Odgovorni uposlenik *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUsers className="text-gray-400" />
                </div>
                <select
                  name="uposlenici_id"
                  value={formData.uposlenici_id}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                  required
                >
                  <option value="">Odaberite uposlenika</option>
                  {uposlenici.map(uposlenik => (
                    <option key={uposlenik.id} value={uposlenik.id}>
                      {uposlenik.ime} {uposlenik.prezime}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cijena - optional but included in form */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cijena (KM)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="text-gray-400" />
                </div>
                <input
                  type="number"
                  name="cijena"
                  value={formData.cijena}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/eventi')}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Odustani
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Čuvanje...
                </>
              ) : (
                <>
                  <FiSave className="mr-2" />
                  Sačuvaj događaj
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DodajEvent;