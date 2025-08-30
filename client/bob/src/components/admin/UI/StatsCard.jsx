import { ArrowUp, ArrowDown } from 'lucide-react';

const StatsCard = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-lg h-12 w-12 flex items-center justify-center`}>
          <Icon className="text-white" />
        </div>
      </div>
      <div className={`mt-4 flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? (
          <ArrowUp className="w-4 h-4 mr-1" />
        ) : (
          <ArrowDown className="w-4 h-4 mr-1" />
        )}
        <span className="text-sm font-medium">
          {Math.abs(change)}% {isPositive ? 'povećanje' : 'smanjenje'} u odnosu na prošli period
        </span>
      </div>
    </div>
  );
};

export default StatsCard;