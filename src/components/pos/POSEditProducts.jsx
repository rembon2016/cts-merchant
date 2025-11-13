import { useLocation } from "react-router-dom";
import POSProductForm from "./POSProductForm";

export default function POSEditProducts() {
  const location = useLocation();
  const pathname = location.pathname;
  const productId = pathname.split("/pos/edit-produk/")[1];
  return <POSProductForm editMode={true} productId={productId} />;
}
