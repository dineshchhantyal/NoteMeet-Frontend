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

// Theme configuration for consistent spacing and container sizes
const themeConfig = {
	spacing: {
		section: {
			sm: '2rem',
			md: '4rem',
			lg: '6rem',
		},
	},
	container: {
		maxWidth: '1200px',
		padding: '1.5rem',
	},
};

const config: Config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		container: {
			center: true,
			padding: themeConfig.container.padding,
			screens: {
				sm: '640px',
				md: '768px',
				lg: '1024px',
				xl: themeConfig.container.maxWidth,
			},
		},
		extend: {
			colors: {
				// Base colors
				background: colors.mintCream,
				foreground: colors.deepBlue,

				// Card and component colors
				card: {
					DEFAULT: colors.mintCream2,
					foreground: colors.deepBlue,
					hover: 'rgba(231, 250, 243, 0.8)',
				},
				popover: {
					DEFAULT: colors.mintCream2,
					foreground: colors.deepBlue,
				},

				// Primary color with proper gradient
				primary: {
					DEFAULT: colors.midnightGreen,
					foreground: colors.mintCream,
					50: '#eef8f9',
					100: '#d5eff1',
					200: '#b0e1e5',
					300: '#7dccd2',
					400: '#4ab1ba',
					500: '#30969f',
					600: '#0C4A51', // midnightGreen
					700: '#0a3b41',
					800: '#093338',
					900: '#072a2e',
					950: '#051c1f',
				},

				// Secondary color with proper gradient
				secondary: {
					DEFAULT: colors.cambridgeBlue,
					foreground: colors.deepBlue,
					50: '#f2f7f7',
					100: '#e5f0ef',
					200: '#c9e1df',
					300: '#A7C4C2', // cambridgeBlue
					400: '#8aafac',
					500: '#6d9995',
					600: '#567f7c',
					700: '#466766',
					800: '#3a5453',
					900: '#314645',
					950: '#1e2c2c',
				},

				// Muted colors for less emphasis
				muted: {
					DEFAULT: colors.mintCream2,
					foreground: colors.cambridgeBlue,
				},

				// Accent color with proper gradient
				accent: {
					DEFAULT: colors.softYellow,
					foreground: colors.midnightGreen,
					50: '#fff9e6',
					100: '#fff3cc',
					200: '#ffea99',
					300: '#FFDD87', // softYellow
					400: '#ffd666',
					500: '#ffc633',
					600: '#e6b82e',
					700: '#cc9d28',
					800: '#b38522',
					900: '#997019',
					950: '#664a12',
				},

				// Destructive color for errors and warnings
				destructive: {
					DEFAULT: colors.softRed,
					foreground: colors.mintCream,
					hover: '#f65656',
				},

				// UI element colors
				border: colors.cambridgeBlue,
				input: colors.cambridgeBlue,
				ring: colors.emerald,

				// Chart colors for data visualization
				chart: {
					1: colors.deepBlue,
					2: colors.emerald,
					3: colors.softYellow,
					4: colors.mintCream2,
					5: colors.cambridgeBlue,
				},

				// Sidebar specific colors
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

			// Spacing for sections
			spacing: {
				'section-sm': themeConfig.spacing.section.sm,
				'section-md': themeConfig.spacing.section.md,
				'section-lg': themeConfig.spacing.section.lg,
			},

			// Animations
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

			// Keyframes
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
	plugins: [
		require('tailwindcss-animate'),
		require('@vidstack/react/tailwind.cjs'),
		function ({ addComponents }: any) {
			addComponents({
				'.container-section': {
					maxWidth: themeConfig.container.maxWidth,
					paddingLeft: themeConfig.container.padding,
					paddingRight: themeConfig.container.padding,
					marginLeft: 'auto',
					marginRight: 'auto',
				},
				'.section-padding': {
					paddingTop: themeConfig.spacing.section.md,
					paddingBottom: themeConfig.spacing.section.md,
					'@screen lg': {
						paddingTop: themeConfig.spacing.section.lg,
						paddingBottom: themeConfig.spacing.section.lg,
					},
				},
				'.card-hover': {
					'@apply transition-all duration-200': {},
					'&:hover': {
						'@apply shadow-md': {},
						transform: 'translateY(-2px)',
					},
				},
			});
		},
	],
};

export default config;
export { colors, themeConfig };
