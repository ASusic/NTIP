import { Link } from 'react-router-dom';
import { FaTruck, FaShieldAlt, FaBolt, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

const HomePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="bg-gray-50 overflow-hidden">
      {}
      <section className="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-32 px-6">
        <div className="absolute inset-0 bg-[url('/images/construction-pattern.png')] opacity-10"></div>
        <div className="container mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Premium <span className="text-green-400">Građevinski Materijali</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto"
          >
            Kvalitetni materijali za vaš dom po najboljim cijenama na tržištu
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              to="/proizvodi"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-lg font-medium flex items-center justify-center gap-2 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Istražite proizvode <FaArrowRight />
            </Link>
            <Link
              to="/kontakt"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg text-lg font-medium transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              Kontaktirajte nas
            </Link>
          </motion.div>
        </div>
      </section>

      {/* */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-xl hover:bg-white hover:shadow-xl transition-all"
            >
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <FaTruck className="text-4xl text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Brza Dostava</h3>
              <p className="text-gray-600">Dostava u roku od 24h za sve narudžbe unutar 50km</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-xl hover:bg-white hover:shadow-xl transition-all"
            >
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <FaShieldAlt className="text-4xl text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Garancija Kvaliteta</h3>
              <p className="text-gray-600">Svi proizvodi sa certifikatom kvaliteta i 5-godišnjom garancijom</p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col items-center text-center p-8 bg-gray-50 rounded-xl hover:bg-white hover:shadow-xl transition-all"
            >
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <FaBolt className="text-4xl text-green-600" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Stručno Savjetovanje</h3>
              <p className="text-gray-600">Besplatno savjetovanje s našim certificiranim stručnjacima</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Izdvojeni Proizvodi</h2>
            <div className="w-24 h-1 bg-green-500 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Naši najkvalitetniji proizvodi koje naš tim preporučuje za vaš sljedeći projekt
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-4 h-full">
                <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
                <div className="space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
