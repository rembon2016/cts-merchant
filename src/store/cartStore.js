import { create } from "zustand";
import { usePosStore } from "./posStore";

const ROOT_API = import.meta.env.VITE_API_POS_ROUTES;

const useCartStore = create((set, get) => ({
  cart: [],
  selectedCart: [],
  isLoading: false,
  discountCode: "",
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
    const userId = sessionStorage.getItem("userId");
    const tokenPos = sessionStorage.getItem("authPosToken");
    const activeBranch = sessionStorage.getItem("branchActive");
    const stock = getProductStock(product, variant?.id, isFromDetail);

    if (stock < quantity) {
      alert(`Stok tidak mencukupi. Stok tersedia: ${stock}`);
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
          product_sku_id: product?.skus?.id,
          quantity,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed add to cart`);
      }

      set({
        success: true,
        isLoading: false,
        error: null,
        triggerCartFetch: true,
        response,
      });

      if (response) {
        setTimeout(() => {
          set({ success: null, triggerCartFetch: false, response: null });
        }, 3000);
      }
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
  updateCartItem: async (cartItemId, quantity) => {
    try {
      const tokenPos = sessionStorage.getItem("authPosToken");

      set({ isLoading: true, error: null });

      const response = await fetch(`${ROOT_API}/pos/cart/item/${cartItemId}`, {
        method: "PATCH",
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
          Authorization: `Bearer ${get().tokenPos}`,
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
  checkVoucherDiscount: async (discount) => {
    try {
      set({ isLoading: true, error: null });
      const response = await fetch(`${ROOT_API}/pos/discount/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${get().tokenPos}`,
        },
        body: JSON.stringify({
          discount_code: discount,
          branch_id: get().activeBranch,
        }),
      });

      if (!response.ok) {
        set({ isLoading: false, error: response?.message });
        throw new Error("Failed to check discount code");
      }

      const result = await response.json();
      set({ discountCode: result?.data, isLoading: false });
      return result?.data;
    } catch (error) {
      console.log(error.message);
      set({ error: error.message, isLoading: false });
    }
  },
}));

export { useCartStore };
