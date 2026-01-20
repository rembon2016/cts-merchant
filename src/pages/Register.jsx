import { lazy, Suspense } from "react";

const AuthForm = lazy(() => import("../components/auth/AuthForm"));

const Register = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthForm formMode="register" />
    </Suspense>
  );
};

export default Register;
