import { useCurrentUser } from '@/hooks/use-current-user';
import { Calendar, Clock, Clipboard, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils/date-time';

export function AccountInfo() {
	const user = useCurrentUser();

	const accountCreated = user?.createdAt
		? formatDate(user.createdAt.toISOString())
		: 'Unknown';

	const lastLogin = user?.lastLogin
		? formatDate(user.lastLogin.toISOString())
		: 'Unknown';

	const copyAccountId = () => {
		if (user?.id) {
			navigator.clipboard.writeText(user.id);
		}
	};

	const downloadUserData = () => {
		// Implementation for downloading user data
		// This is a placeholder for GDPR compliance feature
		alert('This feature will download all your account data');
	};

	return (
		<div className="border-b border-[#63d392]/20 p-6">
			<h2 className="text-xl font-semibold text-white mb-4">
				Account Information
			</h2>

			<div className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<div className="flex items-center text-gray-300 mb-1">
							<Calendar className="h-4 w-4 mr-2" />
							<span className="text-sm">Account Created</span>
						</div>
						<p className="text-white">{accountCreated}</p>
					</div>

					<div>
						<div className="flex items-center text-gray-300 mb-1">
							<Clock className="h-4 w-4 mr-2" />
							<span className="text-sm">Last Login</span>
						</div>
						<p className="text-white">{lastLogin}</p>
					</div>
				</div>

				<div>
					<div className="flex items-center text-gray-300 mb-1">
						<Clipboard className="h-4 w-4 mr-2" />
						<span className="text-sm">Account ID</span>
					</div>
					<div className="flex items-center">
						<p className="text-white font-mono text-sm truncate max-w-xs">
							{user?.id || 'Not available'}
						</p>
						<Button
							variant="ghost"
							size="sm"
							onClick={copyAccountId}
							className="ml-2 text-[#63d392] hover:text-[#63d392]/80 hover:bg-[#156469]/50"
						>
							Copy
						</Button>
					</div>
				</div>

				<div className="pt-4 flex justify-end">
					<Button
						variant="outline"
						size="sm"
						onClick={downloadUserData}
						className="text-white border-[#63d392]/30 hover:bg-[#156469]/50"
					>
						<Download className="h-4 w-4 mr-2" />
						Download My Data
					</Button>
				</div>
			</div>
		</div>
	);
}
