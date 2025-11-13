import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useProductStore } from "../../store/productStore";
import { useThemeStore } from "../../store/themeStore";
import { formatCurrency } from "../../helper/currency";
import { ShoppingCart } from "lucide-react";
import CustomLoading from "../customs/loading/CustomLoading";
import BottomModal from "../customs/menu/BottomModal";
import BackButton from "../customs/button/BackButton";

export default function DetailProduct() {
  const { getDetailProduct, isLoading, products, error } = useProductStore();

  const { isDark } = useThemeStore();

  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const productStock = products?.stocks?.reduce((a, b) => a + b.qty, 0);

  const location = useLocation();
  const pathname = location.pathname;
  // For variant products, show total stock across all variants

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
        {/* <button
          // key={item.id}
          onClick={() => handleMenuClick(item)}
          className="bg-white dark:bg-slate-700 rounded-2xl p-3 flex flex-col items-center gap-2 shadow-soft"
        /> */}

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
              <h4 className="font-medium text-gray-500 text-md">Harga Jual</h4>
              <h3 className="font-bold text-lg">
                {formatCurrency(products?.cost_product)}
              </h3>
            </div>
            <div className="w-full flex flex-col gap-1 justify-center items-start p-4 bg-white rounded-lg">
              <h4 className="font-medium text-gray-500 text-md">Harga Beli</h4>
              <h3 className="font-bold text-lg">
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
          <div className="mt-3">
            <button
              className={`w-full flex gap-2 justify-center items-center h-16 py-2 rounded-lg transition-colors bg-[var(--c-primary)] text-white hover:bg-blue-700`}
              onClick={() => setIsSheetOpen(true)}
              disabled={isLoading}
            >
              <ShoppingCart className="w-5 h-5" />
              Masukkan Keranjang
            </button>
            {/* <button
              className={`w-20 h-16 rounded-full border-2 border-gray-500 flex justify-center items-center transition-colors gap-2`}
              onClick={() => setIsSheetOpen(true)}
              disabled={isLoading}
            >
              <img
                src={`${isDark ? "/icons/cart-white.svg" : "/icons/cart.svg"}`}
                alt="Add to cart"
                className="w-8 h-8"
              />
            </button> */}
          </div>
        </div>

        <BottomModal
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
          data={products}
          stocks={productStock}
          onItemClick={() => setIsSheetOpen(false)}
          isFromDetail={true}
        />
      </div>
    );
  }, [products, isLoading, isDark, isSheetOpen, error]);

  useEffect(() => {
    if (pathname.includes("/product/")) {
      const productId = pathname.split("/product/")[1];
      getDetailProduct(productId);
    }
  }, [pathname]);

  return (
    <div className="px-4">
      <BackButton />
      {renderElements}
    </div>
  );
}
