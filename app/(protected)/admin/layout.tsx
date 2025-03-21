import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';

import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import AdminSubHeader from '@/components/admin/admin-subheader';
import { UserRole } from '@prisma/client';

const geistSans = localFont({
	src: '../../fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: '../../fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export const metadata: Metadata = {
	title: 'NoteMeet - Simplifying Meetings, Maximizing Impact',
	description:
		'NoteMeet is a modern productivity tool designed to enhance the way meetings are scheduled, recorded, and analyzed.',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	if (!session) {
		return null;
	}

	if (session.user?.role !== UserRole.ADMIN) {
		return <div>Nice try, but only admins get to see the cool stuff! 🕶️</div>;
	}

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background font-sans`}
			>
				<Header label="Home" />
				<AdminSubHeader />

				<SessionProvider session={session}>
					<Toaster />

					{children}
				</SessionProvider>
				<Footer />
			</body>
		</html>
	);
}
