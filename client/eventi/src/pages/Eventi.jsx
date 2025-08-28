import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiShoppingCart, 
  FiArrowRight,
  FiSearch,
  FiFilter,
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle
} from 'react-icons/fi';
import { jwtDecode } from "jwt-decode";
import Header from '../components/Header';
import Footer from '../components/Footer';

const Eventi = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [locations, setLocations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    date: '',
    priceRange: ''
  });
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseError, setPurchaseError] = useState(null);
  const [userData, setUserData] = useState({
    uloga: localStorage.getItem('uloga'),
    username: localStorage.getItem('username')
  });
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setUserData({
        uloga: localStorage.getItem('uloga'),
        username: localStorage.getItem('username')
      });
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      
      if (!token || !userId) {
        return false;
      }

      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        return false;
      }
      
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsResponse = await fetch('http://localhost:3000/events');
        if (!eventsResponse.ok) throw new Error('Failed to fetch events');
        let eventsData = await eventsResponse.json();

        eventsData = eventsData.map(event => ({
          ...event,
          id: event.ID // Normalizacija ID polja
        }));

        const locationsResponse = await fetch('http://localhost:3000/lokacije');
        if (!locationsResponse.ok) throw new Error('Failed to fetch locations');
        const locationsData = await locationsResponse.json();

        const locationsObj = locationsData.reduce((acc, location) => {
          acc[location.id] = location;
          return acc;
        }, {});

        setEvents(eventsData);
        setFilteredEvents(eventsData);
        setLocations(locationsObj);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let results = events;
    
    if (searchTerm) {
      results = results.filter(event => 
        event.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.opis.toLowerCase().includes(searchTerm.toLowerCase()) ||
        locations[event.lokacija_id]?.naziv.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filters.category) {
      results = results.filter(event => {
        const eventType = getEventType(event.id);
        return eventType.toLowerCase() === filters.category.toLowerCase();
      });
    }

    if (filters.date) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      results = results.filter(event => {
        const eventDate = new Date(event.datum);
        
        switch(filters.date) {
          case 'today':
            return eventDate.toDateString() === today.toDateString();
          case 'tomorrow':
            return eventDate.toDateString() === tomorrow.toDateString();
          case 'this-week':
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);
            return eventDate >= today && eventDate <= nextWeek;
          case 'this-month':
            const nextMonth = new Date(today);
            nextMonth.setMonth(nextMonth.getMonth() + 1);
            return eventDate >= today && eventDate <= nextMonth;
          default:
            return true;
        }
      });
    }

    if (filters.priceRange) {
      results = results.filter(event => {
        const eventPrice = event.cijena;
        
        switch(filters.priceRange) {
          case 'under-20':
            return eventPrice < 20;
          case '20-50':
            return eventPrice >= 20 && eventPrice <= 50;
          case 'over-50':
            return eventPrice > 50;
          default:
            return true;
        }
      });
    }

    setFilteredEvents(results);
  }, [searchTerm, filters, events, locations]);

  const getEventType = (id) => {
    return id === 2 ? "Komedija" : id === 3 ? "Pozorište" : "Koncert";
  };

  const generateTicketNumber = () => {
    return 'TICK-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
  };

  const handlePurchase = (event) => {
    if (!checkAuth()) {
      navigate('/login', { state: { from: 'eventi' } });
      return;
    }
    
    if (!event || !event.id) {
      setPurchaseError('Nevažeći događaj');
      return;
    }
  
    setSelectedEvent(event);
    setPurchaseSuccess(false);
    setPurchaseError(null);
  };

  const confirmPurchase = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      
      if (!token || !userId) {
        throw new Error('Morate biti prijavljeni da biste kupili ulaznice');
      }

      if (!selectedEvent || !selectedEvent.id) {
        throw new Error('Nije odabran ispravan događaj');
      }

      const ticketData = {
        broj_ulaznice: generateTicketNumber(),
        cijena: selectedEvent.cijena * ticketQuantity,
        status: 'kupljeno',
        korisnik_id: parseInt(userId),
        event_id: parseInt(selectedEvent.id)
      };

      const response = await fetch('http://localhost:3000/ulaznice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ticketData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Greška pri kupovini ulaznica');
      }

      setPurchaseSuccess(true);
    } catch (err) {
      setPurchaseError(err.message);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('bs-BA', options);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      category: '',
      date: '',
      priceRange: ''
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Predstojeći događaji
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-indigo-100 max-w-2xl mx-auto"
            >
              Pronađite savršen događaj za sebe i rezervišite ulaznice odmah
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-3xl mx-auto"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Pretražite događaje..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-4 px-6 pr-12 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl" />
            </div>

            <div className="flex justify-center mt-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-indigo-100 hover:text-white transition-colors"
              >
                <FiFilter className="mr-2" />
                {showFilters ? 'Sakrij filtere' : 'Prikaži filtere'}
                {showFilters ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow-md"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Kategorija</label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({...filters, category: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Sve kategorije</option>
                    <option value="koncert">Koncerti</option>
                    <option value="pozorište">Pozorište</option>
                    <option value="komedija">Komedija</option>
                    <option value="sport">Sport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Datum</label>
                  <select
                    value={filters.date}
                    onChange={(e) => setFilters({...filters, date: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Svi datumi</option>
                    <option value="today">Danas</option>
                    <option value="tomorrow">Sutra</option>
                    <option value="this-week">Ove sedmice</option>
                    <option value="this-month">Ovog mjeseca</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Cijena</label>
                  <select
                    value={filters.priceRange}
                    onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Sve cijene</option>
                    <option value="under-20">Ispod 20 KM</option>
                    <option value="20-50">20 - 50 KM</option>
                    <option value="over-50">Preko 50 KM</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <FiX className="mr-1" />
                  Resetuj filtere
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">
            {filteredEvents.length} {filteredEvents.length === 1 ? ' nadolazeća događaj' : 'nadolazeća događaja'}
          </h2>
          <div className="text-gray-600">
            {searchTerm || Object.values(filters).some(Boolean) ? (
              <button
                onClick={resetFilters}
                className="text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Poništi pretragu
              </button>
            ) : null}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700 mb-2">Nema rezultata</h3>
            <p className="text-gray-500">Pokušajte da promijenite kriterijume pretrage</p>
            <button
              onClick={resetFilters}
              className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Poništi filtere
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all"
              >
                <div className="h-48 bg-gradient-to-r from-purple-400 to-indigo-500 relative">
                  <div className="absolute top-4 right-4 bg-white text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {getEventType(event.id)}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.naziv}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.opis}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <FiCalendar className="mr-2 text-indigo-500" />
                      <span>{formatDate(event.datum)}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FiClock className="mr-2 text-indigo-500" />
                      <span>{event.vrijeme}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <FiMapPin className="mr-2 text-indigo-500" />
                      <span>
                        {locations[event.lokacija_id]?.naziv || 'Nepoznata lokacija'}
                        {locations[event.lokacija_id]?.adresa && `, ${locations[event.lokacija_id].adresa}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold text-indigo-600">
                      {event.cijena} KM po ulaznici
                    </div>
                    <motion.button
                      onClick={() => handlePurchase(event)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                    >
                      <FiShoppingCart className="mr-2" />
                      Kupi ulaznice
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full"
          >
            <div className="p-6">
              {purchaseSuccess ? (
                <div className="text-center">
                  <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Uspešna kupovina!</h3>
                  <p className="text-gray-600 mb-6">
                    Uspešno ste kupili {ticketQuantity} ulaznica za "{selectedEvent.naziv}"
                  </p>
                  <button
                    onClick={() => {
                      setSelectedEvent(null);
                      setPurchaseSuccess(false);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Zatvori
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedEvent.naziv}</h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FiMapPin className="mr-2" />
                    <span>{locations[selectedEvent.lokacija_id]?.naziv}</span>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Količina ulaznica:</label>
                    <div className="flex items-center">
                      <button 
                        onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                        className="bg-gray-200 px-3 py-1 rounded-l-lg hover:bg-gray-300 transition-colors"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={ticketQuantity}
                        onChange={(e) => setTicketQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="border-t border-b border-gray-300 px-3 py-1 w-16 text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                      <button 
                        onClick={() => setTicketQuantity(ticketQuantity + 1)}
                        className="bg-gray-200 px-3 py-1 rounded-r-lg hover:bg-gray-300 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Cijena po ulaznici:</span>
                      <span className="font-semibold">{selectedEvent.cijena} KM</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Ukupno:</span>
                      <span>{(selectedEvent.cijena * ticketQuantity).toFixed(2)} KM</span>
                    </div>
                  </div>

                  {purchaseError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {purchaseError}
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Odustani
                    </button>
                    <motion.button
                      onClick={confirmPurchase}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center"
                    >
                      Potvrdi kupovinu <FiArrowRight className="ml-2" />
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Eventi;