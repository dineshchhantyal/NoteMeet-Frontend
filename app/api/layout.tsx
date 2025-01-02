export const metadata = {
	title: 'NoteMeet API',
	description: 'NoteMeet API',
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

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
