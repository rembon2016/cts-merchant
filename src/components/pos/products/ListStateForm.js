const activeBranch = sessionStorage.getItem("branchActive");

export const ListStateForm = {
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
      is_active: "",
    },
  ],
  bundle_items: [],
  stocks: [
    {
      branch_id: activeBranch,
      qty: "",
      reason: "",
      type: "",
    },
  ],
  prices: [
    {
      branch_id: activeBranch,
      cost: "",
      price: "",
      effective_from: "",
      effective_until: "",
    },
  ],
};
