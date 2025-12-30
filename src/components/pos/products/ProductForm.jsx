import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SimpleInput from "../../customs/form/SimpleInput";
import CustomTextarea from "../../customs/form/CustomTextarea";
import CustomInputFile from "../../customs/form/CustomInputFile";
import CustomSelectBox from "../../customs/form/CustomSelectBox";
import BottomModal from "../../customs/menu/BottomModal";

import { useProductStore } from "../../../store/productStore";
import { useCustomToast } from "../../../hooks/useCustomToast";
import CustomToast from "../../customs/toast/CustomToast";
import PrimaryButton from "../../customs/button/PrimaryButton";
import BackButton from "../../customs/button/BackButton";
import { ListStateForm } from "./ListStateForm";

export default function ProductForm({ editMode = false, productId = null }) {
  const navigate = useNavigate();

  const activeBranch = Number?.parseInt(
    sessionStorage?.getItem("branchActive") || 0
  );

  const [formData, setFormData] = useState(ListStateForm(activeBranch));

  const adjustStocks = false;
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
    addCategories,
    addProducts,
    editProducts,
    getDetailProduct,
    products,
    getProducts,
    isLoading,
  } = useProductStore();
  const {
    toast,
    success: showSuccess,
    error: showError,
    hideToast,
  } = useCustomToast();

  const listFormatToNumber = [
    "cost_product",
    "price_product",
    "minimum_sales_quantity",
    "stok_alert",
  ];

  // Inline Add Category
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [newCategoryErrors, setNewCategoryErrors] = useState({});
  const [addingCategory, setAddingCategory] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Delete confirmation & undo for SKUs
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [skuToDelete, setSkuToDelete] = useState(null);
  const [bundleToDelete, setBundleToDelete] = useState(null);
  const [confirmModalType, setConfirmModalType] = useState(null);

  const formatToNumber = (value) => value?.replaceAll(/\D/g, "");

  const formatDateToInput = (val) => {
    if (!val) return "";
    const d = new Date(val);
    const ts = d.getTime();
    return !Number.isNaN(ts) ? d.toISOString().split("T")[0] : "";
  };

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

  const handleRemoveItem = (arrayName, indexOrItem) => {
    setFormData((prev) => {
      // Special handling for SKUs: persisted SKUs (have `id`) should be marked
      // as deleted (action: 'delete') so backend can remove them, but not shown
      // to the user anymore. New SKUs (no id) should be removed from array.
      if (arrayName === "skus") {
        const skus = prev.skus || [];
        let realIndex = -1;

        if (typeof indexOrItem === "number") {
          realIndex = indexOrItem;
        } else {
          // Try find by id first, then by reference equality
          if (indexOrItem?.id) {
            realIndex = skus.findIndex((s) => s?.id === indexOrItem.id);
          } else {
            realIndex = skus.findIndex((s) => s === indexOrItem);
          }
        }

        if (realIndex === -1) return prev;

        const target = skus[realIndex];

        if (target?.id) {
          // mark persisted SKU as deleted but keep it in array so it can be
          // sent to backend with action:'delete'
          const newSkus = skus.map((s, i) =>
            i === realIndex ? { ...s, action: "delete" } : s
          );
          return { ...prev, skus: newSkus };
        } else {
          // remove non-persisted SKU from array
          const newSkus = skus.filter((_, i) => i !== realIndex);
          return { ...prev, skus: newSkus };
        }
      }

      if (arrayName === "bundle_items") {
        const bundles = prev.bundle_items || [];
        let realIndex = -1;

        if (typeof indexOrItem === "number") {
          realIndex = indexOrItem;
        } else {
          // Try find by id first, then by reference equality
          if (indexOrItem?.id) {
            realIndex = bundles.findIndex((b) => b?.id === indexOrItem.id);
          } else {
            realIndex = bundles.findIndex((b) => b === indexOrItem);
          }
        }

        if (realIndex === -1) return prev;

        const target = bundles[realIndex];

        if (target?.id) {
          // mark persisted bundle item as deleted but keep it in array so it can be sent to backend with action:'delete'
          const newBundleItems = bundles.map((b, i) =>
            i === realIndex ? { ...b, action: "delete" } : b
          );
          return { ...prev, bundle_items: newBundleItems };
        } else {
          // remove non-persisted bundle item from array
          const newBundleItems = bundles.filter((_, i) => i !== realIndex);
          return { ...prev, bundle_items: newBundleItems };
        }
      }

      const newArray = prev[arrayName].filter((_, i) => i !== indexOrItem);
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
        products?.skus && products?.skus?.length > 0
          ? products?.skus?.map((sku) => ({
              id: sku?.id || "",
              sku: sku?.sku || "",
              barcode: sku?.barcode || "",
              variant_name: sku?.variant_name || "",
              cost: Number.parseInt(sku?.productPrices?.[0]?.cost) || "",
              price: Number.parseInt(sku?.productPrices?.[0]?.price) || "",
              is_active: !!sku?.is_active,
              qty: sku?.productStocks?.[0]?.qty || 0,
              effective_from: sku?.productPrices?.[0]?.effective_from || null,
              effective_until: sku?.productPrices?.[0]?.effective_until || null,
            }))
          : [],
      bundle_items:
        products?.bundle_items && products?.bundle_items.length > 0
          ? products?.bundle_items.map((bundle) => ({
              id: bundle?.id || "",
              product_id: bundle?.product?.id || "",
              qty: bundle?.qty || "",
              price: bundle?.price || "",
            }))
          : [],
      stocks:
        products?.stocks && products?.stocks.length > 0
          ? products?.stocks.map((stock) => ({
              branch_id: activeBranch,
              qty: stock?.qty || "",
              reason: stock?.reason || "",
              type: stock?.type || "",
            }))
          : [],
      prices:
        products?.prices && products?.prices.length > 0
          ? products?.prices.map((price) => ({
              branch_id: activeBranch,
              cost: price?.cost || "",
              price: price?.price || "",
              effective_from: price?.effective_from || "",
              effective_until: price?.effective_until || "",
            }))
          : [],
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

  const validateForm = () => {
    const errors = {};
    const empty = (v) => !v?.toString().trim();
    const emptyArr = (v) => !Array.isArray(v) || !v.length;

    const newArraySKUS = (formData?.skus || [])
      .filter((s) => s?.action !== "delete")
      .map(({ is_active, barcode, ...rest }) => rest);

    // required fields
    if (empty(formData.name)) errors.name = "Nama produk wajib diisi";
    if (empty(formData.code)) errors.code = "Kode produk wajib diisi";
    if (empty(formData.type_product_id))
      errors.type_product_id = "Tipe produk wajib dipilih";
    if (empty(formData.unit_id)) errors.unit_id = "Unit wajib dipilih";
    if (empty(formData.cost_product)) errors.cost_product = "Biaya wajib diisi";
    if (empty(formData.price_product))
      errors.price_product = "Harga wajib diisi";
    if (empty(formData.minimum_sales_quantity))
      errors.minimum_sales_quantity = "Jumlah minimum penjualan wajib diisi";
    if (empty(formData.stok_alert))
      errors.stok_alert = "Peringatan stok wajib diisi";

    if (emptyArr(formData.category_ids))
      errors.category_ids = "Kategori wajib di pilih";
    if (emptyArr(formData.brand_ids)) errors.brand_ids = "Brand minimal 1";

    // stock adjustment (edit mode only)
    if (editMode && adjustStocks) {
      const stock = formData.stocks?.[0];
      if (!stock || empty(stock.qty))
        errors["stocks.qty"] = "Data stok wajib diisi";
      if (stock) {
        if (empty(stock.qty)) errors["stocks.qty"] = "Kuantitas wajib diisi";
        if (empty(stock.reason)) errors["stocks.reason"] = "Alasan wajib diisi";
        if (empty(stock.type))
          errors["stocks.type"] = "Tipe penyesuaian wajib dipilih";
      }
    }

    if (formData.is_variant) {
      const hasValidSku = newArraySKUS.every((sku) =>
        Object.values(sku).every((val) => !empty(val))
      );
      if (!hasValidSku) {
        errors.skus = "Data SKU wajib di isi";
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

    const skuForm = (formData.skus || [])
      .filter((s) => !(s?.action === "delete" && !s?.id))
      .map((sku) => ({
        id: sku?.id || "",
        sku: sku?.sku || "",
        barcode: sku?.barcode || "",
        variant_name: sku?.variant_name || "",
        reason: sku?.reason || "deskripsi",
        price: sku?.price || "",
        cost: sku?.cost || "",
        qty: sku?.qty || "",
        is_active: sku?.is_active ? 1 : 0,
        branch_id: activeBranch,
        effective_from: sku?.effective_from || "",
        effective_until: sku?.effective_until || "",
        action: sku?.action || (sku?.id ? "update" : "create"),
      }));

    const bundleItemsFrom = (formData?.bundle_items || [])
      // exclude only bundle items that were created locally and then deleted
      .filter((b) => !(b?.action === "delete" && !b?.id))
      .map((bundle) => ({
        id: bundle?.id || "",
        qty: bundle?.qty || "",
        product_id: bundle?.product_id || "",
        price: bundle?.price || "",
        action: bundle?.action || (bundle?.id ? "update" : "create"),
      }));

    const mapStocksFromSku = (formData?.skus || [])
      .filter((s) => s?.action !== "delete")
      .map((sku) => ({
        branch_id: activeBranch,
        qty: sku?.qty,
        reason: sku?.reason,
        product_sku_id: sku?.id || "",
        ...(editMode ? { type: sku?.type } : {}),
      }));

    // For add mode, exclude `type` from stocks payload
    const stocksPayload = (formData.stocks || []).map((s) => ({
      branch_id: activeBranch,
      qty: s?.qty,
      reason: s?.reason,
      product_sku_id: formData?.skus?.[0]?.id || "",
      ...(editMode ? { type: s?.type } : {}),
    }));

    const pricePayload = [
      {
        branch_id: activeBranch,
        cost: formData.cost_product,
        price: formData.price_product,
        effective_from: formData.prices[0]?.effective_from,
        effective_until: formData.prices[0]?.effective_until,
        product_sku_id: formData?.skus?.[0]?.id || "",
      },
    ];

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      showError("Isi semua inputan yang wajib diisi");
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
      bundle_items: formData.is_bundle ? bundleItemsFrom : [],
      skus: formData.is_variant ? skuForm : [],
      stocks: !formData?.is_variant
        ? editMode
          ? stocksPayload
          : formData.stocks
        : mapStocksFromSku,
      prices: pricePayload,
    };

    const response = editMode
      ? await editProducts(dataToSubmit, productId)
      : await addProducts(dataToSubmit);

    if (response?.success === true) {
      showSuccess(
        `${
          editMode
            ? "Produk Berhasil Diperbarui"
            : "Produk Berhasil Ditambahkan"
        }`
      );
      setTimeout(() => {
        navigate("/pos/products", {
          replace: true,
        });
      }, 2000);
    } else {
      showError(
        `${editMode ? "Gagal Memperbarui Produk" : "Gagal Menambahkan Produk"}`
      );
    }
  };

  const elementSKUS = (item, index) => {
    const effectiveFromValue = editMode
      ? formatDateToInput(item?.effective_from)
      : item?.effective_from || "";
    const effectiveUntilValue = editMode
      ? formatDateToInput(item?.effective_until)
      : item?.effective_until || "";

    return (
      <div className="flex flex-col gap-2 w-full" key={`sku-${index}`}>
        <SimpleInput
          name="skus.sku"
          type="text"
          label="SKU"
          value={item?.sku}
          handleChange={(e) =>
            handleNestedChange("skus", index, "sku", e.target.value)
          }
          isRequired={true}
          errors={validationErrors.sku}
        />
        <SimpleInput
          name="skus.variant_name"
          type="text"
          label={"Nama Varian"}
          value={item?.variant_name}
          handleChange={(e) =>
            handleNestedChange("skus", index, "variant_name", e.target.value)
          }
          isRequired={true}
          errors={validationErrors.variant_name}
        />
        <div className="flex gap-2">
          <SimpleInput
            name="skus.cost"
            type="text"
            label="Harga Beli"
            value={item?.cost}
            handleChange={(e) =>
              handleNestedChange("skus", index, "cost", e.target.value, true)
            }
            isRequired={true}
            errors={validationErrors?.cost}
          />
          <SimpleInput
            name="skus.price"
            type="text"
            label="Harga Jual"
            value={item?.price}
            handleChange={(e) =>
              handleNestedChange("skus", index, "price", e.target.value, true)
            }
            isRequired={true}
            errors={validationErrors.price}
          />
        </div>
        <SimpleInput
          name="skus.qty"
          type="text"
          label="Stok"
          value={item?.qty}
          handleChange={(e) =>
            handleNestedChange("skus", index, "qty", e.target.value, true)
          }
          isRequired={true}
          errors={validationErrors.qty}
        />
        <div className="flex gap-2 w-full">
          <SimpleInput
            name="skus.effective_from"
            type="date"
            label="Berlaku Dari"
            value={effectiveFromValue}
            handleChange={(e) =>
              handleNestedChange(
                "skus",
                index,
                "effective_from",
                e.target.value
              )
            }
            isDefaultSize={false}
            isRequired={true}
            errors={validationErrors.effective_from}
          />
          <SimpleInput
            name="skus.effective_until"
            type="date"
            label="Berlaku Sampai"
            value={effectiveUntilValue}
            handleChange={(e) =>
              handleNestedChange(
                "skus",
                index,
                "effective_until",
                e.target.value
              )
            }
            isDefaultSize={false}
            isRequired={true}
            errors={validationErrors.effective_until}
          />
        </div>

        <SimpleInput
          name="skus.barcode"
          type="text"
          label="Barcode"
          value={item?.barcode}
          handleChange={(e) =>
            handleNestedChange("skus", index, "barcode", e.target.value)
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
          onClick={() => {
            setSkuToDelete(item);
            setShowDeleteConfirm(true);
            setConfirmModalType("varian");
          }}
        >
          {getTrashIcon}
        </button>
      </div>
    );
  };

  const elementBundle = (item, index) => {
    return (
      <div className="flex flex-col gap-2 w-full" key={`bundle-${index}`}>
        <SimpleInput
          name="bundle_items.product_id"
          type="text"
          label={"Produk"}
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
          type={"text"}
          label={"Kuantitas"}
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
          label={"Harga"}
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
          onClick={() => {
            setBundleToDelete(item);
            setShowDeleteConfirm(true);
            setConfirmModalType("bundle");
          }}
        >
          {getTrashIcon}
        </button>
      </div>
    );
  };

  const handleAutoAddCategory = async (name) => {
    const payload = {
      name: name,
      description: "",
      image: "",
    };

    const res = await addCategories(payload);

    if (res?.success) {
      showSuccess(`Kategori "${name}" berhasil ditambahkan`);
      await getCategories();

      if (res?.data?.id) {
        setFormData((prev) => ({
          ...prev,
          category_ids: [...(prev.category_ids || []), res.data],
        }));
      }
    } else {
      showError(res?.error || "Gagal menambahkan kategori");
    }
  };

  // Delete confirmation and undo helpers for SKUs and Bundle Items
  const handleConfirmDelete = () => {
    // require at least one selected target
    if (!skuToDelete && !bundleToDelete) return;

    if (skuToDelete) {
      handleRemoveItem("skus", skuToDelete);
    } else if (bundleToDelete) {
      handleRemoveItem("bundle_items", bundleToDelete);
    }

    setSkuToDelete(null);
    setBundleToDelete(null);
    setConfirmModalType(null);
    setShowDeleteConfirm(false);
  };

  const handleCancelDelete = () => {
    setSkuToDelete(null);
    setBundleToDelete(null);
    setConfirmModalType(null);
    setShowDeleteConfirm(false);
  };

  const handleUndoDelete = (item, name) => {
    setFormData((prev) => ({
      ...prev,
      [name]: (prev[name] || []).map((s) =>
        s?.id && item?.id
          ? s.id === item.id
            ? { ...s, action: "update" }
            : s
          : s === item
          ? { ...s, action: "create" }
          : s
      ),
    }));
  };

  const renderForm = useMemo(() => {
    const effectiveFromValue = editMode
      ? formatDateToInput(formData?.prices?.[0]?.effective_from)
      : formData?.prices?.[0]?.effective_from || "";
    const effectiveUntilValue = editMode
      ? formatDateToInput(formData?.prices?.[0]?.effective_until)
      : formData?.prices?.[0]?.effective_until || "";

    const pendingDeletedSkus = (formData?.skus || []).filter(
      (s) => s?.action === "delete"
    );

    const pendingDeletedBundles = (formData?.bundle_items || []).filter(
      (b) => b?.action === "delete"
    );

    return (
      <div className="flex flex-col gap-3 mt-3 p-4">
        <BackButton to="/pos/products" />
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
            isRequired={true}
          />
        </div>

        <SimpleInput
          name="name"
          type="text"
          label="Nama Produk"
          value={formData?.name}
          handleChange={handleChange}
          errors={validationErrors.name}
          isRequired={true}
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
          isRequired={true}
        />

        {Array.isArray(categories) && categories.length !== 0 && (
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
            isRequired={true}
            onAddItem={handleAutoAddCategory}
            inputName="Kategori"
          />
        )}

        {Array.isArray(categories) && categories.length === 0 ? (
          <div
            className={`mt-2 rounded-lg border-2  ${
              validationErrors.category_ids
                ? "border-red-500"
                : "border-gray-300"
            } p-4 bg-white`}
          >
            <div className="mb-1">
              <h4
                className={`font-semibold text-sm ${
                  validationErrors.category_ids
                    ? "text-red-500"
                    : "text-gray-800"
                }`}
              >
                Belum ada kategori
              </h4>
            </div>
            <button
              type="button"
              className={`text-sm font-medium ${
                validationErrors.category_ids
                  ? "text-red-500"
                  : "text-[var(--c-primary)]"
              }`}
              onClick={() => setShowCategoryModal(true)}
            >
              + Tambah kategori baru
            </button>
          </div>
        ) : null}

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
            isRequired={true}
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
            isRequired={true}
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
          label="Foto Produk"
        />

        <div className="flex gap-2">
          <SimpleInput
            name="cost_product"
            type="text"
            label="Biaya"
            value={formData?.cost_product}
            handleChange={handleChange}
            errors={validationErrors.cost_product}
            isRequired={true}
          />
          <SimpleInput
            name="price_product"
            type="text"
            label="Harga"
            value={formData?.price_product}
            handleChange={handleChange}
            errors={validationErrors.price_product}
            isRequired={true}
          />
        </div>

        <div className="flex gap-2 w-full">
          <SimpleInput
            name="prices.effective_from"
            type="date"
            label="Berlaku Dari"
            value={effectiveFromValue}
            handleChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                prices: prev.prices.map((price, i) =>
                  i === 0 ? { ...price, effective_from: e.target.value } : price
                ),
              }))
            }
            errors={validationErrors["prices.effective_from"]}
            isDefaultSize={false}
            isRequired={true}
          />
          <SimpleInput
            name="prices.effective_until"
            type="date"
            label="Berlaku Sampai"
            value={effectiveUntilValue}
            handleChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                prices: prev.prices.map((price, i) =>
                  i === 0
                    ? {
                        ...price,
                        effective_until: !editMode
                          ? e.target.value
                          : formatDateToInput(e.target.value),
                      }
                    : price
                ),
              }))
            }
            errors={validationErrors["prices.effective_until"]}
            isDefaultSize={false}
            isRequired={true}
          />
        </div>

        <SimpleInput
          name="minimum_sales_quantity"
          type="text"
          label={"Jumlah Minimum Penjualan"}
          value={formData?.minimum_sales_quantity}
          handleChange={handleChange}
          errors={validationErrors.minimum_sales_quantity}
          isRequired={true}
        />

        <SimpleInput
          name="stok_alert"
          type="text"
          label={"Peringatan Stok"}
          value={formData?.stok_alert}
          handleChange={handleChange}
          errors={validationErrors.stok_alert}
          isRequired={true}
        />

        <div className="mt-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
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
                    value={item?.type || "addition"}
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
        <div className="mt-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
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
                              price: "",
                              cost: "",
                              qty: "",
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
              {formData?.skus
                ?.filter((s) => s?.action !== "delete")
                .map((item, index) => elementSKUS(item, index))}

              {pendingDeletedSkus.length > 0 && (
                <div className="mt-4 p-4 rounded-lg border border-yellow-300 bg-yellow-50">
                  <h4 className="font-semibold mb-2">Pending deletions</h4>
                  <div className="flex flex-col gap-2">
                    {pendingDeletedSkus.map((s, i) => (
                      <div
                        key={`pending-sku-${s?.id || i}`}
                        className="flex items-center justify-between gap-2 bg-white p-2 rounded"
                      >
                        <div className="text-sm">
                          {s?.product_id || "(Unnamed)"}
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="text-sm px-3 py-2 rounded border"
                            onClick={() => handleUndoDelete(s, "skus")}
                          >
                            Undo
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
                        price: "",
                        cost: "",
                        qty: "",
                        effective_from: null,
                        effective_until: null,
                        is_active: true,
                      },
                    ],
                  }));
                }}
              >
                {"+ Tambah Varian"}
              </button>
            </div>
          )}
        </div>

        {/* Bundle Section */}
        <div className="mt-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
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
              {formData?.bundle_items
                ?.filter((s) => s?.action !== "delete")
                .map((item, index) => elementBundle(item, index))}

              {pendingDeletedBundles.length > 0 && (
                <div className="mt-4 p-4 rounded-lg border border-yellow-300 bg-yellow-50">
                  <h4 className="font-semibold mb-2">Pending deletions</h4>
                  <div className="flex flex-col gap-2">
                    {pendingDeletedBundles.map((s, i) => (
                      <div
                        key={`pending-sku-${s?.id || i}`}
                        className="flex items-center justify-between gap-2 bg-white p-2 rounded"
                      >
                        <div className="text-sm">
                          {s?.variant_name || "(Unnamed)"}
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="text-sm px-3 py-2 rounded border"
                            onClick={() => handleUndoDelete(s, "bundle_items")}
                          >
                            Undo
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

        <PrimaryButton
          isLoading={isLoading}
          handleOnClick={handleSubmit}
          title="Simpan"
          disableCondition={isLoading}
        />
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
    newCategory,
    newCategoryErrors,
    addingCategory,
  ]);

  return (
    <>
      <CustomToast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.duration}
      />
      <BottomModal
        isOpen={showCategoryModal}
        setIsOpen={setShowCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        mode="custom"
        title="Tambah Kategori"
      >
        <SimpleInput
          name="new_category_name"
          type="text"
          label="Nama Kategori"
          value={newCategory.name}
          handleChange={(e) => {
            const v = e.target.value;
            setNewCategory((prev) => ({ ...prev, name: v }));
            setNewCategoryErrors((prev) => ({ ...prev, name: "" }));
          }}
          isRequired={true}
          errors={newCategoryErrors.name}
        />
        <SimpleInput
          name="new_category_description"
          type="text"
          label="Deskripsi (opsional)"
          value={newCategory.description}
          handleChange={(e) =>
            setNewCategory((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
        />
        <CustomInputFile
          name="new_category_image"
          accept="image/*"
          onChange={(file) =>
            setNewCategory((prev) => ({ ...prev, image: file }))
          }
          label="Gambar Kategori (opsional)"
        />
        <div className="flex justify-end pt-2">
          <button
            type="button"
            className="px-4 py-2 rounded-lg bg-[var(--c-primary)] text-white text-sm font-medium disabled:opacity-60"
            onClick={async () => {
              const errs = {};
              if (!newCategory.name || String(newCategory.name).trim() === "") {
                errs.name = "Nama kategori wajib diisi";
              }
              setNewCategoryErrors(errs);
              if (Object.keys(errs).length > 0) return;
              try {
                setAddingCategory(true);
                const payload = {
                  name: newCategory.name.trim(),
                  description: newCategory.description || "",
                  image: newCategory.image || "",
                };
                const res = await addCategories(payload);
                await getCategories();
                let createdId =
                  res?.data?.id || res?.data?.category?.id || null;
                if (!createdId) {
                  const list = useProductStore.getState().categories || [];
                  const match = list.find(
                    (c) =>
                      String(c?.name || "").toLowerCase() ===
                      String(newCategory.name).trim().toLowerCase()
                  );
                  if (match?.id) createdId = match.id;
                }
                if (createdId) {
                  setFormData((prev) => ({
                    ...prev,
                    category_ids: [...(prev.category_ids || []), createdId],
                  }));
                }
                showSuccess("Kategori Berhasil Ditambahkan");
                setNewCategory({ name: "", description: "", image: null });
                setShowCategoryModal(false);
              } catch (e) {
                showError("Gagal Menambahkan Kategori");
              } finally {
                setAddingCategory(false);
              }
            }}
            disabled={addingCategory || isLoading}
          >
            {addingCategory || isLoading ? "Menyimpan..." : "Simpan Kategori"}
          </button>
        </div>
      </BottomModal>

      <BottomModal
        isOpen={showDeleteConfirm}
        setIsOpen={setShowDeleteConfirm}
        onClose={handleCancelDelete}
        mode="custom"
        title={`Hapus ${confirmModalType}`}
        bodyHeight={"100px"}
      >
        <div className="p-4">
          <p>
            Apakah Anda yakin ingin menghapus {confirmModalType} "
            {confirmModalType === "varian"
              ? skuToDelete?.variant_name || "(Unnamed)"
              : "ini"}
            "?
          </p>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border"
              onClick={handleCancelDelete}
            >
              Batal
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-red-500 text-white"
              onClick={handleConfirmDelete}
            >
              Hapus
            </button>
          </div>
        </div>
      </BottomModal>

      {renderForm}
    </>
  );
}
