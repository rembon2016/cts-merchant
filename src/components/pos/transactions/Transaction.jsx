import DashboardTransaction from "./DashboardTransaction";
import ListTransaction from "./ListTransaction";

export default function Transaction() {
  return (
    <div className="px-4 py-2">
      <DashboardTransaction />
      <ListTransaction />
    </div>
  );
}
