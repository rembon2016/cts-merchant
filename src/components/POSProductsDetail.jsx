import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProductStore } from "../store/productStore";
import { useThemeStore } from "../store/themeStore";
import { formatCurrency } from "../helper/currency";
import CustomLoading from "./CustomLoading";

export default function POSProductsDetail() {
  const { getDetailProduct, isLoading, products, error } = useProductStore();

  const { isDark } = useThemeStore();

  const productStock = products?.stocks?.reduce((a, b) => a + b.qty, 0);

  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  // For variant products, show total stock across all variants

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
        <div className="flex justify-between items-center w-full mb-4">
          <button className="bg-white text-gray-700 font-semibold w-[100px] py-2 rounded-sm hover:bg-slate-100 transition-colors duration-200">
            Kembali
          </button>
          <div className="flex gap-1">
            <button className="bg-white w-[100px] py-2 text-gray-700 font-semibold rounded-sm hover:bg-slate-100 transition-colors duration-200">
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
            <div className="flex gap-1">
              <h3 className="font-medium text-lg">Stok: </h3>
              <h3 className="font-bold text-lg">{productStock}</h3>
            </div>
            <div className="flex gap-1">
              <h3 className="font-medium text-lg">Minimum Pembelian: </h3>
              <h3 className="font-bold text-lg">
                {products?.minimum_sales_quantity}
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }, [products, isLoading, isDark, error]);

  return <>{renderElements}</>;
}
