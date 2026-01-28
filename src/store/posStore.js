import { create } from "zustand";

const ROOT_API = import.meta.env.VITE_API_POS_ROUTES;

const usePosStore = create((set, get) => ({
  // Categories state
  categories: [],
  isLoading: false,
  error: null,

  // Products state
  products: [],
  productsLoading: false,
  productsError: null,
  currentPage: 1,
  hasMoreProducts: true,
  totalProducts: 0,

  // Get categories from API
  getCategories: async (params = {}) => {
    const { page = 1, per_page = 10, search = "" } = params;

    set({ isLoading: true, error: null });

    try {
      const token = sessionStorage.getItem("authPosToken");

      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: per_page.toString(),
        search,
      });

      const response = await fetch(
        `${ROOT_API}/pos/categories?${queryParams}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        set({
          categories: result.data,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(result.message || "Failed to fetch categories");
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Terjadi kesalahan saat mengambil kategori",
      });
    }
  },

  // Get products from API with pagination and filters
  getProducts: async (params = {}) => {
    const { page = 1, per_page = 10, category_id = "", search = "" } = params;

    const token = sessionStorage.getItem("authPosToken");
    const activeBranch = sessionStorage.getItem("branchActive");

    set({ productsLoading: true, productsError: null });

    try {
      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      if (!activeBranch) {
        throw new Error("Branch tidak ditemukan");
      }

      const queryParams = new URLSearchParams({
        branch_id: activeBranch,
        page: page.toString(),
        per_page: per_page.toString(),
        category_id,
        search,
      });

      const response = await fetch(`${ROOT_API}/pos/products?${queryParams}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const result = await response.json();

      set({
        products: result?.data?.data,
        currentPage: result.data.current_page || page,
        hasMoreProducts:
          (result.data.current_page || page) < (result.data?.last_page || 1),
        totalProducts: result.data?.total || 0,
        productsLoading: false,
        productsError: null,
        reset: false,
      });
    } catch (error) {
      set({
        productsLoading: false,
        productsError:
          error.message || "Terjadi kesalahan saat mengambil produk",
      });
    }
  },

  // Load more products (for infinite scroll)
  loadMoreProducts: async (params = {}) => {
    const state = get();
    if (state.productsLoading || !state.hasMoreProducts) return;

    await state.getProducts({
      ...params,
      page: state.currentPage + 1,
      reset: false,
    });
  },

  // Reset products (for new search/filter)
  resetProducts: () => {
    set({
      products: [],
      currentPage: 1,
      hasMoreProducts: true,
      totalProducts: 0,
      productsError: null,
    });
  },

  getPriceOrCost: (filterData, apiKey, apiName) => {
    return Number.parseFloat(filterData?.[apiKey]?.[0]?.[apiName] || 0);
  },

  // Get product price (prioritize product_prices over price_product)
  getProductPrice: (product, skuId = null, isFromDetail = false) => {
    // If product has variants and skuId is provided
    if (product?.is_variant) {
      const priceData = product?.skus?.find((p) => p.id === skuId);
      if (priceData) {
        const mapApiKey = isFromDetail ? "productPrices" : "product_prices";
        return get().getPriceOrCost(priceData, mapApiKey, "price");
      }
    }

    // Fallback to price_product
    return Number.parseFloat(product?.price_product || 0);
  },

  getProductCost: (product, skuId = null, isFromDetail = false) => {
    // If product has variants and skuId is provided
    if (product?.is_variant) {
      const priceData = product?.skus?.find((p) => p.id === skuId);
      if (priceData) {
        const mapApiKey = isFromDetail ? "productPrices" : "product_prices";
        return get().getPriceOrCost(priceData, mapApiKey, "cost");
      }
    }

    // Fallback to price_product
    return Number.parseFloat(product?.cost_product || 0);
  },

  // Get product stock
  getProductStock: (product, skuId = null, isFromDetail = false) => {
    const branchId = sessionStorage.getItem("branchActive");

    if (!branchId) return 0;

    if (!isFromDetail && product?.is_variant && skuId) {
      const stock = product?.skus?.find((s) => s?.id === skuId);

      return stock ? stock.product_stocks[0].qty : 0;
    }

    if (isFromDetail) {
      const stock = product?.skus?.find((s) => s?.id === skuId);

      return stock ? stock.productStocks[0].qty : 0;

      // const stock = product?.stocks?.find(
      //   (s) => s?.branch_id === Number.parseInt(branchId)
      // );
      // return stock ? stock?.qty : 0;
    } else {
      const stock = product?.product_stocks?.find(
        (s) => s?.branch_id === Number.parseInt(branchId) && !s?.product_sku_id,
      );
      return stock ? stock?.qty : 0;
    }
  },

  // Get total variant stock for products with variants
  getTotalVariantStock: (product) => {
    const branchId = sessionStorage.getItem("branchActive");

    if (!branchId || !product?.is_variant) return 0;

    let totalStock = 0;
    const branchIdNum = Number.parseInt(branchId);

    if (product.skus && product.skus.length > 0) {
      product.skus.forEach((sku) => {
        if (sku.product_stocks && sku.product_stocks.length > 0) {
          const stock = sku.product_stocks.find(
            (s) => s.branch_id === branchIdNum,
          );
          if (stock) {
            totalStock += stock.qty;
          }
        }
      });
    }

    return totalStock;
  },

  // Get total variant stock for products with variants
  getSingleVariantStock: (product, isFromDetail = false) => {
    const branchId = sessionStorage.getItem("branchActive");

    if (!branchId || !product?.is_variant) return 0;

    let productStocks = 0;

    if (product.skus && product.skus.length > 0) {
      if (!isFromDetail) {
        productStocks += product?.skus[0]?.product_stocks[0]?.qty;
      } else {
        productStocks += product?.skus[0]?.productStocks[0]?.qty;
      }
    }

    return productStocks;
  },

  // Check if product has any stock available (for variant products)
  hasAvailableStock: (product) => {
    if (!product.is_variant) {
      return get().getProductStock(product) > 0;
    }

    return get().getTotalVariantStock(product) > 0;
  },

  // update password user
  updatePasswordPOS: async (formData) => {
    const token = sessionStorage.getItem("authPosToken");

    try {
      set({ error: null });

      const apiProperties = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      };

      const response = await fetch(`${ROOT_API}/user/password`, {
        ...apiProperties,
      });

      return await response?.json();
    } catch (error) {
      return error;
    }
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear categories
  clearCategories: () => set({ categories: [], error: null }),

  // Clear products error
  clearProductsError: () => set({ productsError: null }),
}));

export { usePosStore };
