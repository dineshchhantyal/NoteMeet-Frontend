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
					// DEFAULT: colors.emerald,
					DEFAULT: '#0a4a4e',
					foreground: colors.mintCream,
					50: '#f8f8f8',
					100: '#e8e8e8',
					200: '#d3d3d3',
					300: '#a3a3a3',
					400: '#737373',
					500: '#525252',
					600: '#404040',
					700: '#262626',
					800: '#171717',
					900: '#0a0a0a',
					950: '#030303',
				},
				secondary: {
					DEFAULT: colors.cambridgeBlue,
					foreground: colors.deepBlue,
					50: '#f8f8f8',
					100: '#e8e8e8',
					200: '#d3d3d3',
					300: '#a3a3a3',
					400: '#737373',
					500: '#525252',
					600: '#404040',
					700: '#262626',
					800: '#171717',
					900: '#0a0a0a',
					950: '#030303',
				},
				muted: {
					DEFAULT: colors.mintCream2,
					foreground: colors.cambridgeBlue,
				},
				accent: {
					DEFAULT: colors.softYellow,
					foreground: colors.deepBlue,
					50: '#f8f8f8',
					100: '#e8e8e8',
					200: '#d3d3d3',
					300: '#a3a3a3',
					400: '#737373',
					500: '#525252',
					600: '#404040',
					700: '#262626',
					800: '#171717',
					900: '#0a0a0a',
					950: '#030303',
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
			animation: {
				'fade-in': 'fadeIn 0.5s ease-in',
				'fade-out': 'fadeOut 0.5s ease-out',
				'slide-up': 'slideUp 0.5s ease-out',
				'slide-down': 'slideDown 0.5s ease-out',
				'slide-left': 'slideLeft 0.5s ease-out',
				'slide-right': 'slideRight 0.5s ease-out',
				'scale-in': 'scaleIn 0.5s ease-out',
				'scale-out': 'scaleOut 0.5s ease-out',
				'spin-slow': 'spin 3s linear infinite',
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'bounce-slow': 'bounce 3s infinite',
				float: 'float 3s ease-in-out infinite',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				fadeOut: {
					'0%': { opacity: '1' },
					'100%': { opacity: '0' },
				},
				slideUp: {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				slideDown: {
					'0%': { transform: 'translateY(-20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
				slideLeft: {
					'0%': { transform: 'translateX(20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
				slideRight: {
					'0%': { transform: 'translateX(-20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' },
				},
				scaleIn: {
					'0%': { transform: 'scale(0.9)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				scaleOut: {
					'0%': { transform: 'scale(1.1)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' },
				},
			},
			aspectRatio: {
				portrait: '3/4',
				landscape: '4/3',
				ultrawide: '21/9',
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
