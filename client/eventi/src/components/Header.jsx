import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  FiHome, 
  FiCalendar, 
  FiMessageSquare, 
  FiUser, 
  FiLogOut,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiList,
  FiUsers,
  FiTag
} from 'react-icons/fi';
import { BsTicketPerforated } from 'react-icons/bs';

const Header = () => {
  const [userData, setUserData] = useState({
    uloga: localStorage.getItem('uloga'),
    username: localStorage.getItem('username')
  });
  const [activeDropdown, setActiveDropdown] = useState(null);
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

  const { uloga, username } = userData;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo and Main Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/home" className="flex items-center space-x-2" onClick={closeDropdowns}>
              <motion.span 
                className="text-2xl font-bold hover:text-indigo-200 transition-colors"
                whileHover={{ scale: 1.05 }}
              >
                Eventim
              </motion.span>
            </Link>
            
            <nav className="hidden md:flex space-x-1">
              <Link 
                to="/home" 
                className="flex items-center px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                onClick={closeDropdowns}
              >
                <FiHome className="mr-2" />
                Početna
              </Link>

              {/* Events Link - Regular users */}
              {uloga === 'korisnik' && (
                <Link 
                  to="/eventi" 
                  className="flex items-center px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={closeDropdowns}
                >
                  <FiCalendar className="mr-2" />
                  Događaji
                </Link>
              )}

              {/* Events Dropdown - Admin */}
              {uloga === 'admin' && (
                <div className="relative">
                  <button 
                    className={`flex items-center px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors ${activeDropdown === 'events' ? 'bg-indigo-700' : ''}`}
                    onClick={() => toggleDropdown('events')}
                  >
                    <FiCalendar className="mr-2" />
                    Događaji
                  </button>
                  {activeDropdown === 'events' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-1 z-50"
                    >
                      <Link
                        to="/eventi"
                        className="block px-4 py-2 hover:bg-indigo-50 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <FiList className="mr-2" />
                        Pregled svih
                      </Link>
                      <Link
                        to="/DodajEvent"
                        className="block px-4 py-2 hover:bg-indigo-50 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <FiPlus className="mr-2" />
                        Dodaj događaj
                      </Link>
                      <Link
                        to="/UrediEvent"
                        className="block px-4 py-2 hover:bg-indigo-50 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <FiEdit className="mr-2" />
                        Uredi događaje
                      </Link>
                      <Link
                        to="/ObrisiEvent"
                        className="block px-4 py-2 hover:bg-indigo-50 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <FiTrash2 className="mr-2" />
                        Izbriši događaje
                      </Link>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Tickets Link - Regular users */}
              {uloga === 'korisnik' && (
                <Link 
                  to="/MojeUlaznice" 
                  className="flex items-center px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={closeDropdowns}
                >
                  <BsTicketPerforated className="mr-2" />
                  Moje ulaznice
                </Link>
              )}

              {/* Tickets Dropdown - Admin */}
              {uloga === 'admin' && (
                <div className="relative">
                  <button 
                    className={`flex items-center px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors ${activeDropdown === 'tickets' ? 'bg-indigo-700' : ''}`}
                    onClick={() => toggleDropdown('tickets')}
                  >
                    <BsTicketPerforated className="mr-2" />
                    Ulaznice
                  </button>
                  {activeDropdown === 'tickets' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-1 z-50"
                    >
                      <Link
                        to="/PregledUlaznica"
                        className="block px-4 py-2 hover:bg-indigo-50 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <FiList className="mr-2" />
                        Pregled svih
                      </Link>
                      <Link
                        to="/PonistiUlaznicu"
                        className="block px-4 py-2 hover:bg-indigo-50 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <FiTrash2 className="mr-2" />
                        Poništi ulaznice
                      </Link>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Comments Link - Regular users */}
              {uloga === 'korisnik' && (
                <Link 
                  to="/MojiKomentari" 
                  className="flex items-center px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  onClick={closeDropdowns}
                >
                  <FiMessageSquare className="mr-2" />
                  Moji komentari
                </Link>
              )}

              {/* Comments Dropdown - Admin */}
              {uloga === 'admin' && (
                <div className="relative">
                  <button 
                    className={`flex items-center px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors ${activeDropdown === 'comments' ? 'bg-indigo-700' : ''}`}
                    onClick={() => toggleDropdown('comments')}
                  >
                    <FiMessageSquare className="mr-2" />
                    Komentari
                  </button>
                  {activeDropdown === 'comments' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-1 z-50"
                    >
                      <Link
                        to="/PregledKomentara"
                        className="block px-4 py-2 hover:bg-indigo-50 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <FiList className="mr-2" />
                        Pregled svih
                      </Link>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Categories Dropdown - Admin only */}
              {uloga === 'admin' && (
                <div className="relative">
                  <button 
                    className={`flex items-center px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors ${activeDropdown === 'categories' ? 'bg-indigo-700' : ''}`}
                    onClick={() => toggleDropdown('categories')}
                  >
                    <FiTag className="mr-2" />
                    Kategorije
                  </button>
                  {activeDropdown === 'categories' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-1 z-50"
                    >
                      <Link
                        to="/PregledKategorija"
                        className="block px-4 py-2 hover:bg-indigo-50 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <FiList className="mr-2" />
                        Pregled svih
                      </Link>
                      <Link
                        to="/DodajKategoriju"
                        className="block px-4 py-2 hover:bg-indigo-50 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <FiPlus className="mr-2" />
                        Dodaj kategoriju
                      </Link>
                      <Link
                        to="/UrediKategoriju"
                        className="block px-4 py-2 hover:bg-indigo-50 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <FiEdit className="mr-2" />
                        Uredi kategorije
                      </Link>
                      <Link
                        to="/ObrisiKategoriju"
                        className="block px-4 py-2 hover:bg-indigo-50 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <FiTrash2 className="mr-2" />
                        Izbriši kategorije
                      </Link>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Employees Dropdown - Admin only */}
              {uloga === 'admin' && (
                <div className="relative">
                  <button 
                    className={`flex items-center px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors ${activeDropdown === 'employees' ? 'bg-indigo-700' : ''}`}
                    onClick={() => toggleDropdown('employees')}
                  >
                    <FiUsers className="mr-2" />
                    Uposlenici
                  </button>
                  {activeDropdown === 'employees' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute left-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl py-1 z-50"
                    >
                      <Link
                        to="/PregledUposlenici"
                        className="block px-4 py-2 hover:bg-indigo-50 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <FiList className="mr-2" />
                        Pregled svih
                      </Link>
                      <Link
                        to="/DodajUposlenici"
                        className="block px-4 py-2 hover:bg-indigo-50 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <FiPlus className="mr-2" />
                        Dodaj uposlenika
                      </Link>
                      <Link
                        to="/UrediUposlenika"
                        className="block px-4 py-2 hover:bg-indigo-50 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <FiEdit className="mr-2" />
                        Uredi uposlenike
                      </Link>
                      <Link
                        to="/ObrisiUposlenika"
                        className="block px-4 py-2 hover:bg-indigo-50 flex items-center"
                        onClick={closeDropdowns}
                      >
                        <FiTrash2 className="mr-2" />
                        Izbriši uposlenike
                      </Link>
                    </motion.div>
                  )}
                </div>
              )}
            </nav>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {username ? (
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="hidden md:flex items-center space-x-2 bg-indigo-700 px-4 py-2 rounded-full">
                  <FiUser className="text-indigo-200" />
                  <span className="font-medium">Dobrodošli, {username}</span>
                </div>
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiLogOut />
                  <span>Odjava</span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Link 
                  to="/login" 
                  className="flex items-center space-x-2 bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
                >
                  <FiUser />
                  <span>Prijava</span>
                </Link>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex justify-around pt-3 mt-3 border-t border-indigo-500">
          <Link to="/home" className="p-2 rounded-full hover:bg-indigo-700 transition-colors">
            <FiHome className="w-5 h-5" />
          </Link>
          <Link to="/eventi" className="p-2 rounded-full hover:bg-indigo-700 transition-colors">
            <FiCalendar className="w-5 h-5" />
          </Link>
          {uloga === 'korisnik' && (
            <>
              <Link to="/MojeUlaznice" className="p-2 rounded-full hover:bg-indigo-700 transition-colors">
                <BsTicketPerforated className="w-5 h-5" />
              </Link>
              <Link to="/MojiKomentari" className="p-2 rounded-full hover:bg-indigo-700 transition-colors">
                <FiMessageSquare className="w-5 h-5" />
              </Link>
            </>
          )}
          {uloga === 'admin' && (
            <>
              <Link to="/kategorije" className="p-2 rounded-full hover:bg-indigo-700 transition-colors">
                <FiTag className="w-5 h-5" />
              </Link>
              <Link to="/uposlenici" className="p-2 rounded-full hover:bg-indigo-700 transition-colors">
                <FiUsers className="w-5 h-5" />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;