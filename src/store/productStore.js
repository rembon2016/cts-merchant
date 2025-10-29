import { create } from "zustand";

const useProductStore = create((set, get) => ({
  // Categories state
  categories: [],
  isLoading: false,
  hasMoreProducts: true,
  error: null,
  products: [],
  brands: [],
  typeProducts: [],
  units: [],
  currentPage: 1,
  total: 0,

  // Get products from API with pagination and filters
  getProducts: async (params = {}) => {
    const {
      page = 1,
      per_page = 10,
      category_id = "",
      search = "",
      reset = false,
    } = params;

    const token = sessionStorage.getItem("authPosToken");
    const activeBranch = sessionStorage.getItem("branchActive");

    set({ isLoading: true, error: null });

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

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/products?${queryParams}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        set({
          isLoading: false,
          error: `HTTP error! status: ${response?.status}`,
        });
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        const newProducts = result.data.products || [];
        const currentProducts = reset ? [] : get().products;

        set({
          products: [...currentProducts, ...newProducts],
          currentPage: result.data.current_page || page,
          hasMoreProducts:
            (result.data.current_page || page) < (result.data.last_page || 1),
          total: result.data.total || 0,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(result.message || "Failed to fetch products");
      }
    } catch (error) {
      set({
        isLoading: false,
        error: error.message || "Terjadi kesalahan saat mengambil produk",
      });
    }
  },

  // Get detail product
  getDetailProduct: async (productId) => {
    const tokenPos = sessionStorage.getItem("authPosToken");
    const activeBranch = sessionStorage.getItem("branchActive");

    try {
      set({ isLoading: true, error: null, products: null });

      if (!tokenPos) {
        throw new Error("Token tidak ditemukan");
      }

      if (!activeBranch) {
        throw new Error("Branch tidak ditemukan");
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/products/${productId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokenPos}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        set({ isLoading: false, error: `Gagal mendapatkan produk` });
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const result = await response.json();

      set({ error: null, isLoading: false, products: result?.data });
    } catch (error) {
      set({
        error: error.message || "Terjadi kesalahan saat mengambil produk",
      });
      return null;
    } finally {
      set({
        isLoading: false,
        error: null,
      });
    }
  },

  // Get product stock
  getProductStock: (product, skuId = null) => {
    const branchId = sessionStorage.getItem("branchActive");
    if (!branchId) return 0;

    if (product?.is_variant && skuId) {
      const stock = product?.product_stocks?.find(
        (s) =>
          s?.branch_id === parseInt(branchId) && s?.product_sku_id === skuId
      );
      return stock ? stock?.qty : 0;
    }

    const stock = product?.product_stocks?.find(
      (s) => s?.branch_id === parseInt(branchId) && !s?.product_sku_id
    );
    return stock ? stock.qty : 0;
  },

  // Get total variant stock for products with variants
  getTotalVariantStock: (product) => {
    const branchId = sessionStorage.getItem("branchActive");
    if (!branchId || !product?.is_variant) return 0;

    const totalStock =
      product?.product_stocks
        ?.filter((s) => s?.branch_id === parseInt(branchId))
        ?.reduce((total, stock) => total + (stock?.qty || 0), 0) || 0;

    return totalStock;
  },

  // Get product price (prioritize product_prices over price_product)
  getProductPrice: (product, skuId = null) => {
    // If product has variants and skuId is provided
    if (product?.is_variant && skuId && product?.product_prices?.length > 0) {
      const priceData = product?.product_prices?.find(
        (p) => p?.product_sku_id === skuId
      );
      if (priceData) return parseFloat(priceData?.price);
    }

    // If product has general product_prices
    if (product?.product_prices?.length > 0) {
      return parseFloat(product?.product_prices[0].price);
    }

    // Fallback to price_product
    return parseFloat(product?.price_product || 0);
  },

  // Get brand from a product
  getBrands: async () => {
    const token = sessionStorage.getItem("authPosToken");

    try {
      set({ isLoading: true });

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/brands`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        set({ isLoading: false, error: `Gagal mendapatkan produk` });
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const result = await response.json();

      set({ isLoading: false, brands: result?.data, error: null });
    } catch (error) {
      console.log("Error", error.message);
      set({ error: error.message });
    }
  },

  // Get categories from a product
  getCategories: async () => {
    const token = sessionStorage.getItem("authPosToken");

    try {
      set({ isLoading: true });

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/categories`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        set({ isLoading: false, error: `Gagal mendapatkan produk` });
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const result = await response.json();

      set({
        isLoading: false,
        categories: result?.data?.categories,
        error: null,
      });
    } catch (error) {
      console.log("Error", error.message);
      set({ error: error.message });
    }
  },

  // Get type from a product
  getTypeProducts: async () => {
    const token = sessionStorage.getItem("authPosToken");

    try {
      set({ isLoading: true });

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/type-products`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        set({ isLoading: false, error: `Gagal mendapatkan produk` });
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const result = await response.json();

      set({ isLoading: false, typeProducts: result?.data, error: null });
    } catch (error) {
      console.log("Error", error.message);
      set({ error: error.message });
    }
  },

  // Get unit from a product
  getUnits: async () => {
    const token = sessionStorage.getItem("authPosToken");

    try {
      set({ isLoading: true });

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/units`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        set({ isLoading: false, error: `Gagal mendapatkan produk` });
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const result = await response.json();

      set({ isLoading: false, units: result?.data, error: null });
    } catch (error) {
      console.log("Error", error.message);
      set({ error: error.message });
    }
  },

  // Add new products
  addProducts: async (formData) => {
    const token = sessionStorage.getItem("authPosToken");

    try {
      set({ isLoading: true, error: null });

      // Detect if there is any File in the formData values
      const hasFile = Object.values(formData || {}).some(
        (v) =>
          v instanceof File ||
          (Array.isArray(v) && v.some((i) => i instanceof File))
      );

      let body;
      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      if (hasFile) {
        // Use FormData for file upload
        body = new FormData();

        Object.entries(formData || {}).forEach(([key, value]) => {
          if (value instanceof File) {
            body.append(key, value, value.name);
          } else if (Array.isArray(value)) {
            // append arrays; files inside arrays are appended as key[]
            value.forEach((item) => {
              if (item instanceof File)
                body.append(`${key}[]`, item, item.name);
              else if (item && typeof item === "object")
                body.append(`${key}[]`, JSON.stringify(item));
              else body.append(`${key}[]`, item);
            });
          } else if (value && typeof value === "object") {
            // for nested objects, stringify them
            body.append(key, JSON.stringify(value));
          } else if (value !== undefined && value !== null) {
            body.append(key, String(value));
          }
        });
        // NOTE: do NOT set Content-Type header for FormData — browser will set boundary
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(formData);
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/products`,
        {
          method: "POST",
          headers,
          body,
        }
      );

      if (!response.ok) {
        set({ isLoading: false, error: `Gagal menambahkan produk` });
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const result = await response.json();

      set({
        isLoading: false,
        products: [...get().products, result?.data],
        error: null,
      });
    } catch (error) {
      console.log("Error", error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Add new categories
  addCategories: async (formData) => {
    const token = sessionStorage.getItem("authPosToken");

    try {
      set({ isLoading: true, error: null });

      const response = await fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/categories`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        set({ isLoading: false, error: `Gagal menambahkan kategori` });
        throw new Error(`HTTP error! status: ${response?.status}`);
      }

      const result = await response.json();

      set({
        isLoading: false,
        categories: [...get().categories, result?.data],
        error: null,
        success: true,
      });

      if (response.ok) {
        setTimeout(() => {
          set({ success: null });
        }, 2000);
      }
    } catch (error) {
      console.log("Error", error);
      set({ error: error.message, isLoading: false });
    }
  },

  // Check if product has any stock available (for variant products)
  hasAvailableStock: (product) => {
    if (!product.is_variant) {
      return get().getProductStock(product) > 0;
    }

    return get().getTotalVariantStock(product) > 0;
  },

  // Clear error
  clearError: () => set({ error: null }),

  // Clear categories
  clearCategories: () => set({ categories: [], error: null }),

  // Clear products error
  clearProductsError: () => set({ error: null }),
}));

export { useProductStore };
