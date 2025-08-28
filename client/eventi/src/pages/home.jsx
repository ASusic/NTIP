import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  FiSearch, 
  FiShoppingCart, 
  FiShield, 
  FiCalendar, 
  FiCreditCard, 
  FiMail, 
  FiSmartphone 
} from 'react-icons/fi';
import { BsTicketPerforated } from 'react-icons/bs';

const Home = () => {
  const features = [
    {
      icon: <FiSearch className="w-8 h-8 text-indigo-500" />,
      title: "Širok izbor događaja",
      description: "Pregledajte stotine događaja iz različitih kategorija i pronađite nešto što odgovara vašim interesovanjima."
    },
    {
      icon: <FiShoppingCart className="w-8 h-8 text-indigo-500" />,
      title: "Jednostavna kupovina",
      description: "Kupite ulaznice u samo nekoliko klikova. Brzo, jednostavno i sigurno."
    },
    {
      icon: <FiShield className="w-8 h-8 text-indigo-500" />,
      title: "Sigurna platforma",
      description: "Naša platforma koristi najnovije sigurnosne tehnologije kako bismo zaštitili vaše podatke."
    }
  ];

  const steps = [
    { icon: <FiSearch className="w-6 h-6" />, text: "Pronađite događaj koji vas interesuje" },
    { icon: <BsTicketPerforated className="w-6 h-6" />, text: "Odaberite broj i kategoriju ulaznica" },
    { icon: <FiCreditCard className="w-6 h-6" />, text: "Izvršite plaćanje sigurnim metodama" },
    { icon: <FiMail className="w-6 h-6" />, text: "Dobijete elektronske ulaznice na email" },
    { icon: <FiSmartphone className="w-6 h-6" />, text: "Ponesite ulaznice na događaj (printane ili na mobilnom)" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Doživite <span className="text-indigo-200">nezaboravne</span> trenutke
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-indigo-100">
                Vaša ulaznica za najbolje događaje u regionu. Koncerti, sport, pozorište i još mnogo toga.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Istražite događaje
              </motion.button>
            </motion.div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white transform skew-y-1 origin-top-left"></div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Zašto izabrati <span className="text-indigo-600">Eventim</span>?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Naša platforma nudi najbolje iskustvo za kupovinu ulaznica
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-gray-50 p-8 rounded-xl hover:bg-white border border-gray-100 hover:border-indigo-100 transition-all hover:shadow-lg"
                >
                  <div className="flex justify-center mb-6">
                    <div className="bg-indigo-100 p-4 rounded-full">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-3 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-indigo-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-4">
                Kako funkcioniše?
              </h2>
              <p className="text-lg text-indigo-600 max-w-2xl mx-auto">
                Kupovina ulaznica u samo 5 jednostavnih koraka
              </p>
            </motion.div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute left-6 top-0 h-full w-0.5 bg-indigo-200 transform -translate-x-1/2"></div>
                
                <div className="space-y-10">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="relative pl-16"
                    >
                      <div className="absolute left-6 top-0 h-12 w-12 rounded-full bg-indigo-100 border-4 border-white flex items-center justify-center text-indigo-600 transform -translate-x-1/2">
                        <span className="font-bold text-indigo-700">{index + 1}</span>
                      </div>
                      <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <div className="mr-4 text-indigo-500">
                            {step.icon}
                          </div>
                          <p className="text-lg font-medium text-gray-800">
                            {step.text}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;