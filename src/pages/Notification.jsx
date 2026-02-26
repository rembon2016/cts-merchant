import { lazy, Suspense } from "react";

const NotificationComponent = lazy(
  () => import("../components/customs/notification/Notification.jsx"),
);

const Notification = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotificationComponent />
    </Suspense>
  );
};

export default Notification;
