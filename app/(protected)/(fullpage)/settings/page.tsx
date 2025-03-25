'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCog } from 'lucide-react';
import { PersonalInfoSection } from '@/components/settings/personal-info-section';
import { SecuritySection } from '@/components/settings/security-section';
import { CommunicationPreferences } from '@/components/settings/communication-preferences';
import { AccountInfo } from '@/components/settings/account-info';
import { AdminSection } from '@/components/settings/admin-section';
import { useCurrentUser } from '@/hooks/use-current-user';
import { UserRole } from '@prisma/client';

export default function SettingsPage() {
	const user = useCurrentUser();

	return (
		<div className="flex flex-col min-h-screen bg-[#0a4a4e] py-16 px-4">
			<div className="container mx-auto max-w-4xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<div className="flex items-center justify-center mb-8">
						<UserCog className="h-8 w-8 text-[#63d392] mr-3" />
						<h1 className="text-3xl font-bold text-white">Account Settings</h1>
					</div>

					<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 overflow-hidden shadow-lg mb-8">
						<PersonalInfoSection />
						<CommunicationPreferences />
						<SecuritySection />
						<AccountInfo />
						{user?.role === UserRole.ADMIN && <AdminSection />}
					</div>

					{/* Decorative elements */}
					<div className="absolute top-20 right-10 w-64 h-64 bg-[#63d392]/5 rounded-full blur-3xl -z-10"></div>
					<div className="absolute bottom-20 left-10 w-80 h-80 bg-[#156469]/10 rounded-full blur-3xl -z-10"></div>
				</motion.div>
			</div>
		</div>
	);
}
