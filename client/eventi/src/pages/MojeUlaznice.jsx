import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCreditCard,
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiDollarSign,
  FiUser,
  FiArrowRight,
  FiSearch,
  FiX
} from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MojeUlaznice = () => {
  const [tickets, setTickets] = useState([]);
  const [events, setEvents] = useState({});
  const [locations, setLocations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [userData] = useState({
    username: localStorage.getItem('username') || 'Korisnik',
    userId: localStorage.getItem('id')
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');

        if (!token || !userId) {
          throw new Error('Morate biti prijavljeni');
        }

        // Dohvati sve ulaznice
        const ticketsResponse = await fetch(`http://localhost:3000/ulaznice`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!ticketsResponse.ok) {
          throw new Error('Greška pri dobavljanju ulaznica');
        }

        const allTickets = await ticketsResponse.json();

        // Filtriraj samo ulaznice za trenutnog korisnika
        const userTickets = allTickets.filter(ticket => 
          ticket.korisnik_id && ticket.korisnik_id.toString() === userId.toString()
        );

        if (userTickets.length === 0) {
          setTickets([]);
          setLoading(false);
          return;
        }

        // Dohvati sve eventove
        const eventsResponse = await fetch(`http://localhost:3000/events`);
        if (!eventsResponse.ok) throw new Error('Greška pri dobavljanju događaja');
        const eventsData = await eventsResponse.json();

        // Dohvati sve lokacije
        const locationsResponse = await fetch(`http://localhost:3000/lokacije`);
        if (!locationsResponse.ok) throw new Error('Greška pri dobavljanju lokacija');
        const locationsData = await locationsResponse.json();

        // Kreiraj lookup objekte (obratite pažnju na event.ID)
        const eventsObj = eventsData.reduce((acc, event) => {
          acc[event.ID] = event; // Koristimo event.ID umjesto event.id
          return acc;
        }, {});

        const locationsObj = locationsData.reduce((acc, location) => {
          acc[location.id] = location;
          return acc;
        }, {});

        setTickets(userTickets);
        setEvents(eventsObj);
        setLocations(locationsObj);
      } catch (err) {
        console.error('Došlo je do greške:', err);
        setError(err.message || 'Došlo je do greške pri učitavanju podataka');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('bs-BA', options);
  };

  const filteredTickets = tickets.filter(ticket => {
    if (!searchTerm) return true;
    
    const event = events[ticket.event_id];
    if (!event) return false;
    
    return (
      event.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (locations[event.lokacija_id]?.naziv || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-red-500 text-lg p-4 bg-red-50 rounded-lg">
            {error}
            <button 
              onClick={() => window.location.reload()} 
              className="ml-4 text-indigo-600 hover:text-indigo-800"
            >
              Pokušajte ponovo
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold mb-2"
              >
                Moje Ulaznice
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-indigo-100"
              >
                Pregledajte sve kupljene ulaznice
              </motion.p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="Pretražite ulaznice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 px-5 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <FiCreditCard className="mx-auto text-gray-400 text-5xl mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                {searchTerm ? 'Nema rezultata pretrage' : 'Nemate kupljenih ulaznica'}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-4">
                {searchTerm 
                  ? 'Pokušajte da promijenite kriterijume pretrage' 
                  : 'Posjetite stranicu sa događajima da biste kupili ulaznice'}
              </p>
              <div className="mt-4 text-sm text-gray-400">
                Korisnik ID: {userData.userId}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTickets.map((ticket) => {
                const event = events[ticket.event_id];
                
                if (!event) {
                  return (
                    <motion.div
                      key={ticket.id}
                      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">Nepoznat događaj</h3>
                            <div className="flex items-center text-indigo-600 mt-1">
                              <FiCreditCard className="mr-1" />
                              <span className="text-sm font-medium">#{ticket.broj_ulaznice}</span>
                            </div>
                          </div>
                          <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                            Nevažeća ulaznica
                          </span>
                        </div>

                        <div className="text-red-500 mb-4">
                          Dogovaj za ovu ulaznicu nije pronađen (Event ID: {ticket.event_id})
                        </div>

                        <div className="space-y-3 mb-6">
                          <div className="flex items-center text-gray-700">
                            <FiDollarSign className="mr-2 text-indigo-500 flex-shrink-0" />
                            <span>Ukupna cijena: {ticket.cijena} KM</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                }

                const location = locations[event.lokacija_id];
                
                return (
                  <motion.div
                    key={ticket.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{event.naziv}</h3>
                          <div className="flex items-center text-indigo-600 mt-1">
                            <FiCreditCard className="mr-1" />
                            <span className="text-sm font-medium">#{ticket.broj_ulaznice}</span>
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                          ticket.status === 'aktivna' ? 'bg-green-100 text-green-800' : 
                          ticket.status === 'iskorištena' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {ticket.status}
                        </span>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-gray-700">
                          <FiCalendar className="mr-2 text-indigo-500 flex-shrink-0" />
                          <span>{formatDate(event.datum)}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <FiClock className="mr-2 text-indigo-500 flex-shrink-0" />
                          <span>{event.vrijeme}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <FiMapPin className="mr-2 text-indigo-500 flex-shrink-0" />
                          <span>
                            {location?.naziv || 'Nepoznata lokacija'}
                            {location?.adresa && `, ${location.adresa}`}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <FiDollarSign className="mr-2 text-indigo-500 flex-shrink-0" />
                          <span>Ukupna cijena: {ticket.cijena} KM</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="w-full flex items-center justify-between px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <span>Više detalja</span>
                        <FiArrowRight />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {events[selectedTicket.event_id]?.naziv || 'Nepoznat događaj'}
                    </h3>
                    <div className="flex items-center text-indigo-600 mt-1">
                      <FiCreditCard className="mr-1" />
                      <span className="font-medium">#{selectedTicket.broj_ulaznice}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedTicket(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <FiUser className="mt-1 mr-2 text-indigo-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Korisnik</p>
                      <p className="font-medium">{userData.username}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiCalendar className="mt-1 mr-2 text-indigo-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Datum i vrijeme</p>
                      <p className="font-medium">
                        {selectedTicket.event_id && events[selectedTicket.event_id]?.datum ? 
                          `${formatDate(events[selectedTicket.event_id].datum)} u ${events[selectedTicket.event_id].vrijeme}` : 
                          'Nepoznato'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiMapPin className="mt-1 mr-2 text-indigo-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Lokacija</p>
                      <p className="font-medium">
                        {selectedTicket.event_id && events[selectedTicket.event_id]?.lokacija_id ?
                          locations[events[selectedTicket.event_id].lokacija_id]?.naziv || 'Nepoznata lokacija' :
                          'Nepoznata lokacija'}
                        {selectedTicket.event_id && events[selectedTicket.event_id]?.lokacija_id &&
                          locations[events[selectedTicket.event_id].lokacija_id]?.adresa && (
                            <span className="block text-gray-600">
                              {locations[events[selectedTicket.event_id].lokacija_id].adresa}
                            </span>
                          )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FiDollarSign className="mt-1 mr-2 text-indigo-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Cijena</p>
                      <p className="font-medium">{selectedTicket.cijena} KM</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="mt-1 mr-2 w-4 h-4 rounded-full bg-indigo-500 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="font-medium capitalize">{selectedTicket.status}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Zatvori
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default MojeUlaznice;