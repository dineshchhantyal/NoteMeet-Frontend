'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
	Crown,
	HardDrive,
	Clock,
	VideoIcon,
	AlertCircle,
	Loader2,
} from 'lucide-react';

interface SubscriptionPlan {
	id: string;
	planId: string;
	planName: string;
	status: string;
	billingPeriod: string;
	startDate: string;
	endDate: string | null;
	price: {
		base: number;
		total: number;
	};
}

interface SubscriptionLimits {
	storageLimit: number;
	meetingDuration: number;
	meetingsAllowed: number;
}

interface SubscriptionData {
	subscriptions: SubscriptionPlan[];
	limits: SubscriptionLimits;
	remaining: SubscriptionLimits;
	isEarlyAccess: boolean;
}

export function SubscriptionPanel() {
	const [data, setData] = useState<SubscriptionData | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchSubscriptionData = async () => {
			try {
				setLoading(true);
				const response = await fetch('/api/user/subscription');

				if (!response.ok) {
					throw new Error('Failed to fetch subscription data');
				}

				const subscriptionData = await response.json();
				setData(subscriptionData);
			} catch (err) {
				setError('Could not load your subscription information');
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchSubscriptionData();
	}, []);

	// Format bytes to human-readable size
	const formatStorageSize = (bytes: number) => {
		if (bytes < 1024) return bytes + ' B';
		const units = ['KB', 'MB', 'GB', 'TB'];
		let i = -1;
		do {
			bytes /= 1024;
			i++;
		} while (bytes >= 1024 && i < units.length - 1);
		return bytes.toFixed(1) + ' ' + units[i];
	};

	// Format seconds to human-readable duration
	const formatDuration = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		return `${hours}h ${minutes}m`;
	};

	if (loading) {
		return (
			<Card className="w-full">
				<CardHeader className="pb-2">
					<CardTitle className="text-xl flex items-center">
						<Loader2 className="mr-2 h-5 w-5 animate-spin" />
						Loading subscription data...
					</CardTitle>
				</CardHeader>
				<CardContent className="h-64 flex items-center justify-center">
					<div className="text-center text-muted-foreground">
						Retrieving your subscription information...
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error || !data) {
		return (
			<Card className="w-full border-red-200">
				<CardHeader className="pb-2">
					<CardTitle className="text-xl flex items-center text-red-500">
						<AlertCircle className="mr-2 h-5 w-5" />
						Subscription Information Unavailable
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-red-400">
						{error || 'Could not load subscription data'}
					</p>
					<Button
						variant="outline"
						className="mt-4"
						onClick={() => window.location.reload()}
					>
						Try Again
					</Button>
				</CardContent>
			</Card>
		);
	}

	const hasActiveSubscription = data.subscriptions.some(
		(sub) => sub.status === 'ACTIVE',
	);

	return (
		<Card className="w-full bg-[#156469]/20 border-[#63d392]/20">
			<CardHeader className="pb-2">
				<div className="flex items-center justify-between">
					<CardTitle className="text-xl">Your Subscription</CardTitle>
					{data.isEarlyAccess && (
						<Badge className="bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-600 hover:to-pink-600">
							<Crown className="h-3 w-3 mr-1" /> Early Access
						</Badge>
					)}
				</div>
				<CardDescription>
					{hasActiveSubscription
						? `You're currently on the ${data.subscriptions[0].planName} plan`
						: "You don't have an active subscription"}
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-6">
				<Tabs defaultValue="usage" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="usage">Usage</TabsTrigger>
						<TabsTrigger value="plans">Plans</TabsTrigger>
					</TabsList>

					<TabsContent value="usage" className="space-y-6 pt-4">
						{/* Storage Usage */}
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<div className="flex items-center">
									<HardDrive className="h-4 w-4 mr-2 text-[#63d392]" />
									<span>Storage</span>
								</div>
								<span className="text-sm">
									{formatStorageSize(
										data.limits.storageLimit - data.remaining.storageLimit,
									)}{' '}
									/ {formatStorageSize(data.limits.storageLimit)}
								</span>
							</div>
							<Progress
								value={
									((data.limits.storageLimit - data.remaining.storageLimit) /
										data.limits.storageLimit) *
									100
								}
								className="h-2 bg-[#0d5559]"
							/>
						</div>

						{/* Meeting Duration */}
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<div className="flex items-center">
									<Clock className="h-4 w-4 mr-2 text-[#63d392]" />
									<span>Meeting Duration</span>
								</div>
								<span className="text-sm">
									{formatDuration(data.limits.meetingDuration)}
								</span>
							</div>
							<Progress value={100} className="h-2 bg-[#0d5559]" />
						</div>

						{/* Meetings Allowed */}
						<div className="space-y-2">
							<div className="flex justify-between items-center">
								<div className="flex items-center">
									<VideoIcon className="h-4 w-4 mr-2 text-[#63d392]" />
									<span>Meetings</span>
								</div>
								<span className="text-sm">
									{data.limits.meetingsAllowed - data.remaining.meetingsAllowed}{' '}
									/ {data.limits.meetingsAllowed}
								</span>
							</div>
							<Progress
								value={
									((data.limits.meetingsAllowed -
										data.remaining.meetingsAllowed) /
										data.limits.meetingsAllowed) *
									100
								}
								className="h-2 bg-[#0d5559]"
							/>
						</div>
					</TabsContent>

					<TabsContent value="plans" className="pt-4">
						<div className="space-y-4">
							{data.subscriptions.length > 0 ? (
								data.subscriptions.map((sub) => (
									<div
										key={sub.id}
										className="p-4 border border-[#63d392]/20 rounded-lg bg-[#0d5559]/30"
									>
										<div className="flex justify-between items-center mb-2">
											<h3 className="font-medium text-[#63d392]">
												{sub.planName}
											</h3>
											<Badge
												variant={
													sub.status === 'ACTIVE' ? 'default' : 'outline'
												}
											>
												{sub.status}
											</Badge>
										</div>
										<div className="grid grid-cols-2 gap-2 text-sm text-gray-200">
											<div>Billing Period:</div>
											<div className="text-right">
												{sub.billingPeriod.toLowerCase()}
											</div>

											<div>Start Date:</div>
											<div className="text-right">
												{new Date(sub.startDate).toLocaleDateString()}
											</div>

											{sub.endDate && (
												<>
													<div>End Date:</div>
													<div className="text-right">
														{new Date(sub.endDate).toLocaleDateString()}
													</div>
												</>
											)}

											{sub.price.total > 0 && (
												<>
													<div>Price:</div>
													<div className="text-right">
														${sub.price.total.toFixed(2)}
													</div>
												</>
											)}
										</div>
									</div>
								))
							) : (
								<div className="text-center py-8 text-gray-400">
									<p>You don&apos;t have any subscription plans yet</p>
								</div>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>

			<CardFooter className="flex justify-between pt-0">
				{hasActiveSubscription ? (
					<Button
						variant="outline"
						className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
					>
						Cancel Subscription
					</Button>
				) : (
					<Button className="bg-[#13a870] hover:bg-[#13a870]/80">
						Upgrade Plan
					</Button>
				)}
				<Button variant="ghost">Billing History</Button>
			</CardFooter>
		</Card>
	);
}
