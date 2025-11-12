import { create } from "zustand";
import { usePosStore } from "./posStore";
import { useAuthStore } from "./authStore";

const ROOT_API = import.meta.env.VITE_API_POS_ROUTES;
const CART_ITEM_ID = "cartItemId";

const useCartStore = create((set, get) => ({
  cart: [],
  selectedCart: [],
  discountData: [],
  isLoading: false,
  tokenPos: sessionStorage.getItem("authPosToken") || null,
  activeBranch: sessionStorage.getItem("branchActive") || null,
  error: null,
  success: null,
  response: null,
  triggerCartFetch: false,
  setSelectedCart: (selectCart) => {
    // Mendukung functional update dan direct value
    if (typeof selectCart === "function") {
      set((state) => ({ selectedCart: selectCart(state.selectedCart) }));
    } else {
      set({ selectedCart: selectCart });
    }
  },
  addToCart: async (
    product,
    variant = null,
    quantity = 1,
    isFromDetail = false
  ) => {
    const { getProductStock } = usePosStore.getState();
    const userPosId = sessionStorage.getItem("userPosId");
    const tokenPos = sessionStorage.getItem("authPosToken");
    const activeBranch = sessionStorage.getItem("branchActive");
    const stock = getProductStock(product, variant?.id, isFromDetail);

    if (stock < quantity) {
      return {
        success: false,
        error: `Stok tidak mencukupi. Stok tersedia: ${stock}`,
      };
    }

    set({ isLoading: true, error: null, success: null });

    try {
      const attemptAdd = async (bearerToken) =>
        await fetch(`${ROOT_API}/pos/cart/add`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${bearerToken}`,
          },
          body: JSON.stringify({
            branch_id: Number(activeBranch),
            user_id: Number(userPosId),
            product_id: Number(product?.id),
            product_sku_id: Number(product?.skus?.id),
            quantity,
          }),
          redirect: "follow",
        });

      // First attempt
      let response = await attemptAdd(tokenPos);

      // Handle redirect/CORS/unauthorized by refreshing token and retrying once
      const isRedirect =
        response?.status === 302 || response?.type === "opaqueredirect";
      const isUnauthorized =
        response?.status === 401 || response?.status === 403;
      if (isRedirect || isUnauthorized) {
        try {
          const { refreshToken } = useAuthStore.getState();
          await refreshToken();
        } catch (e) {
          console.error(
            "Failed to refresh token before retry:",
            e?.message || e
          );
        }

        const refreshedPosToken =
          sessionStorage.getItem("authPosToken") || tokenPos;
        response = await attemptAdd(refreshedPosToken);
      }

      if (!response.ok) {
        if (response.status === 302) {
          const message =
            "Ada redirect dari server (302). Periksa konfigurasi CORS/Token POS.";
          throw new Error(message);
        } else {
          throw new Error(`Failed add to cart`);
        }
      }

      const result = await response.json();
      const normalized =
        typeof result?.success === "boolean"
          ? result
          : { ...result, success: true };

      set({
        success: true,
        isLoading: false,
        error: null,
        triggerCartFetch: true,
        response: normalized,
      });

      get().getCart();

      setTimeout(() => {
        set({ success: null, triggerCartFetch: false });
      }, 3000);

      return normalized;
    } catch (error) {
      // Coba sekali lagi jika error jaringan/CORS terdeteksi
      const maybeNetworkError = /Failed to fetch|NetworkError|TypeError/i.test(
        error?.message || ""
      );
      if (maybeNetworkError) {
        try {
          const { refreshToken } = useAuthStore.getState();
          await refreshToken();
        } catch (e) {
          console.warn(
            "Token refresh attempt failed during network error.",
            e?.message || e
          );
        }

        try {
          const refreshedPosToken =
            sessionStorage.getItem("authPosToken") || tokenPos;
          const retryResponse = await fetch(`${ROOT_API}/pos/cart/add`, {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${refreshedPosToken}`,
            },
            body: JSON.stringify({
              branch_id: activeBranch,
              user_id: userPosId,
              product_id: product?.id,
              product_sku_id: product?.skus?.id,
              quantity,
            }),
            redirect: "follow",
          });

          if (retryResponse?.ok) {
            const retryResult = await retryResponse.json();
            const normalizedRetry =
              typeof retryResult?.success === "boolean"
                ? retryResult
                : { ...retryResult, success: true };

            set({
              success: true,
              isLoading: false,
              error: null,
              response: normalizedRetry,
            });
            get().getCart();
            return normalizedRetry;
          }
        } catch (e2) {
          console.error("Retry after network error failed:", e2?.message || e2);
        }
      }

      set({
        success: false,
        isLoading: false,
        error: error?.message || "Gagal menambahkan ke keranjang",
      });

      return { success: false, error: error?.message };
    }
  },
  // Dapatkan cart item id (id pada items) berdasarkan product_id dari state cart
  getCartItemIdByProductId: (productId) => {
    try {
      const cart = get().cart;
      const items = cart?.data?.items || [];
      const found = items.find(
        (it) => String(it?.product_id) === String(productId)
      );
      return found?.id ?? null;
    } catch (error) {
      console.error("getCartItemIdByProductId error:", error?.message);
      return null;
    }
  },
  getCart: async () => {
    try {
      const userPosId = sessionStorage.getItem("userPosId");
      const tokenPos = sessionStorage.getItem("authPosToken");
      const activeBranch = sessionStorage.getItem("branchActive");

      set({ isLoading: true, error: null });

      const response = await fetch(
        `${ROOT_API}/pos/cart?branch_id=${activeBranch}&user_id=${userPosId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPos}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      sessionStorage.setItem(
        "cartItemId",
        JSON.stringify(result?.data?.items?.map((cartItem) => cartItem.id))
      );

      if (result.success && result) {
        set({ cart: result, isLoading: false });
        sessionStorage.setItem(
          CART_ITEM_ID,
          JSON.stringify(
            result?.data?.items?.map((cartItem) => ({
              cart_id: cartItem?.id,
              product_id: cartItem?.product_id,
            }))
          )
        );
      }
    } catch (error) {
      console.error("Error: ", error.message);
      set({ cart: [], isLoading: false });
    }
  },
  deleteCartItems: async (cartId) => {
    try {
      const tokenPos = sessionStorage.getItem("authPosToken");

      set({ isLoading: true, error: null });

      const response = await fetch(`${ROOT_API}/pos/cart/item/${cartId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenPos}`,
        },
      });

      if (!response.ok) {
        set({ error: true, isLoading: false });
        setTimeout(() => {
          set({ error: null });
        }, 3000);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result) {
        set({ cart: result, isLoading: false, error: false });
        sessionStorage.setItem(
          CART_ITEM_ID,
          JSON.stringify(
            result?.data?.items?.map((cartItem) => ({
              cart_id: cartItem?.id,
              product_id: cartItem?.product_id,
            }))
          )
        );
      }
    } catch (error) {
      console.log("Error: ", error.message);
      set({ error: true, isLoading: false });
    }
  },
  updateCartItem: async (cartItemId, quantity) => {
    try {
      const tokenPos = sessionStorage.getItem("authPosToken");

      set({ isLoading: true, error: null });

      const response = await fetch(`${ROOT_API}/pos/cart/item/${cartItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenPos}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        set({ error: true, isLoading: false });
        setTimeout(() => {
          set({ error: null });
        }, 3000);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const normalized =
        typeof result?.success === "boolean"
          ? result
          : { ...result, success: true };

      // If API returns updated cart, use it. Otherwise, trigger a fresh fetch.
      if (normalized?.success) {
        set({ cart: normalized, isLoading: false, error: false });
      } else {
        // fallback: refetch cart
        await get().getCart?.();
        set({ isLoading: false });
      }

      return normalized;
    } catch (error) {
      console.log("Error: ", error.message);
      set({ error: error.message, isLoading: false });
    }
  },
  // Update quantity locally without calling server (frontend preview)
  updateLocalCartItem: (cartItemId, quantity) => {
    try {
      set((state) => {
        const cart = state.cart;
        if (!cart || !cart.data || !Array.isArray(cart.data.items)) return {};

        const items = cart.data.items.map((it) =>
          String(it.id) === String(cartItemId)
            ? { ...it, quantity, subtotal: Number(it.price) * Number(quantity) }
            : it
        );

        return { cart: { ...cart, data: { ...cart.data, items } } };
      });
    } catch (error) {
      console.error("updateLocalCartItem error:", error.message);
    }
  },
  clearCart: async (cartId) => {
    try {
      set({ isLoading: true, error: null });

      const response = await fetch(`${ROOT_API}/pos/cart/clear`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authPosToken")}`,
        },
        body: JSON.stringify({
          cart_id: cartId,
        }),
      });

      if (!response.ok) {
        set({ error: true, isLoading: false });
        setTimeout(() => {
          set({ error: null });
        }, 3000);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      set({
        cart: [],
        selectCart: [],
        isLoading: false,
        error: false,
        success: true,
      });

      get().getCart();

      if (response.ok) {
        sessionStorage.removeItem(CART_ITEM_ID);
        setTimeout(() => {
          set({ success: null });
        }, 3000);
        return () => clearTimeout();
      }
    } catch (error) {
      console.log("Error: ", error.message);
      setTimeout(() => {
        set({ error: null });
      }, 3000);
      set({ error: error.message, isLoading: false });
    }
  },
  clearMultipleCarts: async (cartIds) => {
    try {
      set({ isLoading: true, error: null });

      const tokenPos = sessionStorage.getItem("authPosToken");

      // Loop through each cart_id and call the clear API
      const clearPromises = cartIds.map((cartId) =>
        fetch(`${ROOT_API}/pos/cart/clear?cart_id=${cartId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPos}`,
          },
        })
      );

      const responses = await Promise.all(clearPromises);

      // Check if all requests were successful
      const allSuccessful = responses.every((response) => response.ok);

      if (!allSuccessful) {
        throw new Error("Failed to clear some cart items");
      }

      set({
        cart: [],
        selectedCart: [],
        isLoading: false,
        error: false,
        success: true,
      });

      get().getCart();

      setTimeout(() => {
        set({ success: null });
      }, 3000);

      return true;
    } catch (error) {
      console.log("Error clearing carts: ", error.message);
      set({ error: error.message, isLoading: false });
      setTimeout(() => {
        set({ error: null });
      }, 3000);
      return false;
    }
  },
  clearDiscountData: () => set({ discountData: [] }),
  checkVoucherDiscount: async (discount) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`${ROOT_API}/pos/discount/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authPosToken")}`,
        },
        body: JSON.stringify({
          discount_code: discount,
          branch_id: sessionStorage.getItem("branchActive"),
        }),
      });

      if (!response.ok) {
        set({ isLoading: false, error: response?.message });
        throw new Error("Failed to check discount code");
      }

      const result = await response.json();

      set({ discountData: result?.data, isLoading: false });
      return result?.data;
    } catch (error) {
      console.log(error.message);
      set({ error: error.message, isLoading: false });
    }
  },
}));

export { useCartStore };
