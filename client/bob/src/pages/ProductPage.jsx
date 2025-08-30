import { useState, useEffect, useRef } from 'react';
import { 
  FaSearch, FaFilter, FaShoppingCart, FaStar, FaRegStar, FaStarHalfAlt, 
  FaChevronDown, FaTimes, FaArrowLeft, FaArrowRight, FaBox, FaTruck, 
  FaMoneyBillWave, FaInfoCircle, FaHeart, FaRegHeart, FaShareAlt, FaEye
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProductsPage = () => {
  // State management
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const itemsPerPage = viewMode === 'grid' ? 12 : 6;
  const filtersRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();

  // Check if user is logged in
  const isLoggedIn = localStorage.getItem('token') !== null;
  const user = isLoggedIn ? {
    id: localStorage.getItem('id'),
    ime: localStorage.getItem('ime'),
    prezime: localStorage.getItem('prezime'),
    email: localStorage.getItem('email')
  } : null;

  // Load temporary cart from sessionStorage
  const [cart, setCart] = useState(() => {
  const saved = sessionStorage.getItem('cart');
  return saved ? JSON.parse(saved) : [];
});

  // Save temporary cart to sessionStorage
  useEffect(() => {
  sessionStorage.setItem('cart', JSON.stringify(cart));
}, [cart]);


  // Add to cart function
  const addToCart = (item) => {
  const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
  
  if (existingItemIndex >= 0) {
    const updatedCart = [...cart];
    updatedCart[existingItemIndex].quantity += item.quantity;
    setCart(updatedCart);
  } else {
    setCart([...cart, item]);
  }
};
  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('http://localhost:3000/artikli'),
          fetch('http://localhost:3000/kategorije')
        ]);

        if (!productsResponse.ok || !categoriesResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [productsData, categoriesData] = await Promise.all([
          productsResponse.json(),
          categoriesResponse.json()
        ]);

        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Došlo je do greške pri učitavanju proizvoda');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let result = [...products];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(product =>
        product.naziv.toLowerCase().includes(term) ||
        (product.opis && product.opis.toLowerCase().includes(term)) ||
        (product.sifra && product.sifra.toLowerCase().includes(term))
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      result = result.filter(product =>
        selectedCategories.includes(product.kategorija_id)
      );
    }

    // Price range filter
    result = result.filter(product =>
      product.cijena >= priceRange[0] && product.cijena <= priceRange[1]
    );

    // Sorting
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.cijena - b.cijena);
        break;
      case 'price-desc':
        result.sort((a, b) => b.cijena - a.cijena);
        break;
      case 'rating':
        result.sort((a, b) => (b.ocjena || 0) - (a.ocjena || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.datum_kreiranja) - new Date(a.datum_kreiranja));
        break;
      case 'popular':
        result.sort((a, b) => (b.broj_prodaja || 0) - (a.broj_prodaja || 0));
        break;
      default:
        break;
    }

    setFilteredProducts(result);
    setCurrentPage(1);
  }, [products, searchTerm, selectedCategories, priceRange, sortOption]);

  // Handle click outside filters and modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target)) {
        setShowFilters(false);
      }
      if (modalRef.current && !modalRef.current.contains(event.target) && showProductModal) {
        setShowProductModal(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProductModal]);

  // Toggle product in wishlist
  const toggleWishlist = (productId) => {
    setWishlist(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Add to cart handler
const handleAddToCart = (product) => {
  if (!isLoggedIn) {
    toast.error('Morate biti prijavljeni da biste dodali proizvod u korpu');
    navigate('/prijava');
    return;
  }

  if (!product.kolicina_na_stanju || quantity < 1 || quantity > product.kolicina_na_stanju) {
    toast.error('Unesite validnu količinu');
    return;
  }

  const cartItem = {
    id: product.id,
    name: product.naziv,
    price: product.cijena,
    image: product.slika_url,
    quantity: quantity
  };

  // Add to cart
  const existingItemIndex = cart.findIndex(item => item.id === product.id);
  if (existingItemIndex >= 0) {
    const updatedCart = [...cart];
    updatedCart[existingItemIndex].quantity += quantity;
    setCart(updatedCart);
  } else {
    setCart([...cart, cartItem]);
  }

  toast.success(`${quantity} x ${product.naziv} dodano u korpu`);
  setQuantity(1);
};

// Continue shopping handler
const handleContinueShopping = (product) => {
  if (!isLoggedIn) {
    toast.error('Morate biti prijavljeni da biste dodali proizvod u korpu');
    navigate('/prijava');
    return;
  }

  const cartItem = {
    id: product.id,
    name: product.naziv,
    price: product.cijena,
    image: product.slika_url,
    quantity: quantity
  };

  // Add to cart
  const existingItemIndex = cart.findIndex(item => item.id === product.id);
  if (existingItemIndex >= 0) {
    const updatedCart = [...cart];
    updatedCart[existingItemIndex].quantity += quantity;
    setCart(updatedCart);
  } else {
    setCart([...cart, cartItem]);
  }

  toast.success(`${quantity} x ${product.naziv} dodano u korpu`);
  setQuantity(1);
  closeProductModal();
};

// Go to cart handler
const handleGoToCart = () => {
  // Prvo dodaj proizvod u korpu
  if (selectedProduct) {
    const cartItem = {
      id: selectedProduct.id,
      name: selectedProduct.naziv,
      price: selectedProduct.cijena,
      image: selectedProduct.slika_url,
      quantity: quantity
    };

    // Add to cart
    const existingItemIndex = cart.findIndex(item => item.id === selectedProduct.id);
    if (existingItemIndex >= 0) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, cartItem]);
    }

    toast.success(`${quantity} x ${selectedProduct.naziv} dodano u korpu`);
  }

  // Onda redirect na korpu i zatvori modal
  navigate('/korpa');
  closeProductModal();
};
  // Toggle category filter
  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Render star rating
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return stars;
  };

  // Product modal handlers
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowProductModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    document.body.style.overflow = 'auto';
  };

  // Quantity handler
  const handleQuantityChange = (value) => {
    const numValue = parseInt(value) || 1;
    const newQuantity = Math.max(1, Math.min(selectedProduct.kolicina_na_stanju, numValue));
    setQuantity(newQuantity);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Share product
  const shareProduct = (product) => {
    if (navigator.share) {
      navigator.share({
        title: product.naziv,
        text: `Pogledajte ${product.naziv} na našoj stranici`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link kopiran u clipboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Naši Proizvodi</h1>
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'proizvod' : 'proizvoda'} pronađeno
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                aria-label="Grid view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                aria-label="List view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Pretraži proizvode..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <FaTimes className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="default">Sortiraj po</option>
                <option value="price-asc">Cijena: niža prema višoj</option>
                <option value="price-desc">Cijena: viša prema nižoj</option>
                <option value="rating">Najbolje ocijenjeno</option>
                <option value="newest">Najnovije</option>
                <option value="popular">Najprodavanije</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <FaChevronDown className="text-gray-400" />
              </div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
            >
              <FaFilter />
              <span>Filteri</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar - Mobile */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                ref={filtersRef}
                className="md:hidden fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-xl p-6 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Filteri</h2>
                  <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-700">
                    <FaTimes />
                  </button>
                </div>

                <div className="mb-8">
                  <h3 className="font-medium mb-4 text-lg">Cijena (KM)</h3>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="w-full mb-2 accent-green-500"
                    />
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full accent-green-500"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-gray-700">
                    <span className="font-medium">{priceRange[0]} KM</span>
                    <span className="font-medium">{priceRange[1]} KM</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4 text-lg">Kategorije</h3>
                  <div className="space-y-3">
                    {categories.map(category => (
                      <div key={category.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`cat-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`cat-${category.id}`} className="ml-3 text-gray-700">
                          {category.naziv}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setPriceRange([0, 1000]);
                  }}
                  className="mt-6 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Resetuj filtere
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Filters Sidebar - Desktop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="hidden md:block w-72 flex-shrink-0"
          >
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4 border border-gray-100">
              <div className="mb-8">
                <h3 className="font-medium mb-4 text-lg">Cijena (KM)</h3>
                <div className="px-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-full mb-2 accent-green-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-green-500"
                  />
                </div>
                <div className="flex justify-between mt-2 text-gray-700">
                  <span className="font-medium">{priceRange[0]} KM</span>
                  <span className="font-medium">{priceRange[1]} KM</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-4 text-lg">Kategorije</h3>
                <div className="space-y-3">
                  {categories.map(category => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`cat-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => toggleCategory(category.id)}
                        className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`cat-${category.id}`} className="ml-3 text-gray-700">
                        {category.naziv}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategories([]);
                  setPriceRange([0, 1000]);
                }}
                className="mt-6 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Resetuj filtere
              </button>
            </div>
          </motion.div>

          {/* Products List */}
          <div className="flex-1">
            {loading ? (
              <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-6"}>
                {[...Array(itemsPerPage)].map((_, i) => (
                  viewMode === 'grid' ? (
                    <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-4 space-y-3">
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  ) : (
                    <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse flex">
                      <div className="w-48 h-48 bg-gray-200"></div>
                      <div className="p-6 flex-grow space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  )
                ))}
              </div>
            ) : currentItems.length > 0 ? (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentItems.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all flex flex-col cursor-pointer relative group"
                        onClick={() => openProductModal(product)}
                      >
                        {/* Wishlist button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          className="absolute top-3 left-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
                          aria-label={wishlist.includes(product.id) ? "Ukloni iz liste želja" : "Dodaj u listu želja"}
                        >
                          {wishlist.includes(product.id) ? (
                            <FaHeart className="text-red-500" />
                          ) : (
                            <FaRegHeart className="text-gray-600 hover:text-red-500" />
                          )}
                        </button>

                        {/* Share button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            shareProduct(product);
                          }}
                          className="absolute top-3 right-3 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Podijeli proizvod"
                        >
                          <FaShareAlt className="text-gray-600 hover:text-green-500" />
                        </button>

                        {/* Product image */}
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={`/images/${product.slika_url || 'placeholder-product.jpg'}`}
                            alt={product.naziv}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = '/images/placeholder-product.jpg';
                            }}
                            loading="lazy"
                          />
                          {product.kolicina_na_stanju > 0 ? (
                            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              Na stanju
                            </span>
                          ) : (
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              Nema na stanju
                            </span>
                          )}
                        </div>

                        {/* Product info */}
                        <div className="p-4 flex-grow flex flex-col">
                          <h3 className="font-bold text-lg mb-1 text-gray-900 group-hover:text-green-600 transition-colors">{product.naziv}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {product.opis || 'Nema opisa'}
                          </p>

                          <div className="flex items-center mb-3">
                            <div className="flex mr-2">
                              {renderRating(product.ocjena)}
                            </div>
                            <span className="text-sm text-gray-500">({product.broj_recenzija || 0})</span>
                          </div>

                          <div className="mt-auto flex justify-between items-center">
                            <span className="font-bold text-xl text-gray-900">{product.cijena} KM</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openProductModal(product);
                              }}
                              disabled={product.kolicina_na_stanju <= 0}
                              className={`p-2 rounded-full transition-all shadow-md ${product.kolicina_na_stanju > 0
                                  ? 'bg-green-500 hover:bg-green-600 text-white hover:scale-110'
                                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                            >
                              <FaShoppingCart />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {currentItems.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row"
                        onClick={() => openProductModal(product)}
                      >
                        {/* Product image */}
                        <div className="relative w-full md:w-64 h-64 md:h-auto flex-shrink-0">
                          <img
                            src={`/images/${product.slika_url || 'placeholder-product.jpg'}`}
                            alt={product.naziv}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/images/placeholder-product.jpg';
                            }}
                            loading="lazy"
                          />
                          <div className="absolute top-3 left-3 flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(product.id);
                              }}
                              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                              aria-label={wishlist.includes(product.id) ? "Ukloni iz liste želja" : "Dodaj u listu želja"}
                            >
                              {wishlist.includes(product.id) ? (
                                <FaHeart className="text-red-500" />
                              ) : (
                                <FaRegHeart className="text-gray-600 hover:text-red-500" />
                              )}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                shareProduct(product);
                              }}
                              className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                              aria-label="Podijeli proizvod"
                            >
                              <FaShareAlt className="text-gray-600 hover:text-green-500" />
                            </button>
                          </div>
                          {product.kolicina_na_stanju > 0 ? (
                            <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              Na stanju
                            </span>
                          ) : (
                            <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              Nema na stanju
                            </span>
                          )}
                        </div>

                        {/* Product details */}
                        <div className="p-6 flex-grow">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-xl mb-2 text-gray-900 hover:text-green-600 transition-colors">{product.naziv}</h3>
                              <div className="flex items-center mb-4">
                                <div className="flex mr-2">
                                  {renderRating(product.ocjena)}
                                </div>
                                <span className="text-sm text-gray-500">({product.broj_recenzija || 0} recenzija)</span>
                              </div>
                            </div>
                            <span className="font-bold text-2xl text-gray-900">{product.cijena} KM</span>
                          </div>

                          <p className="text-gray-600 mb-4">
                            {product.opis || 'Nema opisa'}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                              {categories.find(c => c.id === product.kategorija_id)?.naziv || 'Nepoznato'}
                            </span>
                            {product.kolicina_na_stanju > 0 && (
                              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                Dostupno: {product.kolicina_na_stanju} kom
                              </span>
                            )}
                          </div>

                          <div className="flex gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openProductModal(product);
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                              <FaShoppingCart />
                              <span>Dodaj u korpu</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openProductModal(product);
                              }}
                              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <FaEye />
                              <span>Detalji</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="inline-flex rounded-md shadow">
                      <button
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <FaArrowLeft />
                      </button>

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => paginate(pageNum)}
                            className={`px-4 py-2 border-t border-b border-gray-300 ${currentPage === pageNum
                                ? 'bg-green-500 text-white border-green-500'
                                : 'bg-white text-gray-500 hover:bg-gray-50'
                              }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      <button
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                      >
                        <FaArrowRight />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow p-8 text-center">
                <h3 className="text-xl font-medium mb-2">Nema rezultata</h3>
                <p className="text-gray-600 mb-4">Nijedan proizvod ne odgovara vašim filterima</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategories([]);
                    setPriceRange([0, 1000]);
                    setSortOption('default');
                  }}
                  className="text-green-500 hover:text-green-600 font-medium"
                >
                  Resetuj filtere
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setShowFilters(false)}
          />
        )}
      </AnimatePresence>

      {/* Product Modal */}
      <AnimatePresence>
        {showProductModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              ref={modalRef}
              className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="relative">
                <button
                  onClick={closeProductModal}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100"
                >
                  <FaTimes className="text-gray-600" />
                </button>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative h-64 md:h-full">
                    <img
                      src={`/images/${selectedProduct.slika_url || 'placeholder-product.jpg'}`}
                      alt={selectedProduct.naziv}
                      className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                      onError={(e) => {
                        e.target.src = '/images/placeholder-product.jpg';
                      }}
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      <button
                        onClick={() => toggleWishlist(selectedProduct.id)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                        aria-label={wishlist.includes(selectedProduct.id) ? "Ukloni iz liste želja" : "Dodaj u listu želja"}
                      >
                        {wishlist.includes(selectedProduct.id) ? (
                          <FaHeart className="text-red-500" />
                        ) : (
                          <FaRegHeart className="text-gray-600" />
                        )}
                      </button>
                      <button
                        onClick={() => shareProduct(selectedProduct)}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                        aria-label="Podijeli proizvod"
                      >
                        <FaShareAlt className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2">{selectedProduct.naziv}</h2>

                    <div className="flex items-center mb-4">
                      <div className="flex mr-2">
                        {renderRating(selectedProduct.ocjena)}
                      </div>
                      <span className="text-sm text-gray-500">
                        ({selectedProduct.broj_recenzija || 0} recenzija)
                      </span>
                    </div>

                    <div className="mb-6">
                      <span className="text-3xl font-bold text-gray-900">
                        {selectedProduct.cijena} KM
                      </span>
                      {selectedProduct.kolicina_na_stanju > 0 ? (
                        <span className="ml-3 text-green-500">Na stanju</span>
                      ) : (
                        <span className="ml-3 text-red-500">Nema na stanju</span>
                      )}
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <FaInfoCircle className="mr-2 text-green-500" />
                        Opis proizvoda
                      </h3>
                      <p className="text-gray-700">
                        {selectedProduct.opis || 'Nema dostupnog opisa za ovaj proizvod.'}
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <FaBox className="mr-2 text-green-500" />
                        Specifikacije
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <span className="text-gray-600 w-32">Kategorija:</span>
                          <span className="font-medium">
                            {categories.find(c => c.id === selectedProduct.kategorija_id)?.naziv || 'Nepoznato'}
                          </span>
                        </li>
                        <li className="flex items-center">
                          <span className="text-gray-600 w-32">Dostupnost:</span>
                          <span className="font-medium">
                            {selectedProduct.kolicina_na_stanju > 0
                              ? `${selectedProduct.kolicina_na_stanju} komada`
                              : 'Nema na stanju'}
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <FaMoneyBillWave className="mr-2 text-green-500" />
                        Količina
                      </h3>
                      <div className="flex items-center">
                        <button
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= 1}
                          className="px-3 py-1 bg-gray-200 rounded-l-lg disabled:opacity-50"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={selectedProduct.kolicina_na_stanju}
                          value={quantity}
                          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                          className="w-16 text-center border-t border-b border-gray-300 py-1"
                        />
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={quantity >= selectedProduct.kolicina_na_stanju}
                          className="px-3 py-1 bg-gray-200 rounded-r-lg disabled:opacity-50"
                        >
                          +
                        </button>
                        <span className="ml-3 text-sm text-gray-500">
                          Max: {selectedProduct.kolicina_na_stanju}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <button
                        onClick={() => handleContinueShopping(selectedProduct)}
                        disabled={selectedProduct.kolicina_na_stanju <= 0}
                        className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${selectedProduct.kolicina_na_stanju > 0
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        <FaShoppingCart className="mr-2" />
                        Nastavi s kupovinom ({quantity} kom)
                      </button>

                      <button
                        onClick={handleGoToCart}
                        disabled={selectedProduct.kolicina_na_stanju <= 0}
                        className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center ${selectedProduct.kolicina_na_stanju > 0
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                      >
                        <FaShoppingCart className="mr-2" />
                        Idi u košaricu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductsPage;