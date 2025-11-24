import { useNavigate } from "react-router-dom";
import CommingSoon from "../components/customs/element/CommingSoon";

export default function CustomerSupport() {
  const navigate = useNavigate();
  return <CommingSoon onAction={() => navigate("/")} />;
}
