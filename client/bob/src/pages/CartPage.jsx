import { useState, useEffect } from 'react';
import {
    FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowLeft,
    FaMoneyBillWave, FaTruck, FaCreditCard, FaLock, FaCheck,
    FaUser, FaMapMarkerAlt, FaInfoCircle, FaReceipt
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [shippingMethod, setShippingMethod] = useState('standard');
    const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [cardDetails, setCardDetails] = useState({
        number: '',
        name: '',
        expiry: '',
        cvv: ''
    });
    const [showCardForm, setShowCardForm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                setIsLoggedIn(token !== null);

                if (token) {
                    setUser({
                        id: localStorage.getItem('id'),
                        ime: localStorage.getItem('ime'),
                        prezime: localStorage.getItem('prezime'),
                        email: localStorage.getItem('email'),
                        tip_korisnika: localStorage.getItem('tip_korisnika')
                    });
                }

                const savedCart = sessionStorage.getItem('cart');
                if (savedCart) {
                    const cart = JSON.parse(savedCart);

                    const productsResponse = await fetch('http://localhost:3000/artikli');
                    if (!productsResponse.ok) throw new Error('Failed to fetch products');
                    const productsData = await productsResponse.json();
                    setProducts(productsData);

                    const enrichedCart = cart.map(item => {
                        const product = productsData.find(p => p.id === item.id);
                        return {
                            ...item,
                            image: product?.slika_url || 'placeholder-product.jpg'
                        };
                    });

                    setCartItems(enrichedCart);
                }
            } catch (error) {
                console.error('Error loading data:', error);
                toast.error('Došlo je do greške pri učitavanju podataka');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (cartItems.length > 0) {
            sessionStorage.setItem('cart', JSON.stringify(cartItems));
        } else {
            sessionStorage.removeItem('cart');
        }
    }, [cartItems]);

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const freeShippingThreshold = 200;
    const shippingCost = subtotal >= freeShippingThreshold ? 0 : (
        shippingMethod === 'express' ? 15 : 10
    );
    const tax = subtotal * 0.17;
    const total = subtotal + shippingCost + tax;

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;

        setCartItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
        toast.success('Količina ažurirana');
    };

    const removeItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
        toast.success('Proizvod uklonjen iz korpe');
    };

    const handleCardChange = (e) => {
        const { name, value } = e.target;

        if (name === 'number') {
            const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
            setCardDetails(prev => ({
                ...prev,
                [name]: formattedValue
            }));
            return;
        }

        if (name === 'expiry' && value.length === 2 && !value.includes('/')) {
            setCardDetails(prev => ({
                ...prev,
                [name]: value + '/'
            }));
            return;
        }

        setCardDetails(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const createTransaction = async (narudzba_id, iznos, paymentMethod) => {
        try {
            const transactionData = {
                narudzba_id,
                iznos,
                status: paymentMethod === 'cash_on_delivery' ? 'na cekanju' : 'placeno',
                datum_transakcije: new Date().toISOString(),
            };

            console.log("Sending transaction data:", transactionData);

            const response = await fetch('http://localhost:3000/transakcije', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(transactionData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response:', errorText);
                throw new Error('Failed to create transaction');
            }

            const data = await response.json();
            return data;

        } catch (error) {
            console.error('Error creating transaction:', error);
            throw error;
        }
    };




    const createOrderItems = async (narudzba_id) => {
        try {
            const promises = cartItems.map(async (item) => {
                const response = await fetch('http://localhost:3000/narudzbe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        narudzba_id,
                        artikal_id: item.id,
                        kolicina: item.quantity,
                        cijena_po_komadu: item.price
                    })
                });
                if (!response.ok) throw new Error('Failed to create order item');
                return response.json();
            });

            await Promise.all(promises);
        } catch (error) {
            console.error('Error creating order items:', error);
            throw error;
        }
    };

    const handleCheckout = async () => {
        if (!isLoggedIn) {
            toast.error('Morate biti prijavljeni da biste nastavili na plaćanje');
            navigate('/prijava');
            return;
        }

        if (cartItems.length === 0) {
            toast.error('Vaša korpa je prazna');
            return;
        }

        if (paymentMethod === 'credit_card' && (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv)) {
            toast.error('Molimo unesite sve podatke o kartici');
            return;
        }

        if (!deliveryAddress) {
            toast.error('Molimo unesite adresu dostave');
            return;
        }

        try {
            const requiredFields = {
                korisnik_id: parseInt(user.id),
                datum_narudzbe: new Date().toISOString(),
                ukupna_cijena: parseFloat(total.toFixed(2)),
                status: 'u obradi',
                nacin_placanja: paymentMethod === 'credit_card' ? 'kartica' : 'pouzece',
                tip_dostave: shippingMethod === 'express' ? 'brza' : 'standardna',
                adresa_dostave: deliveryAddress.trim()
            };

            // Validate no fields are empty/null
            for (const [key, value] of Object.entries(requiredFields)) {
                if (value === undefined || value === null || value === '') {
                    throw new Error(`Polje ${key} je obavezno!`);
                }
            }

            console.log('Validated payload:', JSON.stringify(requiredFields, null, 2));

            const orderResponse = await fetch('http://localhost:3000/narudzbe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(requiredFields)
            });


            if (!orderResponse.ok) {
                const errorData = await orderResponse.json();
                console.log('Error details from server:', errorData);
                throw new Error(errorData.message || 'Failed to create order');
            }

            const orderResult = await orderResponse.json();
            console.log('Order created successfully:', orderResult);

            // Create order items
            await Promise.all(cartItems.map(async (item) => {
                const orderItemResponse = await fetch('http://localhost:3000/stavkenarudzbe', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        narudzba_id: orderResult.id,
                        artikl_id: item.id,
                        kolicina: item.quantity,
                        cijena_po_komadu: item.price
                    })
                });

                if (!orderItemResponse.ok) {
                    const errorText = await orderItemResponse.text();
                    console.error('Error creating order item:', errorText);
                    throw new Error('Failed to create order item');
                }
            }));

            // Create transaction
            const transactionResponse = await fetch('http://localhost:3000/transakcije', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    narudzba_id: orderResult.id,
                    iznos: total,
                    status: paymentMethod === 'cash_on_delivery' ? 'na cekanju' : 'placeno',
                    datum: new Date().toISOString()
                })
            });

            if (!transactionResponse.ok) {
                throw new Error('Failed to create transaction');
            }

            if (paymentMethod === 'credit_card') {
                toast.loading('Obrada plaćanja...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            toast.success('Narudžba uspješno kreirana!');

            // Clear cart and reset form
            setCartItems([]);
            sessionStorage.removeItem('cart');
            setDeliveryAddress('');
            setCardDetails({
                number: '',
                name: '',
                expiry: '',
                cvv: ''
            });

            navigate('/proizvodi');
        } catch (error) {
            console.error('Error during checkout:', error);
            toast.error(error.message || 'Došlo je do greške pri kreiranju narudžbe');
        }
    };

    const continueShopping = () => {
        navigate('/proizvodi');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
                        <div className="animate-pulse space-y-6">
                            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-24 h-24 bg-gray-200 rounded"></div>
                                    <div className="flex-grow space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    </div>
                                </div>
                            ))}
                            <div className="h-12 bg-gray-200 rounded w-full mt-8"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={continueShopping}
                            className="flex items-center gap-2 text-green-600 hover:text-green-700"
                        >
                            <FaArrowLeft />
                            <span>Nastavi sa kupovinom</span>
                        </button>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <FaShoppingCart />
                            <span>Vaša Korpa</span>
                        </h1>
                        <div className="w-24"></div>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="bg-white rounded-xl shadow p-8 text-center">
                            <div className="text-5xl text-gray-300 mb-4">
                                <FaShoppingCart />
                            </div>
                            <h3 className="text-xl font-medium mb-2">Vaša korpa je prazna</h3>
                            <p className="text-gray-600 mb-6">Dodajte proizvode u korpu kako biste nastavili</p>
                            <button
                                onClick={continueShopping}
                                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                Pregledaj proizvode
                            </button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                <div className="bg-white rounded-xl shadow overflow-hidden">
                                    <div className="divide-y divide-gray-200">
                                        {cartItems.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                className="p-4 flex gap-4"
                                            >
                                                <div className="w-24 h-24 flex-shrink-0">
                                                    <img
                                                        src={`/images/${item.image}`}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover rounded-lg"
                                                        onError={(e) => {
                                                            e.target.src = '/images/placeholder-product.jpg';
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between">
                                                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                                                        <button
                                                            onClick={() => removeItem(item.id)}
                                                            className="text-gray-400 hover:text-red-500"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                    <p className="text-gray-600 mb-2">{item.price} KM</p>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="p-1 text-gray-500 hover:text-green-600"
                                                        >
                                                            <FaMinus />
                                                        </button>
                                                        <span className="w-8 text-center">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="p-1 text-gray-500 hover:text-green-600"
                                                        >
                                                            <FaPlus />
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="text-right font-medium">
                                                    {(item.price * item.quantity).toFixed(2)} KM
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow mt-6 p-6">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-green-500" />
                                        <span>Adresa dostave</span>
                                    </h3>
                                    <textarea
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        placeholder="Unesite kompletnu adresu za dostavu"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div className="bg-white rounded-xl shadow mt-6 p-6">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <FaTruck className="text-green-500" />
                                        <span>Način dostave</span>
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                id="standard-shipping"
                                                name="shipping"
                                                value="standard"
                                                checked={shippingMethod === 'standard'}
                                                onChange={() => setShippingMethod('standard')}
                                                className="h-4 w-4 text-green-600 focus:ring-green-500"
                                            />
                                            <label htmlFor="standard-shipping" className="flex-grow">
                                                <div className="font-medium">Standardna dostava</div>
                                                <div className="text-sm text-gray-500">3-5 radnih dana</div>
                                            </label>
                                            <span className={`font-medium ${subtotal >= freeShippingThreshold ? 'text-green-500' : ''}`}>
                                                {subtotal >= freeShippingThreshold ? 'Besplatno' : '10 KM'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                id="express-shipping"
                                                name="shipping"
                                                value="express"
                                                checked={shippingMethod === 'express'}
                                                onChange={() => setShippingMethod('express')}
                                                className="h-4 w-4 text-green-600 focus:ring-green-500"
                                            />
                                            <label htmlFor="express-shipping" className="flex-grow">
                                                <div className="font-medium">Ekspresna dostava</div>
                                                <div className="text-sm text-gray-500">1-2 radna dana</div>
                                            </label>
                                            <span className={`font-medium ${subtotal >= freeShippingThreshold ? 'text-green-500' : ''}`}>
                                                {subtotal >= freeShippingThreshold ? 'Besplatno' : '15 KM'}
                                            </span>
                                        </div>
                                        {subtotal >= freeShippingThreshold && (
                                            <div className="text-green-500 text-sm flex items-center gap-1">
                                                <FaCheck />
                                                <span>Besplatna dostava za narudžbe preko {freeShippingThreshold} KM</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow mt-6 p-6">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <FaCreditCard className="text-green-500" />
                                        <span>Način plaćanja</span>
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                id="cash-on-delivery"
                                                name="payment"
                                                value="cash_on_delivery"
                                                checked={paymentMethod === 'cash_on_delivery'}
                                                onChange={() => {
                                                    setPaymentMethod('cash_on_delivery');
                                                    setShowCardForm(false);
                                                }}
                                                className="h-4 w-4 text-green-600 focus:ring-green-500"
                                            />
                                            <label htmlFor="cash-on-delivery" className="font-medium">
                                                Pouzećem
                                            </label>
                                        </div>
                                        {user?.tip_korisnika === 'firma' && (
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    id="bank-transfer"
                                                    name="payment"
                                                    value="bank_transfer"
                                                    checked={paymentMethod === 'bank_transfer'}
                                                    onChange={() => {
                                                        setPaymentMethod('bank_transfer');
                                                        setShowCardForm(false);
                                                    }}
                                                    className="h-4 w-4 text-green-600 focus:ring-green-500"
                                                />
                                                <label htmlFor="bank-transfer" className="font-medium">
                                                    Žiralno (samo za firme)
                                                </label>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                id="credit-card"
                                                name="payment"
                                                value="credit_card"
                                                checked={paymentMethod === 'credit_card'}
                                                onChange={() => {
                                                    setPaymentMethod('credit_card');
                                                    setShowCardForm(true);
                                                }}
                                                className="h-4 w-4 text-green-600 focus:ring-green-500"
                                            />
                                            <label htmlFor="credit-card" className="font-medium">
                                                Kreditna kartica
                                            </label>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {showCardForm && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="mt-4 overflow-hidden"
                                            >
                                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Broj kartice
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="number"
                                                            value={cardDetails.number}
                                                            onChange={handleCardChange}
                                                            placeholder="1234 5678 9012 3456"
                                                            maxLength={19}
                                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        />
                                                    </div>
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Ime na kartici
                                                        </label>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            value={cardDetails.name}
                                                            onChange={handleCardChange}
                                                            placeholder="Ime Prezime"
                                                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                Datum isteka
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="expiry"
                                                                value={cardDetails.expiry}
                                                                onChange={handleCardChange}
                                                                placeholder="MM/YY"
                                                                maxLength={5}
                                                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                                CVV
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="cvv"
                                                                value={cardDetails.cvv}
                                                                onChange={handleCardChange}
                                                                placeholder="123"
                                                                maxLength={3}
                                                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="mt-3 flex items-center text-sm text-gray-500">
                                                        <FaInfoCircle className="mr-1" />
                                                        <span>Sigurnosni kod sa poleđine kartice</span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <div className="md:col-span-1">
                                <div className="bg-white rounded-xl shadow p-6 sticky top-4">
                                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                        <FaMoneyBillWave className="text-green-500" />
                                        <span>Sažetak narudžbe</span>
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Međusuma:</span>
                                            <span>{subtotal.toFixed(2)} KM</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Dostava:</span>
                                            <span className={shippingCost === 0 ? 'text-green-500' : ''}>
                                                {shippingCost === 0 ? 'Besplatno' : `${shippingCost.toFixed(2)} KM`}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">PDV (17%):</span>
                                            <span>{tax.toFixed(2)} KM</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between font-bold text-lg">
                                            <span>Ukupno:</span>
                                            <span>{total.toFixed(2)} KM</span>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                            <FaUser className="text-green-500" />
                                            <span>Podaci o kupcu</span>
                                        </h3>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <div>{user?.ime} {user?.prezime}</div>
                                            <div>{user?.email}</div>
                                            {user?.tip_korisnika === 'firma' && (
                                                <div className="text-green-500">Firma</div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                                            <FaReceipt className="text-green-500" />
                                            <span>Transakcija</span>
                                        </h3>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <div>Status: {paymentMethod === 'cash_on_delivery' ? 'Na čekanju' : 'Plaćeno'}</div>
                                            <div>Način: {
                                                paymentMethod === 'cash_on_delivery' ? 'Pouzećem' :
                                                    paymentMethod === 'bank_transfer' ? 'Žiralno' :
                                                        'Kreditna kartica'
                                            }</div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        className="w-full mt-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaLock />
                                        <span>Nastavi na plaćanje</span>
                                    </button>

                                    <div className="mt-4 text-sm text-gray-500">
                                        Vaši lični podaci će biti korišteni za procesuiranje narudžbe, poboljšanje vašeg iskustva
                                        korištenja web stranice i za druge svrhe opisane u našoj Politici privatnosti.
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartPage;