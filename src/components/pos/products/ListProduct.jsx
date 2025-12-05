import { useMemo, useState, useRef, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { usePosStore } from "../../../store/posStore";
import { useProductStore } from "../../../store/productStore";
import { formatCurrency } from "../../../helper/currency";
import { useNavigate } from "react-router-dom";
import { useCustomToast } from "../../../hooks/useCustomToast";
import SimpleModal from "../../customs/modal/SimpleModal";
import CustomToast from "../../customs/toast/CustomToast";
import LoadingSkeletonCard from "../../customs/loading/LoadingSkeletonCard";
import LoadingSkeletonList from "../../customs/loading/LoadingSkeletonList";
import NoData from "../../customs/element/NoData";
import FloatingButton from "../../customs/button/FloatingButton";
import ProductCard from "../../customs/card/ProductCard";
import LoadMoreButton from "../../customs/button/LoadMoreButton";

export default function ListProduct() {
  const {
    categories: subCategories,
    getCategories,
    products,
    productsLoading,
    productsError,
    hasMoreProducts,
    loadMoreProducts,
    getProducts,
    resetProducts,
    getProductPrice,
    getProductStock,
    getTotalVariantStock,
    hasAvailableStock,
    totalProducts,
    currentPage,
  } = usePosStore();

  const {
    toast,
    success: showSuccess,
    error: showError,
    hideToast,
  } = useCustomToast();

  const { removeCategories, isLoading } = useProductStore();

  const [selectedSub, setSelectedSub] = useState("");
  const [activeTab, setActiveTab] = useState("Produk");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const initialFetchDoneRef = useRef(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [accumulatedData, setAccumulatedData] = useState([]);

  const LIMIT_DATA = 20;

  const navigate = useNavigate();

  // Orchestrate initial fetch (categories then products) so big loading runs once
  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        if (typeof getCategories === "function") {
          await getCategories({ per_page: LIMIT_DATA });
        }
        resetProducts();
        await getProducts({
          category_id: "",
          search: "",
          page: 1,
          per_page: LIMIT_DATA,
          reset: true,
        });
      } finally {
        if (!cancelled) {
          initialFetchDoneRef.current = true;
          setInitialLoading(false);
        }
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [getCategories, getProducts, resetProducts]);

  // Refetch products when selected category changes
  useEffect(() => {
    if (!initialFetchDoneRef.current) return;
    const categoryId = selectedSub
      ? subCategories.find((cat) => cat.name === selectedSub)?.id || ""
      : "";
    resetProducts();
    getProducts({
      category_id: categoryId,
      search: "",
      page: 1,
      per_page: LIMIT_DATA,
      reset: true,
    });
  }, [selectedSub, getProducts, resetProducts]);

  // Navigate to product detail page
  const goToProductDetail = (productId) =>
    navigate(`/pos/products/${productId}`);

  const deleteCategory = async (paramsId) => {
    try {
      const response = await removeCategories(paramsId);

      if (response?.success) {
        showSuccess("Kategori berhasil dihapus");
      } else {
        showError(response?.error || "Gagal menghapus kategori");
      }

      setShowDeleteModal(false);
      setSelectedCategory(null);
      getCategories();
    } catch (error) {
      console.log(error);
      setShowDeleteModal(false);
    }
  };

  const handleChangeActiveTab = (tab) => setActiveTab(tab);

  // Compute total stocks across all products
  const totalStocks = useMemo(() => {
    if (!products || products.length === 0) return 0;

    return products.reduce((total, product) => {
      // Prefer store helpers when available (handles variant logic)
      let stock = 0;

      try {
        if (product.is_variant) {
          stock =
            typeof getTotalVariantStock === "function"
              ? getTotalVariantStock(product)
              : 0;
        } else {
          stock =
            typeof getProductStock === "function"
              ? getProductStock(product)
              : 0;
        }
      } catch (e) {
        stock = 0;
      }

      // Fallback: sum qty from product_stocks array if helper returned falsy
      if (!stock || stock === 0) {
        const fallback = (product.product_stocks || []).reduce(
          (s, ps) => s + (Number(ps.qty) || 0),
          0
        );
        stock = fallback;
      }

      return total + Number(stock || 0);
    }, 0);
  }, [products, getProductStock, getTotalVariantStock]);

  const renderElemntsTab = useMemo(() => {
    if (initialLoading) {
      return <LoadingSkeletonList items={1} />;
    }

    return (
      <div className="w-full mb-4">
        <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow">
          <button
            className={`w-1/2 px-4 py-2 rounded-md text-sm font-semibold ${
              activeTab === "Produk"
                ? "bg-[var(--c-accent)] text-gray-700"
                : "text-gray-700 dark:text-slate-100"
            }`}
            onClick={() => handleChangeActiveTab("Produk")}
          >
            Produk
          </button>
          <button
            className={`w-1/2 px-4 py-2 rounded-md text-sm font-semibold ${
              activeTab === "Kategori"
                ? "bg-[var(--c-accent)] text-gray-700"
                : "text-gray-700 dark:text-slate-100"
            }`}
            onClick={() => handleChangeActiveTab("Kategori")}
          >
            Kategori
          </button>
        </div>
      </div>
    );
  }, [initialLoading, activeTab]);

  const renderCatalogProducts = useMemo(() => {
    if (initialLoading) {
      return <LoadingSkeletonList />;
    }

    return (
      <div className="grid grid-cols-2 gap-2">
        <div className="w-full income-card p-4 bg-[var(--c-primary)] flex flex-col gap-2 rounded-xl shadow">
          <h3 className="font-normal text-white">Jumlah Produk</h3>
          <h1 className="font-bold text-xl text-white">{products.length}</h1>
        </div>
        <div className="w-full income-card p-4 bg-[var(--c-primary)] flex flex-col gap-2 rounded-xl shadow">
          <h3 className="font-normal text-white">Total Stok</h3>
          <h1 className="font-bold text-xl text-white">
            {new globalThis.Intl.NumberFormat("id-ID", {
              minimumFractionDigits: 0,
            }).format(totalStocks)}
          </h1>
        </div>
      </div>
    );
  }, [initialLoading, accumulatedData, totalStocks]);

  const redirectTo =
    activeTab === "Produk" ? "/pos/tambah-produk" : "/pos/tambah-kategori";

  const renderElementsButtons = (redirectTo) => (
    <FloatingButton
      handleOnClick={() => navigate(redirectTo, { replace: true })}
    />
  );

  const renderElementsProducts = () => {
    if (initialLoading) {
      return <LoadingSkeletonCard items={accumulatedData?.length} />;
    }

    if (!initialLoading && !productsError && accumulatedData?.length === 0) {
      return <NoData text="Tidak ada produk" />;
    }

    const elements = () => {
      return (
        <div className="grid grid-cols-2 gap-2 mt-2">
          {accumulatedData.map((product, index) => {
            const productPrice = getProductPrice(product);
            const productStock = product.is_variant
              ? getTotalVariantStock(product)
              : getProductStock(product);
            const isOutOfStock = !hasAvailableStock(product);

            return (
              <ProductCard
                key={product.id}
                product={product}
                price={formatCurrency(productPrice)}
                stock={productStock}
                disabled={isOutOfStock}
                onClick={() => goToProductDetail(product.id)}
                showButtonCart={false}
                loading={initialLoading || productsLoading}
              />
            );
          })}
        </div>
      );
    };

    return (
      <div className="relative">
        {renderCatalogProducts}
        {elements()}
        {!initialLoading && !productsError && hasMoreProducts && (
          <LoadMoreButton
            data={accumulatedData}
            totalData={totalProducts}
            loading={productsLoading}
            handleLoadMore={() => loadMoreProducts({ per_page: LIMIT_DATA })}
          />
        )}
      </div>
    );
  };

  const renderElementsCategories = () => {
    if (initialLoading) {
      return <LoadingSkeletonList items={subCategories?.length} />;
    }

    if (!initialLoading && subCategories?.length === 0) {
      return <NoData text="Tidak ada kategori" />;
    }

    const elements = () => {
      return (
        <div className="space-y-2">
          {subCategories.map((sub) => {
            return (
              <div
                key={sub.id}
                className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-between"
              >
                <button
                  className="text-left flex-1"
                  onClick={() => handleChangeActiveTab("Kategori")}
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {sub?.name}
                  </span>
                </button>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    type="button"
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-slate-600 dark:hover:bg-slate-500 text-gray-700 dark:text-white"
                    onClick={() =>
                      navigate(`/pos/edit-kategori/${sub.id}`, {
                        replace: true,
                      })
                    }
                    aria-label="Edit kategori"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/30 dark:hover:bg-red-900/40"
                    onClick={() => {
                      setSelectedCategory(sub);
                      setShowDeleteModal(true);
                    }}
                    aria-label="Hapus kategori"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      );
    };

    return (
      <div className="relative pb-16">
        {elements()}
        {showDeleteModal && selectedCategory && (
          <SimpleModal
            onClose={() => setShowDeleteModal(false)}
            handleClick={() => deleteCategory(selectedCategory.id)}
            title={"Konfirmasi Hapus"}
            content={`Apakah Anda yakin ingin menghapus kategori ini?`}
            showButton={true}
            isLoading={isLoading}
          />
        )}
      </div>
    );
  };

  const renderElements = useMemo(() => {
    return (
      <div className="flex flex-col gap-3">
        {activeTab === "Produk" && renderElementsProducts()}
        {activeTab === "Kategori" && renderElementsCategories()}
        {renderElementsButtons(redirectTo)}
      </div>
    );
  }, [
    productsError,
    productsLoading,
    accumulatedData,
    hasMoreProducts,
    activeTab,
    selectedSub,
    subCategories,
    selectedCategory,
    showDeleteModal,
    initialLoading,
    isLoading,
  ]);

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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 relative">
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
      <div className="p-4 max-w-sm mx-auto safe-bottom">
        {renderElemntsTab}
        {renderElements}
      </div>
    </div>
  );
}
