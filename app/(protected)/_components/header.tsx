import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { UserButton } from "../../../components/auth/user-button";
import { NotificationDropdown } from "@/app/(protected)/dashboard/components/notification-dropdown";

interface HeaderProps {
  label: string;
}

const AuthenticatedHeader = ({ label }: HeaderProps) => {

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
              <NotificationDropdown />
                 <UserButton />

        </div>
      </div>
    </header>
  );
};

export default AuthenticatedHeader;