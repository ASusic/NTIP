const Badge = ({ status }) => {
  const statusStyles = {
    'u obradi': 'bg-yellow-100 text-yellow-800',
    'poslato': 'bg-blue-100 text-blue-800',
    'dostavljeno': 'bg-green-100 text-green-800',
    'otkazano': 'bg-red-100 text-red-800',
    'plaćeno': 'bg-green-100 text-green-800',
    'na čekanju': 'bg-yellow-100 text-yellow-800',
    'neuspjelo': 'bg-red-100 text-red-800',
    'dostupno': 'bg-green-100 text-green-800',
    'nedostupno': 'bg-red-100 text-red-800',
    'fizičko lice': 'bg-blue-100 text-blue-800',
    'pravno lice': 'bg-purple-100 text-purple-800',
    'administrator': 'bg-green-100 text-green-800'
  };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

export default Badge;