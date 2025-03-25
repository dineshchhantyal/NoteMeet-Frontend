import { useState, useTransition } from 'react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { BellRing, Mail } from 'lucide-react';
import { FormError } from '@/components/form-error';
import { FormSuccess } from '@/components/form-success';
import { useCurrentUser } from '@/hooks/use-current-user';
import { updateCommunicationPreferences } from '@/actions/settings';

export function CommunicationPreferences() {
	const user = useCurrentUser();
	const [error, setError] = useState<string | undefined>('');
	const [success, setSuccess] = useState<string | undefined>('');
	const [isPending, startTransition] = useTransition();

	const [emailNotifications, setEmailNotifications] = useState<boolean>(
		user?.emailNotifications ?? true,
	);
	const [newsletterSubscribed, setNewsletterSubscribed] = useState<boolean>(
		user?.newsletterSubscribed ?? false,
	);

	const handleSave = () => {
		startTransition(() => {
			updateCommunicationPreferences({
				emailNotifications,
				newsletterSubscribed,
			})
				.then((data) => {
					if (data.error) {
						setError(data.error);
					}
					if (data.success) {
						setSuccess(data.success);
					}
				})
				.catch(() => setError('Something went wrong!'));
		});
	};

	return (
		<div className="border-b border-[#63d392]/20 p-6">
			<div className="flex items-center mb-2">
				<BellRing className="h-5 w-5 text-[#63d392] mr-2" />
				<h2 className="text-xl font-semibold text-white">
					Communication Preferences
				</h2>
			</div>
			<p className="text-gray-300 text-sm mb-6">
				Manage how and when you receive notifications
			</p>

			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-white font-medium">Email Notifications</h3>
						<p className="text-gray-300 text-sm">
							Receive email notifications about meetings and updates
						</p>
					</div>
					<Switch
						checked={emailNotifications}
						onCheckedChange={setEmailNotifications}
						className="data-[state=checked]:bg-[#63d392]"
					/>
				</div>

				<div className="flex items-center justify-between">
					<div>
						<h3 className="text-white font-medium">Newsletter</h3>
						<p className="text-gray-300 text-sm">
							Subscribe to our monthly newsletter with product updates
						</p>
					</div>
					<Switch
						checked={newsletterSubscribed}
						onCheckedChange={setNewsletterSubscribed}
						className="data-[state=checked]:bg-[#63d392]"
					/>
				</div>

				<FormError message={error} />
				<FormSuccess message={success} />

				<div className="flex justify-end">
					<Button
						onClick={handleSave}
						disabled={isPending}
						className="bg-[#63d392] hover:bg-[#63d392]/80 text-[#0a4a4e] font-medium"
					>
						Save Preferences
					</Button>
				</div>
			</div>
		</div>
	);
}
