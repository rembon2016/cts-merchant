import { useLocation } from "react-router-dom";
import POSCategoriesForm from "./POSCategoriesForm";

export default function POSEditCategories() {
  const location = useLocation();
  const pathname = location.pathname;
  const categoryId = pathname.split("/pos/edit-kategori/")[1];

  return <POSCategoriesForm editMode={true} categoryId={categoryId} />;
}
