import { withNextVideo } from 'next-video/process';
// next.config.js

const NEXT_PUBLIC_CHROME_EXTENSION_ID =
	process.env.NEXT_PUBLIC_CHROME_EXTENSION_ID;

/** @type {import('next').NextConfig} */
const nextConfig = {
	async headers() {
		return [
			{
				// matching all API routes
				source: '/api/:path*',
				headers: [
					{ key: 'Access-Control-Allow-Credentials', value: 'true' },
					{
						key: 'Access-Control-Allow-Origin',
						value: `chrome-extension://${NEXT_PUBLIC_CHROME_EXTENSION_ID}`,
					}, // replace this your actual origin
					{
						key: 'Access-Control-Allow-Methods',
						value: 'GET,DELETE,PATCH,POST,PUT',
					},
					{
						key: 'Access-Control-Allow-Headers',
						value:
							'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
					},
				],
			},
		];
	},
};

export default withNextVideo(nextConfig);
