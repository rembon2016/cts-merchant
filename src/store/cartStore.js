import { create } from "zustand";
import { usePosStore } from "./posStore";
import { useSessionStore } from "./sessionStore";

const useCartStore = create((set, get) => ({
  cart: [],
  addToCart: (product, variant = null, quantity = 1) => {
    const { getProductStock, getProductPrice } = usePosStore.getState();
    const { tokenPos, user, activeBranch } = useSessionStore.getState();
    const stock = getProductStock(product, variant?.id);

    if (stock < quantity) {
      alert(`Stok tidak mencukupi. Stok tersedia: ${stock}`);
      return;
    }

    const price = getProductPrice(product, variant?.id);
    const cartItem = {
      id: variant ? `${product.id}-${variant.id}` : product.id.toString(),
      productId: product.id,
      variantId: variant?.id || null,
      name: variant
        ? `${product.name} - ${variant.variant_name}`
        : product.name,
      price,
      quantity,
      stock,
      image: product.image,
    };

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
      const response = fetch(
        `${import.meta.env.VITE_API_POS_ROUTES}/pos/cart/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenPos}`,
          },
          body: JSON.stringify({
            branch_id: activeBranch,
            user_id: user?.id,
            product_id: product?.id,
            product_sku_id: product?.skus?.id,
            quantity: quantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = response.json();

      set({ cart: result });
    } catch (error) {
      console.error("Error: ", error.message);
    }
  },
  getCart: async () => {
    const { tokenPos, user, activeBranch } = useSessionStore.getState();

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_POS_ROUTES
        }/pos/cart?branch_id=${activeBranch}&user_id=${user?.id}`,
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
        set({ cart: result });
      }
    } catch (error) {
      console.error("Error: ", error.message);
      set({ cart: [] });
    }
  },
}));

export { useCartStore };
