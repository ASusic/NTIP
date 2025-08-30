import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBuilding, FaIdCard, FaCalendarAlt } from 'react-icons/fa';

const ProfileCard = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          ...decoded,
          telefon: localStorage.getItem('telefon'),
          adresa: localStorage.getItem('adresa'),
          tip_korisnika: localStorage.getItem('tip_korisnika'),
          naziv_firme: localStorage.getItem('naziv_firme') || 'Nije navedeno',
          pib: localStorage.getItem('pib') || 'Nije navedeno',
          datum_registracije: localStorage.getItem('datum_registracije')
        });
      } catch (error) {
        console.error('Error decoding token:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold text-gray-700">Niste prijavljeni</h2>
        <p className="mt-2 text-gray-600">Molimo prijavite se da biste vidjeli svoj profil</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto my-8 p-6"
    >
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-blue-500 text-4xl font-bold mb-4 md:mb-0 md:mr-6">
              {user.ime ? user.ime.charAt(0) : 'K'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user.ime} {user.prezime}</h1>
              <p className="text-blue-100">{user.tip_korisnika === 'fizicko' ? 'Fizičko lice' : 'Pravno lice'}</p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Lični podaci</h2>
            
            <div className="flex items-start">
              <FaUser className="text-blue-500 mt-1 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Ime i prezime</p>
                <p className="font-medium">{user.ime} {user.prezime}</p>
              </div>
            </div>

            <div className="flex items-start">
              <FaEnvelope className="text-blue-500 mt-1 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start">
              <FaPhone className="text-blue-500 mt-1 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Telefon</p>
                <p className="font-medium">{user.telefon || 'Nije navedeno'}</p>
              </div>
            </div>

            <div className="flex items-start">
              <FaMapMarkerAlt className="text-blue-500 mt-1 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Adresa</p>
                <p className="font-medium">{user.adresa || 'Nije navedeno'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Poslovni podaci</h2>
            
            <div className="flex items-start">
              <FaBuilding className="text-blue-500 mt-1 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Naziv firme</p>
                <p className="font-medium">{user.naziv_firme}</p>
              </div>
            </div>

            <div className="flex items-start">
              <FaIdCard className="text-blue-500 mt-1 mr-3" />
              <div>
                <p className="text-sm text-gray-500">PIB</p>
                <p className="font-medium">{user.pib}</p>
              </div>
            </div>

            <div className="flex items-start">
              <FaCalendarAlt className="text-blue-500 mt-1 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Datum registracije</p>
                <p className="font-medium">
                  {new Date(user.datum_registracije).toLocaleDateString('sr-RS')}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <FaUser className="text-blue-500 mt-1 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Tip korisnika</p>
                <p className="font-medium">
                  {user.tip_korisnika === 'fizicko' ? 'Fizičko lice' : 'Pravno lice'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            Uredi profil
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;