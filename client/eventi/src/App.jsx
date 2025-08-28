import { useState } from 'react';
import { jwtDecode } from "jwt-decode";
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLogIn, FiUser, FiUserPlus } from 'react-icons/fi';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Home from './pages/home';
import Header from './components/Header';
import Footer from './components/Footer';
import Eventi from './pages/Eventi';
import MojeUlaznice from './pages/MojeUlaznice';
import MojiKomentari from './pages/MojiKomentari';
import DodajEvent from './pages/admin/DodajEvent';
import UrediEvent from './pages/admin/UrediEvent';
import ObrisiEvent from './pages/admin/ObrisiEvent';
import PregledUlaznica from './pages/admin/PregledUlaznica';
import PonistiUlaznicu from './pages/admin/PonistiUlaznicu';
import PregledKomentara from './pages/admin/PregledKomentara';
import PregledKategorija from './pages/admin/PregledKategorija';
import DodajKategoriju from './pages/admin/DodajKategoriju';
import UrediKategoriju from './pages/admin/UrediKategoriju';
import ObrisiKategoriju from './pages/admin/ObrisiKategoriju';
import PregledUposlenici from './pages/admin/PregledUposlenici';
import DodajUposlenici from './pages/admin/DodajUposlenici';
import UrediUposlenika from './pages/admin/UrediUposlenika';
import ObrisiUposlenika from './pages/admin/ObrisiUposlenika';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
  
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          sifra: password
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
  
      if (data.token) {
        const decoded = jwtDecode(data.token);
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', decoded.id);
        localStorage.setItem('username', decoded.username);
        localStorage.setItem('uloga', decoded.uloga);
        localStorage.setItem('email', decoded.email);
  
        navigate('/home');
      } else {
        throw new Error('Token not found in response');
      }
    } catch (error) {
      setError(error.message || 'Došlo je do greške pri prijavi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {isRegistering ? (
          <RegisterForm 
            onBack={() => setIsRegistering(false)}
            onSuccess={() => {
              setIsRegistering(false);
              setError('');
            }}
            onError={(err) => setError(err)}
          />
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center">
              <h1 className="text-2xl font-bold text-white">Event Manager</h1>
              <p className="text-indigo-100 mt-1">Prijavite se na svoj račun</p>
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

              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email adresa
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Lozinka
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="••••••••"
                      required
                      minLength="6"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Zapamti me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Zaboravili ste lozinku?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Prijavljivanje...
                    </>
                  ) : (
                    <>
                      <FiLogIn className="mr-2" />
                      Prijavi se
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="px-6 pb-6 text-center">
              <p className="text-sm text-gray-600">
                Nemate račun?{' '}
                <button 
                  onClick={() => setIsRegistering(true)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Registrirajte se
                </button>
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const RegisterForm = ({ onBack, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Lozinke se ne podudaraju');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/korisnici', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          sifra: formData.password,
          uloga: 'korisnik' // Uvijek postavljamo ulogu na 'korisnik'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registracija nije uspjela');
      }

      onSuccess();
    } catch (error) {
      setError(error.message);
      onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-center">
        <h1 className="text-2xl font-bold text-white">Event Manager</h1>
        <p className="text-indigo-100 mt-1">Kreirajte novi račun</p>
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

        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email adresa
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Korisničko ime
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Vaše korisničko ime"
                required
                minLength="3"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Lozinka
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
                required
                minLength="6"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Potvrdi lozinku
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="••••••••"
                required
                minLength="6"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Nazad na prijavu
          </button>
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registracija...
              </>
            ) : (
              <>
                <FiUserPlus className="mr-2" />
                Registriraj se
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/eventi" element={<Eventi />} />
        <Route path="/MojeUlaznice" element={<MojeUlaznice />} />
        <Route path="/MojiKomentari" element={<MojiKomentari />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/DodajEvent" element={<DodajEvent/>} />
        <Route path="/UrediEvent" element={<UrediEvent/>} />
        <Route path="/ObrisiEvent" element={<ObrisiEvent/>} />
        <Route path="/PregledUlaznica" element={<PregledUlaznica/>} />
        <Route path="/PonistiUlaznicu" element={<PonistiUlaznicu/>} />
        <Route path="/PregledKomentara" element={<PregledKomentara/>} />
        <Route path="/PregledKategorija" element={<PregledKategorija/>} />
        <Route path="/DodajKategoriju" element={<DodajKategoriju/>} />
        <Route path="/UrediKategoriju" element={<UrediKategoriju/>} />
        <Route path="/ObrisiKategoriju" element={<ObrisiKategoriju/>} />
        <Route path="/PregledUposlenici" element={<PregledUposlenici/>} />
        <Route path="/DodajUposlenici" element={<DodajUposlenici/>} />
        <Route path="/UrediUposlenika" element={<UrediUposlenika/>} />
        <Route path="/ObrisiUposlenika" element={<ObrisiUposlenika/>} />
      </Routes>
    </Router>
  );
}

export default App;