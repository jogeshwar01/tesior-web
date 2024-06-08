import LoginForm from "@/components/layout/login-form";
import { Suspense } from "react";

export default function Login() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
