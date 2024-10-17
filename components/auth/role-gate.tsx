"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { FormError } from "../form-error";

interface RoleGateProps {
  children: React.ReactNode;
  alloweRole: UserRole;
}

export const RoleGate = ({ children, alloweRole }: RoleGateProps) => {
  const role = useCurrentRole();

  if (role !== alloweRole) {
    return (
      <FormError message="You do not have permission to view this content!" />
    );
  }

  return <>{children}</>;
};
