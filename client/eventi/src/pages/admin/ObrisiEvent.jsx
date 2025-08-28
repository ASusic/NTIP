import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUsers,
  FiDollarSign,
  FiTrash2,
  FiX,
  FiSearch,
  FiAlertTriangle
} from 'react-icons/fi';

const ObrisiEvent = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/events');
        if (!response.ok) throw new Error('Greška pri dobavljanju događaja');
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error('Došlo je do greške:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:3000/events/${selectedEvent.ID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Greška pri brisanju događaja');
      }

      navigate('/eventi');
    } catch (err) {
      console.error('Greška:', err);
      setError(err.message);
    } finally {
      setIsDeleting(false);
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
        <div className="bg-gradient-to-r from-red-600 to-orange-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Brisanje događaja</h2>
            <button 
              onClick={() => navigate('/eventi')}
              className="p-2 rounded-full hover:bg-red-700 transition-colors"
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
                  placeholder="Pretraži događaje za brisanje..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
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
                    onClick={() => setSelectedEvent(event)}
                  >
                    <h3 className="font-bold text-lg text-red-600">{event.naziv}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{event.opis}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                      <FiCalendar className="mr-1" />
                      <span>{new Date(event.datum).toLocaleDateString()}</span>
                      <FiClock className="ml-3 mr-1" />
                      <span>{event.vrijeme}</span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm font-medium">Cijena: {event.cijena} KM</span>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Kliknite za brisanje
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-red-50 border-l-4 border-red-500 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FiAlertTriangle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Potvrda brisanja događaja
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        Jeste li sigurni da želite trajno obrisati događaj "{selectedEvent.naziv}"?
                        Ova radnja se ne može poništiti.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Detalji događaja
                  </h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Naziv</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedEvent.naziv}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Datum</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(selectedEvent.datum).toLocaleDateString()} u {selectedEvent.vrijeme}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Lokacija ID</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedEvent.lokacija_id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Uposlenik ID</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedEvent.uposlenici_id}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-sm font-medium text-gray-500">Opis</p>
                      <p className="mt-1 text-sm text-gray-900">{selectedEvent.opis}</p>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 text-red-600 p-3 rounded-lg text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Odustani
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Brisanje...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="mr-2" />
                      Obriši događaj
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ObrisiEvent;