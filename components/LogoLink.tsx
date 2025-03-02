import Link from 'next/link';
import Logo from './ui/Logo';

interface LogoLinkProps {
	showText?: boolean;
}

const LogoLink = ({ showText = true }: LogoLinkProps) => {
	return (
		<Link href="/" className="flex items-center space-x-2 group">
			<Logo className="h-10 w-10 transition-transform duration-300 group-hover:rotate-6" />
			{showText && (
				<span className="hidden md:block text-2xl text-white">
					<span className="font-bold">note</span>
					<span className="text-[#63d392] font-medium">meet</span>
				</span>
			)}
		</Link>
	);
};

export default LogoLink;
