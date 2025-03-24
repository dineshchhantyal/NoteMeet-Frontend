import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Configure AWS SES client
const ses = new SESClient({
	region: process.env.AWS_REGION || 'us-east-1',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
	},
});

const FROM_EMAIL = 'notemeet@dineshchhantyal.com';
const domain = process.env.NEXT_PUBLIC_APP_URL;

/**
 * Send an email using AWS SES
 */
async function sendEmail(to: string, subject: string, html: string) {
	const params = {
		Source: FROM_EMAIL,
		Destination: {
			ToAddresses: [to],
		},
		Message: {
			Subject: {
				Data: subject,
				Charset: 'UTF-8',
			},
			Body: {
				Html: {
					Data: html,
					Charset: 'UTF-8',
				},
			},
		},
	};

	try {
		const command = new SendEmailCommand(params);
		const response = await ses.send(command);
		console.log(`Email sent successfully: ${response.MessageId}`);
		return response;
	} catch (error) {
		console.error('Error sending email via SES:', error);
		throw error;
	}
}

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
	const resetLink = `${domain}/auth/new-password?token=${token}`;
	const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>You've requested to reset your password for your NoteMeet account.</p>
      <p>Click the button below to set a new password:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="background-color: #13a870; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Reset Password
        </a>
      </div>
      <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
      <p>This link will expire in 24 hours.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #666; font-size: 14px;">The NoteMeet Team</p>
    </div>
  `;

	return sendEmail(email, 'Reset Your NoteMeet Password', html);
};

/**
 * Send email verification
 */
export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `${domain}/auth/new-verification?token=${token}`;
	const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Confirm Your Email Address</h2>
      <p>Thank you for signing up with NoteMeet! Please confirm your email address to complete your registration.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${confirmLink}" style="background-color: #13a870; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Confirm Email
        </a>
      </div>
      <p>If you didn't create an account with NoteMeet, please ignore this email.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #666; font-size: 14px;">The NoteMeet Team</p>
    </div>
  `;

	return sendEmail(email, 'Confirm Your NoteMeet Email', html);
};

/**
 * Send two-factor authentication token
 */
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
	const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Your Two-Factor Authentication Code</h2>
      <p>You're receiving this email because you're attempting to sign in to your NoteMeet account.</p>
      <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f5f5f5; border-radius: 4px; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
        ${token}
      </div>
      <p>This code will expire in 10 minutes. If you didn't request this code, please secure your account by changing your password.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #666; font-size: 14px;">The NoteMeet Team</p>
    </div>
  `;

	return sendEmail(email, 'Your NoteMeet 2FA Code', html);
};

/**
 * Send meeting invitation
 */
export const sendMeetingInviteEmail = async (
	email: string,
	meetingId: string,
	token: string,
) => {
	const meetingLink = `${domain}/meetings/${meetingId}?token=${token}`;
	const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>You've Been Invited to a Meeting</h2>
      <p>You've been invited to join a meeting on NoteMeet.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${meetingLink}" style="background-color: #13a870; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Join Meeting
        </a>
      </div>
      <p>If you don't recognize this invitation, you can safely ignore this email.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #666; font-size: 14px;">The NoteMeet Team</p>
    </div>
  `;

	return sendEmail(email, 'NoteMeet Meeting Invitation', html);
};

/**
 * Send meeting reminder
 */

export const sendMeetingReminderEmail = async (
	email: string,
	meetingId: string,
	token: string,
) => {
	const meetingLink = `${domain}/meetings/${meetingId}?token=${token}`;
	const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Meeting Reminder</h2>
      <p>You have a meeting scheduled on NoteMeet.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${meetingLink}" style="background-color: #13a870; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
          Join Meeting
        </a>
      </div>
      <p>If you don't recognize this meeting, you can safely ignore this email.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;" />
      <p style="color: #666; font-size: 14px;">The NoteMeet Team</p>
    </div>
  `;

	return sendEmail(email, 'NoteMeet Meeting Reminder', html);
};
