import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProductStore } from "../../../store/productStore";
import { useThemeStore } from "../../../store/themeStore";
import { formatCurrency } from "../../../helper/currency";
import SimpleModal from "../../customs/modal/SimpleModal";
import BackButton from "../../customs/button/BackButton";
import { useCustomToast } from "../../../hooks/useCustomToast";
import CustomToast from "../../customs/toast/CustomToast";
import LoadingSkeletonCard from "../../customs/loading/LoadingSkeletonCard";
import CustomImage from "../../customs/element/CustomImage";

export default function DetailProduct() {
  const { getDetailProduct, removeProducts, isLoading, products, error } =
    useProductStore();
  const {
    toast,
    success: showSuccess,
    error: showError,
    hideToast,
  } = useCustomToast();

  const [showModal, setShowModal] = useState(false);
  const [fullValue, setFullValue] = useState(null);

  const { isDark } = useThemeStore();

  const productStock = products?.stocks?.reduce((a, b) => a + b.qty, 0);

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  // For variant products, show total stock across all variants

  const handleOpenModal = () => setShowModal(true);

  const handleCloseModal = () => setShowModal(false);

  const handleDeleteProducts = async () => {
    const response = await removeProducts(products?.id);
    setShowModal(false);

    if (response?.success === true) {
      setShowModal(false);
      showSuccess("Berhasil Menghapus Produk");
      navigate("/pos/products", { replace: true });
    } else {
      showError("Gagal Menghapus Produk");
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (pathname.includes("/pos/products/")) {
      const productId = pathname.split("/pos/products/")[1];
      getDetailProduct(productId);
    }
  }, [pathname]);

  const renderElements = useMemo(() => {
    if (isLoading) {
      return <LoadingSkeletonCard />;
    }

    if (error) {
      return (
        <div className="col-span-2 text-center text-red-500 p-4 bg-red-50 rounded-lg">
          Gagal Mendapatkan Detail Produk
        </div>
      );
    }

    return (
      <div className="w-full h-full mt-3">
        {showModal && (
          <SimpleModal
            onClose={handleCloseModal}
            handleClick={handleDeleteProducts}
            title="Hapus Data"
            content="Hapus Produk Ini?"
            showButton={true}
          />
        )}
        <div className="flex justify-between items-center w-full mb-4">
          <BackButton />
          <div className="flex gap-1">
            <button
              onClick={handleOpenModal}
              className="bg-red-500 text-white w-[100px] py- font-semibold rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Hapus
            </button>
            <button
              onClick={() =>
                navigate(`/pos/edit-produk/${products?.id}`, {
                  replace: true,
                })
              }
              className="bg-[var(--c-primary)] w-[100px] py-2 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Edit
            </button>
          </div>
        </div>
        <div className="w-full h-full flex flex-col gap-3">
          <CustomImage
            imageSource={products?.image}
            imageWidth={96}
            imageHeight={64}
            altImage={products?.name}
            onError={(e) => {
              e.target.src = "/images/placeholder.jpg";
            }}
            imageLoad="eager"
            imageFetchPriority="high"
            className="w-full max-w-[378px] h-full max-h-[267px] object-cover object-center rounded-lg"
          />
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-3xl">{products?.name}</h3>
            <h3 className="font-semibold text-lg">{products?.description}</h3>
          </div>
          <div className="flex gap-2">
            <div className="w-full flex flex-col gap-1 justify-center items-start p-4 bg-white rounded-lg">
              <h4 className="font-medium text-gray-500 dark:text-gray-300 text-md">
                Harga Jual
              </h4>
              <h3 className="font-bold text-lg">
                {formatCurrency(products?.cost_product)}
              </h3>
            </div>
            <div className="w-full flex flex-col gap-1 justify-center items-start p-4 bg-white rounded-lg">
              <h4 className="font-medium text-gray-500 dark:text-gray-300 text-md">
                Harga Beli
              </h4>
              <h3 className="font-bold text-lg">
                {formatCurrency(products?.price_product)}
              </h3>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between bg-white p-4 rounded-md">
              <h3 className="font-medium text-md">Kode Produk </h3>
              <h3 className="font-bold text-md">{products?.code}</h3>
            </div>
            <div className="flex justify-between bg-white p-4 rounded-md">
              <h3 className="font-medium text-md">SKU</h3>
              <h3 className="font-bold text-md">{products?.sku || "-"}</h3>
            </div>
            <div className="flex justify-between bg-white p-4 rounded-md">
              <h3 className="font-medium text-md">Stok </h3>
              <h3 className="font-bold text-md">{productStock}</h3>
            </div>
            <div className="flex justify-between bg-white p-4 rounded-md">
              <h3 className="font-medium text-md">Minimum Pembelian </h3>
              <h3 className="font-bold text-md">
                {products?.minimum_sales_quantity}
              </h3>
            </div>
            <div className="flex justify-between bg-white p-4 rounded-md">
              <h3 className="font-medium text-md">Unit </h3>
              <h3 className="font-bold text-md">{products?.unit?.name}</h3>
            </div>
            {products?.bundle_items?.length > 0 &&
              products?.bundle_items.map((item) => (
                <div className="flex flex-col gap-2" key={item?.id}>
                  <h5 className="font-semibold text-gray-500 mt-2">Bundling</h5>
                  <div className="flex justify-between bg-white p-4 rounded-md">
                    <h3 className="font-medium text-md">Nama Produk </h3>
                    <h3 className="font-bold text-md">{item?.product?.name}</h3>
                  </div>
                  <div className="flex justify-between bg-white p-4 rounded-md">
                    <h3 className="font-medium text-md">Harga </h3>
                    <h3 className="font-bold text-md">
                      {formatCurrency(item?.price)}
                    </h3>
                  </div>
                </div>
              ))}
            <h5 className="font-semibold text-gray-500 mt-2">Varian</h5>
            {products?.skus?.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[300px] text-sm text-left bg-white rounded-md divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-gray-600">Varian</th>
                      <th className="px-4 py-3 text-gray-600">SKU</th>
                      <th className="px-4 py-3 text-gray-600">Aktif</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {products?.skus?.map((item) => (
                      <tr key={item?.id} className="hover:bg-gray-50">
                        <td
                          className="px-4 py-3 font-medium max-w-[140px] sm:max-w-[220px] md:max-w-[320px] truncate cursor-pointer"
                          title={item?.variant_name || "-"}
                          onClick={() =>
                            setFullValue({
                              label: "Varian",
                              value: item?.variant_name || "-",
                            })
                          }
                        >
                          {item?.variant_name || "-"}
                        </td>
                        <td
                          className="px-4 py-3 max-w-[120px] sm:max-w-[180px] md:max-w-[220px] truncate text-xs text-gray-700 cursor-pointer"
                          title={item?.sku || "-"}
                          onClick={() =>
                            setFullValue({
                              label: "SKU",
                              value: item?.sku || "-",
                            })
                          }
                        >
                          {item?.sku || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {item?.is_active ? "Ya" : "Tidak"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Overlay for showing full cell values on tap */}
          {fullValue && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center">
              <button
                className="absolute inset-0 bg-black/30"
                onClick={() => setFullValue(null)}
                aria-hidden
              />
              <div
                role="dialog"
                aria-modal="true"
                className="relative bg-white dark:bg-slate-700 rounded-lg p-4 max-w-[92%] mx-4 shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{fullValue.label}</h4>
                    <div className="text-sm break-words">{fullValue.value}</div>
                  </div>
                  <div className="flex-shrink-0 ml-3">
                    <button
                      onClick={() => setFullValue(null)}
                      className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-600 rounded px-3 py-1"
                    >
                      Tutup
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }, [products, isLoading, isDark, error, showModal, fullValue]);

  useEffect(() => {
    const preloadImage = (src) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = src;
      document.head.appendChild(link);
    };
    preloadImage(products?.image);
  }, [products?.image]);

  return (
    <div className="px-4">
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
      {renderElements}
    </div>
  );
}
