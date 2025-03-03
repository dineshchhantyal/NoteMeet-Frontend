import { PrismaClient } from '@prisma/client';

// Check if we're running in Edge Runtime
const isEdge = () => {
	return (
		typeof process !== 'undefined' &&
		typeof process.env !== 'undefined' &&
		process.env.NEXT_RUNTIME === 'edge'
	);
};

// Only create a PrismaClient instance if not in Edge Runtime
let prisma: PrismaClient | undefined;

if (!isEdge()) {
	const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
	prisma = globalForPrisma.prisma || new PrismaClient();

	if (process.env.NODE_ENV !== 'production') {
		globalForPrisma.prisma = prisma;
	}
}

export const db = prisma;
