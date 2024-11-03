import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  return (
    <Suspense fallback={<Loader2 className="h-5 w-5 animate-spin" />}>
      <RegisterForm />
    </Suspense>
  );
}
