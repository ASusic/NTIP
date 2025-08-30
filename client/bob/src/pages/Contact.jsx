import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const Contact = () => {
  const locations = [
    {
      name: "Izačić - Sjedište",
      address: "Izačić bb, 77240 Izačić",
      phone: "+387 37 393 095",
      email: "izacic@bobgradnja.ba",
      hours: "Pon-Pet: 07:00 - 17:00, Sub: 07:00 - 13:00"
    },
    {
      name: "Kamenica",
      address: "Kamenica 23, 77206 Kamenica",
      phone: "+387 37 393 096",
      email: "kamenica@bobgradnja.ba",
      hours: "Pon-Pet: 07:00 - 16:00, Sub: 07:00 - 12:00"
    },
    {
      name: "Pritoka",
      address: "Pritoka 15, 77000 Pritoka",
      phone: "+387 37 393 097",
      email: "pritoka@bobgradnja.ba",
      hours: "Pon-Pet: 07:00 - 16:00, Sub: 07:00 - 12:00"
    }
  ];

  const contactImages = [
    
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 bg-[url('/images/firma.png')] bg-cover bg-center bg-no-repeat"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white"
          >
            Kontaktirajte <span className="text-green-400">Nas</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-300"
          >
            Tu smo da odgovorimo na sva vaša pitanja i pomognemo u realizaciji vaših projekata
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg inline-block mb-6">
                <h2 className="text-3xl font-bold">Pošaljite Poruku</h2>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Ime i prezime*</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email adresa*</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Broj telefona</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Tema*</label>
                  <select 
                    id="subject" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    required
                  >
                    <option value="">Odaberite temu</option>
                    <option value="pricing">Cijene i ponude</option>
                    <option value="delivery">Dostava</option>
                    <option value="products">Proizvodi</option>
                    <option value="cooperation">Saradnja</option>
                    <option value="other">Ostalo</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Poruka*</label>
                  <textarea 
                    id="message" 
                    rows="5" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    required
                  ></textarea>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg"
                >
                  Pošalji Poruku
                </motion.button>
              </form>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg inline-block mb-6">
                <h2 className="text-3xl font-bold">Kontakt Informacije</h2>
              </div>
              
              
              
              {/* Locations */}
              <div className="space-y-8">
                {locations.map((location, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-green-500" /> {location.name}
                    </h3>
                    <div className="space-y-3">
                      <p className="flex items-start gap-3 text-gray-700">
                        <FaMapMarkerAlt className="text-green-500 mt-1 flex-shrink-0" />
                        <span>{location.address}</span>
                      </p>
                      <p className="flex items-center gap-3 text-gray-700">
                        <FaPhone className="text-green-500" />
                        <a href={`tel:${location.phone.replace(/\s/g, '')}`} className="hover:text-green-600 transition-colors">
                          {location.phone}
                        </a>
                      </p>
                      <p className="flex items-center gap-3 text-gray-700">
                        <FaEnvelope className="text-green-500" />
                        <a href={`mailto:${location.email}`} className="hover:text-green-600 transition-colors">
                          {location.email}
                        </a>
                      </p>
                      <p className="flex items-center gap-3 text-gray-700">
                        <FaClock className="text-green-500" />
                        <span>{location.hours}</span>
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Social Media */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="mt-10 bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4">Pratite Nas</h3>
                <div className="flex gap-4">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-xl transition-all"
                  >
                    <FaFacebook />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-tr from-purple-500 to-pink-500 hover:to-yellow-500 text-white rounded-full flex items-center justify-center text-xl transition-all"
                  >
                    <FaInstagram />
                  </a>
                  <a 
                    href="https://linkedin.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center text-xl transition-all"
                  >
                    <FaLinkedin />
                  </a>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Gdje Se Nalazimo</h2>
            <div className="w-24 h-1 bg-green-500 mx-auto"></div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-xl overflow-hidden shadow-2xl h-[500px]"
          >
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2831.571024092871!2d15.926817011893352!3d44.78955017807812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47613f003b7ead81%3A0xaa95b07f756f0c96!2sBOB%20PRITOKA!5e0!3m2!1sen!2sba!4v1749425096501!5m2!1sen!2sba" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              title="BOB Gradnja Lokacija"
            ></iframe>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Često Postavljana Pitanja</h2>
            <div className="w-24 h-1 bg-green-500 mx-auto"></div>
          </motion.div>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: "Koje građevinske materijale nudite?",
                answer: "Nudimo kompletnu paletu građevinskih materijala uključujući cement, gips, žbuke, ljepila, hidroizolacije, armaturu, drvene i metalne proizvode, te sve ostalo što vam je potrebno za izgradnju."
              },
              {
                question: "Da li vršite dostavu?",
                answer: "Da, imamo vlastiti transport i vršimo dostavu u cijeloj regioni. Dostava se obavlja u roku od 24 sata za većinu proizvoda."
              },
              {
                question: "Koje su vaše metode plaćanja?",
                answer: "Prihvatamo gotovinu, kartična plaćanja, bankovne transfere te možemo ponuditi i odloženo plaćanje za redovne kupce."
              },
              {
                question: "Da li nudite stručne savjete?",
                answer: "Naš tim stručnjaka je uvijek na raspolaganju da vam pruži besplatne savjete o izboru materijala i najboljim praksama za vaš projekat."
              },
              {
                question: "Kako mogu postati vaš partner?",
                answer: "Kontaktirajte naš odjel za saradnju putem kontakt forme ili direktno na email partner@bobgradnja.ba. Rado ćemo razgovarati o mogućnostima partnerstva."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
              >
                <button className="w-full flex justify-between items-center p-6 text-left focus:outline-none">
                  <h3 className="text-xl font-bold text-gray-800">{item.question}</h3>
                  <svg className="w-6 h-6 text-green-500 transition-transform transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="px-6 pb-6 pt-0 text-gray-600">
                  {item.answer}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Imate dodatna pitanja?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Naš tim je uvijek tu da vam pomogne. Kontaktirajte nas bilo kojim od ponuđenih načina.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="tel:+38737393095"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                <FaPhone /> Pozovite Nas
              </a>
              <a
                href="mailto:info@bobgradnja.ba"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-lg text-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                <FaEnvelope /> Pošaljite Email
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;