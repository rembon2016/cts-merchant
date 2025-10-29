import { useMemo, useCallback, useState, useRef } from "react";
import { usePosStore } from "../store/posStore";
import { formatCurrency } from "../helper/currency";
import { useNavigate } from "react-router-dom";
import CustomLoading from "./CustomLoading";

export default function POSProducts() {
  const {
    categories: subCategories,
    products,
    productsLoading,
    productsError,
    hasMoreProducts,
    loadMoreProducts,
    getProductPrice,
    getProductStock,
    getTotalVariantStock,
    hasAvailableStock,
  } = usePosStore();

  const [selectedSub, setSelectedSub] = useState("");
  const observerRef = useRef();

  const navigate = useNavigate();

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
  const goToProductDetail = (productId) => navigate(`/product/${productId}`);

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
      <div className="flex flex-col gap-3">
        <div className="w-full h-full p-4 flex justify-between items-center bg-white rounded-lg">
          <h3 className="text-lg font-bold ">Daftar Product</h3>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/pos/tambah-produk", { replace: true })}
              className="text-sm"
            >
              + Produk
            </button>
            <button
              onClick={() =>
                navigate("/pos/tambah-kategori", { replace: true })
              }
              className="text-sm"
            >
              + Kategori
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="w-full p-4 bg-white flex flex-col gap-2">
            <h3 className="font-normal">Jumlah Product</h3>
            <h1 className="font-bold text-xl">{products.length}</h1>
          </div>
          <div className="w-full p-4 bg-white flex flex-col gap-2">
            <h3 className="font-normal">Total Stok</h3>
            <h1 className="font-bold text-xl">
              {new Intl.NumberFormat("id-ID", {
                minimumFractionDigits: 0,
              }).format(totalStocks)}
            </h1>
          </div>
        </div>
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, [productsError, productsLoading, products, hasMoreProducts]);

  return <div className="p-6 max-w-3xl mx-auto">{renderElements}</div>;
}
