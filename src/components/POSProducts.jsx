import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { Pencil, Trash2, XCircle } from "lucide-react";
import { usePosStore } from "../store/posStore";
import { useProductStore } from "../store/productStore";
import { formatCurrency } from "../helper/currency";
import { useNavigate } from "react-router-dom";
import CustomLoading from "./CustomLoading";
import SimpleModal from "./modal/SimpleModal";

export default function POSProducts() {
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
  } = usePosStore();

  const { removeCategories, isLoading: removingCategory } = useProductStore();

  const [selectedSub, setSelectedSub] = useState("");
  const [activeTab, setActiveTab] = useState("Produk");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const observerRef = useRef();

  const navigate = useNavigate();

  // Reset and fetch all products when component mounts
  useEffect(() => {
    resetProducts();
    getProducts({
      category_id: "",
      search: "",
      page: 1,
      per_page: 20,
      reset: true,
    });
  }, [getProducts, resetProducts]);

  // Ensure categories are fetched for Kategori tab
  useEffect(() => {
    if (typeof getCategories === "function") {
      getCategories();
    }
  }, [getCategories]);

  // Refetch products when selected category changes
  useEffect(() => {
    const categoryId = selectedSub
      ? subCategories.find((cat) => cat.name === selectedSub)?.id || ""
      : "";
    resetProducts();
    getProducts({
      category_id: categoryId,
      search: "",
      page: 1,
      per_page: 20,
      reset: true,
    });
  }, [selectedSub, subCategories, getProducts, resetProducts]);

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
      subCategories,
    ]
  );

  // Navigate to product detail page
  const goToProductDetail = (productId) =>
    navigate(`/pos/products/${productId}`);

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

  const renderElements = useMemo(() => {
    if (productsLoading) {
      return (
        <div className="w-full text-center">
          <CustomLoading />
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

    return (
      <div className="flex flex-col gap-3">
        <div className="w-full">
          <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow">
            <button
              className={`w-1/2 px-4 py-2 rounded-md text-sm font-semibold ${
                activeTab === "Produk"
                  ? "bg-[var(--c-accent)] text-slate-700"
                  : "text-gray-700 dark:text-slate-100"
              }`}
              onClick={() => setActiveTab("Produk")}
            >
              Produk
            </button>
            <button
              className={`w-1/2 px-4 py-2 rounded-md text-sm font-semibold ${
                activeTab === "Kategori"
                  ? "bg-[var(--c-accent)] text-slate-700"
                  : "text-gray-700 dark:text-slate-100"
              }`}
              onClick={() => setActiveTab("Kategori")}
            >
              Kategori
            </button>
          </div>
        </div>

        {activeTab === "Produk" && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="w-full p-4 bg-white flex flex-col gap-2 rounded-lg shadow">
                <h3 className="font-normal">Jumlah Produk</h3>
                <h1 className="font-bold text-xl">{products.length}</h1>
              </div>
              <div className="w-full p-4 bg-white flex flex-col gap-2 rounded-lg shadow">
                <h3 className="font-normal">Total Stok</h3>
                <h1 className="font-bold text-xl">
                  {new Intl.NumberFormat("id-ID", {
                    minimumFractionDigits: 0,
                  }).format(totalStocks)}
                </h1>
              </div>
            </div>
            <div className="flex">
              <button
                onClick={() =>
                  navigate("/pos/tambah-produk", { replace: true })
                }
                className="text-md w-full bg-[var(--c-primary)] text-white rounded-md py-4 font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                + Produk
              </button>
            </div>

            {!productsLoading && !productsError && products?.length === 0 && (
                <div className="col-span-2 flex flex-col items-center justify-center text-gray-500 p-4 bg-gray-100 rounded-lg h-[250px]">
                    <XCircle className="w-16 h-16 mb-2 text-gray-400" />
                    <span className="text-sm">Produk tidak ditemukan</span>
                </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              {products.map((product, index) => {
                const isLastProduct = products.length === index + 1;
                const productPrice = getProductPrice(product);
                const productStock = product.is_variant
                  ? getTotalVariantStock(product)
                  : getProductStock(product);
                const isOutOfStock = !hasAvailableStock(product);

                return (
                  <button
                    key={product.id}
                    ref={isLastProduct ? lastProductElementRef : null}
                    className={`border rounded-lg shadow hover:shadow-lg transition flex flex-col items-start overflow-hidden ${
                      isOutOfStock ? "opacity-50" : "cursor-pointer"
                    }`}
                    onClick={() =>
                      !isOutOfStock && goToProductDetail(product.id)
                    }
                  >
                    <div className="relative w-full">
                      <img
                        src={
                          product.image
                            ? `${import.meta.env.VITE_API_IMAGE}${
                                product.image
                              }`
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
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {activeTab === "Kategori" && (
          <>
            <div className="flex mb-2">
              <button
                onClick={() =>
                  navigate("/pos/tambah-kategori", { replace: true })
                }
                className="text-md w-full bg-[var(--c-primary)] text-white rounded-md py-4 font-semibold hover:bg-blue-700 transition-colors duration-200"
              >
                + Kategori
              </button>
            </div>
            <div className="space-y-2">
              {subCategories.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-white dark:bg-slate-700 rounded-lg p-4 shadow-sm border border-slate-100 dark:border-slate-600 flex items-center justify-between"
                >
                  <button
                    className="text-left flex-1"
                    onClick={() => {
                      setSelectedSub((prev) =>
                        prev?.toLowerCase() === sub?.name?.toLowerCase()
                          ? ""
                          : sub?.name
                      );
                      setActiveTab("Produk");
                    }}
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
              ))}
            </div>
            {showDeleteModal && selectedCategory && (
              <SimpleModal
                onClose={() => setShowDeleteModal(false)}
                handleClick={async () => {
                  try {
                    await removeCategories(selectedCategory.id);
                    setShowDeleteModal(false);
                    setSelectedCategory(null);
                    // refresh categories after deletion
                    getCategories();
                  } catch (e) {
                    // silently close modal; error feedback handled by store
                    setShowDeleteModal(false);
                  }
                }}
                title={"Konfirmasi Hapus"}
                content={`Apakah Anda yakin ingin menghapus kategori "${selectedCategory?.name}"?`}
                showButton={true}
              />
            )}
          </>
        )}
      </div>
    );
  }, [
    productsError,
    productsLoading,
    products,
    hasMoreProducts,
    activeTab,
    selectedSub,
    subCategories,
  ]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <div className="p-4 max-w-sm mx-auto safe-bottom">{renderElements}</div>
    </div>
  );
}
