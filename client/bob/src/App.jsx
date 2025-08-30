import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfileCard from './pages/ProfileCard';
import ProtectedRoute from './components/ProtectedRoute';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Kategorije from './pages/Kategorije';
import MojeNarudzbe from './pages/MojeNarudzbe';
import Sidebar from './components/admin/Layout/Sidebar';
import AdminHeader from './components/admin/Layout/Header';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import Orders from './pages/admin/Orders';
import Users from './pages/admin/Users';
import Statistics from './pages/admin/Statistics';
import Transactions from './pages/admin/Transactions';
import Settings from './pages/admin/Settings';

const AdminLayout = ({ children, sidebarOpen, setSidebarOpen }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-40 ${sidebarOpen ? 'block' : 'hidden'}`} 
            onClick={() => setSidebarOpen(false)}></div>
        <div className={`fixed inset-y-0 left-0 w-64 z-50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition duration-300 ease-in-out`}>
          <Sidebar setSidebarOpen={setSidebarOpen} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 fixed h-full">
          <Sidebar />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-40 lg:hidden bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-600"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="text-lg font-semibold">Admin Panel</div>
            <div className="w-6"></div>
          </div>
        </div>
        
        {/* Admin header */}
        <AdminHeader />

        {/* Main content area */}
        <main className="flex-1 pb-8 px-4 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <Routes>
        {/* Admin rute */}
        <Route path="/admin" element={
          <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            <Dashboard />
          </AdminLayout>
        } />
        <Route path="/admin/products" element={
          <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            <Products />
          </AdminLayout>
        } />
        <Route path="/admin/categories" element={
          <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            <Categories />
          </AdminLayout>
        } />
        <Route path="/admin/orders" element={
          <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            <Orders />
          </AdminLayout>
        } />
        <Route path="/admin/users" element={
          <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            <Users />
          </AdminLayout>
        } />
        <Route path="/admin/statistics" element={
          <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            <Statistics />
          </AdminLayout>
        } />
        <Route path="/admin/transactions" element={
          <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            <Transactions />
          </AdminLayout>
        } />
        <Route path="/admin/settings" element={
          <AdminLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
            <Settings />
          </AdminLayout>
        } />

        {/* Standardne korisničke rute */}
        <Route path="/" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-[#F5F5F5]">
              <HomePage />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/prijava" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-[#F5F5F5]">
              <LoginPage />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/registracija" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-[#F5F5F5]">
              <RegisterPage />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/proizvodi" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-[#F5F5F5]">
              <ProductPage />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/o-nama" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-[#F5F5F5]">
              <About />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/kontakt" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-[#F5F5F5]">
              <Contact />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/kategorije" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-[#F5F5F5]">
              <Kategorije />
            </main>
            <Footer />
          </div>
        } />
        <Route path="/moj-profil" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-[#F5F5F5]">
              <ProtectedRoute>
                <ProfileCard />
              </ProtectedRoute>
            </main>
            <Footer />
          </div>
        } />
        <Route path="/korpa" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-[#F5F5F5]">
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            </main>
            <Footer />
          </div>
        } />
        <Route path="/moje-narudzbe" element={
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-[#F5F5F5]">
              <ProtectedRoute>
                <MojeNarudzbe />
              </ProtectedRoute>
            </main>
            <Footer />
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;