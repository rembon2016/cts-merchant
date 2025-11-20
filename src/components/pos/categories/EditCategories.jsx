import { useLocation } from "react-router-dom";
import CategoriesForm from "./CategoriesForm";

export default function EditCategories() {
  const location = useLocation();
  const pathname = location.pathname;
  const categoryId = pathname.split("/pos/edit-kategori/")[1];

  return <CategoriesForm editMode={true} categoryId={categoryId} />;
}
