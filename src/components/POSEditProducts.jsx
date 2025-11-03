import { useEffect, useMemo, useState } from "react";
import SimpleInput from "./form/SimpleInput";
import CustomTextarea from "./form/CustomTextarea";
import CustomInputFile from "./form/CustomInputFile";
import CustomCheckbox from "./form/CustomCheckbox";
import { useProductStore } from "../store/productStore";
import { toast, ToastContainer } from "react-toastify";
import CustomSelectBox from "./form/CustomSelectBox";
import { useLocation, useNavigate } from "react-router-dom";

export default function POSEditProducts() {
  const getToday = new Date().toISOString().split("T")[0];
  const activeBranch = sessionStorage.getItem("branchActive");

  const location = useLocation();
  const pathname = location.pathname;

  const navigate = useNavigate();

  const productId = pathname.split("/pos/edit-produk/")[1];

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
    skus: [
      {
        sku: "",
        barcode: "",
        variant_name: "",
        is_active: false,
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
        branch_id: activeBranch,
        qty: "",
        reason: "",
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

  const {
    brands,
    getBrands,
    products,
    getTypeProducts,
    typeProducts,
    units,
    getUnits,
    categories,
    getCategories,
    editProducts,
    getDetailProduct,
    success,
    error,
    isLoading,
  } = useProductStore();

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
  };

  const handleNestedChange = (
    arrayName,
    index,
    fieldName,
    value,
    isFormatToNumber
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
  };

  const handleRemoveItem = (arrayName, index) => {
    setFormData((prev) => {
      const newArray = prev[arrayName].filter((_, i) => i !== index);
      const updates = { [arrayName]: newArray };

      // Auto set is_bundle to false if all bundle_items are removed
      if (arrayName === "bundle_items" && newArray.length === 0) {
        updates.is_bundle = false;
      }

      // Auto set is_variant to false if all skus are removed
      if (arrayName === "skus" && newArray.length === 0) {
        updates.is_variant = false;
      }

      return { ...prev, ...updates };
    });
  };

  const handleSubmit = async () => {
    // Extract IDs as numbers from category_ids and brand_ids
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

    const dataToSubmit = {
      ...formData,
      category_ids: categoryIds,
      brand_ids: brandIds,
      is_variant: formData.is_variant ? 1 : 0,
      is_bundle: formData.is_bundle ? 1 : 0,
      bundle_items: formData.is_bundle ? formData.bundle_items : [],
      skus: formData.is_variant ? formData.skus : [],
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

    const response = await editProducts(dataToSubmit, products?.id);

    if (response?.success) {
      toast.success(
        typeof success === "string" ? success : "Berhasil mengubah Produk",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
      setTimeout(() => {
        navigate("/pos/products");
      }, 3000);

      return () => clearTimeout();
    } else {
      toast.error(
        typeof error === "string"
          ? "Gagal Menambahkan Produk"
          : "Terjadi kesalahan",
        {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  };

  const getDetailProductsForEdited = async () => {
    await getDetailProduct(productId);
  };

  useEffect(() => {
    if (pathname.includes("/pos/edit-produk")) {
      if (!productId) return;
      getDetailProductsForEdited();
    }
    Promise.all([
      getBrands(),
      getTypeProducts(),
      getUnits(),
      getCategories(),
      // getProducts(),
    ]);
  }, [pathname, productId]);

  // Effect untuk mapping data dari products ke formData
  useEffect(() => {
    if (products?.id) {
      // Map data dari API ke format yang dibutuhkan form
      const mappedData = {
        code: products.code || "",
        name: products.name || "",
        description: products.description || "",
        image: products.image || "",
        type_product_id: products.type_product?.id || "",
        unit_id: products.unit?.id || "",
        cost_product: products.cost_product || "",
        price_product: products.price_product || "",
        minimum_sales_quantity: products.minimum_sales_quantity || "",
        stok_alert: products.stok_alert || "",
        is_variant: products.is_variant || false,
        is_bundle: products.is_bundle || false,
        sku: products.sku || "",
        barcode: products.barcode || "",
        // Map categories dari array objek ke array ID, tapi simpan objek untuk CustomSelectBox
        category_ids: products.categories || [],
        // Map brands dari array objek ke array ID, tapi simpan objek untuk CustomSelectBox
        brand_ids: products.brands || [],
        // Map skus dari API
        skus:
          products.skus && products.skus.length > 0
            ? products.skus.map((sku) => ({
                sku: sku.sku || "",
                barcode: sku.barcode || "",
                variant_name: sku.variant_name || "",
                is_active: sku.is_active || false,
              }))
            : [
                {
                  sku: "",
                  barcode: "",
                  variant_name: "",
                  is_active: false,
                },
              ],
        // Map bundle_items dari API
        bundle_items:
          products.bundle_items && products.bundle_items.length > 0
            ? products.bundle_items.map((item) => ({
                product_id: item.product?.id || "",
                qty: item.qty || "",
                price: item.price || "",
              }))
            : [
                {
                  product_id: "",
                  qty: "",
                  price: "",
                },
              ],
        // Map stocks dari API
        stocks:
          products.stocks && products.stocks.length > 0
            ? products.stocks.map((stock) => ({
                branch_id: stock.branch_id || activeBranch,
                qty: stock.qty || "",
                reason: stock.reason || "",
              }))
            : [
                {
                  branch_id: activeBranch,
                  qty: "",
                  reason: "",
                },
              ],
        // Map prices dari API
        prices:
          products.prices && products.prices.length > 0
            ? products.prices.map((price) => ({
                branch_id: price.branch_id || activeBranch,
                cost: price.cost || "",
                price: price.price || "",
                effective_from: price.effective_from || "",
                effective_until: price.effective_until || "",
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
    }
  }, [products, activeBranch]);

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

  const renderElements = useMemo(() => {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <SimpleInput
            name="sku"
            type="text"
            label="SKU"
            value={formData?.sku}
            handleChange={handleChange}
            // disabled={true}
          />
          <SimpleInput
            name="code"
            type="text"
            label="Kode Produk"
            value={formData?.code}
            handleChange={handleChange}
            // disabled={true}
          />
        </div>
        <SimpleInput
          name="name"
          type="text"
          label="Nama Produk"
          value={formData?.name}
          handleChange={handleChange}
          // disabled={true}
        />
        <CustomSelectBox
          label="Pilih Brands"
          name="brand_ids"
          value={formData?.brand_ids}
          selectBoxData={brands}
          onChange={(items) => {
            // Simpan array objek untuk CustomSelectBox
            setFormData((prev) => ({
              ...prev,
              brand_ids: items,
            }));
          }}
          placeholder="Cari atau pilih..."
          multiple={true}
        />
        <CustomSelectBox
          label="Pilih Kategori"
          name="category_ids"
          value={formData?.category_ids}
          selectBoxData={categories}
          onChange={(items) => {
            // Simpan array objek untuk CustomSelectBox
            setFormData((prev) => ({
              ...prev,
              category_ids: items,
            }));
          }}
          placeholder="Cari atau pilih..."
          multiple={true}
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
          />
          <SimpleInput
            name="unit_id"
            type="text"
            label="Pilih Unit"
            value={formData?.unit_id}
            isSelectBox={true}
            selectBoxData={units}
            handleChange={handleChange}
            // disabled={true}
          />
        </div>

        <SimpleInput
          name="barcode"
          type="text"
          label="Barcode"
          value={formData?.barcode}
          handleChange={handleChange}
          // disabled={true}
        />
        <CustomTextarea
          id="description"
          name="description"
          label="Deskripsi"
          value={formData?.description}
          onChange={handleChange}
          rows={5}
          maxLength={1000}
          // helperText="Tulis deskripsi singkat produk (opsional)."
        />

        <CustomInputFile
          name="image"
          accept="image/*"
          onChange={(file) => setFormData((prev) => ({ ...prev, image: file }))}
          initialPreview={formData?.image || null}
        />

        <div className="flex gap-2">
          <SimpleInput
            name="cost_product"
            type="text"
            label="Cost"
            value={formData?.cost_product}
            handleChange={handleChange}
          />
          <SimpleInput
            name="price_product"
            type="text"
            label="Price"
            value={formData?.price_product}
            handleChange={handleChange}
          />
        </div>

        <SimpleInput
          name="minimum_sales_quantity"
          type="text"
          label="Minimum Sales Quantity"
          value={formData?.minimum_sales_quantity}
          handleChange={handleChange}
          // disabled={true}
        />
        <SimpleInput
          name="stok_alert"
          type="text"
          label="Stock Alert"
          value={formData?.stok_alert}
          handleChange={handleChange}
          // disabled={true}
        />
        {formData?.stocks?.map((item, index) => (
          <div className="flex flex-col gap-2" key={index}>
            <SimpleInput
              name="stocks.qty"
              type="text"
              label="Stocks / Quantity"
              value={item?.qty}
              handleChange={(e) =>
                handleNestedChange("stocks", index, "qty", e.target.value, true)
              }
            />
            <SimpleInput
              name="stocks.reason"
              type="text"
              label="Reason"
              value={item?.reason}
              handleChange={(e) =>
                handleNestedChange("stocks", index, "reason", e.target.value)
              }
            />
          </div>
        ))}

        <div className="py-4 flex justify-between">
          <div className="flex items-center gap-2">
            <CustomCheckbox
              id="is_bundle"
              name="is_bundle"
              checked={formData?.is_bundle}
              onChange={() =>
                setFormData((prev) => ({ ...prev, is_bundle: !prev.is_bundle }))
              }
              size="md"
            />
            <div className="mt-2 text-sm">Is Bundle?</div>
          </div>
          <div className="flex items-center gap-2">
            <CustomCheckbox
              id="is_variant"
              name="is_variant"
              checked={formData?.is_variant}
              onChange={() =>
                setFormData((prev) => ({
                  ...prev,
                  is_variant: !prev.is_variant,
                }))
              }
              size="md"
            />
            <div className="mt-2 text-sm">Is Variant?</div>
          </div>
        </div>
        {formData?.is_bundle && (
          <div className="flex flex-col gap-2 items-end">
            <button
              className="text-white font-semibold bg-[var(--c-primary)] py-4 px-6 rounded-lg"
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
            {formData?.bundle_items?.map((item, index) => (
              <div className="flex flex-col gap-2 w-full" key={index}>
                <SimpleInput
                  name="bundle_items.product_id"
                  type="text"
                  label="Product"
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
                  // disabled={true}
                />
                <SimpleInput
                  name="bundle_items.qty"
                  type="number"
                  label="Quantity"
                  value={item?.qty}
                  handleChange={(e) =>
                    handleNestedChange(
                      "bundle_items",
                      index,
                      "qty",
                      e.target.value
                    )
                  }
                  // disabled={true}
                />
                <SimpleInput
                  name="bundle_items.price"
                  type="text"
                  label="Price"
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
                  // disabled={true}
                />
                <button
                  className="font-semibold bg-red-500 p-4 rounded-lg w-fit ml-auto mt-2"
                  onClick={() => handleRemoveItem("bundle_items", index)}
                >
                  {getTrashIcon}
                </button>
              </div>
            ))}
          </div>
        )}
        {formData?.is_variant && (
          <div className="flex flex-col gap-2 items-end">
            <button
              className="text-white font-semibold bg-[var(--c-primary)] py-4 px-6 rounded-lg"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  skus: [
                    ...prev.skus,
                    {
                      variant_name: "",
                      sku: "",
                      barcode: "",
                      is_active: false,
                    },
                  ],
                }));
              }}
            >
              + Tambah Variant
            </button>
            {formData?.skus?.map((item, index) => (
              <div className="flex flex-col gap-2 w-full" key={index}>
                <SimpleInput
                  name="skus.variant_name"
                  type="text"
                  label="Variant Name"
                  value={item?.variant_name}
                  handleChange={(e) =>
                    handleNestedChange(
                      "skus",
                      index,
                      "variant_name",
                      e.target.value
                    )
                  }
                  // disabled={true}
                />
                <SimpleInput
                  name="skus.sku"
                  type="text"
                  label="SKU"
                  value={item?.sku}
                  handleChange={(e) =>
                    handleNestedChange("skus", index, "sku", e.target.value)
                  }
                  // disabled={true}
                />
                <SimpleInput
                  name="skus.barcode"
                  type="text"
                  label="Barcode"
                  value={item?.barcode}
                  handleChange={(e) =>
                    handleNestedChange("skus", index, "barcode", e.target.value)
                  }
                  // disabled={true}
                />
                <div className="p-4 flex items-center gap-2">
                  <CustomCheckbox
                    id={`skus.is_active.${index}`}
                    name="skus.is_active"
                    checked={item?.is_active}
                    onChange={() =>
                      handleNestedChange(
                        "skus",
                        index,
                        "is_active",
                        !item.is_active
                      )
                    }
                    size="md"
                  />
                  <div className="mt-2 text-sm">
                    Is Active?: {item?.is_active ? "Yes" : "No"}
                  </div>
                </div>
                <button
                  className="font-semibold bg-red-500 p-4 rounded-lg w-fit ml-auto mt-2"
                  onClick={() => handleRemoveItem("skus", index)}
                >
                  {getTrashIcon}
                </button>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-[var(--c-primary)] text-white py-4 w-full rounded-lg font-semibold"
        >
          {isLoading ? "Memproses..." : "Edit Produk"}
        </button>
      </div>
    );
  }, [formData, handleChange, isLoading]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <ToastContainer />
      {renderElements}
    </div>
  );
}
