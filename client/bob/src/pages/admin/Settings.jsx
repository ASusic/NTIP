import { useState } from 'react';
import { Save, Mail, Phone, MapPin, CreditCard, Truck } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    email: 'info@bob.ba',
    phone: '+38733222333',
    address: 'Bihac, Pritoka 12',
    paymentMethods: ['pouzeće', 'kartica'],
    deliveryOptions: ['standardna', 'brza'],
    workingHours: '08:00 - 16:00'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const updatedMethods = checked 
        ? [...settings.paymentMethods, value]
        : settings.paymentMethods.filter(method => method !== value);
      
      setSettings(prev => ({
        ...prev,
        paymentMethods: updatedMethods
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  return (
    <div className="ml-64 pt-16 p-6">
      <h1 className="text-2xl font-bold mb-6">Podešavanja sistema</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <Mail className="w-5 h-5 mr-2 text-gray-600" />
            Kontakt informacije
          </h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input
              type="tel"
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresa</label>
            <input
              type="text"
              name="address"
              value={settings.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <CreditCard className="w-5 h-5 mr-2 text-gray-600" />
            Načini plaćanja
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="paymentMethods"
                value="pouzeće"
                checked={settings.paymentMethods.includes('pouzeće')}
                onChange={handleChange}
                className="h-4 w-4 text-[#22C55E] focus:ring-[#22C55E] border-gray-300 rounded"
              />
              <span className="text-gray-700">Pouzeće</span>
            </label>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="paymentMethods"
                value="kartica"
                checked={settings.paymentMethods.includes('kartica')}
                onChange={handleChange}
                className="h-4 w-4 text-[#22C55E] focus:ring-[#22C55E] border-gray-300 rounded"
              />
              <span className="text-gray-700">Kartica</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <Truck className="w-5 h-5 mr-2 text-gray-600" />
            Opcije dostave
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Standardna dostava</label>
              <input
                type="text"
                name="standardDelivery"
                value="3-5 radnih dana"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brza dostava</label>
              <input
                type="text"
                name="expressDelivery"
                value="1-2 radna dana"
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center px-4 py-2 bg-[#22C55E] text-white rounded-lg hover:bg-green-600">
          <Save className="w-5 h-5 mr-2" />
          Sačuvaj promjene
        </button>
      </div>
    </div>
  );
};

export default Settings;