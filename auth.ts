import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';

import { db } from '@/lib/db';
import authConfig from '@/auth.config';
import { getUserById } from '@/data/user';
import { getTwoFactorConfoirmationByUserId } from '@/data/two-factor-confirmation';
import { getAccountByUserId } from './data/account';

// Create a separate prisma instance for auth
const prisma = new PrismaClient();

// Don't use the PrismaAdapter in middleware
export const { handlers, auth, signIn, signOut } = NextAuth({
	pages: {
		signIn: '/auth/login',
		error: '/auth/error',
	},
	events: {
		async linkAccount({ user }) {
			await db.user.update({
				where: { id: user.id },
				data: { emailVerified: new Date() },
			});
		},
	},
	callbacks: {
		async signIn({ user, account }) {
			// Allow OAuth without email verification
			if (account?.provider !== 'credentials') return true;

			if (user && user.id) {
				const existingUser = await getUserById(user.id);

				// Prevent sign in without email verification
				if (!existingUser?.emailVerified) return false;

				if (existingUser.isTwoFactorEnabled) {
					const twoFactorConfirmation = await getTwoFactorConfoirmationByUserId(
						existingUser.id,
					);

					if (!twoFactorConfirmation) return false;

					await db.twoFactorConfirmation.delete({
						where: { id: twoFactorConfirmation.id },
					});
				}
			}

			return true;
		},
		async session({ session, token }) {
			if (token.sub && session.user) {
				session.user.id = token.sub;
			}

			if (token.role && session.user) {
				session.user.role = token.role;
			}

			if (token.isTwoFactorEnabled && session.user) {
				session.user.isTwoFactorEnabled = token.isTwoFactorEnabled;
			}

			if (session.user) {
				session.user.name = token.name;
				session.user.email = token.email as string;
				session.user.isOAuth = token.isOAuth as boolean;
			}

			return session;
		},
		async jwt({ token }) {
			if (!token.sub) return token;

			const existingUser = await getUserById(token.sub);

			if (!existingUser) return token;

			const existingAccount = await getAccountByUserId(existingUser.id);

			token.isOAuth = !!existingAccount;
			token.name = existingUser.name;
			token.email = existingUser.email;
			token.role = existingUser.role;
			token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

			return token;
		},
	},
	adapter:
		process.env.NEXT_RUNTIME === 'edge' ? undefined : PrismaAdapter(prisma),
	session: { strategy: 'jwt' },
	...authConfig,
});
