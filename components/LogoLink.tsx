import Link from 'next/link';
import Logo from './ui/Logo';

interface LogoLinkProps {
	showText?: boolean;
}

const LogoLink = ({ showText = true }: LogoLinkProps) => {
	return (
		<Link href="/" className="flex items-center space-x-2">
			{/* <Image
				src="/logo.svg"
				alt="NoteMeet Logo"
				width={40}
				height={40}
			/> */}
			<Logo className="h-14 w-14" />
			{showText && (
				<span className="hidden md:block text-2xl text-foreground ">
					<span className="font-bold">note</span>meet
				</span>
			)}
		</Link>
	);
};

export default LogoLink;
