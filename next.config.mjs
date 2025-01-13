import { withNextVideo } from 'next-video/process';
// next.config.js

const EXTENSIONS = [
	,
	{
		browser: 'chrome',
		type: 'development',
		id: 'jgieeopdjainceemppplhdpaphahecji',
	},
	{
		browser: 'chrome',
		type: 'production',
		id: 'iglooicboappkpddcinabadplpbkchfl',
	},
];
/** @type {import('next').NextConfig} */
const nextConfig = {
	async headers() {
		return EXTENSIONS.map((extension) => ({
			source: '/api/:path*',
			headers: [
				{ key: 'Access-Control-Allow-Credentials', value: 'true' },
				{
					key: 'Access-Control-Allow-Origin',
					value: `chrome-extension://${extension.id}`,
				},
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
		}));
	},
};

export default withNextVideo(nextConfig);
