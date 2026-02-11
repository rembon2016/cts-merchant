import { useNavigate } from "react-router-dom";
import PPOBTemp from "./PPOBTemp";

export default function PPOB() {
  const navigate = useNavigate();

  // return <CommingSoon onAction={() => navigate("/")} />;
  return <PPOBTemp onAction={() => navigate("/")} />;
}
