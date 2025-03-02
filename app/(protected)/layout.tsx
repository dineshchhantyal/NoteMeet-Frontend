import { ReduxProvider } from '@/lib/redux/provider';

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <ReduxProvider>{children}</ReduxProvider>;
}
