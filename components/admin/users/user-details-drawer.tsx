import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	UserRole,
	UserStatus,
	User,
	UserPlanType,
	UserSubscriptionStatus,
} from '@/types/admin';
import { Ban, Check, ClipboardCopy, Loader2, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { formatDate } from '@/lib/utils/date-time';

interface UserDetailsDrawerProps {
	user: User | null;
	open: boolean;
	onClose: () => void;
	onUserUpdated: () => void;
}

export function UserDetailsDrawer({
	user,
	open,
	onClose,
	onUserUpdated,
}: UserDetailsDrawerProps) {
	const [isUpdating, setIsUpdating] = useState(false);
	const [userData, setUserData] = useState<Partial<User>>({});

	// Update local state when user changes
	useState(() => {
		if (user) {
			setUserData(user);
		}
	});

	if (!user) return null;

	const handleChange = (field: keyof User, value: User[keyof User]) => {
		setUserData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSaveChanges = async () => {
		if (!user) return;

		setIsUpdating(true);
		try {
			const response = await fetch(`/api/admin/users/${user.id}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(userData),
			});

			if (!response.ok) {
				throw new Error('Failed to update user');
			}

			toast('User information has been successfully updated.');

			onUserUpdated();
			onClose();
		} catch (error) {
			toast((error as Error).message);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleStatusChange = async (status: UserStatus) => {
		setIsUpdating(true);
		try {
			const response = await fetch(`/api/admin/users/${user.id}/status`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ status }),
			});

			if (!response.ok) {
				throw new Error('Failed to update user status');
			}

			const actionText =
				status === UserStatus.ACTIVE
					? 'activated'
					: status === UserStatus.SUSPENDED
						? 'suspended'
						: 'updated';

			toast(`User account has been ${actionText}.`);

			onUserUpdated();
			onClose();
		} catch (error) {
			toast((error as Error).message);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleRoleChange = async (role: UserRole) => {
		setIsUpdating(true);
		try {
			const response = await fetch(`/api/admin/users/${user.id}/role`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ role }),
			});

			if (!response.ok) {
				throw new Error('Failed to update user role');
			}

			toast(`User role has been changed to ${role}.`);

			onUserUpdated();
			onClose();
		} catch (error) {
			toast((error as Error).message);
		} finally {
			setIsUpdating(false);
		}
	};

	const copyToClipboard = (text: string, label: string) => {
		navigator.clipboard.writeText(text);
		toast(`${label} has been copied to clipboard.`);
	};

	const getSubscriptionBadge = (status?: UserSubscriptionStatus) => {
		switch (status) {
			case UserSubscriptionStatus.ACTIVE:
				return <Badge className="bg-green-600">Active</Badge>;
			case UserSubscriptionStatus.CANCELED:
				return <Badge className="bg-yellow-600">Canceled</Badge>;
			case UserSubscriptionStatus.PAST_DUE:
				return <Badge className="bg-red-600">Past Due</Badge>;
			case UserSubscriptionStatus.UNPAID:
				return <Badge className="bg-red-600">Unpaid</Badge>;
			default:
				return <Badge className="bg-gray-600">No subscription</Badge>;
		}
	};

	return (
		<Sheet open={open} onOpenChange={onClose}>
			<SheetContent className="sm:max-w-md lg:max-w-lg bg-[#0a4a4e] border-l border-[#63d392]/20 text-white overflow-y-auto">
				<SheetHeader>
					<SheetTitle className="text-[#63d392]">User Details</SheetTitle>
					<SheetDescription className="text-gray-300">
						View and edit user information
					</SheetDescription>
				</SheetHeader>

				<div className="py-6">
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-4">
							<Avatar className="h-16 w-16 border-2 border-[#63d392]/20">
								<AvatarImage src={user.avatarUrl} alt={user.name} />
								<AvatarFallback className="bg-[#156469] text-white text-xl">
									{user.name.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div>
								<h3 className="text-xl font-semibold text-white">
									{user.name}
								</h3>
								<div className="flex items-center text-gray-300">
									{user.email}
									<button
										onClick={() => copyToClipboard(user.email, 'Email')}
										className="ml-1 p-1 rounded-sm hover:bg-[#156469]/50"
									>
										<ClipboardCopy className="h-3 w-3" />
									</button>
								</div>
							</div>
						</div>
						<div className="space-x-2">
							<Badge
								className={
									user.status === UserStatus.ACTIVE
										? 'bg-green-600'
										: user.status === UserStatus.PENDING
											? 'bg-yellow-600'
											: 'bg-red-600'
								}
							>
								{user.status}
							</Badge>
							<Badge className="bg-blue-600">{user.role}</Badge>
						</div>
					</div>

					<Tabs defaultValue="general">
						<TabsList className="bg-[#156469]/30 text-gray-300">
							<TabsTrigger value="general">General Info</TabsTrigger>
							<TabsTrigger value="subscription">Subscription</TabsTrigger>
							<TabsTrigger value="actions">Admin Actions</TabsTrigger>
						</TabsList>

						<TabsContent value="general" className="space-y-4 mt-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="name" className="text-gray-300">
										Full Name
									</Label>
									<Input
										id="name"
										value={userData.name || ''}
										onChange={(e) => handleChange('name', e.target.value)}
										className="bg-[#0d5559]/50 border-[#63d392]/20 text-white"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="email" className="text-gray-300">
										Email Address
									</Label>
									<Input
										id="email"
										value={userData.email || ''}
										onChange={(e) => handleChange('email', e.target.value)}
										className="bg-[#0d5559]/50 border-[#63d392]/20 text-white"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="bio" className="text-gray-300">
									Bio
								</Label>
								<Textarea
									id="bio"
									value={userData.bio || ''}
									onChange={(e) => handleChange('bio', e.target.value)}
									className="bg-[#0d5559]/50 border-[#63d392]/20 text-white"
									rows={4}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className="text-gray-300">User ID</Label>
									<div className="flex items-center">
										<Input
											value={user.id}
											disabled
											className="bg-[#0d5559]/50 border-[#63d392]/20 text-gray-300"
										/>
										<button
											onClick={() => copyToClipboard(user.id, 'User ID')}
											className="ml-2 p-2 rounded-sm hover:bg-[#156469]/50"
										>
											<ClipboardCopy className="h-4 w-4 text-gray-300" />
										</button>
									</div>
								</div>
								<div className="space-y-2">
									<Label className="text-gray-300">Joined Date</Label>
									<Input
										value={formatDate(user.createdAt)}
										disabled
										className="bg-[#0d5559]/50 border-[#63d392]/20 text-gray-300"
									/>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label className="text-gray-300">Last Active</Label>
									<Input
										value={
											user.lastActiveAt
												? formatDate(user.lastActiveAt)
												: 'Never'
										}
										disabled
										className="bg-[#0d5559]/50 border-[#63d392]/20 text-gray-300"
									/>
								</div>
								<div className="space-y-2">
									<Label className="text-gray-300">Total Meetings</Label>
									<Input
										value={user.totalMeetings?.toString() || '0'}
										disabled
										className="bg-[#0d5559]/50 border-[#63d392]/20 text-gray-300"
									/>
								</div>
							</div>

							<Button
								onClick={handleSaveChanges}
								disabled={isUpdating}
								className="w-full mt-4 bg-[#63d392] hover:bg-[#63d392]/80 text-[#0a4a4e]"
							>
								{isUpdating ? (
									<>
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
										Saving changes...
									</>
								) : (
									'Save Changes'
								)}
							</Button>
						</TabsContent>

						<TabsContent value="subscription" className="space-y-4 mt-4">
							<div className="p-4 rounded-md bg-[#156469]/20 border border-[#63d392]/20">
								<div className="flex justify-between items-center">
									<h3 className="text-lg font-semibold text-white">
										Current Plan
									</h3>
									{getSubscriptionBadge(user.subscription?.status)}
								</div>
								<div className="mt-2 text-gray-300">
									{user.subscription ? (
										<>
											<p className="text-lg font-medium text-white">
												{user.subscription.planName || 'Unknown Plan'}
											</p>
											<p className="text-sm">
												Type:{' '}
												{user.subscription.planType || UserPlanType.MONTHLY}
											</p>
											<p className="text-sm">
												Price: ${user.subscription.price || '0'} /{' '}
												{user.subscription.planType === UserPlanType.MONTHLY
													? 'month'
													: 'year'}
											</p>
											{user.subscription.startDate && (
												<p className="text-sm">
													Started: {formatDate(user.subscription.startDate)}
												</p>
											)}
											{user.subscription.endDate && (
												<p className="text-sm">
													Ends: {formatDate(user.subscription.endDate)}
												</p>
											)}
										</>
									) : (
										<p>No active subscription</p>
									)}
								</div>
							</div>

							<div className="space-y-2">
								<Label className="text-gray-300">Billing Email</Label>
								<Input
									value={user.billingEmail || user.email}
									disabled
									className="bg-[#0d5559]/50 border-[#63d392]/20 text-gray-300"
								/>
							</div>

							<div className="mt-4">
								<h3 className="text-lg font-semibold text-white mb-2">
									Recent Invoices
								</h3>
								{user.invoices && user.invoices.length > 0 ? (
									<div className="space-y-2">
										{user.invoices.map((invoice, i) => (
											<div
												key={i}
												className="flex justify-between p-3 rounded-md bg-[#156469]/10 border border-[#63d392]/10"
											>
												<div>
													<p className="text-white">
														${invoice.amount} - {invoice.description}
													</p>
													<p className="text-sm text-gray-300">
														{formatDate(invoice.date)}
													</p>
												</div>
												<Badge
													className={
														invoice.status === 'paid'
															? 'bg-green-600'
															: invoice.status === 'pending'
																? 'bg-yellow-600'
																: 'bg-red-600'
													}
												>
													{invoice.status}
												</Badge>
											</div>
										))}
									</div>
								) : (
									<p className="text-gray-300">No invoice history</p>
								)}
							</div>
						</TabsContent>

						<TabsContent value="actions" className="space-y-6 mt-4">
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-white">
									Change User Role
								</h3>
								<Select
									value={userData.role}
									onValueChange={(value) => handleChange('role', value)}
								>
									<SelectTrigger className="bg-[#0d5559]/50 border-[#63d392]/20 text-white">
										<SelectValue placeholder="Select role" />
									</SelectTrigger>
									<SelectContent className="bg-[#0d5559] border-[#63d392]/20 text-white">
										<SelectItem value={UserRole.USER}>User</SelectItem>
										<SelectItem value={UserRole.MODERATOR}>
											Moderator
										</SelectItem>
										<SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
									</SelectContent>
								</Select>
								<Button
									onClick={() =>
										userData.role && handleRoleChange(userData.role as UserRole)
									}
									disabled={isUpdating || userData.role === user.role}
									className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
								>
									<Shield className="mr-2 h-4 w-4" />
									Update Role
								</Button>
							</div>

							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-white">
									User Account Status
								</h3>
								{user.status === UserStatus.ACTIVE ? (
									<Button
										onClick={() => handleStatusChange(UserStatus.SUSPENDED)}
										disabled={isUpdating}
										className="w-full bg-red-600 hover:bg-red-700 text-white"
									>
										<Ban className="mr-2 h-4 w-4" />
										Suspend User Account
									</Button>
								) : (
									<Button
										onClick={() => handleStatusChange(UserStatus.ACTIVE)}
										disabled={isUpdating}
										className="w-full bg-green-600 hover:bg-green-700 text-white"
									>
										<Check className="mr-2 h-4 w-4" />
										Activate User Account
									</Button>
								)}
							</div>

							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-white">
									Account Operations
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<Button
										variant="outline"
										className="w-full border-[#63d392]/30 text-white hover:bg-[#156469]/50"
									>
										Reset Password
									</Button>
									<Button
										variant="outline"
										className="w-full border-[#63d392]/30 text-white hover:bg-[#156469]/50"
									>
										Login As User
									</Button>
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</SheetContent>
		</Sheet>
	);
}
