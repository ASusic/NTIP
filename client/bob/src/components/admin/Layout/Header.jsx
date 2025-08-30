import { Bell, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
  return (
    <header className="bg-white shadow-sm fixed top-0 right-0 left-64 h-16 flex items-center justify-between px-6 z-10">
      {/* Pretraga */}
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Pretraži..."
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
        />
      </div>

      {/* Desna strana - notifikacije i profil */}
      <div className="flex items-center space-x-4">
        {/* Notifikacije */}
        <button className="p-2 rounded-full hover:bg-gray-100 relative">
          <Bell className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Profil korisnika */}
        <div className="flex items-center space-x-2">
          <Link to="/admin/settings">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-medium">A</span>
            </div>
          </Link>
          <div>
            <p className="text-sm font-medium">Admin</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;