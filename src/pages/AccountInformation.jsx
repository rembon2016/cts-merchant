import { lazy, Suspense } from "react";

const AccountInformationComponent = lazy(
  () => import("../components/user/AccountInformation"),
);
export default function AccountInformation() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountInformationComponent />
    </Suspense>
  );
}
