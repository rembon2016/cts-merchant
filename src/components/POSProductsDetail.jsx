import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { useThemeStore } from "../store/themeStore";
import { formatCurrency } from "../helper/currency";
import { toast, ToastContainer } from "react-toastify";
import CustomLoading from "./CustomLoading";
import SimpleModal from "./modal/SimpleModal";

export default function POSProductsDetail() {
  const { getDetailProduct, removeProducts, isLoading, products, error } =
    useProductStore();

  const [showModal, setShowModal] = useState(false);

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

    if (response?.success) {
      toast.success(
        typeof success === "string" ? success : "Berhasil menghapus Produk",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      navigate("/pos/products", { replace: true });
    } else {
      toast.error(
        typeof error === "string"
          ? "Gagal menghapus Produk"
          : "Terjadi kesalahan",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
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
      return (
        <div className="w-full text-center">
          {/* Loading indicator for infinite scroll */}
          <CustomLoading />
        </div>
      );
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
          <button className="bg-white text-gray-700 font-semibold w-[100px] py-2 rounded-sm hover:bg-slate-100 transition-colors duration-200">
            Kembali
          </button>
          <div className="flex gap-1">
            <button
              onClick={handleOpenModal}
              className="bg-white w-[100px] py-2 text-gray-700 font-semibold rounded-sm hover:bg-slate-100 transition-colors duration-200"
            >
              Hapus
            </button>
            <button
              onClick={() =>
                navigate(`/pos/edit-produk/${products?.id}`, {
                  replace: true,
                })
              }
              className="bg-white w-[100px] py-2 text-gray-700 font-semibold rounded-sm hover:bg-slate-100 transition-colors duration-200"
            >
              Edit
            </button>
          </div>
        </div>
        <div className="w-full h-full flex flex-col gap-3">
          <img
            src={products?.image}
            alt={products?.name}
            className="w-full max-w-[378px] h-full max-h-[267px] object-cover object-center rounded-lg"
          />
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-3xl">{products?.name}</h3>
            <h3 className="font-semibold text-lg">{products?.description}</h3>
          </div>
          <div className="flex gap-2">
            <div className="w-full flex flex-col gap-1 justify-center items-start p-4 bg-white rounded-lg">
              <h4 className="font-medium text-md">Harga Jual</h4>
              <h3 className="font-bold text-2xl">
                {formatCurrency(products?.cost_product)}
              </h3>
            </div>
            <div className="w-full flex flex-col gap-1 justify-center items-start p-4 bg-white rounded-lg">
              <h4 className="font-medium text-md">Harga Beli</h4>
              <h3 className="font-bold text-2xl">
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
            {products?.skus?.length > 0 &&
              products?.skus.map((item) => (
                <div className="flex flex-col gap-2" key={item?.id}>
                  <h5 className="font-semibold text-gray-500 mt-2">Varian</h5>
                  <div className="flex justify-between bg-white p-4 rounded-md">
                    <h3 className="font-medium text-md">Nama Variant </h3>
                    <h3 className="font-bold text-md">{item?.variant_name}</h3>
                  </div>
                  <div className="flex justify-between bg-white p-4 rounded-md">
                    <h3 className="font-medium text-md">SKU </h3>
                    <h3 className="font-bold text-md">{item?.sku}</h3>
                  </div>
                  <div className="flex justify-between bg-white p-4 rounded-md">
                    <h3 className="font-medium text-md">Aktif?</h3>
                    <h3 className="font-bold text-md">
                      {item?.is_active ? "Ya" : "Tidak"}
                    </h3>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }, [products, isLoading, isDark, error, showModal]);

  return (
    <>
      <ToastContainer />
      {renderElements}
    </>
  );
}
