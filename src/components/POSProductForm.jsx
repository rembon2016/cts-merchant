import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import SimpleInput from "./form/SimpleInput";
import CustomTextarea from "./form/CustomTextarea";
import CustomInputFile from "./form/CustomInputFile";
import CustomSelectBox from "./form/CustomSelectBox";

import { useProductStore } from "../store/productStore";

export default function POSProductForm({
  editMode = false,
  productId = null,
  navigateOnSuccessTo = "/pos/products",
}) {
  const navigate = useNavigate();

  const getToday = new Date().toISOString().split("T")[0];
  const activeBranch = sessionStorage.getItem("branchActive");

  const [formData, setFormData] = useState({
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
    skus: [],
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
  });

  const [adjustStocks, setAdjustStocks] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const {
    brands,
    getBrands,
    getTypeProducts,
    typeProducts,
    units,
    getUnits,
    categories,
    getCategories,
    addProducts,
    editProducts,
    getDetailProduct,
    success,
    error,
    isLoading,
  } = useProductStore();
  const { products, getProducts } = useProductStore();

  const listFormatToNumber = [
    "cost_product",
    "price_product",
    "minimum_sales_quantity",
    "stok_alert",
  ];

  const formatToNumber = (value) => value?.replaceAll(/\D/g, "");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: !listFormatToNumber?.includes(name)
        ? value
        : formatToNumber(value),
    }));

    // Clear field-level error when user modifies the field
    setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleNestedChange = (
    arrayName,
    index,
    fieldName,
    value,
    isFormatToNumber = false
  ) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index
          ? {
              ...item,
              [fieldName]: !isFormatToNumber ? value : formatToNumber(value),
            }
          : item
      ),
    }));

    // Clear nested field error (support stocks.* messages)
    if (arrayName === "stocks") {
      setValidationErrors((prev) => ({
        ...prev,
        [`stocks.${fieldName}`]: "",
      }));
    }
  };

  const handleRemoveItem = (arrayName, index) => {
    setFormData((prev) => {
      const newArray = prev[arrayName].filter((_, i) => i !== index);
      const updates = { [arrayName]: newArray };

      if (arrayName === "bundle_items" && newArray.length === 0) {
        updates.is_bundle = false;
      }
      if (arrayName === "skus" && newArray.length === 0) {
        updates.is_variant = false;
      }

      return { ...prev, ...updates };
    });
  };

  const mapDetailToForm = (products) => {
    const mappedData = {
      code: products?.code || "",
      name: products?.name || "",
      description: products?.description || "",
      image: products?.image || "",
      type_product_id: products?.type_product?.id || "",
      unit_id: products?.unit?.id || "",
      cost_product: products?.cost_product || "",
      price_product: products?.price_product || "",
      minimum_sales_quantity: products?.minimum_sales_quantity || "",
      stok_alert: products?.stok_alert || "",
      is_variant: products?.is_variant || false,
      is_bundle: products?.is_bundle || false,
      sku: products?.sku || "",
      barcode: products?.barcode || "",
      category_ids: products?.categories || [],
      brand_ids: products?.brands || [],
      skus:
        products?.skus && products?.skus.length > 0
          ? products?.skus.map((sku) => ({
              sku: sku?.sku || "",
              barcode: sku?.barcode || "",
              variant_name: sku?.variant_name || "",
              is_active: !!sku?.is_active,
            }))
          : [],
      bundle_items:
        products?.bundle_items && products?.bundle_items.length > 0
          ? products?.bundle_items.map((item) => ({
              product_id: item?.product?.id || "",
              qty: item?.qty || "",
              price: item?.price || "",
            }))
          : [],
      stocks:
        products?.stocks && products?.stocks.length > 0
          ? products?.stocks.map((stock) => ({
              branch_id: stock?.branch_id || activeBranch,
              qty: stock?.qty || "",
              reason: stock?.reason || "",
              type: stock?.type || "",
            }))
          : [
              {
                branch_id: activeBranch,
                qty: "",
                reason: "",
                type: "",
              },
            ],
      prices:
        products?.prices && products?.prices.length > 0
          ? products?.prices.map((price) => ({
              branch_id: price?.branch_id || activeBranch,
              cost: price?.cost || "",
              price: price?.price || "",
              effective_from: price?.effective_from || "",
              effective_until: price?.effective_until || "",
            }))
          : [
              {
                branch_id: activeBranch,
                cost: "",
                price: "",
                effective_from: "",
                effective_until: "",
              },
            ],
    };

    setFormData(mappedData);
  };

  const getProductsForEdit = async () => {
    const res = await getDetailProduct(productId);
    if (res?.data) {
      mapDetailToForm(res?.data);
    }
  };

  useEffect(() => {
    // Fetch master data and product list (for bundle selection)
    Promise.all([
      getBrands(),
      getTypeProducts(),
      getUnits(),
      getCategories(),
      getProducts({ page: 1, per_page: 50, reset: true }),
    ]);

    // Fetch detail if edit mode
    if (editMode && productId) {
      getProductsForEdit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, productId]);

  const getTrashIcon = useMemo(() => {
    return (
      <svg
        width="17"
        height="20"
        viewBox="0 0 17 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M14.25 6.75L13.41 15.148C13.283 16.421 13.22 17.057 12.93 17.538C12.6757 17.9614 12.3016 18.3 11.855 18.511C11.348 18.75 10.71 18.75 9.43 18.75H7.07C5.791 18.75 5.152 18.75 4.645 18.51C4.19805 18.2991 3.82361 17.9606 3.569 17.537C3.281 17.057 3.217 16.421 3.089 15.148L2.25 6.75M9.75 13.25V8.25M6.75 13.25V8.25M0.75 4.25H5.365M5.365 4.25L5.751 1.578C5.863 1.092 6.267 0.75 6.731 0.75H9.769C10.233 0.75 10.636 1.092 10.749 1.578L11.135 4.25M5.365 4.25H11.135M11.135 4.25H15.75"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }, []);

  const validateForm = () => {
    const errors = {};
    const isEmptyStr = (v) =>
      v === undefined || v === null || String(v).trim() === "";
    const isEmptyArr = (v) => !Array.isArray(v) || v.length === 0;

    // Basic required fields
    if (isEmptyStr(formData.name)) errors.name = "Nama produk wajib diisi";
    if (isEmptyStr(formData.code)) errors.code = "Kode produk wajib diisi";
    if (isEmptyStr(formData.type_product_id))
      errors.type_product_id = "Tipe produk wajib dipilih";
    if (isEmptyStr(formData.unit_id)) errors.unit_id = "Unit wajib dipilih";
    if (isEmptyStr(formData.cost_product))
      errors.cost_product = "Biaya/Cost wajib diisi";
    if (isEmptyStr(formData.price_product))
      errors.price_product = "Harga/Price wajib diisi";
    if (isEmptyStr(formData.minimum_sales_quantity))
      errors.minimum_sales_quantity = "Jumlah minimum penjualan wajib diisi";
    if (isEmptyStr(formData.stok_alert))
      errors.stok_alert = "Peringatan stok wajib diisi";

    if (isEmptyArr(formData.category_ids))
      errors.category_ids = "Kategori minimal 1";
    if (isEmptyArr(formData.brand_ids)) errors.brand_ids = "Brand minimal 1";

    // Prices are constructed from cost/price; above fields cover their requirement

    // Stocks validation only in edit mode when user opts to adjust stocks
    if (editMode && adjustStocks) {
      const stock = Array.isArray(formData.stocks) ? formData.stocks[0] : null;
      if (!stock) {
        errors["stocks.qty"] = "Data stok wajib diisi";
      } else {
        if (isEmptyStr(stock.branch_id))
          errors["stocks.branch_id"] = "Cabang wajib diisi";
        if (isEmptyStr(stock.qty))
          errors["stocks.qty"] = "Kuantitas wajib diisi";
        if (isEmptyStr(stock.reason))
          errors["stocks.reason"] = "Alasan wajib diisi";
        if (isEmptyStr(stock.type))
          errors["stocks.type"] = "Tipe penyesuaian wajib dipilih";
      }
    }

    return errors;
  };

  const handleSubmit = async () => {
    // Normalize image: if editMode and user didn't change image (still a string URL/path), send empty string
    const normalizedImage =
      editMode && typeof formData.image === "string" ? "" : formData.image;

    const categoryIds = Array.isArray(formData.category_ids)
      ? formData.category_ids.map((item) =>
          typeof item === "object" && item?.id ? Number(item.id) : Number(item)
        )
      : [];

    const brandIds = Array.isArray(formData.brand_ids)
      ? formData.brand_ids.map((item) =>
          typeof item === "object" && item?.id ? Number(item.id) : Number(item)
        )
      : [];

    const skuForm = (formData.skus || []).map((sku) => ({
      sku: sku?.sku || "",
      barcode: sku?.barcode || "",
      variant_name: sku?.variant_name || "",
      is_active: sku?.is_active ? 1 : 0,
    }));

    // For add mode, exclude `type` from stocks payload
    const stocksPayload = (formData.stocks || []).map((s) => ({
      branch_id: s?.branch_id,
      qty: s?.qty,
      reason: s?.reason,
      ...(editMode ? { type: s?.type } : {}),
    }));

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});

    const dataToSubmit = {
      ...formData,
      image: normalizedImage,
      category_ids: categoryIds,
      brand_ids: brandIds,
      is_variant: formData.is_variant ? 1 : 0,
      is_bundle: formData.is_bundle ? 1 : 0,
      bundle_items: formData.is_bundle ? formData.bundle_items : [],
      skus: formData.is_variant ? skuForm : [],
      stocks: editMode && adjustStocks ? stocksPayload : [],
      prices: [
        {
          branch_id: activeBranch,
          cost: formData.cost_product,
          price: formData.price_product,
          effective_from: getToday,
          effective_until: "01-01-2026",
        },
      ],
    };

    const response = editMode
      ? await editProducts(dataToSubmit, productId)
      : await addProducts(dataToSubmit);

    if (response?.success) {
      toast.success(
        typeof success === "string"
          ? success
          : editMode
          ? "Berhasil mengubah Produk"
          : "Berhasil menambahkan Produk"
      );
      const timer = setTimeout(() => {
        navigate(navigateOnSuccessTo);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      toast.error(
        typeof error === "string"
          ? editMode
            ? "Gagal Mengubah Produk"
            : "Gagal Menambahkan Produk"
          : "Terjadi kesalahan"
      );
    }
  };

  const tipeData = [
    {
      id: "addition",
      name: "Addition",
    },
    {
      id: "reduction",
      name: "Reduction",
    },
  ];

  const renderForm = useMemo(() => {
    return (
      <div className="flex flex-col gap-3 mt-3">
        <div className="flex gap-2">
          <SimpleInput
            name="sku"
            type="text"
            label="SKU"
            value={formData?.sku}
            handleChange={handleChange}
          />
          <SimpleInput
            name="code"
            type="text"
            label="Kode Produk"
            value={formData?.code}
            handleChange={handleChange}
            errors={validationErrors.code}
          />
        </div>

        <SimpleInput
          name="name"
          type="text"
          label="Nama Produk"
          value={formData?.name}
          handleChange={handleChange}
          errors={validationErrors.name}
        />

        <CustomSelectBox
          label="Pilih Brands"
          name="brand_ids"
          value={formData?.brand_ids}
          selectBoxData={brands}
          onChange={(items) => {
            setFormData((prev) => ({
              ...prev,
              brand_ids: items,
            }));
            setValidationErrors((prev) => ({ ...prev, brand_ids: "" }));
          }}
          placeholder="Cari atau pilih..."
          multiple={true}
          errors={validationErrors.brand_ids}
        />

        <CustomSelectBox
          label="Pilih Kategori"
          name="category_ids"
          value={formData?.category_ids}
          selectBoxData={categories}
          onChange={(items) => {
            setFormData((prev) => ({
              ...prev,
              category_ids: items,
            }));
            setValidationErrors((prev) => ({ ...prev, category_ids: "" }));
          }}
          placeholder="Cari atau pilih..."
          multiple={true}
          errors={validationErrors.category_ids}
        />

        <div className="flex gap-2">
          <SimpleInput
            name="type_product_id"
            type="text"
            label="Pilih Tipe"
            value={formData?.type_product_id}
            isSelectBox={true}
            selectBoxData={typeProducts}
            handleChange={handleChange}
            errors={validationErrors.type_product_id}
          />
          <SimpleInput
            name="unit_id"
            type="text"
            label="Pilih Unit"
            value={formData?.unit_id}
            isSelectBox={true}
            selectBoxData={units}
            handleChange={handleChange}
            errors={validationErrors.unit_id}
          />
        </div>

        <SimpleInput
          name="barcode"
          type="text"
          label="Barcode"
          value={formData?.barcode}
          handleChange={handleChange}
        />

        <CustomTextarea
          id="description"
          name="description"
          label="Deskripsi"
          value={formData?.description}
          onChange={handleChange}
          rows={5}
          maxLength={1000}
        />

        <CustomInputFile
          name="image"
          accept="image/*"
          onChange={(file) => setFormData((prev) => ({ ...prev, image: file }))}
          initialPreview={
            typeof formData?.image === "string" && formData.image
              ? /^https?:\/\//.test(formData.image)
                ? formData.image
                : `${import.meta.env.VITE_API_IMAGE}${formData.image}`
              : null
          }
        />

        <div className="flex gap-2">
          <SimpleInput
            name="cost_product"
            type="text"
            label={editMode ? "Cost" : "Biaya"}
            value={formData?.cost_product}
            handleChange={handleChange}
            errors={validationErrors.cost_product}
          />
          <SimpleInput
            name="price_product"
            type="text"
            label={editMode ? "Price" : "Harga"}
            value={formData?.price_product}
            handleChange={handleChange}
            errors={validationErrors.price_product}
          />
        </div>

        <SimpleInput
          name="minimum_sales_quantity"
          type="text"
          label={
            editMode ? "Minimum Sales Quantity" : "Jumlah Minimum Penjualan"
          }
          value={formData?.minimum_sales_quantity}
          handleChange={handleChange}
          errors={validationErrors.minimum_sales_quantity}
        />

        <SimpleInput
          name="stok_alert"
          type="text"
          label={editMode ? "Stock Alert" : "Peringatan Stok"}
          value={formData?.stok_alert}
          handleChange={handleChange}
          errors={validationErrors.stok_alert}
        />

        <div className="mt-6 p-4 border border-gray-200 rounded-lg">
          {/* {editMode && (
            <>
              <h3 className="text-lg font-semibold mb-4">
                Ingin menyesuaikan stok produk?
              </h3>
              <div className="flex gap-6 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="adjust_stocks"
                    value="yes"
                    checked={!!adjustStocks}
                    onChange={() => {
                      setAdjustStocks(true);
                      setFormData((prev) => ({
                        ...prev,
                        stocks:
                          prev.stocks && prev.stocks.length > 0
                            ? [
                                {
                                  branch_id:
                                    prev.stocks[0]?.branch_id || activeBranch,
                                  qty: prev.stocks[0]?.qty || "",
                                  reason: prev.stocks[0]?.reason || "",
                                  type: prev.stocks[0]?.type || "",
                                },
                              ]
                            : [
                                {
                                  branch_id: activeBranch,
                                  qty: "",
                                  reason: "",
                                  type: "",
                                },
                              ],
                      }));
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Ya</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="adjust_stocks"
                    value="no"
                    checked={!adjustStocks}
                    onChange={() => {
                      setAdjustStocks(false);
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Tidak</span>
                </label>
              </div>
            </>
          )} */}

          <div className="flex flex-col gap-2">
            {formData?.stocks?.slice(0, 1).map((item, index) => (
              <div className="flex flex-col gap-2" key={`stock-${index}`}>
                <SimpleInput
                  name="stocks.qty"
                  type="text"
                  label="Stok / Kuantitas"
                  value={item?.qty}
                  handleChange={(e) =>
                    handleNestedChange(
                      "stocks",
                      index,
                      "qty",
                      e.target.value,
                      true
                    )
                  }
                  errors={validationErrors["stocks.qty"]}
                />
                {editMode && (
                  <SimpleInput
                    name="stocks.type"
                    type="text"
                    label="Tipe"
                    isSelectBox={true}
                    selectBoxData={tipeData}
                    value={item?.type}
                    handleChange={(e) =>
                      handleNestedChange(
                        "stocks",
                        index,
                        "type",
                        e.target.value
                      )
                    }
                    errors={validationErrors["stocks.type"]}
                  />
                )}
                <SimpleInput
                  name="stocks.reason"
                  type="text"
                  label="Alasan"
                  value={item?.reason}
                  handleChange={(e) =>
                    handleNestedChange(
                      "stocks",
                      index,
                      "reason",
                      e.target.value
                    )
                  }
                  errors={validationErrors["stocks.reason"]}
                />
              </div>
            ))}
            {/* No add/remove buttons: enforce single row */}
          </div>
        </div>

        {/* Variant Section */}
        <div className="mt-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Produk ini punya varian?
          </h3>
          <div className="flex gap-6 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="has_variant"
                value="yes"
                checked={!!formData?.is_variant}
                onChange={() => {
                  setFormData((prev) => ({
                    ...prev,
                    is_variant: true,
                    skus:
                      prev.skus && prev.skus.length > 0
                        ? prev.skus
                        : [
                            {
                              variant_name: "",
                              sku: "",
                              barcode: "",
                              is_active: editMode ? false : true,
                            },
                          ],
                  }));
                }}
                className="w-4 h-4"
              />
              <span className="text-sm">Ya, memiliki varian</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="has_variant"
                value="no"
                checked={!formData?.is_variant}
                onChange={() => {
                  setFormData((prev) => ({
                    ...prev,
                    is_variant: false,
                    skus: [],
                  }));
                }}
                className="w-4 h-4"
              />
              <span className="text-sm">Tidak</span>
            </label>
          </div>

          {formData?.is_variant && (
            <div className="flex flex-col gap-2 mt-4">
              {formData?.skus?.map((item, index) => (
                <div
                  className="flex flex-col gap-2 w-full"
                  key={`sku-${index}`}
                >
                  <SimpleInput
                    name="skus.variant_name"
                    type="text"
                    label={editMode ? "Variant Name" : "Nama Varian"}
                    value={item?.variant_name}
                    handleChange={(e) =>
                      handleNestedChange(
                        "skus",
                        index,
                        "variant_name",
                        e.target.value
                      )
                    }
                  />
                  <SimpleInput
                    name="skus.sku"
                    type="text"
                    label="SKU"
                    value={item?.sku}
                    handleChange={(e) =>
                      handleNestedChange("skus", index, "sku", e.target.value)
                    }
                  />
                  <SimpleInput
                    name="skus.barcode"
                    type="text"
                    label="Barcode"
                    value={item?.barcode}
                    handleChange={(e) =>
                      handleNestedChange(
                        "skus",
                        index,
                        "barcode",
                        e.target.value
                      )
                    }
                  />
                  {editMode && (
                    <div className="p-4 flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!item?.is_active}
                          onChange={() =>
                            handleNestedChange(
                              "skus",
                              index,
                              "is_active",
                              !item?.is_active
                            )
                          }
                          className="w-4 h-4"
                        />
                        <span className="text-sm">
                          Is Active?: {item?.is_active ? "Yes" : "No"}
                        </span>
                      </label>
                    </div>
                  )}
                  <button
                    type="button"
                    className="font-semibold bg-red-500 p-4 rounded-lg w-fit ml-auto mt-2 text-white"
                    onClick={() => handleRemoveItem("skus", index)}
                  >
                    {getTrashIcon}
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="text-white font-semibold bg-[var(--c-primary)] py-4 px-6 rounded-lg w-fit ml-auto mt-4"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    skus: [
                      ...prev.skus,
                      {
                        variant_name: "",
                        sku: "",
                        barcode: "",
                        is_active: editMode ? false : true,
                      },
                    ],
                  }));
                }}
              >
                {editMode ? "+ Tambah Variant" : "+ Tambah Varian"}
              </button>
            </div>
          )}
        </div>

        {/* Bundle Section */}
        <div className="mt-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">
            Produk ini punya bundle?
          </h3>
          <div className="flex gap-6 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="has_bundle"
                value="yes"
                checked={!!formData?.is_bundle}
                onChange={() => {
                  setFormData((prev) => ({
                    ...prev,
                    is_bundle: true,
                    bundle_items:
                      prev.bundle_items && prev.bundle_items.length > 0
                        ? prev.bundle_items
                        : [
                            {
                              product_id: "",
                              qty: "",
                              price: "",
                            },
                          ],
                  }));
                }}
                className="w-4 h-4"
              />
              <span className="text-sm">Ya, memiliki bundle</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="has_bundle"
                value="no"
                checked={!formData?.is_bundle}
                onChange={() => {
                  setFormData((prev) => ({
                    ...prev,
                    is_bundle: false,
                    bundle_items: [],
                  }));
                }}
                className="w-4 h-4"
              />
              <span className="text-sm">Tidak</span>
            </label>
          </div>

          {formData?.is_bundle && (
            <div className="flex flex-col gap-2 mt-4">
              {formData?.bundle_items?.map((item, index) => (
                <div
                  className="flex flex-col gap-2 w-full"
                  key={`bundle-${index}`}
                >
                  <SimpleInput
                    name="bundle_items.product_id"
                    type="text"
                    label={editMode ? "Product" : "Produk"}
                    value={item?.product_id}
                    handleChange={(e) =>
                      handleNestedChange(
                        "bundle_items",
                        index,
                        "product_id",
                        e.target.value
                      )
                    }
                    isSelectBox={true}
                    selectBoxData={products}
                  />
                  <SimpleInput
                    name="bundle_items.qty"
                    type={editMode ? "number" : "text"}
                    label={editMode ? "Quantity" : "Kuantitas"}
                    value={item?.qty}
                    handleChange={(e) =>
                      handleNestedChange(
                        "bundle_items",
                        index,
                        "qty",
                        e.target.value,
                        true
                      )
                    }
                  />
                  <SimpleInput
                    name="bundle_items.price"
                    type="text"
                    label={editMode ? "Price" : "Harga"}
                    value={item?.price}
                    handleChange={(e) =>
                      handleNestedChange(
                        "bundle_items",
                        index,
                        "price",
                        e.target.value,
                        true
                      )
                    }
                  />
                  <button
                    type="button"
                    className="font-semibold bg-red-500 p-4 rounded-lg w-fit ml-auto mt-2 text-white"
                    onClick={() => handleRemoveItem("bundle_items", index)}
                  >
                    {getTrashIcon}
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="text-white font-semibold bg-[var(--c-primary)] py-4 px-6 rounded-lg w-fit ml-auto mt-4"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    bundle_items: [
                      ...prev.bundle_items,
                      { product_id: "", qty: "", price: "" },
                    ],
                  }));
                }}
              >
                + Tambah Bundle
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-[var(--c-primary)] text-white py-4 w-full rounded-lg font-semibold"
        >
          {isLoading
            ? "Memproses..."
            : editMode
            ? "Edit Produk"
            : "Tambah Produk"}
        </button>
      </div>
    );
  }, [
    formData,
    brands,
    categories,
    typeProducts,
    units,
    products,
    isLoading,
    validationErrors,
  ]);

  return renderForm;
}
