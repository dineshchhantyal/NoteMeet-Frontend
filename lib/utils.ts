import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Add your existing utility functions
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatCurrency(
	amount: number,
	currencyCode: string = 'USD',
): string {
	try {
		// Use Intl.NumberFormat for localized currency formatting
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currencyCode,
			minimumFractionDigits: 0,
			maximumFractionDigits: 2,
		}).format(amount);
	} catch (error) {
		// Fallback formatting if the currency code is invalid
		console.error(`Error formatting currency: ${error}`);
		return `${currencyCode} ${amount.toFixed(2)}`;
	}
}
