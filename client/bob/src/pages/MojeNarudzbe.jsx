import { useState, useEffect } from 'react';
import {
    FaShoppingBag, FaCalendarAlt, FaMoneyBillWave, FaTruck, FaCheckCircle,
    FaTimesCircle, FaSpinner, FaSearch, FaFilter, FaPrint, FaFilePdf,
    FaPhone, FaMapMarkerAlt, FaBuilding
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/bs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MojeNarudzbe = () => {
    const [orders, setOrders] = useState([]);
    const [articles, setArticles] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('sve');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    toast.error('Morate biti prijavljeni da biste vidjeli narudžbe');
                    navigate('/prijava');
                    return;
                }

                const ordersResponse = await fetch('http://localhost:3000/narudzbe', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!ordersResponse.ok) throw new Error('Greška pri učitavanju narudžbi');

                const ordersData = await ordersResponse.json();
                const userId = localStorage.getItem('id');
                const userOrders = ordersData.filter(order => order.korisnik_id == userId);

                const itemsResponse = await fetch('http://localhost:3000/stavkenarudzbe', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!itemsResponse.ok) throw new Error('Greška pri učitavanju stavki narudžbi');

                const itemsData = await itemsResponse.json();
                const articleIds = [...new Set(itemsData.map(item => item.artikl_id))];

                const articlesPromises = articleIds.map(async (id) => {
                    const articleResponse = await fetch(`http://localhost:3000/artikli/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (articleResponse.ok) {
                        return articleResponse.json();
                    }
                    return null;
                });

                const articlesData = await Promise.all(articlesPromises);
                const articlesMap = {};
                articlesData.forEach(article => {
                    if (article) {
                        articlesMap[article.id] = article;
                    }
                });

                setArticles(articlesMap);

                const ordersWithItems = userOrders.map((order) => {
                    const orderItems = itemsData.filter(item => item.narudzba_id === order.id);
                    const totalItems = orderItems.reduce((sum, item) => sum + item.kolicina, 0);

                    return {
                        ...order,
                        stavke: orderItems.map(item => ({
                            ...item,
                            artikal: articlesMap[item.artikl_id] || null
                        })),
                        broj_proizvoda: totalItems
                    };
                });

                setOrders(ordersWithItems);
            } catch (error) {
                console.error('Error fetching orders:', error);
                toast.error(error.message || 'Došlo je do greške pri učitavanju narudžbi');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.id.toString().includes(searchTerm.toLowerCase()) ||
            order.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.nacin_placanja.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'sve' || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'u obradi': return 'bg-blue-100 text-blue-800';
            case 'poslano': return 'bg-purple-100 text-purple-800';
            case 'dostavljeno': return 'bg-green-100 text-green-800';
            case 'otkazano': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'u obradi': return <FaSpinner className="animate-spin" />;
            case 'poslano': return <FaTruck />;
            case 'dostavljeno': return <FaCheckCircle />;
            case 'otkazano': return <FaTimesCircle />;
            default: return <FaShoppingBag />;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString || dateString === 0) return 'Nepoznat datum';
        return moment(dateString).format('DD.MM.YYYY HH:mm');
    };

    const formatCurrency = (amount) => parseFloat(amount).toFixed(2) + ' KM';

    const generatePDF = (order) => {
        try {
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm'
            });

            doc.addFont('helvetica', 'Helvetica', 'normal');
            doc.setFont('Helvetica');

            doc.setFontSize(16);
            doc.setTextColor(34, 197, 94);
            doc.setFont('Helvetica', 'bold');
            doc.text('BOB d.o.o.', 105, 15, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            doc.setFont('Helvetica', 'normal');
            doc.text('Gradjevinski materijal i oprema', 105, 22, { align: 'center' });
            
            doc.setFontSize(8);
            doc.text('Izacic bb, Izacic', 14, 30);
            doc.text('Tel: +387 37 393 095', 14, 35);
            
            doc.text('Pljesevicka bb, Kamenica', 105, 30, { align: 'center' });
            doc.text('Tel: +387 37 388 818', 105, 35, { align: 'center' });
            
            doc.text('Pritoka bb, Pritoka', 196, 30, { align: 'right' });
            
            doc.setDrawColor(34, 197, 94);
            doc.setLineWidth(0.5);
            doc.line(14, 40, 196, 40);
            
            doc.setFontSize(14);
            doc.text(`Narudžba #${order.id}`, 14, 50);
            
            doc.setFontSize(10);
            doc.text(`Datum: ${formatDate(order.datum_narudzbe)}`, 14, 60);
            doc.text(`Status: ${order.status}`, 14, 65);
            doc.text(`Nacin placanja: ${order.nacin_placanja === 'kartica' ? 'Kartica' :
                order.nacin_placanja === 'pouzece' ? 'Pouzece' : 'Ziralno'}`, 14, 70);
            doc.text(`Adresa dostave: ${order.adresa_dostave}`, 14, 75);
            doc.text(`Ukupna cijena: ${formatCurrency(order.ukupna_cijena)}`, 14, 80);

            const items = order.stavke?.map(item => [
                item.artikl_id,
                item.artikal?.naziv || 'Proizvod',
                item.kolicina,
                formatCurrency(item.cijena_po_komadu),
                formatCurrency(item.cijena_po_komadu * item.kolicina)
            ]) || [];

            autoTable(doc, {
                startY: 90,
                head: [['ID', 'Proizvod', 'Kolicina', 'Cijena', 'Ukupno']],
                body: items,
                theme: 'grid',
                headStyles: { 
                    fillColor: [34, 197, 94], 
                    textColor: 255,
                    fontStyle: 'bold'
                },
                styles: { 
                    cellPadding: 5, 
                    fontSize: 9,
                    halign: 'center'
                },
                columnStyles: {
                    0: { halign: 'center' },
                    1: { halign: 'left' },
                    2: { halign: 'center' },
                    3: { halign: 'right' },
                    4: { halign: 'right' }
                }
            });

            const pageCount = doc.internal.getNumberOfPages();
            for(let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(100);
                doc.text(`Strana ${i} od ${pageCount}`, 105, 285, { align: 'center' });
                doc.text('Hvala Vam na povjerenju!', 105, 290, { align: 'center' });
            }

            doc.save(`BOB_Narudzba_${order.id}.pdf`);
        } catch (error) {
            console.error('Greška pri generisanju PDF-a:', error);
            toast.error('Došlo je do greške pri generisanju PDF-a');
        }
    };

    const printOrder = (order) => {
        toast.promise(
            new Promise((resolve) => {
                generatePDF(order);
                resolve();
            }),
            {
                loading: 'Generisanje PDF-a...',
                success: `PDF za narudžbu #${order.id} je spreman!`,
                error: 'Greška pri generisanju PDF-a'
            }
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-8">
                        <div className="animate-pulse space-y-6">
                            <div className="h-10 bg-gray-200 rounded w-1/4 mb-8"></div>
                            <div className="h-12 bg-gray-200 rounded w-full"></div>
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="border-b border-gray-200 pb-6">
                                    <div className="h-6 bg-gray-200 rounded w-1/6 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                                    <div className="grid grid-cols-4 gap-4">
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                        <div className="h-4 bg-gray-200 rounded"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <FaShoppingBag className="text-green-500" />
                            <span>Moje Narudžbe</span>
                        </h1>
                        <p className="text-gray-600 mt-2">Pregled svih vaših narudžbi i njihovog statusa</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-xl shadow overflow-hidden mb-8"
                    >
                        <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row gap-4 items-start md:items-center">
                            <div className="relative flex-grow">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FaSearch className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Pretraži narudžbe..."
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full md:w-auto">
                                <FaFilter className="text-gray-400" />
                                <select
                                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="sve">Sve narudžbe</option>
                                    <option value="u obradi">U obradi</option>
                                    <option value="poslano">Poslano</option>
                                    <option value="dostavljeno">Dostavljeno</option>
                                    <option value="otkazano">Otkazano</option>
                                </select>
                            </div>
                        </div>

                        {filteredOrders.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="text-5xl text-gray-300 mb-4">
                                    <FaShoppingBag />
                                </div>
                                <h3 className="text-xl font-medium mb-2">
                                    {searchTerm || statusFilter !== 'sve' ?
                                        'Nema rezultata za vašu pretragu' :
                                        'Nemate nikakvih narudžbi'}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {searchTerm || statusFilter !== 'sve' ?
                                        'Pokušajte promijeniti kriterije pretrage' :
                                        'Kada napravite narudžbu, ona će se pojaviti ovdje'}
                                </p>
                                <button
                                    onClick={() => navigate('/proizvodi')}
                                    className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Pregledaj proizvode
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {filteredOrders.map((order) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="p-6 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                                    <span>Narudžba #{order.id}</span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)} flex items-center gap-1`}>
                                                        {getStatusIcon(order.status)}
                                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                    </span>
                                                </h3>
                                                <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                    <FaCalendarAlt />
                                                    <span>{formatDate(order.datum_narudzbe)}</span>
                                                </p>
                                            </div>
                                            <div className="flex flex-col md:items-end">
                                                <p className="text-lg font-bold">{formatCurrency(order.ukupna_cijena)}</p>
                                                <p className="text-sm text-gray-500 flex items-center gap-1">
                                                    <FaMoneyBillWave />
                                                    <span>
                                                        {order.nacin_placanja === 'kartica' ? 'Kartica' :
                                                            order.nacin_placanja === 'pouzece' ? 'Pouzeće' :
                                                                'Žiralno'}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <p className="font-medium">Način dostave</p>
                                                <p className="text-gray-600 capitalize">
                                                    {order.tip_dostave === 'brza' ? 'Brza dostava' : 'Standardna dostava'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-medium">Adresa dostave</p>
                                                <p className="text-gray-600">{order.adresa_dostave}</p>
                                            </div>
                                            <div>
                                                <p className="font-medium">Broj proizvoda</p>
                                                <p className="text-gray-600">{order.broj_proizvoda || 0}</p>
                                            </div>
                                            <div className="flex items-end gap-2">
                                                <button
                                                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                                                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                                                >
                                                    {selectedOrder?.id === order.id ? 'Sakazi detalje' : 'Prikaži detalje'}
                                                </button>
                                                <button
                                                    onClick={() => printOrder(order)}
                                                    className="text-gray-500 hover:text-gray-700 text-sm font-medium flex items-center gap-1"
                                                >
                                                    <FaFilePdf /> PDF
                                                </button>
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {selectedOrder?.id === order.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-4 overflow-hidden"
                                                >
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <h4 className="font-medium mb-3">Proizvodi u narudžbi</h4>
                                                        <div className="space-y-3">
                                                            {order.stavke?.map((item, index) => (
                                                                <div key={index} className="flex items-start gap-4 pb-3 border-b border-gray-200 last:border-0">
                                                                    <div className="w-16 h-16 bg-white border border-gray-200 rounded-lg overflow-hidden">
                                                                        <img
                                                                            src={item.artikal?.slika_url ? `/images/${item.artikal.slika_url}` : '/images/placeholder-product.jpg'}
                                                                            alt={item.artikal?.naziv || 'Proizvod'}
                                                                            className="w-full h-full object-cover"
                                                                            onError={(e) => {
                                                                                e.target.src = '/images/placeholder-product.jpg';
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="flex-grow">
                                                                        <p className="font-medium">{item.artikal?.naziv || `Proizvod ID: ${item.artikl_id}`}</p>
                                                                        {item.artikal?.opis && <p className="text-sm text-gray-500">{item.artikal.opis}</p>}
                                                                        <p className="text-sm text-gray-500 mt-1">{formatCurrency(item.cijena_po_komadu)} × {item.kolicina}</p>
                                                                    </div>
                                                                    <div className="font-medium">
                                                                        {formatCurrency(item.cijena_po_komadu * item.kolicina)}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {filteredOrders.length > 0 && (
                        <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-gray-600">
                                Prikazano {filteredOrders.length} od {orders.length} narudžbi
                            </div>
                            <div className="flex gap-2">
                               
                                <button
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                                    onClick={() => navigate('/proizvodi')}
                                >
                                    Nova narudžba
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MojeNarudzbe;