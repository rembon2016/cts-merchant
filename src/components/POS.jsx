import { useState, useEffect, useCallback, useRef } from "react";
import { useThemeStore } from "../store/themeStore";
import { usePosStore } from "../store/posStore";
import { useDebounce } from "../hooks/useDebounce";
import VariantModal from "./VariantModal";

const categories = [
  {
    name: "TRANSAKSI",
    iconLight: "/icons/transaction.svg",
    iconDark: "/icons/transaction-white.svg",
  },
  {
    name: "PRODUK",
    iconLight: "/icons/product.svg",
    iconDark: "/icons/product-white.svg",
  },
  {
    name: "MENU",
    iconLight: "/icons/menu.svg",
    iconDark: "/icons/menu-white.svg",
  },
];

export default function POS() {
  const [search, setSearch] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [cart, setCart] = useState([]);
  const observerRef = useRef();

  const { isDark } = useThemeStore();
  const { 
    categories: apiCategories, 
    isLoading, 
    error, 
    getCategories,
    products,
    productsLoading,
    productsError,
    hasMoreProducts,
    getProducts,
    loadMoreProducts,
    resetProducts,
    getProductPrice,
    getProductStock,
    getTotalVariantStock,
    hasAvailableStock
  } = usePosStore();

  // Debounce search input
  const debouncedSearch = useDebounce(search, 500);

  // Fetch categories on component mount
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // Fetch products when filters change
  useEffect(() => {
    resetProducts();
    getProducts({
      category_id: selectedSub ? apiCategories.find(cat => cat.name === selectedSub)?.id || '' : '',
      search: debouncedSearch,
      page: 1,
      per_page: 20,
      reset: true
    });
  }, [selectedSub, debouncedSearch, apiCategories, getProducts, resetProducts]);

  // Infinite scroll observer
  const lastProductElementRef = useCallback(node => {
    if (productsLoading) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMoreProducts) {
        loadMoreProducts({
          category_id: selectedSub ? apiCategories.find(cat => cat.name === selectedSub)?.id || '' : '',
          search: debouncedSearch,
          per_page: 20
        });
      }
    });
    if (node) observerRef.current.observe(node);
  }, [productsLoading, hasMoreProducts, loadMoreProducts, selectedSub, debouncedSearch, apiCategories]);

  // Handle product click
  const handleProductClick = (product) => {
    // Check if product has any available stock
    if (!hasAvailableStock(product)) {
      alert('Produk ini sedang habis stok');
      return;
    }

    if (product.is_variant && product.skus?.length > 0) {
      setSelectedProduct(product);
      setShowVariantModal(true);
    } else {
      // Add to cart directly for non-variant products
      handleAddToCart(product);
    }
  };

  // Handle add to cart
  const handleAddToCart = (product, variant = null, quantity = 1) => {
    const stock = getProductStock(product, variant?.id);
    
    if (stock < quantity) {
      alert(`Stok tidak mencukupi. Stok tersedia: ${stock}`);
      return;
    }

    const price = getProductPrice(product, variant?.id);
    const cartItem = {
      id: variant ? `${product.id}-${variant.id}` : product.id.toString(),
      productId: product.id,
      variantId: variant?.id || null,
      name: variant ? `${product.name} - ${variant.variant_name}` : product.name,
      price: price,
      quantity: quantity,
      stock: stock,
      image: product.image
    };

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === cartItem.id);
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > stock) {
          alert(`Stok tidak mencukupi. Stok tersedia: ${stock}`);
          return prevCart;
        }
        return prevCart.map(item =>
          item.id === cartItem.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      return [...prevCart, cartItem];
    });
  };

  // Handle variant selection
  const handleVariantSelect = ({ product, variant, quantity, price, stock }) => {
    handleAddToCart(product, variant, quantity);
  };

  // Format price
  const formatPrice = (price) => {
    return parseFloat(price).toLocaleString('id-ID');
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Kategori Produk */}
      <div className="flex gap-2 mb-6">
        {categories.map((cat) => (
          <div
            key={cat.name}
            className="w-full min-h-[100px] max-h-full flex flex-col justify-center items-center hover:bg-slate-200 dark:hover:bg-slate-600 bg-white  text-slate-600 dark:text-slate-100 rounded-lg font-semibold cursor-pointer text-[12px]"
          >
            <img
              src={isDark ? cat.iconDark : cat.iconLight}
              alt={cat.name}
              className="w-10 h-10 mb-2 "
            />
            {cat.name}
          </div>
        ))}
      </div>
      {/* Sub Kategori */}
      <div className="mb-6">
        {isLoading && (
          <div className="text-center text-gray-500 mb-4">
            Memuat kategori...
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
            Error: {error}
          </div>
        )}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {apiCategories.map((sub) => (
            <button
              key={sub.id}
              className={`px-4 py-2 rounded border ${
                selectedSub === sub.name
                  ? "bg-[var(--c-accent)] text-slate-600"
                  : "bg-gray-100 text-gray-700"
              } hover:bg-[var(--c-accent)] hover:text-slate-600 transition slate-600 space-nowrap rounded-full dark:text-slate-100 dark:hover:text-slate-600`}
              onClick={() => setSelectedSub(sub.name === selectedSub ? "" : sub.name)}
            >
              {sub.name}
            </button>
          ))}
        </div>
      </div>
      {/* Pencarian */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button className="px-4 py-2 bg-[var(--c-primary)] text-white rounded hover:bg-[var(--c-primary)] transition">
          Cari
        </button>
      </div>
      {/* Daftar Produk */}
      <div className="grid grid-cols-2 gap-4">
        {productsError && (
          <div className="col-span-2 text-center text-red-500 p-4 bg-red-50 rounded-lg">
            Error: {productsError}
          </div>
        )}
        
        {products.length === 0 && !productsLoading && !productsError ? (
          <div className="col-span-2 text-center text-gray-500">
            Produk tidak ditemukan.
          </div>
        ) : (
          products.map((product, index) => {
            const isLastProduct = products.length === index + 1;
            const productPrice = getProductPrice(product);
            
            // For variant products, show total stock across all variants
            const productStock = product.is_variant 
              ? getTotalVariantStock(product) 
              : getProductStock(product);
            
            const isOutOfStock = !hasAvailableStock(product);

            return (
              <div
                key={product.id}
                ref={isLastProduct ? lastProductElementRef : null}
                className={`border rounded-lg shadow hover:shadow-lg transition flex flex-col items-start ${
                  isOutOfStock ? 'opacity-50' : 'cursor-pointer'
                }`}
                onClick={() => !isOutOfStock && handleProductClick(product)}
              >
                <div className="relative w-full">
                  <img
                    src={product.image ? `${import.meta.env.VITE_API_IMAGE}${product.image}` : '/images/placeholder.jpg'}
                    alt={product.name || "Product Image"}
                    className="w-full h-[100px] object-cover rounded-t-[10px]"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg'
                    }}
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-[10px]">
                      <span className="text-white font-semibold text-sm">HABIS</span>
                    </div>
                  )}
                  {product.is_variant && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Varian
                    </div>
                  )}
                </div>
                <div className="p-4 w-full">
                  <div className="font-bold text-lg">{product.name}</div>
                  <div className="font-normal text-sm mb-2 text-gray-600 dark:text-gray-400">
                    {product.description}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    <span>Rp.</span>
                    <span className="font-bold text-2xl">{formatPrice(productPrice)}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    Stok: {productStock}
                  </div>
                  <div className="mt-3 flex gap-2 justify-between items-center">
                    <button 
                      className={`w-full h-12 py-2 rounded-full transition-colors ${
                        isOutOfStock 
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                          : 'bg-[var(--c-primary)] text-white hover:bg-blue-700'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isOutOfStock) {
                          handleProductClick(product);
                        }
                      }}
                      disabled={isOutOfStock}
                    >
                      {isOutOfStock ? 'Habis' : 'Beli'}
                    </button>
                    <button 
                      className={`w-20 h-12 rounded-full border-2 flex justify-center items-center transition-colors ${
                        isOutOfStock 
                          ? 'border-gray-400 cursor-not-allowed' 
                          : 'border-slate-600 dark:border-slate-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isOutOfStock) {
                          handleAddToCart(product);
                        }
                      }}
                      disabled={isOutOfStock}
                    >
                      <img
                        src={`${
                          isDark ? "/icons/cart-white.svg" : "/icons/cart.svg"
                        }`}
                        alt="Add to cart"
                        className="w-8 h-8"
                      />
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
        
        {/* Loading indicator for infinite scroll */}
        {productsLoading && (
          <div className="col-span-2 text-center py-4">
            <div className="inline-flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--c-primary)]"></div>
              <span className="text-gray-500">Memuat produk...</span>
            </div>
          </div>
        )}
      </div>

      {/* Variant Modal */}
      <VariantModal
        isOpen={showVariantModal}
        onClose={() => {
          setShowVariantModal(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onSelectVariant={handleVariantSelect}
      />

      {/* Cart Summary (optional - can be expanded later) */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-[var(--c-primary)] text-white p-3 rounded-full shadow-lg">
          <div className="flex items-center space-x-2">
            <img src="/icons/cart-white.svg" alt="Cart" className="w-6 h-6" />
            <span className="font-semibold">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
