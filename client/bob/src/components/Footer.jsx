import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* O kompaniji */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 text-green-500 flex items-center">
              <span className="bg-green-500/10 p-1 rounded mr-2">
                <FaMapMarkerAlt className="text-green-500" />
              </span>
              BOB d.o.o.
            </h3>
            <p className="mb-4">
              BOB d.o.o. nudi širok asortiman građevinskog materijala i opreme za vaše građevinske projekte.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <FaTwitter className="text-xl" />
              </a>
            </div>
          </motion.div>

          {/* Lokacije */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 text-green-500">Naše lokacije</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-white">Izačić</h4>
                <p className="text-sm">Izačić bb</p>
                <p className="text-sm flex items-center mt-1">
                  <FaPhone className="mr-2 text-green-500" /> +387 37 393 095
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white">Kamenica</h4>
                <p className="text-sm">Plješevička bb</p>
                <p className="text-sm flex items-center mt-1">
                  <FaPhone className="mr-2 text-green-500" /> +387 37 388 818
                </p>
              </div>
              <div>
                <h4 className="font-medium text-white">Pritoka</h4>
                <p className="text-sm">Pritoka bb</p>
              </div>
            </div>
          </motion.div>

          {/* Brzi linkovi */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 text-green-500">Linkovi</h3>
            <ul className="space-y-2">
              <li>
                <a href="/proizvodi" className="hover:text-green-500 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                  Proizvodi
                </a>
              </li>
              <li>
                <a href="/kategorije" className="hover:text-green-500 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                  Kategorije
                </a>
              </li>
              <li>
                <a href="/o-nama" className="hover:text-green-500 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                  O nama
                </a>
              </li>
              <li>
                <a href="/uslovi" className="hover:text-green-500 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                  Uslovi kupovine
                </a>
              </li>
              <li>
                <a href="/kontakt" className="hover:text-green-500 transition-colors flex items-center">
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-2"></span>
                  Kontakt
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 text-green-500">Newsletter</h3>
            <p className="mb-3">Prijavite se za najnovije ponude i akcije:</p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Vaš email" 
                className="px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-green-500 text-white"
                required
              />
              <button 
                type="submit" 
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded transition-colors shadow hover:shadow-md"
              >
                Prijavi se
              </button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 pt-6 text-center text-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© {currentYear} BOB d.o.o. Sva prava zadržana.</p>
            <div className="mt-3 md:mt-0">
              <a href="http://bob.ba" className="hover:text-green-500 transition-colors mr-4">bob.ba</a>
              <a href="mailto:info@bob.ba" className="hover:text-green-500 transition-colors mr-4">info@bob.ba</a>
              <a href="mailto:bob.doo@bih.net.ba" className="hover:text-green-500 transition-colors">bob.doo@bih.net.ba</a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;