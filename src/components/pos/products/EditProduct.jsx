import { useLocation } from "react-router-dom";
import ProductForm from "./ProductForm";

export default function EditProduct() {
  const location = useLocation();
  const pathname = location.pathname;
  const productId = pathname.split("/pos/edit-produk/")[1];
  return <ProductForm editMode={true} productId={productId} />;
}
