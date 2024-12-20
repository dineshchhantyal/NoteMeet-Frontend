import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { LoginButton } from "./auth/login-button";
import { useSession } from "next-auth/react";
import { NotificationDropdown } from "@/app/(protected)/dashboard/components/notification-dropdown";
import { UserButton } from "./auth/user-button";
import { useRouter } from "next/navigation";
import LogoLink from "./LogoLink";

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  const { status } = useSession();
  const router = useRouter();



  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" aria-label={label}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <LogoLink showText={true}/>
        
        <div className="flex space-x-4">
            {status === 'unauthenticated' && (
              <>
              <LoginButton mode="modal" asChild>
              <Button variant={"outline"}>Sign In</Button>
              </LoginButton>
              <LoginButton mode="modal" asChild>
              <Button variant={"secondary"}>Sign Up</Button>
              </LoginButton>
              </>
            )}
            {status === 'authenticated' && (
              <>
              <Button variant={"outline"}
              onClick={() => {router.push("/dashboard")}}
              >Dashboard</Button>
               <NotificationDropdown />
                <UserButton />
              </>
            )}
        </div>
      </div>
    </header>
  );
};
