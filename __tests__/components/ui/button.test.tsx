import { Button } from '@/components/ui/button';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Button Component', () => {
	test('renders correctly', () => {
		render(<Button>Click me</Button>);
		expect(
			screen.getByRole('button', { name: /click me/i }),
		).toBeInTheDocument();
	});

	test('handles click events', async () => {
		const handleClick = jest.fn();
		render(<Button onClick={handleClick}>Click me</Button>);

		await userEvent.click(screen.getByRole('button', { name: /click me/i }));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	test('renders disabled state correctly', () => {
		render(<Button disabled>Disabled Button</Button>);
		expect(
			screen.getByRole('button', { name: /disabled button/i }),
		).toBeDisabled();
	});
});
