import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { LoginButton } from "./auth/login-button";
import { useSession } from "next-auth/react";
import { NotificationDropdown } from "@/app/(protected)/dashboard/components/notification-dropdown";
import { UserButton } from "./auth/user-button";
import { useRouter } from "next/navigation";

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  const { status } = useSession();
  const router = useRouter();



  return (
    <header className="bg-white shadow-sm sticky top-0 z-50" aria-label={label}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="NoteMeet Logo" width={40} height={40} />
          <span className="text-2xl font-bold text-[#4A4A4A]">NoteMeet</span>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link href="/features" className="text-[#4A4A4A] hover:text-[#4A90E2]">Features</Link></li>
            <li><Link href="/pricing" className="text-[#4A4A4A] hover:text-[#4A90E2]">Pricing</Link></li>
            <li><Link href="/contact" className="text-[#4A4A4A] hover:text-[#4A90E2]">Contact</Link></li>
          </ul>
        </nav>
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
