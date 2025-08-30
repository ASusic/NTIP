import { FaBuilding, FaUsers, FaAward, FaMapMarkerAlt, FaPhone, FaClock, FaTruck, FaChartLine, FaHandshake } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const About = () => {
  const stats = [
    { value: "15+", label: "Godina iskustva", icon: <FaBuilding /> },
    { value: "50+", label: "Zaposlenih", icon: <FaUsers /> },
    { value: "1000+", label: "Projekata", icon: <FaAward /> },
    { value: "500+", label: "Partnera", icon: <FaHandshake /> },
    { value: "24/7", label: "Dostava", icon: <FaTruck /> },
    { value: "99%", label: "Zadovoljnih klijenata", icon: <FaChartLine /> }
  ];

  const galleryImages = [ 
    "/images/aso.png",
    "/images/firma2.png",
    "/images/aso2.png",
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section with Parallax Effect */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
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
            <span className="text-green-400">BOB</span> Gradnja
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-gray-300"
          >
            Vodeći dobavljač građevinskih materijala u regiji sa tradicijom od 1995. godine
          </motion.p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Gallery Slider */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2 rounded-xl overflow-hidden shadow-2xl"
            >
              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={30}
                slidesPerView={1}
                autoplay={{ delay: 5000 }}
                pagination={{ clickable: true }}
                loop={true}
                className="h-[500px]"
              >
                {galleryImages.map((img, index) => (
                  <SwiperSlide key={index}>
                    <img 
                      src={img} 
                      alt={`Gallery ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg inline-block mb-6">
                <h2 className="text-3xl font-bold">Naša Priča</h2>
              </div>
              
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                BOB d.o.o. osnovan 2005. godine u Izačiću, razvio se u vodećeg distributera građevinskih materijala 
                u Hercegovini. Sa tri lokacije (Izačić, Kamenica i Pritoka), nudimo kompletnu paletu proizvoda 
                za građevinarstvo.
              </p>
              
              <p className="text-gray-700 mb-8 text-lg leading-relaxed">
                Naša misija je pružiti najkvalitetnije materijale uz stručno savjetovanje i brzu dostavu. 
                Kroz godine smo izgradili povjerenje brojnih klijenata i partnera, postavljajući nove standarde 
                u građevinskoj industriji.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow text-center"
                  >
                    <div className="text-green-500 text-3xl mb-2 flex justify-center">
                      <div className="bg-green-100 p-3 rounded-full">
                        {stat.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
                    <p className="text-gray-600">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Naš Put</h2>
            <div className="w-24 h-1 bg-green-500 mx-auto"></div>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden md:block absolute left-1/2 h-full w-1 bg-green-500 transform -translate-x-1/2"></div>
            
            {/* Timeline items */}
            <div className="space-y-12 md:space-y-0">
              {[
                {
                  year: "1995",
                  title: "Osnivanje",
                  description: "Osnovan BOB d.o.o. u Izačiću sa malim asortimanom proizvoda"
                },
                {
                  year: "2000",
                  title: "Prva ekspanzija",
                  description: "Otvaranje druge lokacije na Kamenici i proširenje asortimana"
                },
                {
                  year: "2015",
                  title: "Modernizacija",
                  description: "Uvođenje moderne logistike i IT sistema za upravljanje zalihama"
                },
                {
                  year: "2020",
                  title: "Digitalna transformacija",
                  description: "Pokretanje online prodaje i implementacija CRM sistema"
                },
                {
                  year: "2023",
                  title: "Nova lokacija",
                  description: "Otvaranje treće poslovnice u Pritoci"
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative flex flex-col md:flex-row ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}
                >
                  <div className="md:w-1/2 p-6">
                    <div className={`bg-white p-8 rounded-xl shadow-lg ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                      <div className="text-green-500 font-bold text-lg mb-2">{item.year}</div>
                      <h3 className="text-2xl font-bold mb-3 text-gray-800">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex md:w-1/2 justify-center">
                    <div className="w-16 h-16 rounded-full bg-green-500 border-4 border-white flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="md:hidden w-full flex justify-center my-4">
                    <div className="w-12 h-12 rounded-full bg-green-500 border-4 border-white flex items-center justify-center text-white font-bold shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Naš Tim</h2>
            <div className="w-24 h-1 bg-green-500 mx-auto"></div>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Upoznajte naš tim stručnjaka koji stoji iza uspjeha BOB d.o.o.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Ahmedin Sušić",
                position: "Direktor",
                
              },
              
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="h-64 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-4xl text-white font-bold">
                  {member.name.charAt(0)}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-gray-800">{member.name}</h3>
                  <p className="text-green-600 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Spremni za saradnju?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Kontaktirajte naš tim danas i dobijte personalizovanu ponudu za vaš projekat
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/kontakt"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                Kontaktirajte nas
              </a>
              <a
                href="tel:+38737393095"
                className="bg-transparent border-2 border-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-lg text-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl"
              >
                <FaPhone /> +387 37 393 095
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;