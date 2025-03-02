import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/sonner';
import '@/styles/globals.css';

import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import { Footer } from '@/components/footer';
import { Header } from '@/components/header';
import { ReduxProvider } from '@/lib/redux/provider';

const geistSans = localFont({
	src: '../fonts/GeistVF.woff',
	variable: '--font-geist-sans',
	weight: '100 900',
});
const geistMono = localFont({
	src: '../fonts/GeistMonoVF.woff',
	variable: '--font-geist-mono',
	weight: '100 900',
});

export const metadata: Metadata = {
	title: 'NoteMeet - Simplifying Meetings, Maximizing Impact',
	description:
		'NoteMeet is a modern productivity tool designed to enhance the way meetings are scheduled, recorded, and analyzed.',
	icons: {
		icon: '/icons/favicon.ico',
		shortcut: '/icons/favicon-16x16.png',
		apple: '/icons/apple-touch-icon.png',
		other: [
			{
				rel: 'icon',
				url: '/icons/favicon-32x32.png',
			},
			{
				rel: 'android-chrome',
				url: '/icons/android-chrome-192x192.png',
			},
			{
				rel: 'apple-touch-icon',
				url: '/icons/apple-touch-icon.png',
			},
			{
				rel: 'manifest',
				url: '/icons/site.webmanifest',
			},
		],
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#0a4a4e] text-white font-sans`}
			>
				<Header label="Home" />

				<SessionProvider session={session}>
					<ReduxProvider>
						<Toaster />
						{children}
					</ReduxProvider>
				</SessionProvider>
				<Footer />
			</body>
		</html>
	);
}
