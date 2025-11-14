import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useThemeStore } from "../../store/themeStore";
import { usePosStore } from "../../store/posStore";
import { useDebounce } from "../../hooks/useDebounce";
import { useCartStore } from "../../store/cartStore";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../helper/currency";
import SearchInput from "../customs/form/SearchInput";
import { toast } from "react-toastify";
import { AlertCircle, ShoppingCart, XCircle } from "lucide-react";
import BottomModal from "../customs/menu/BottomModal";

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
  const { error } = useCartStore();
  const {
    categories: subCategories,
    isLoading,
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

  // Show toast when cart add/update succeeds or fails
  // useEffect(() => {
  //   if (success) {
  //     toast.success("Berhasil ditambahkan ke keranjang", {
  //       position: "top-center",
  //       autoClose: 3000,
  //     });
  //   }

  //   if (error) {
  //     toast.error("Terjadi kesalahan saat menambahkan ke keranjang", {
  //       position: "top-center",
  //       autoClose: 3000,
  //     });
  //   }
  // }, [success, error]);

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
      toast.warning("Produk ini sedang habis stok");
      return;
    }

    setSelectedProduct(product);
    setShowVariantModal(true);
    // addToCart(product);
    // if (product.is_variant && product.skus?.length > 0) {
    // } else {
    //   // Add to cart directly for non-variant products
    // }
  };

  // Navigate to product detail page
  const goToProductDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  const renderCategories = useMemo(() => {
    if (isLoading) {
      return (
        <div className="mb-3">
          <div className="flex gap-1 overflow-x-auto invisible-scrollbar pb-2">
            {[...Array(4)].map((_, idx) => (
              <div
                key={idx}
                className="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="mb-3">
          <div className="text-center text-red-500 mb-4 p-3 bg-red-50 rounded-lg">
            Error: {error}
          </div>
        </div>
      );
    }

    return (
      <div className="mb-3">
        <div className="flex gap-1 overflow-x-auto invisible-scrollbar pb-2">
          {subCategories.map((sub) => (
            <button
              key={sub.id}
              className={`w-full flex flex-nowrap px-4 py-2 border ${
                selectedSub?.toLowerCase() === sub?.name?.toLowerCase()
                  ? "bg-[var(--c-accent)] text-slate-600"
                  : "bg-white text-gray-700"
              } hover:bg-[var(--c-accent)] hover:text-slate-600 transition slate-600 space-nowrap rounded-lg dark:text-slate-100 dark:hover:text-slate-600`}
              onClick={() =>
                setSelectedSub(sub?.name === selectedSub ? "" : sub?.name)
              }
            >
              <span
                className={
                  (selectedSub?.toLowerCase() === sub?.name?.toLowerCase()
                    ? "font-semibold"
                    : "") +
                  " w-full flex justify-center items-center text-nowrap whitespace-nowrap text-sm"
                }
              >
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
        <div className="grid grid-cols-2 gap-2">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="w-full h-[220px] bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
            >
              <div className="w-full h-[80px] bg-gray-400 dark:bg-gray-600 rounded-t-[10px] p-2"></div>
              <div className="flex h-full flex-col gap-6 p-3">
                <div className="w-full">
                  <div className="w-[90%] h-[20px] bg-gray-300 dark:bg-gray-500 rounded-sm mb-3"></div>
                  <div className="flex flex-col gap-1">
                    <div className="w-full h-[10px] bg-gray-300 dark:bg-gray-500 rounded-sm"></div>
                    <div className="w-[30%] h-[10px] bg-gray-300 dark:bg-gray-500 rounded-sm"></div>
                  </div>
                </div>

                <div className="w-full h-[35px] bg-gray-400 dark:bg-gray-500 rounded-lg p-2"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (productsError) {
      return (
        <div className="col-span-2 flex flex-col items-center justify-center text-gray-500 p-4 bg-gray-100 rounded-lg h-[250px]">
          <AlertCircle className="w-16 h-16 mb-2 text-gray-400" />
          <span className="text-sm">Error: {productsError}</span>
        </div>
      );
    }

    if (!productsLoading && !productsError && products?.length === 0) {
      return (
        <div className="col-span-2 flex flex-col items-center justify-center text-gray-500 p-4 bg-gray-100 rounded-lg h-[250px]">
          <XCircle className="w-16 h-16 mb-2 text-gray-400" />
          <span className="text-sm">Produk tidak ditemukan</span>
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
              className={`border rounded-lg shadow hover:shadow-lg transition flex flex-col items-start overflow-hidden ${
                isOutOfStock ? "opacity-50" : "cursor-pointer"
              }`}
              onClick={() => !isOutOfStock && goToProductDetail(product.id)}
            >
              <div className="relative w-full">
                <img
                  src={
                    product.image
                      ? `${import.meta.env.VITE_API_IMAGE}${product.image}`
                      : "/images/image-placeholder.png"
                  }
                  alt={product.name || "Product Image"}
                  className="w-full h-[100px] object-cover"
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
              <div className="p-2 w-full h-full flex flex-col justify-between">
                <div>
                  <div className="text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-md">
                      {formatCurrency(productPrice)}
                    </span>
                  </div>
                  <div className="mt-2 mb-4">
                    <div className="font-semibold text-md line-clamp-2 leading-5 mb-1">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Stok: {productStock}
                    </div>
                  </div>
                </div>
                <button
                  className={`w-full flex justify-center items-center gap-2 h-10 py-2 rounded-lg transition-colors ${
                    isOutOfStock
                      ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                      : "bg-[var(--c-primary)] text-white hover:bg-blue-700"
                  } text-xs`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isOutOfStock) {
                      handleProductClick(product);
                    }
                  }}
                  disabled={isOutOfStock}
                >
                  <span className="inline-block">
                    <ShoppingCart className="w-4 h-4" />
                  </span>
                  {isOutOfStock ? "Habis" : "Tambahkan"}
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
            <div className=" bg-[var(--c-accent)] p-2 rounded-2xl flex items-center justify-center mb-2">
              <img
                src={isDark ? cat.iconDark : cat.iconLight}
                alt={cat.name}
                className="w-10 h-10"
              />
            </div>
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
      {selectedProduct && (
        <BottomModal
          isOpen={showVariantModal}
          setIsOpen={setShowVariantModal}
          onClose={() => {
            setShowVariantModal(false);
            setSelectedProduct(null);
          }}
          // Pastikan data yang dikirim adalah produk yang dipilih
          data={{
            ...selectedProduct,
            // Normalisasi image agar konsisten ditampilkan seperti di daftar produk
            image: selectedProduct?.image
              ? `${import.meta.env.VITE_API_IMAGE}${selectedProduct.image}`
              : selectedProduct?.image,
          }}
          // Hitung stok sesuai tipe produk (varian vs non-varian)
          stocks={
            selectedProduct?.is_variant
              ? getTotalVariantStock(selectedProduct)
              : getProductStock(selectedProduct)
          }
          onItemClick={() => setShowVariantModal(false)}
          isFromDetail={false}
        />
      )}
    </div>
  );
}
