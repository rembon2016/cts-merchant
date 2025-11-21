import CommingSoon from "../../components/customs/element/CommingSoon";
import { useNavigate } from "react-router-dom";

export default function PPOB() {
  const navigate = useNavigate();

  return <CommingSoon onAction={() => navigate("/")} />;
}
