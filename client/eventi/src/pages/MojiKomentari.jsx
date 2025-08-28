import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiCalendar,
  FiClock,
  FiMapPin,
  FiMessageSquare,
  FiStar,
  FiSend,
  FiUser
} from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';

const MojiKomentari = () => {
  const [events, setEvents] = useState([]);
  const [locations, setLocations] = useState({});
  const [comments, setComments] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState({
    event_id: '',
    opis: '',
    ocjena: 0,
    vrsta: 'komentar'
  });
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = parseInt(localStorage.getItem('id'));
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username') || 'Korisnik';

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token || !userId) {
          throw new Error('Morate biti prijavljeni');
        }

        const [eventsResponse, locationsResponse, commentsResponse, ticketsResponse] = await Promise.all([
          fetch('http://localhost:3000/events'),
          fetch('http://localhost:3000/lokacije'),
          fetch('http://localhost:3000/komentari'),
          fetch('http://localhost:3000/ulaznice', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        if (!eventsResponse.ok) throw new Error('Greška pri dobavljanju događaja');
        if (!locationsResponse.ok) throw new Error('Greška pri dobavljanju lokacija');
        if (!commentsResponse.ok) throw new Error('Greška pri dobavljanju komentara');
        if (!ticketsResponse.ok) throw new Error('Greška pri dobavljanju ulaznica');

        const [eventsData, locationsData, commentsData, ticketsData] = await Promise.all([
          eventsResponse.json(),
          locationsResponse.json(),
          commentsResponse.json(),
          ticketsResponse.json()
        ]);

        const locationsObj = locationsData.reduce((acc, location) => {
          acc[location.id] = location;
          return acc;
        }, {});

        const userTickets = ticketsData.filter(ticket => 
          ticket.korisnik_id && ticket.korisnik_id.toString() === userId.toString()
        );

        setEvents(eventsData);
        setLocations(locationsObj);
        setComments(commentsData);
        setTickets(userTickets);
      } catch (err) {
        console.error('Došlo je do greške:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, userId]);

  const handleSubmitComment = async (eventId) => {
    try {
      setIsSubmitting(true);
      
      if (!newComment.opis || newComment.opis.trim().length < 3) {
        throw new Error('Komentar mora imati najmanje 3 karaktera');
      }
      if (newComment.ocjena < 1 || newComment.ocjena > 5) {
        throw new Error('Ocjena mora biti između 1 i 5');
      }

      const commentData = {
        opis: newComment.opis,
        ocjena: newComment.ocjena,
        event_id: parseInt(eventId),
        korisnik_id: userId,
        datum: new Date().toISOString().split('T')[0]
      };
      console.log('Podaci koji se šalju:', commentData);
      const response = await fetch('http://localhost:3000/komentari', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(commentData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Greška pri dodavanju komentara');
      }

      const addedComment = await response.json();
      setComments([...comments, addedComment]);
      setNewComment({ event_id: '', opis: '', ocjena: 0, vrsta: 'komentar' });
    } catch (err) {
      console.error('Greška:', err);
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = (rating, setRating = null) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={setRating ? "button" : "div"}
            onClick={() => setRating && setRating({ ...newComment, ocjena: star })}
            className="text-2xl focus:outline-none"
          >
            {star <= rating ? (
              <FiStar className="text-yellow-400 fill-current" />
            ) : (
              <FiStar className="text-gray-300" />
            )}
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('bs-BA', options);
  };

  const today = new Date().toISOString().split('T')[0];
  const pastEvents = events.filter(event => 
    event.datum < today && 
    tickets.some(ticket => ticket.event_id === event.ID)
  );
  const upcomingEvents = events.filter(event => 
    event.datum >= today && 
    tickets.some(ticket => ticket.event_id === event.ID)
  );

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
                Moji Komentari
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-indigo-100"
              >
                Ocijenite i komentirajte događaje na kojima ste bili
              </motion.p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'upcoming' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('upcoming')}
            >
              Nadolazeći događaji ({upcomingEvents.length})
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'past' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('past')}
            >
              Održani događaji ({pastEvents.length})
            </button>
          </div>

          {activeTab === 'upcoming' ? (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Nadolazeći događaji</h2>
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                  <p className="text-gray-500">Trenutno nema nadolazećih događaja na kojima ste bili</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingEvents.map(event => (
                    <motion.div
                      key={event.ID}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                    >
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{event.naziv}</h3>
                        <div className="space-y-2 text-gray-700">
                          <div className="flex items-center">
                            <FiCalendar className="mr-2 text-indigo-500" />
                            <span>{formatDate(event.datum)}</span>
                          </div>
                          <div className="flex items-center">
                            <FiClock className="mr-2 text-indigo-500" />
                            <span>{event.vrijeme}</span>
                          </div>
                          <div className="flex items-center">
                            <FiMapPin className="mr-2 text-indigo-500" />
                            <span>{locations[event.lokacija_id]?.naziv || 'Nepoznata lokacija'}</span>
                          </div>
                        </div>
                        <div className="mt-4 text-sm text-gray-500">
                          Komentari će biti dostupni nakon održavanja događaja
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Održani događaji</h2>
              {pastEvents.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-lg shadow">
                  <p className="text-gray-500">Niste prisustvovali nijednom održanom događaju</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {pastEvents.map(event => {
                    const eventComments = comments.filter(c => c.event_id === event.ID);
                    const userComment = eventComments.find(c => c.korisnik_id == userId);

                    return (
                      <motion.div
                        key={event.ID}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
                      >
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{event.naziv}</h3>
                          <div className="flex flex-wrap gap-4 mb-4">
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
                              <span>{locations[event.lokacija_id]?.naziv || 'Nepoznata lokacija'}</span>
                            </div>
                          </div>

                          {userComment ? (
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                              <h4 className="font-medium text-gray-900 mb-2">Vaš komentar</h4>
                              <div className="mb-2">
                                {renderStarRating(userComment.ocjena)}
                              </div>
                              <p className="text-gray-700">{userComment.opis}</p>
                              <p className="text-sm text-gray-500 mt-2">
                                Objavljeno: {formatDate(userComment.datum)}
                              </p>
                            </div>
                          ) : (
                            <div className="mt-6">
                              <h4 className="font-medium text-gray-900 mb-3">Ostavite komentar</h4>
                              <div className="mb-3">
                                <label className="block text-gray-700 mb-1">Ocjena</label>
                                {renderStarRating(newComment.ocjena, setNewComment)}
                              </div>
                              <div className="mb-3">
                                <label className="block text-gray-700 mb-1">Komentar</label>
                                <textarea
                                  value={newComment.opis}
                                  onChange={(e) => setNewComment({ ...newComment, opis: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                  rows="3"
                                  placeholder="Vaš doživljaj događaja..."
                                ></textarea>
                              </div>
                              <button
                                onClick={() => handleSubmitComment(event.ID)}
                                disabled={isSubmitting || !newComment.opis || newComment.ocjena === 0}
                                className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors ${
                                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                              >
                                {isSubmitting ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Šaljem...
                                  </>
                                ) : (
                                  <>
                                    <FiSend className="mr-2" />
                                    Pošalji komentar
                                  </>
                                )}
                              </button>
                            </div>
                          )}

                          {eventComments.length > 0 && (
                            <div className="mt-6">
                              <h4 className="font-medium text-gray-900 mb-3">Ostali komentari ({eventComments.filter(c => c.korisnik_id != userId).length})</h4>
                              <div className="space-y-4">
                                {eventComments
                                  .filter(c => c.korisnik_id != userId)
                                  .map(comment => (
                                    <div key={comment.id} className="p-3 bg-gray-50 rounded-lg">
                                      <div className="flex justify-between items-start">
                                        <div className="flex items-center">
                                          <FiUser className="mr-2 text-gray-400" />
                                          <span className="font-medium text-gray-900">
                                            {comment.korisnik_id === userId ? 'Vi' : `Korisnik #${comment.korisnik_id}`}
                                          </span>
                                        </div>
                                        <div className="flex items-center">
                                          {renderStarRating(comment.ocjena)}
                                        </div>
                                      </div>
                                      <p className="text-gray-700 mt-1">{comment.opis}</p>
                                      <p className="text-sm text-gray-500 mt-2">
                                        {formatDate(comment.datum)}
                                      </p>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MojiKomentari;