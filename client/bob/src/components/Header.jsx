import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaSearch, FaSignOutAlt, FaBoxOpen, FaUserCircle } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [user, setUser] = useState(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const userDropdownRef = useRef(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwtDecode(token);
          setUser(decoded);
        } catch {
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkAuth();

    const handleUserLoggedIn = () => checkAuth();
    const handleUserLoggedOut = () => checkAuth();

    window.addEventListener('userLoggedIn', handleUserLoggedIn);
    window.addEventListener('userLoggedOut', handleUserLoggedOut);

    return () => {
      window.removeEventListener('userLoggedIn', handleUserLoggedIn);
      window.removeEventListener('userLoggedOut', handleUserLoggedOut);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setShowUserDropdown(false);
    window.dispatchEvent(new Event('userLoggedOut'));
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/proizvodi?pretraga=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowSearch(false);
      setIsMobileMenuOpen(false);
    }
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const cartItemCount = 0;

  return (
    <header className="bg-gray-900 text-white shadow-lg sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <button
              className="md:hidden text-xl focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
            <Link to="/" className="text-2xl font-bold flex items-center group">
              <span className="text-green-500 group-hover:text-green-400 transition-colors">Bob</span>&nbsp;
              <span className="hidden sm:inline text-gray-300 group-hover:text-white transition-colors">d.o.o.</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {/* korisnici */}
            {!user || user?.tip_korisnika !== "admin" ? (
              ['/', '/proizvodi', '/kategorije', '/o-nama', '/kontakt'].map((path, idx) => (
                <Link
                  key={idx}
                  to={path}
                  className="hover:text-green-400 transition-colors font-medium relative group"
                >
                  {['Početna', 'Proizvodi', 'Kategorije', 'O nama', 'Kontakt'][idx]}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300" />
                </Link>
              ))
            ) : (
              <Link
                to="/"
                className="hover:text-green-400 transition-colors font-medium relative group"
              >
                Početna
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300" />
              </Link>
            )}
            
            {user?.tip_korisnika === "admin" && (
              <>
                <Link
                  to="/kategorije"
                  className="hover:text-green-400 transition-colors font-medium relative group"
                >
                  Kategorije
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  to="/admin/orders"
                  className="hover:text-green-400 transition-colors font-medium relative group"
                >
                  Narudžbe
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  to="/admin/transactions"
                  className="hover:text-green-400 transition-colors font-medium relative group"
                >
                  Transakcije
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  to="/admin/statistics"
                  className="hover:text-green-400 transition-colors font-medium relative group"
                >
                  Statistika
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300" />
                </Link>
              </>
            )}

            {user && (
              <Link
                to="/moje-narudzbe"
                className="hover:text-green-400 transition-colors font-medium relative group"
              >
                <div className="flex items-center">
                  <FaBoxOpen className="mr-1" />
                  <span>Moje narudžbe</span>
                </div>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300" />
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-6">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="hover:text-green-400 transition-colors"
              aria-label="Pretraži"
            >
              <FaSearch className="text-lg" />
            </button>

            <Link
              to="/korpa"
              className="relative hover:text-green-400 transition-colors"
              aria-label="Korpa"
            >
              <FaShoppingCart className="text-xl" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="hidden md:flex items-center space-x-4 relative">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center space-x-2 hover:text-green-400 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                    {user.ime ? (
                      <span className="font-medium text-sm">
                        {user.ime.charAt(0).toUpperCase()}
                      </span>
                    ) : (
                      <FaUserCircle className="text-xl" />
                    )}
                  </div>
                  <span className="hidden lg:inline">Dobrodošao, {user.ime}</span>
                </button>
                
                {showUserDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    ref={userDropdownRef}
                    className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50"
                  >
                    <Link
                      to="/moj-profil"
                      className="block px-4 py-2 text-sm hover:bg-gray-700"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <div className="flex items-center">
                        <FaUserCircle className="mr-2" />
                        Moj profil
                      </div>
                    </Link>
                    <Link
                      to="/moje-narudzbe"
                      className="block px-4 py-2 text-sm hover:bg-gray-700"
                      onClick={() => setShowUserDropdown(false)}
                    >
                      <div className="flex items-center">
                        <FaBoxOpen className="mr-2" />
                        Moje narudžbe
                      </div>
                    </Link>
                    {user?.tip_korisnika === "admin" && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm hover:bg-gray-700"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        <div className="flex items-center">
                          <FaUserCircle className="mr-2" />
                          Admin Panel
                        </div>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-700 text-red-400"
                    >
                      <div className="flex items-center">
                        <FaSignOutAlt className="mr-2" />
                        Odjava
                      </div>
                    </button>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link
                  to="/prijava"
                  className="hover:text-green-400 transition-colors flex items-center"
                >
                  <FaUser className="mr-1" />
                  <span className="hidden lg:inline">Prijava</span>
                </Link>
                <Link
                  to="/registracija"
                  className="bg-green-600 hover:bg-green-500 px-4 py-1.5 rounded-md transition-colors shadow hover:shadow-md"
                >
                  Registracija
                </Link>
              </div>
            )}
          </div>
        </div>

        {showSearch && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            ref={searchRef}
            className="py-3"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pretraži proizvode..."
                className="w-full bg-gray-800 text-white px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400"
              >
                <FaSearch />
              </button>
            </form>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-gray-800 overflow-hidden"
          >
            <div className="px-4 py-3">
              <form onSubmit={handleSearch} className="mb-4 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pretraži proizvode..."
                  className="w-full bg-gray-700 text-white px-4 py-2 pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400"
                >
                  <FaSearch />
                </button>
              </form>

              <ul className="space-y-3">
                {/* Show regular navigation only for non-admin users */}
                {!user || user?.tip_korisnika !== "admin" ? (
                  ['Početna', 'Proizvodi', 'Kategorije', 'O nama', 'Kontakt'].map((label, idx) => (
                    <li key={label}>
                      <Link
                        to={['/', '/proizvodi', '/kategorije', '/o-nama', '/kontakt'][idx]}
                        className="block py-2 hover:text-green-400 transition-colors border-b border-gray-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {label}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <Link
                      to="/"
                      className="block py-2 hover:text-green-400 transition-colors border-b border-gray-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Početna
                    </Link>
                  </li>
                )}

                {user?.tip_korisnika === "admin" && (
                  <>
                    <li>
                      <Link
                        to="/admin/kategorije"
                        className="block py-2 hover:text-green-400 transition-colors border-b border-gray-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Kategorije
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/narudzbe"
                        className="block py-2 hover:text-green-400 transition-colors border-b border-gray-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Narudžbe
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/transakcije"
                        className="block py-2 hover:text-green-400 transition-colors border-b border-gray-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Transakcije
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/statistika"
                        className="block py-2 hover:text-green-400 transition-colors border-b border-gray-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Statistika
                      </Link>
                    </li>
                  </>
                )}

                {user && (
                  <li>
                    <Link
                      to="/moje-narudzbe"
                      className="block py-2 hover:text-green-400 transition-colors border-b border-gray-700 flex items-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaBoxOpen className="mr-2" />
                      Moje narudžbe
                    </Link>
                  </li>
                )}

                {user ? (
                  <>
                    <li>
                      <Link
                        to="/moj-profil"
                        className="block py-2 hover:text-green-400 transition-colors border-b border-gray-700 flex items-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FaUserCircle className="mr-2" />
                        Moj profil
                      </Link>
                    </li>
                    {user?.tip_korisnika === "admin" && (
                      <li>
                        <Link
                          to="/dashboard"
                          className="block py-2 hover:text-green-400 transition-colors border-b border-gray-700 flex items-center"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <FaUserCircle className="mr-2" />
                          Admin Panel
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 py-2 text-red-400 hover:text-red-300 transition-colors w-full"
                      >
                        <FaSignOutAlt />
                        <span>Odjava</span>
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/prijava"
                        className="block py-2 hover:text-green-400 transition-colors border-b border-gray-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Prijava
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/registracija"
                        className="block py-2 hover:text-green-400 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Registracija
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;