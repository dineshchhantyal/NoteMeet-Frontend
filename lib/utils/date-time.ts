/**
 * Date and time formatting utilities for NoteMeet
 */

/**
 * Formats a date string into a user-friendly format
 * Shows "Today" or "Tomorrow" when applicable
 */
export const formatDate = (dateStr: string): string => {
	if (!dateStr) return 'Date not set';
	const date = new Date(dateStr);
	const now = new Date();

	// Different format based on how far the date is
	if (date.getFullYear() === now.getFullYear()) {
		// Today
		if (date.toDateString() === now.toDateString()) {
			return 'Today';
		}

		// Tomorrow
		const tomorrow = new Date();
		tomorrow.setDate(now.getDate() + 1);
		if (date.toDateString() === tomorrow.toDateString()) {
			return 'Tomorrow';
		}

		// Within current year (no need to show year)
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
		});
	} else {
		// Different year, show the year
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	}
};

/**
 * Formats a time string (HH:MM) into 12-hour format with AM/PM
 */
export const formatTime = (timeStr: string): string => {
	if (!timeStr) return 'Time not set';

	// Parse the time string (expected format: "HH:MM")
	const [hours, minutes] = timeStr.split(':').map(Number);

	if (isNaN(hours) || isNaN(minutes)) return timeStr;

	// Format in 12-hour time with AM/PM
	const period = hours >= 12 ? 'PM' : 'AM';
	const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM

	return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
};

/**
 * Formats duration in minutes into a human-readable string
 */
export const formatDuration = (durationStr: string | number): string => {
	if (!durationStr) return '1 hour';

	// If it's already a string with units, return as is
	if (
		typeof durationStr === 'string' &&
		(durationStr.includes('hour') || durationStr.includes('min'))
	) {
		return durationStr;
	}

	// Convert to number if it's a string
	const duration =
		typeof durationStr === 'string' ? parseInt(durationStr) : durationStr;

	if (isNaN(duration)) return '1 hour';

	// Format based on value
	if (duration < 60) {
		return `${duration} ${duration === 1 ? 'minute' : 'minutes'}`;
	} else {
		const hours = Math.floor(duration / 60);
		const minutes = duration % 60;

		if (minutes === 0) {
			return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
		} else {
			return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${minutes} ${
				minutes === 1 ? 'minute' : 'minutes'
			}`;
		}
	}
};

/**
 * Returns a relative time string (e.g., "2 hours ago", "in 3 days")
 */
export const getRelativeTimeString = (dateStr: string): string => {
	if (!dateStr) return '';

	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = date.getTime() - now.getTime();
	const diffMins = Math.round(diffMs / 60000);
	const diffHours = Math.round(diffMs / 3600000);
	const diffDays = Math.round(diffMs / 86400000);

	if (diffMins >= -5 && diffMins <= 5) {
		return 'Just now';
	} else if (diffMins < 0 && diffMins > -60) {
		return `${Math.abs(diffMins)} minute${Math.abs(diffMins) !== 1 ? 's' : ''} ago`;
	} else if (diffHours < 0 && diffHours > -24) {
		return `${Math.abs(diffHours)} hour${Math.abs(diffHours) !== 1 ? 's' : ''} ago`;
	} else if (diffDays < 0 && diffDays > -7) {
		return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} ago`;
	} else if (diffMins > 0 && diffMins < 60) {
		return `in ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
	} else if (diffHours > 0 && diffHours < 24) {
		return `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
	} else if (diffDays > 0 && diffDays < 7) {
		return `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
	} else {
		return formatDate(dateStr);
	}
};
