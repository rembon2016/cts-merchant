import { lazy, Suspense } from "react";

const AuthForm = lazy(() => import("../components/auth/AuthForm"));

const Login = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm formMode="login" />
    </Suspense>
  );
};

export default Login;
