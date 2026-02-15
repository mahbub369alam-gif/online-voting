import { CheckAuth } from "@/components/auth/check-auth";
import { LoginForm } from "@/components/auth/login-form";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <CheckAuth>
      <LoginForm />
    </CheckAuth>
  );
}
