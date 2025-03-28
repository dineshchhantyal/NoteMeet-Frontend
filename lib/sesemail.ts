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

// Common email styling for all templates
const emailStyles = `
  /* Base styles */
  body, html { margin: 0; padding: 0; font-family: Arial, sans-serif; }
  .email-container { max-width: 600px; margin: 0 auto; background-color: #f9fafb; }
  .email-header { background: linear-gradient(to right, #0a4a4e, #156469); padding: 30px 20px; text-align: center; }
  .email-body { padding: 30px 20px; background-color: white; }
  .email-footer { padding: 20px; text-align: center; background-color: #f0f0f0; color: #666; font-size: 14px; }

  /* Typography */
  h1 { color: white; margin: 0; padding: 0; font-size: 24px; }
  h2 { color: #0a4a4e; margin-top: 0; margin-bottom: 20px; font-size: 22px; }
  p { color: #4b5563; line-height: 1.5; margin-bottom: 15px; }

  /* Buttons */
  .btn-primary {
    display: inline-block;
    background-color: #63d392;
    color: #0a4a4e !important;
    font-weight: bold;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 4px;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }

  /* Sections */
  .card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 20px;
    background-color: #f9fafb;
  }

  .code-box {
    background-color: #f5f5f5;
    border: 1px solid #e5e7eb;
    border-radius: 4px;
    padding: 15px;
    text-align: center;
    font-size: 24px;
    letter-spacing: 5px;
    font-weight: bold;
    color: #0a4a4e;
    margin: 20px 0;
  }

  .divider {
    border: none;
    height: 1px;
    background-color: #e5e7eb;
    margin: 20px 0;
  }

  .btn-container {
    text-align: center;
    margin: 25px 0;
  }
`;

/**
 * Send an email using AWS SES
 */
async function sendEmail(to: string, subject: string, htmlContent: string) {
	// Create the complete HTML with the styled template
	const completeHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>${emailStyles}</style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <h1>NoteMeet</h1>
        </div>
        <div class="email-body">
          ${htmlContent}
        </div>
        <div class="email-footer">
          <p>&copy; ${new Date().getFullYear()} NoteMeet. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

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
					Data: completeHtml,
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
    <h2>Reset Your Password</h2>
    <p>You've requested to reset your password for your NoteMeet account.</p>
    <p>Click the button below to set a new password:</p>

    <div class="btn-container">
      <a href="${resetLink}" class="btn-primary">Reset Password</a>
    </div>

    <div class="card">
      <p><strong>Important:</strong> This link will expire in 24 hours.</p>
      <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
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
    <h2>Confirm Your Email Address</h2>
    <p>Thank you for signing up with NoteMeet! Please confirm your email address to complete your registration.</p>

    <div class="btn-container">
      <a href="${confirmLink}" class="btn-primary">Confirm Email</a>
    </div>

    <div class="card">
      <p>By confirming your email, you'll get full access to all NoteMeet features including:</p>
      <ul>
        <li>Create and join meetings</li>
        <li>Automated meeting transcription</li>
        <li>AI-powered meeting summaries</li>
      </ul>
    </div>

    <p>If you didn't create an account with NoteMeet, please ignore this email.</p>
  `;

	return sendEmail(email, 'Confirm Your NoteMeet Email', html);
};

/**
 * Send two-factor authentication token
 */
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
	const html = `
    <h2>Your Two-Factor Authentication Code</h2>
    <p>You're receiving this email because you're attempting to sign in to your NoteMeet account.</p>

    <div class="code-box">
      ${token}
    </div>

    <div class="card">
      <p><strong>Important:</strong> This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please secure your account by changing your password immediately.</p>
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
	meetingTitle?: string,
	scheduledAt?: string,
) => {
	const meetingLink = `${domain}/meetings/${meetingId}?token=${token}`;

	// Format date if provided
	let dateInfo = '';
	if (scheduledAt) {
		const date = new Date(scheduledAt);
		const formattedDate = date.toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric',
			year: 'numeric',
		});

		dateInfo = `
      <div class="card">
        <p><strong>Meeting Date:</strong> ${formattedDate}</p>
      </div>
    `;
	}

	const html = `
    <h2>You've Been Invited to a Meeting</h2>
    <p>You've been invited to join ${meetingTitle ? `"${meetingTitle}"` : 'a meeting'} on NoteMeet.</p>

    ${dateInfo}

    <div class="btn-container">
      <a href="${meetingLink}" class="btn-primary">Join Meeting</a>
    </div>

    <p>When you join, you'll have access to the meeting details, recordings, transcripts, and AI-generated summaries.</p>

    <div class="card">
      <p><strong>Note:</strong> If you don't recognize this invitation, you can safely ignore this email.</p>
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
	meetingTitle?: string,
	scheduledTime?: string,
) => {
	const meetingLink = `${domain}/meetings/${meetingId}?token=${token}`;

	// Add time information if available
	let timeInfo = '';
	if (scheduledTime) {
		timeInfo = `<p><strong>Scheduled Time:</strong> ${scheduledTime}</p>`;
	}

	const html = `
    <h2>Meeting Reminder</h2>
    <p>This is a reminder for your upcoming meeting ${meetingTitle ? `"${meetingTitle}"` : ''} on NoteMeet.</p>

    <div class="card">
      ${timeInfo}
      <p>Remember to prepare any necessary materials before joining.</p>
    </div>

    <div class="btn-container">
      <a href="${meetingLink}" class="btn-primary">Join Meeting</a>
    </div>

    <p>NoteMeet will automatically record, transcribe, and summarize your meeting for future reference.</p>

    <div class="card">
      <p><strong>Note:</strong> If you don't recognize this meeting, you can safely ignore this email.</p>
    </div>
  `;

	return sendEmail(email, 'NoteMeet Meeting Reminder', html);
};
