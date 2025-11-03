import { create } from "zustand";
import { usePosStore } from "./posStore";
import { toast } from "react-toastify";

const ROOT_API = import.meta.env.VITE_API_POS_ROUTES;

const useCartStore = create((set, get) => ({
  cart: [],
  selectedCart: [],
  discountData: [],
  isLoading: false,
  loadingCart: false,
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
    set({ loadingCart: true });

    const { getProductStock } = usePosStore.getState();
    const userId = sessionStorage.getItem("userId");
    const tokenPos = sessionStorage.getItem("authPosToken");
    const activeBranch = sessionStorage.getItem("branchActive");
    const stock = getProductStock(product, variant?.id, isFromDetail);

    if (stock < quantity) {
      toast.warning(`Stok tidak mencukupi. Stok tersedia: ${stock}`);
      set({ loadingCart: false, isLoading: false });
      return;
    }

    set({ isLoading: true, error: null, success: null });

    // const price = getProductPrice(product, variant?.id);
    // const cartItem = {
    //   id: variant ? `${product.id}-${variant.id}` : product.id.toString(),
    //   productId: product.id,
    //   variantId: variant?.id || null,
    //   name: variant
    //     ? `${product.name} - ${variant.variant_name}`
    //     : product.name,
    //   price,
    //   quantity,
    //   stock,
    //   image: product.image,
    // };

    // const existingItem = get().cart.find((item) => item.id === cartItem.id);

    // if (existingItem) {
    //   const newQuantity = existingItem.quantity + quantity;

    //   if (newQuantity > stock) {
    //     alert(`Stok tidak mencukupi. Stok tersedia: ${stock}`);
    //     return;
    //   }

    //   set((state) => ({
    //     cart: state.cart.map((item) =>
    //       item.id === cartItem.id ? { ...item, quantity: newQuantity } : item
    //     ),
    //   }));
    //   return;
    // }

    try {
      // If the item already exists in cart, update its quantity instead of adding a duplicate
      const currentItems = get()?.cart?.data?.items || [];
      let existingItem = null;
      if (Array.isArray(currentItems) && currentItems.length > 0) {
        existingItem = currentItems.find((it) => {
          const matchProduct = String(it?.product?.id) === String(product?.id);
          if (variant?.id) {
            const itemSku = Number.parseInt(it?.product?.sku);
            return matchProduct && String(itemSku) === String(variant.id);
          }
          return matchProduct;
        });
      }

      if (existingItem) {
        const newQty =
          Number(existingItem.quantity || 0) + Number(quantity || 0);
        await get().updateCartItem(existingItem.id, newQty, "");

        set({
          loadingCart: false,
          success: true,
          isLoading: false,
          error: null,
          triggerCartFetch: true,
          response: { ok: true },
        });
      } else {
        const response = await fetch(`${ROOT_API}/pos/cart/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPos}`,
          },
          body: JSON.stringify({
            branch_id: activeBranch,
            user_id: userId,
            product_id: product?.id,
            product_sku_id: variant?.id || null,
            quantity,
          }),
        });

        if (!response.ok) {
          // Fallback: fetch cart and try to update if item exists
          await get().getCart();
          const freshItems = get()?.cart?.data?.items || [];
          const item = freshItems.find((it) => {
            const matchProduct =
              String(it?.product?.id) === String(product?.id);
            if (variant?.id) {
              const itemSku = Number.parseInt(it?.product?.sku);
              return matchProduct && String(itemSku) === String(variant.id);
            }
            return matchProduct;
          });

          if (item) {
            const newQty = Number(item.quantity || 0) + Number(quantity || 0);
            await get().updateCartItem(item.id, newQty, "");
          } else {
            set({ loadingCart: false });
            throw new Error(`Failed add to cart`);
          }

          set({
            loadingCart: false,
            success: true,
            isLoading: false,
            error: null,
            triggerCartFetch: true,
            response,
          });
        } else {
          set({
            loadingCart: false,
            success: true,
            isLoading: false,
            error: null,
            triggerCartFetch: true,
            response,
          });
        }
      }

      // Refresh cart immediately so Header shows latest item count
      try {
        await get().getCart();
      } catch (e) {
        console.error("Failed to refresh cart after add:", e?.message || e);
      }
      setTimeout(() => {
        set({ success: null, triggerCartFetch: false, response: null });
      }, 3000);
    } catch (error) {
      console.error("Error: ", error.message);
      set({
        success: false,
        isLoading: false,
        error: error.message,
        response: null,
      });
    }
  },
  getCart: async () => {
    try {
      const userId = sessionStorage.getItem("userId");
      const tokenPos = sessionStorage.getItem("authPosToken");
      const activeBranch = sessionStorage.getItem("branchActive");

      set({ isLoading: true, error: null });

      const response = await fetch(
        `${ROOT_API}/pos/cart?branch_id=${activeBranch}&user_id=${userId}`,
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

      if (result.success && result) {
        set({ cart: result, isLoading: false });
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
      }
    } catch (error) {
      console.log("Error: ", error.message);
      set({ error: true, isLoading: false });
    }
  },
  updateCartItem: async (cartItemId, quantity, notes) => {
    try {
      const tokenPos = sessionStorage.getItem("authPosToken");

      set({ isLoading: true, error: null });

      const response = await fetch(`${ROOT_API}/pos/cart/item/${cartItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenPos}`,
        },
        body: JSON.stringify(
          notes !== undefined ? { quantity, notes } : { quantity }
        ),
      });

      if (!response.ok) {
        set({ error: true, isLoading: false });
        setTimeout(() => {
          set({ error: null });
        }, 3000);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // If API returns updated cart, use it. Otherwise, trigger a fresh fetch.
      if (result && result.success) {
        set({ cart: result, isLoading: false, error: false });
      } else {
        // fallback: refetch cart
        await get().getCart?.();
        set({ isLoading: false });
      }
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

      if (response.ok) {
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
