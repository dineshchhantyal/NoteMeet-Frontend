import type { Config } from 'tailwindcss';

const colors = {
	midnightGreen: '#0C4A51',
	emerald: '#2EC4B6',
	mintCream: '#F6FFF8',
	mintCream2: '#E9FAF3',
	cambridgeBlue: '#A7C4C2',
	softRed: '#F87171',
	deepBlue: '#073B4C',
	softYellow: '#FFDD87',
};

const config: Config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		extend: {
			colors: {
				background: colors.mintCream,
				foreground: colors.deepBlue,
				card: {
					DEFAULT: colors.mintCream,
					foreground: colors.deepBlue,
				},
				popover: {
					DEFAULT: colors.mintCream2,
					foreground: colors.deepBlue,
				},
				primary: {
					DEFAULT: colors.emerald,
					foreground: colors.mintCream,
				},
				secondary: {
					DEFAULT: colors.cambridgeBlue,
					foreground: colors.deepBlue,
				},
				muted: {
					DEFAULT: colors.mintCream2,
					foreground: colors.cambridgeBlue,
				},
				accent: {
					DEFAULT: colors.softYellow,
					foreground: colors.deepBlue,
				},
				destructive: {
					DEFAULT: colors.softRed,
					foreground: colors.mintCream,
				},
				border: colors.cambridgeBlue,
				input: colors.cambridgeBlue,
				ring: colors.emerald,
				chart: {
					1: colors.deepBlue,
					2: colors.emerald,
					3: colors.softYellow,
					4: colors.mintCream2,
					5: colors.cambridgeBlue,
				},
				sidebar: {
					DEFAULT: colors.mintCream2,
					foreground: colors.deepBlue,
					primary: colors.emerald,
					'primary-foreground': colors.mintCream,
					accent: colors.cambridgeBlue,
					'accent-foreground': colors.mintCream,
					border: colors.cambridgeBlue,
					ring: colors.emerald,
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};

export default config;
export { colors };
