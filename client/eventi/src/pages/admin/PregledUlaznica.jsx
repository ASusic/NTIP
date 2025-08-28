import { useState, useEffect } from 'react';
import { FiCalendar, FiUsers, FiDollarSign, FiBarChart2, FiFilter } from 'react-icons/fi';
import { BsTicketPerforated } from 'react-icons/bs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const PregledUlaznica = () => {
  const [ulaznice, setUlaznice] = useState([]);
  const [dogadjaji, setDogadjaji] = useState([]);
  const [filterDogadjaj, setFilterDogadjaj] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    ukupno: 0,
    kupljeno: 0,
    ukupnaZarada: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [ulazniceRes, dogadjajiRes] = await Promise.all([
          fetch('http://localhost:3000/ulaznice'),
          fetch('http://localhost:3000/events')
        ]);

        if (!ulazniceRes.ok) throw new Error('Neuspješno učitavanje ulaznica');
        if (!dogadjajiRes.ok) throw new Error('Neuspješno učitavanje događaja');

        const [ulazniceData, dogadjajiData] = await Promise.all([
            ulazniceRes.json(),
            dogadjajiRes.json().then(data => data.map(item => ({
              id: item.ID,
              naziv: item.naziv,
              opis: item.opis,
              vrijeme: item.vrijeme,
              datum: item.datum,
              lokacija_id: item.lokacija_id,
              uposlenici_id: item.uposlenici_id,
              cijena: item.cijena
            })))
          ]);

        setUlaznice(ulazniceData);
        setDogadjaji(dogadjajiData);
      } catch (err) {
        console.error('Greška pri dohvatanju podataka:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (ulaznice.length > 0 && dogadjaji.length > 0) {
      const filtered = ulaznice.filter(ulaznica => {
        const matchesDogadjaj = filterDogadjaj ? ulaznica.event_id === parseInt(filterDogadjaj) : true;
        const matchesStatus = filterStatus ? ulaznica.status === filterStatus : true;
        return matchesDogadjaj && matchesStatus;
      });
      calculateStats(filtered);
    }
  }, [filterDogadjaj, filterStatus, ulaznice, dogadjaji]);

  const calculateStats = (data) => {
    const ukupno = data.length;
    const kupljeno = data.filter(u => u.status === 'kupljeno').length;
    const ukupnaZarada = data.reduce((sum, u) => {
      const dogadjaj = dogadjaji.find(d => d.id === u.event_id);
      const cijena = dogadjaj ? parseFloat(dogadjaj.cijena) : parseFloat(u.cijena) || 0;
      return sum + cijena;
    }, 0);
  
    setStats({
      ukupno,
      kupljeno,
      ukupnaZarada
    });
  };

  const getNazivDogadjaja = (eventId) => {
    const dogadjaj = dogadjaji.find(d => d.id === eventId);
    return dogadjaj ? dogadjaj.naziv : `Nepoznat događaj (ID: ${eventId})`;
  };

  const getCijenaDogadjaja = (eventId) => {
    const dogadjaj = dogadjaji.find(d => d.id === eventId);
    return dogadjaj ? dogadjaj.cijena : 0;
  };

  const prepareChartData = () => {
    const dataMap = {};

    ulaznice.forEach(ulaznica => {
      const nazivDogadjaja = getNazivDogadjaja(ulaznica.event_id);
      const cijenaDogadjaja = getCijenaDogadjaja(ulaznica.event_id);

      if (!dataMap[nazivDogadjaja]) {
        dataMap[nazivDogadjaja] = {
          name: nazivDogadjaja,
          kupljeno: 0,
          ukupno: 0,
          zarada: 0
        };
      }

      dataMap[nazivDogadjaja].ukupno += 1;
      dataMap[nazivDogadjaja].zarada += parseFloat(cijenaDogadjaja) || 0;
      if (ulaznica.status === 'kupljeno') {
        dataMap[nazivDogadjaja].kupljeno += 1;
      }
    });

    return Object.values(dataMap).sort((a, b) => b.zarada - a.zarada);
  };

  const chartData = prepareChartData();

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
            <p className="mt-2">Provjerite da li je backend server pokrenut i da li API endpointi rade ispravno.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Pregled prodaje ulaznica</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
            <FiFilter className="mr-2" /> Filteri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Događaj</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={filterDogadjaj}
                onChange={(e) => setFilterDogadjaj(e.target.value)}
              >
                <option value="">Svi događaji</option>
                {dogadjaji.map(dogadjaj => (
                  <option key={`event-${dogadjaj.id}`} value={dogadjaj.id}>
                    {dogadjaj.naziv}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">Svi statusi</option>
                <option value="kupljeno">Kupljeno</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                <BsTicketPerforated className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ukupno ulaznica</p>
                <p className="text-2xl font-bold text-gray-800">{stats.ukupno}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FiUsers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Kupljeno</p>
                <p className="text-2xl font-bold text-gray-800">{stats.kupljeno}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FiDollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ukupna zarada</p>
                <p className="text-2xl font-bold text-gray-800">{stats.ukupnaZarada.toFixed(2)} KM</p>
              </div>
            </div>
          </div>
        </div>
        
        {chartData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
              <FiBarChart2 className="mr-2" /> Statistika prodaje po događajima
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 60,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => 
                      name === 'zarada' ? [`${value.toFixed(2)} KM`, 'Zarada'] : [value, name]
                    }
                  />
                  <Legend />
                  <Bar dataKey="kupljeno" name="Kupljeno" fill="#4f46e5" />
                  <Bar dataKey="zarada" name="Zarada (KM)" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <h2 className="text-xl font-semibold text-gray-700 p-6 pb-0">Detalji ulaznica</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Broj ulaznice</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Događaj</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cijena (KM)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kupac ID</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ulaznice
                  .filter(ulaznica => {
                    const matchesDogadjaj = filterDogadjaj ? ulaznica.event_id === parseInt(filterDogadjaj) : true;
                    const matchesStatus = filterStatus ? ulaznica.status === filterStatus : true;
                    return matchesDogadjaj && matchesStatus;
                  })
                  .map(ulaznica => (
                    <tr key={`ticket-${ulaznica.id}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ulaznica.broj_ulaznice}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getNazivDogadjaja(ulaznica.event_id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getCijenaDogadjaja(ulaznica.event_id).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${ulaznica.status === 'kupljeno' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {ulaznica.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ulaznica.korisnik_id || 'Nepoznato'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PregledUlaznica;