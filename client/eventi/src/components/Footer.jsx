import { motion } from 'framer-motion';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope,
  FaTicketAlt
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    { title: "O nama", url: "/about" },
    { title: "Kontakt", url: "/contact" },
    { title: "Uslovi korištenja", url: "/terms" },
    { title: "Politika privatnosti", url: "/privacy" },
    { title: "Česta pitanja", url: "/faq" },
    { title: "Karijere", url: "/careers" }
  ];

  const socialLinks = [
    { icon: <FaFacebook />, url: "https://facebook.com" },
    { icon: <FaInstagram />, url: "https://instagram.com" },
    { icon: <FaTwitter />, url: "https://twitter.com" }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-800 to-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-4">
              <FaTicketAlt className="text-2xl text-indigo-400 mr-2" />
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                Eventim
              </h3>
            </div>
            <p className="text-gray-400 mb-4">
              Vodeća platforma za prodaju ulaznica na najbolje događaje u regionu. 
              Vaša ulaznica za nezaboravne trenutke.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-indigo-400 text-xl transition-colors"
                  whileHover={{ y: -3 }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6 text-white relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-indigo-500">
              Brzi linkovi
            </h4>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                >
                  <a 
                    href={link.url} 
                    className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center"
                  >
                    <span className="w-1 h-1 bg-indigo-400 rounded-full mr-2"></span>
                    {link.title}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6 text-white relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-indigo-500">
              Kontaktirajte nas
            </h4>
            <address className="not-italic space-y-4">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-indigo-400 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-400">Trg Djece Sarajeva 1, Sarajevo 71000, BiH</p>
              </div>
              <div className="flex items-center">
                <FaPhone className="text-indigo-400 mr-3" />
                <a href="tel:+38733123456" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  +387 33 123 456
                </a>
              </div>
              <div className="flex items-center">
                <FaEnvelope className="text-indigo-400 mr-3" />
                <a href="mailto:info@eventim.ba" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  info@eventim.ba
                </a>
              </div>
            </address>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6 text-white relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-indigo-500">
              Newsletter
            </h4>
            <p className="text-gray-400 mb-4">
              Prijavite se na naš newsletter i budite u toku sa najnovijim događajima.
            </p>
            <form className="flex flex-col space-y-3">
              <input 
                type="email" 
                placeholder="Vaša email adresa" 
                className="px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <motion.button
                type="submit"
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Prijavi se
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 mt-12 pt-6 text-center"
        >
          <p className="text-gray-500">
            &copy; {currentYear} Eventim. Sva prava zadržana. | 
            <a href="#" className="hover:text-indigo-400 ml-2 transition-colors">Terms</a> | 
            <a href="#" className="hover:text-indigo-400 ml-2 transition-colors">Privacy</a>
          </p>
          <p className="text-gray-600 text-sm mt-2">
            Designed with ❤️ for event lovers
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;