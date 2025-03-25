import { UserRole } from '@prisma/client';
import { DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
	role: UserRole;
	isTwoFactorEnabled: boolean;
	isOAuth: boolean;
	subscriptionId: string;
	emailNotifications: boolean;
	newsletterSubscribed: boolean;
	subscriptionId: string;
	createdAt: Date | undefined;
	lastLogin: Date | undefined;
};

declare module 'next-auth' {
	interface Session {
		user: ExtendedUser;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		role: UserRole;
		isTwoFactorEnabled: boolean;
	}
}
