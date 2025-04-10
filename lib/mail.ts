import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendPasswordResetEmail = async (email: string, token: string) => {
	const resetLink = `${domain}/auth/new-password?token=${token}`;

	await resend.emails.send({
		from: 'onboarding@notemeet.dineshchhantyal.com',
		to: email,
		subject: 'Reset password',
		html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
	});
};

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `${domain}/auth/new-verification?token=${token}`;

	await resend.emails.send({
		from: 'onboarding@notemeet.dineshchhantyal.com',
		to: email,
		subject: 'Confirm your email',
		html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
	});
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
	await resend.emails.send({
		from: 'onboarding@notemeet.dineshchhantyal.com',
		to: email,
		subject: '2FA Code',
		html: `<p>Tour 2FA code: <strong>${token}</strong></p>`,
	});
};

export const sendMeetingInviteEmail = async (
	email: string,
	meetingId: string,
	token: string,
) => {
	const meetingLink = `${domain}/meetings/${meetingId}?token=${token}`;

	await resend.emails.send({
		from: '@notemeet.dineshchhantyal.com',
		to: email,
		subject: 'Meeting invite',
		html: `<p>Click <a href="${meetingLink}">here</a> to join the meeting.</p>`,
	});
};
