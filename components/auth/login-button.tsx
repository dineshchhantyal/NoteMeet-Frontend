import Link from 'next/link';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { LoginForm } from '@/components/auth/login-form';

interface LoginButtonProps {
	children: React.ReactNode;
	mode?: 'modal' | 'redirect';
	asChild?: boolean;
}

export const LoginButton = ({
	children,
	mode = 'redirect',
}: LoginButtonProps) => {
	if (mode === 'modal') {
		return (
			<Dialog>
				<DialogTrigger asChild>{children}</DialogTrigger>
				<DialogContent className="p-0 w-auto bg-transparent border-none">
					<LoginForm />
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Link href="/auth/login" className="cursor-pointer">
			{children}
		</Link>
	);
};
