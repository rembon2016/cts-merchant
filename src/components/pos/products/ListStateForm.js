export const ListStateForm = (activeBranch) => {
  return {
    code: "",
    name: "",
    description: "",
    image: "",
    type_product_id: "",
    unit_id: "",
    cost_product: "",
    price_product: "",
    minimum_sales_quantity: "",
    stok_alert: "",
    is_variant: false,
    is_bundle: false,
    sku: "",
    barcode: "",
    category_ids: [],
    brand_ids: [],
    skus: [
      {
        sku: "",
        barcode: "",
        variant_name: "",
        cost: "",
        price: "",
        qty: "",
        effective_from: "",
        effective_until: "",
        is_active: 1,
      },
    ],
    bundle_items: [
      {
        product_id: "",
        qty: "",
        price: "",
      },
    ],
    stocks: [
      {
        qty: "",
        reason: "",
        type: "",
        product_sku_id: "",
        branch_id: activeBranch,
      },
    ],
    prices: [
      {
        cost: "",
        price: "",
        effective_from: "",
        effective_until: "",
        product_sku_id: "",
        branch_id: activeBranch,
      },
    ],
  };
};
