'use server';

import * as z from 'zod';

import { ResetSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';
import { sendPasswordResetEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/tokens';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
	const validatedFields = ResetSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: 'Invalid email!' };
	}

	const { email } = validatedFields.data;

	const exitingUser = await getUserByEmail(email);

	if (!exitingUser) {
		return {
			error: 'User not found!',
		};
	}

	const passwordResetToken = await generatePasswordResetToken(email);

	if (!passwordResetToken) {
		return { error: 'Failed to generate reset token!' };
	}

	await sendPasswordResetEmail(
		passwordResetToken.email,
		passwordResetToken.token,
	);

	return { success: 'Reset email sent!' };
};
