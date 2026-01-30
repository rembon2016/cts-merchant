import { lazy, Suspense } from "react";
import { RouteLoadingFallback } from "../utils/routeLoading";

const AuthForm = lazy(() => import("../components/auth/AuthForm"));

const Login = () => {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <AuthForm formMode="login" />
    </Suspense>
  );
};

export default Login;
