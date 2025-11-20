import POSTransactionDashboard from "./POSTransactionDasbhaord";
import POSListTransaction from "./POSListTransaction";

export default function POSTransaction() {
  return (
    <div className="px-4 py-2">
      <POSTransactionDashboard />
      <POSListTransaction />
    </div>
  );
}
