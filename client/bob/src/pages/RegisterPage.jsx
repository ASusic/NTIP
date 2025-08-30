import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [ime, setIme] = useState('');
  const [prezime, setPrezime] = useState('');
  const [email, setEmail] = useState('');
  const [telefon, setTelefon] = useState('');
  const [adresa, setAdresa] = useState('');
  const [password, setPassword] = useState('');
  const [tipKorisnika, setTipKorisnika] = useState('fizicko');
  const [nazivFirme, setNazivFirme] = useState('');
  const [pib, setPib] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/korisnici', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ime,
          prezime,
          email,
          telefon,
          adresa,
          lozinka_hash: password,
          tip_korisnika: tipKorisnika,
          naziv_firme: tipKorisnika === 'pravno' ? nazivFirme : '',
          pib: tipKorisnika === 'pravno' ? pib : '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registracija nije uspjela');
      }

      setSuccess('Registracija uspješna! Preusmjeravanje...');
      setTimeout(() => navigate('/prijava'), 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4"
    >
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h2 className="text-3xl font-bold text-gray-800">Registracija</h2>
            <p className="text-gray-600 mt-2">Kreirajte svoj nalog</p>
          </motion.div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg text-sm"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-3 bg-green-50 text-green-700 rounded-lg text-sm"
          >
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Ime" value={ime} onChange={setIme} />
          <Input label="Prezime" value={prezime} onChange={setPrezime} />
          <Input label="Email" value={email} type="email" onChange={setEmail} />
          <Input label="Telefon" value={telefon} onChange={setTelefon} />
          <Input label="Adresa" value={adresa} onChange={setAdresa} />
          <Input label="Lozinka" value={password} type="password" onChange={setPassword} />

          {/* Tip korisnika */}
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tip korisnika</label>
            <select
              value={tipKorisnika}
              onChange={(e) => setTipKorisnika(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="fizicko">Fizičko lice</option>
              <option value="pravno">Pravno lice</option>
            </select>
          </motion.div>

          {}
          {tipKorisnika === 'pravno' && (
            <>
              <Input label="Naziv firme" value={nazivFirme} onChange={setNazivFirme} />
              <Input label="PIB" value={pib} onChange={setPib} />
            </>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
          >
            {isLoading ? 'Registracija...' : 'Registruj se'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};


const Input = ({ label, value, onChange, type = 'text' }) => (
  <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      required
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
    />
  </motion.div>
);

export default RegisterPage;
