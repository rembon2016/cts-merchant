import { useState, useEffect, useMemo, lazy, Suspense } from "react";
import { usePosStore } from "../../store/posStore";
import { useDebounce } from "../../hooks/useDebounce";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../helper/currency";
import { toast } from "sonner";
import { XCircle } from "lucide-react";
import BottomModal from "../customs/menu/BottomModal";
import LoadingSkeletonCard from "../customs/loading/LoadingSkeletonCard";
import LoadingSkeletonList from "../customs/loading/LoadingSkeletonList";
import BottomSheet from "../customs/menu/BottomSheet";
import NoData from "../customs/element/NoData";
import LoadMoreButton from "../customs/button/LoadMoreButton";
const ButtonFilter = lazy(() => import("../customs/button/ButtonFilter"));
const ProductCard = lazy(() => import("../customs/card/ProductCard"));
const SearchInput = lazy(() => import("../customs/form/SearchInput"));

const MAIN_MENU = [
  {
    id: 1,
    name: "TRANSAKSI",
    icon: "/icons/transaction.svg",
    path: "/pos/transaction",
  },
  {
    id: 2,
    name: "PRODUK",
    icon: "/icons/product.svg",
    path: "/pos/products",
  },
];

export default function POS() {
  const [search, setSearch] = useState("");
  const [selectedSub, setSelectedSub] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [accumulatedData, setAccumulatedData] = useState([]);

  const LIMIT_DATA = 20;

  const {
    categories,
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
    getSingleVariantStock,
    hasAvailableStock,
    totalProducts,
    currentPage,
  } = usePosStore();

  // Debounce search input
  const debouncedSearch = useDebounce(search, 1000);

  const navigate = useNavigate();

  // Fetch categories on component mount
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  // Fetch products when filters change
  useEffect(() => {
    resetProducts();
    getProducts({
      category_id: selectedSub?.id,
      search: debouncedSearch,
      page: 1,
      per_page: LIMIT_DATA,
      reset: true,
    });
  }, [selectedSub, debouncedSearch, getProducts, resetProducts]);

  // Effect untuk mengelola accumulated data ketika data berubah
  useEffect(() => {
    if (products) {
      if (currentPage > 1) {
        setAccumulatedData((prev) => [...prev, ...products]);
      } else {
        setAccumulatedData(products);
      }
    }
  }, [products]);

  // Handle product click
  const handleProductClick = (product) => {
    // Check if product has any available stock
    if (!hasAvailableStock(product)) {
      toast.warning("Produk ini sedang habis stok");
      return;
    }

    setSelectedProduct(product);
    setShowVariantModal(true);
  };

  // Navigate to product detail page
  const goToProductDetail = (productId) => navigate(`/product/${productId}`);

  const handleItemClick = (item) => {
    setSelectedSub(item);
    setIsSheetOpen(false);
  };

  const renderElements = useMemo(() => {
    return (
      <div className="grid grid-cols-3 gap-3">
        {categories?.map((item) => {
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="sheet-item bg-slate-50 dark:bg-slate-600 rounded-xl p-3 flex flex-col items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-500 transition-colors"
            >
              <img
                src={
                  item.image
                    ? `${import.meta.env.VITE_API_IMAGE}${item.image}`
                    : "/images/image-placeholder.png"
                }
                alt={item.name || "Product Image"}
                className="w-full h-[60px] object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = "/images/placeholder.jpg";
                }}
              />
              <span className="text-xs text-center text-primary dark:text-slate-300">
                {item?.name}
              </span>
            </button>
          );
        })}
      </div>
    );
  }, [categories]);

  const renderMainMenu = useMemo(() => {
    if (isLoading) {
      return <LoadingSkeletonList />;
    }

    return (
      <div className="flex gap-2 mb-6">
        {MAIN_MENU.map((cat) => (
          <button
            key={cat.name}
            className="w-full min-h-[100px] max-h-full flex flex-col justify-center items-center hover:bg-slate-200 dark:hover:bg-slate-600 bg-white  text-slate-600 dark:text-slate-100 rounded-lg font-semibold cursor-pointer text-[12px]"
            onClick={() => navigate(cat?.path, { replace: true })}
          >
            <div className="bg-[var(--c-accent)] p-2 rounded-2xl flex items-center justify-center mb-2">
              <img src={cat.icon} alt={cat.name} className="w-10 h-10" />
            </div>
            {cat.name}
          </button>
        ))}
      </div>
    );
  }, [isLoading]);

  const renderProducts = useMemo(() => {
    if (productsLoading) {
      return <LoadingSkeletonCard items={products} />;
    }

    if (productsError) {
      return <NoData text={productsError} />;
    }

    if (!productsLoading && !productsError && accumulatedData?.length === 0) {
      return <NoData text="Produk tidak ditemukan" />;
    }

    return (
      <div className="grid grid-cols-2 gap-2">
        {accumulatedData?.map((product) => {
          // const isLastProduct = products.length === index + 1;
          const productPrice = getProductPrice(product);

          // For variant products, show total stock across all variants
          const productStock = product.is_variant
            ? getTotalVariantStock(product)
            : getProductStock(product);

          const isOutOfStock = !hasAvailableStock(product);

          return (
            <Suspense
              key={product.id}
              fallback={<LoadingSkeletonCard items={[1]} />}
            >
              <ProductCard
                key={product.id}
                product={product}
                price={formatCurrency(productPrice)}
                stock={productStock}
                disabled={isOutOfStock}
                onClick={() => goToProductDetail(product.id)}
                showButtonCart={true}
                handleProductClick={handleProductClick}
              />
            </Suspense>
          );
        })}
      </div>
    );
  }, [productsError, productsLoading, accumulatedData]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Kategori Produk */}
      {renderMainMenu}
      {/* Sub Kategori */}
      {/* {renderCategories} */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex gap-2 w-full">
          <Suspense fallback={<div>Loading...</div>}>
            <SearchInput
              value={search}
              onChange={(value) => setSearch(value)}
              placeholder="Cari produk..."
              propsData="historiProduk"
            />
          </Suspense>
          <ButtonFilter setIsSheetOpen={setIsSheetOpen} />
        </div>
        {selectedSub !== null && !productsLoading && (
          <div className="flex items-center gap-2  mb-4 font-semibold">
            <span className="text-gray-600 dark:text-gray-200 text-sm">
              Kategori:
            </span>
            <span className="bg-[var(--c-accent)] text-gray-700 py-2 px-3 rounded-lg hover:bg-yellow-400 transition-colors flex items-center justify-between gap-2 text-sm  w-fit ">
              {selectedSub?.name}
              <button onClick={() => setSelectedSub(null)}>
                <XCircle />
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Daftar Produk */}
      {renderProducts}

      {!productsError && !isLoading && hasMoreProducts && (
        <LoadMoreButton
          data={accumulatedData}
          totalData={totalProducts}
          loading={isLoading}
          handleLoadMore={() => loadMoreProducts({ per_page: LIMIT_DATA })}
        />
      )}

      {/* Variant Modal */}
      {selectedProduct && (
        <BottomModal
          isOpen={showVariantModal}
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
          isVariant={selectedProduct?.is_variant}
          // Hitung stok sesuai tipe produk (varian vs non-varian)
          stocks={
            selectedProduct?.is_variant
              ? getSingleVariantStock(selectedProduct)
              : getProductStock(selectedProduct)
          }
          onItemClick={() => setShowVariantModal(false)}
          isFromDetail={false}
          renderContent={renderElements}
        />
      )}

      <BottomSheet
        title="Kategori"
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onItemClick={() => setIsSheetOpen(false)}
        renderContent={renderElements}
        bodyHeight="500px"
      />
    </div>
  );
}
