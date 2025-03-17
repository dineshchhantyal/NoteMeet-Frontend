export function mockFetchSuccess<T>(data: T) {
	return jest.fn().mockImplementation(() =>
		Promise.resolve({
			ok: true,
			json: () => Promise.resolve(data),
		}),
	);
}

export function mockFetchError(status = 500, message = 'Server error') {
	return jest.fn().mockImplementation(() =>
		Promise.resolve({
			ok: false,
			status,
			json: () => Promise.resolve({ message }),
		}),
	);
}

import { mockFetchSuccess, mockFetchError } from '../../utils/test-helpers';

describe('API Helper functions', () => {
	test('mockFetchSuccess returns successful response', async () => {
		const testData = { message: 'success' };
		const mockFetch = mockFetchSuccess(testData);

		const response = await mockFetch('https://example.com');
		const data = await response.json();

		expect(response.ok).toBe(true);
		expect(data).toEqual(testData);
	});

	test('mockFetchError returns error response', async () => {
		const mockFetch = mockFetchError(404, 'Not found');

		const response = await mockFetch('https://example.com');
		const data = await response.json();

		expect(response.ok).toBe(false);
		expect(response.status).toBe(404);
		expect(data.message).toBe('Not found');
	});
});
