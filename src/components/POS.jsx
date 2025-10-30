import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useThemeStore } from "../store/themeStore";
import { usePosStore } from "../store/posStore";
import { useDebounce } from "../hooks/useDebounce";
import { useCartStore } from "../store/cartStore";
import VariantModal from "./VariantModal";
import CustomLoading from "./CustomLoading";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../helper/currency";
import SearchInput from "./SearchInput";

const MENU = [
  {
    name: "TRANSAKSI",
    iconLight: "/icons/transaction.svg",
    iconDark: "/icons/transaction-white.svg",
    path: "/pos/transaction",
  },
  {
    name: "PRODUK",
    iconLight: "/icons/product.svg",
    iconDark: "/icons/product-white.svg",
    path: "/pos/products",
  },
];

export default function POS() {
  const [search, setSearch] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const observerRef = useRef();

  const { isDark } = useThemeStore();
  const { addToCart } = useCartStore();
  const {
    categories: subCategories,
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
    hasAvailableStock,
  } = usePosStore();

  // Debounce search input
  const debouncedSearch = useDebounce(search, 500);

  const navigate = useNavigate();

  // Fetch categories on component mount
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // Fetch products when filters change
  useEffect(() => {
    resetProducts();
    getProducts({
      category_id: selectedSub
        ? subCategories.find((cat) => cat.name === selectedSub)?.id || ""
        : "",
      search: debouncedSearch,
      page: 1,
      per_page: 20,
      reset: true,
    });
  }, [selectedSub, debouncedSearch, getProducts, resetProducts]);

  // Infinite scroll observer
  const lastProductElementRef = useCallback(
    (node) => {
      if (productsLoading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreProducts) {
          loadMoreProducts({
            category_id: selectedSub
              ? subCategories.find((cat) => cat.name === selectedSub)?.id || ""
              : "",
            search: debouncedSearch,
            per_page: 20,
          });
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [
      productsLoading,
      hasMoreProducts,
      loadMoreProducts,
      selectedSub,
      debouncedSearch,
      subCategories,
    ]
  );

  // Handle product click
  const handleProductClick = (product) => {
    // Check if product has any available stock
    if (!hasAvailableStock(product)) {
      alert("Produk ini sedang habis stok");
      return;
    }

    if (product.is_variant && product.skus?.length > 0) {
      setSelectedProduct(product);
      setShowVariantModal(true);
    } else {
      // Add to cart directly for non-variant products
      addToCart(product);
    }
  };

  // Navigate to product detail page
  const goToProductDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  // Handle variant selection
  const handleVariantSelect = ({ product, variant, quantity }) => {
    addToCart(product, variant, quantity);
  };

  const renderCategories = useMemo(() => {
    if (isLoading) {
      return (
        <div className="mb-6">
          <div className="text-center text-gray-500 mb-4">
            Memuat kategori...
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="mb-6">
          <div className="text-center text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
            Error: {error}
          </div>
        </div>
      );
    }

    return (
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {subCategories.map((sub) => (
            <button
              key={sub.id}
              className={`w-full flex flex-nowrap px-4 py-2 rounded border ${
                selectedSub?.toLowerCase() === sub?.name?.toLowerCase()
                  ? "bg-[var(--c-accent)] text-slate-600"
                  : "bg-gray-100 text-gray-700"
              } hover:bg-[var(--c-accent)] hover:text-slate-600 transition slate-600 space-nowrap rounded-full dark:text-slate-100 dark:hover:text-slate-600`}
              onClick={() =>
                setSelectedSub(sub?.name === selectedSub ? "" : sub?.name)
              }
            >
              <span className="w-full flex justify-center items-center">
                {sub.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }, [isLoading, error, subCategories, selectedSub]);

  const renderProducts = useMemo(() => {
    if (productsLoading) {
      return (
        <div className="w-full text-center">
          {/* Loading indicator for infinite scroll */}
          <CustomLoading />
        </div>
      );
    }

    if (productsError) {
      return (
        <div className="col-span-2 text-center text-red-500 p-4 bg-red-50 rounded-lg">
          Error: {productsError}
        </div>
      );
    }

    if (!productsLoading && !productsError && products?.length === 0) {
      return (
        <div className="col-span-2 text-center text-gray-500">
          Produk tidak ditemukan.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-2">
        {products.map((product, index) => {
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
                isOutOfStock ? "opacity-50" : "cursor-pointer"
              }`}
              onClick={() => !isOutOfStock && goToProductDetail(product.id)}
            >
              <div className="relative w-full">
                <img
                  src={
                    product.image
                      ? `${import.meta.env.VITE_API_IMAGE}${product.image}`
                      : "/images/placeholder.jpg"
                  }
                  alt={product.name || "Product Image"}
                  className="w-full h-[100px] object-cover rounded-t-[10px]"
                  onError={(e) => {
                    e.target.src = "/images/placeholder.jpg";
                  }}
                />
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-[10px]">
                    <span className="text-white font-semibold text-sm">
                      HABIS
                    </span>
                  </div>
                )}
                {product.is_variant && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    Varian
                  </div>
                )}
              </div>
              <div className="p-2 w-full">
                <div className="font-bold text-md">
                  {product.name.length > 12
                    ? `${product.name.slice(0, 12)}...`
                    : product.name}
                </div>
                <div className="font-normal text-sm mb-2 text-gray-600 dark:text-gray-400">
                  {product.description?.length > 25
                    ? `${product.description.slice(0, 25)}...`
                    : product.description}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  {/* <span>Rp.</span> */}
                  <span className="font-bold text-lg">
                    {formatCurrency(productPrice)}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Stok: {productStock}
                </div>
                <button
                  className={`w-full flex justify-center items-center gap-1 h-12 py-2 rounded-full transition-colors ${
                    isOutOfStock
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-[var(--c-primary)] text-white hover:bg-blue-700"
                  } text-[0.9rem]`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isOutOfStock) {
                      handleProductClick(product);
                    }
                  }}
                  disabled={isOutOfStock}
                >
                  {isOutOfStock ? "Habis" : "Keranjang"}

                  <img
                    src={`/icons/cart-white.svg`}
                    alt="Add to cart"
                    className="w-5 h-5"
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [productsError, productsLoading, products, hasMoreProducts]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Kategori Produk */}
      <div className="flex gap-2 mb-6">
        {MENU.map((cat) => (
          <button
            key={cat.name}
            className="w-full min-h-[100px] max-h-full flex flex-col justify-center items-center hover:bg-slate-200 dark:hover:bg-slate-600 bg-white  text-slate-600 dark:text-slate-100 rounded-lg font-semibold cursor-pointer text-[12px]"
            onClick={() => navigate(cat?.path, { replace: true })}
          >
            <img
              src={isDark ? cat.iconDark : cat.iconLight}
              alt={cat.name}
              className="w-10 h-10 mb-2 "
            />
            {cat.name}
          </button>
        ))}
      </div>
      {/* Sub Kategori */}
      {renderCategories}
      <div className="mb-6">
        <SearchInput
          value={search}
          onChange={(value) => setSearch(value)}
          placeholder="Cari produk..."
        />
      </div>
      {/* Daftar Produk */}
      {renderProducts}

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
    </div>
  );
}
