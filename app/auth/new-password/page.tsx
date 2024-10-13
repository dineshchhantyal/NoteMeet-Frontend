import { Suspense } from "react";
import { NewPasswordForm } from "@/components/auth/new-password-form";
import { Loader2 } from "lucide-react";

export default function NewVerificationPage() {
  return (
    <Suspense fallback={<Loader2 className="h-5 w-5 animate-spin" />}>
      <NewPasswordForm />
    </Suspense>
  );
}
