import { Subscription, UserRole } from '@prisma/client';
import NextAuth, { DefaultSession } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export type ExtendedUser = DefaultSession['user'] & {
	role: UserRole;
	isTwoFactorEnabled: boolean;
	isOAuth: boolean;
	subscriptionId: string | null;
	activeSubscriptions: Subscription[];
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
		activeSubscriptions: Subscription[];
	}
}
