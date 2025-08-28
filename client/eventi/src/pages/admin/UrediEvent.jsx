import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiDollarSign,
  FiSave,
  FiX,
  FiEdit,
  FiSearch
} from 'react-icons/fi';

const UrediEvent = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
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
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [eventsResponse, lokacijeResponse, uposleniciResponse] = await Promise.all([
          fetch('http://localhost:3000/events'),
          fetch('http://localhost:3000/lokacije'),
          fetch('http://localhost:3000/uposlenici')
        ]);

        if (!eventsResponse.ok) throw new Error('Greška pri dobavljanju događaja');
        if (!lokacijeResponse.ok) throw new Error('Greška pri dobavljanju lokacija');
        if (!uposleniciResponse.ok) throw new Error('Greška pri dobavljanju uposlenika');

        const [eventsData, lokacijeData, uposleniciData] = await Promise.all([
          eventsResponse.json(),
          lokacijeResponse.json(),
          uposleniciResponse.json()
        ]);

        setEvents(eventsData);
        setLokacije(lokacijeData);
        setUposlenici(uposleniciData);
      } catch (err) {
        console.error('Došlo je do greške:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setFormData({
      naziv: event.naziv,
      opis: event.opis,
      vrijeme: event.vrijeme,
      datum: event.datum,
      lokacija_id: event.lokacija_id,
      uposlenici_id: event.uposlenici_id,
      cijena: event.cijena
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
    setIsSubmitting(true);
    setError(null);

    try {
      const requiredFields = ['naziv', 'vrijeme', 'datum', 'lokacija_id', 'uposlenici_id', 'cijena'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Obavezna polja: ${missingFields.join(', ')}`);
      }

      const response = await fetch(`http://localhost:3000/events/${selectedEvent.ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          naziv: formData.naziv,
          opis: formData.opis,
          vrijeme: formData.vrijeme,
          datum: formData.datum,
          lokacija_id: formData.lokacija_id,
          uposlenici_id: formData.uposlenici_id,
          cijena: formData.cijena
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Greška pri ažuriranju događaja');
      }

      navigate('/eventi');
    } catch (err) {
      console.error('Greška:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredEvents = events.filter(event =>
    event.naziv.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <button 
            onClick={() => navigate('/eventi')}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Nazad na događaje
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Uređivanje događaja</h2>
            <button 
              onClick={() => navigate('/eventi')}
              className="p-2 rounded-full hover:bg-indigo-700 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!selectedEvent ? (
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Pretraži događaje..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEvents.map(event => (
                  <motion.div
                    key={event.ID}
                    whileHover={{ scale: 1.02 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleEventSelect(event)}
                  >
                    <h3 className="font-bold text-lg text-indigo-600">{event.naziv}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{event.opis}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <FiCalendar className="mr-1" />
                      <span>{new Date(event.datum).toLocaleDateString()}</span>
                      <FiClock className="ml-3 mr-1" />
                      <span>{event.vrijeme}</span>
                    </div>
                    <div className="mt-2 text-sm font-medium">
                      Cijena: {event.cijena} KM
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg">
                <div>
                  <h3 className="font-bold text-indigo-700">Uređujete: {selectedEvent.naziv}</h3>
                  <p className="text-sm text-gray-600">ID: {selectedEvent.ID}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Odaberi drugi događaj
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Naziv događaja *</label>
                  <input
                    type="text"
                    name="naziv"
                    value={formData.naziv}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opis događaja</label>
                  <textarea
                    name="opis"
                    value={formData.opis}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Datum *</label>
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
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vrijeme *</label>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lokacija *</label>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Uposlenik *</label>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cijena (KM) *</label>
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
                      required
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
                      Spremanje...
                    </>
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Spremi promjene
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UrediEvent;