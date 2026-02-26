import { lazy, Suspense } from "react";

const EditProfileComponent = lazy(
  () => import("../components/user/EditProfile"),
);

export default function EditProfile() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditProfileComponent />
    </Suspense>
  );
}
