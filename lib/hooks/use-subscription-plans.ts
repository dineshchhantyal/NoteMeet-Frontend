import { SubscriptionPlan } from '@/types/subscription';
import { useState, useEffect, useCallback } from 'react';

interface SubscriptionStats {
	totalPlans: number;
	activePlans: number;
	averagePrice: number;
	mostPopularTier: string;
	revenueByTier: Record<string, number>;
}

export function useSubscriptionPlans() {
	const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [stats, setStats] = useState<SubscriptionStats>({
		totalPlans: 0,
		activePlans: 0,
		averagePrice: 0,
		mostPopularTier: '',
		revenueByTier: {},
	});

	const fetchPlans = useCallback(async (showRefreshing = false) => {
		if (showRefreshing) setIsRefreshing(true);
		else setIsLoading(true);

		try {
			const response = await fetch('/api/admin/plans');

			if (!response.ok) {
				throw new Error('Failed to fetch plans');
			}

			const data = await response.json();
			const fetchedPlans = data.success ? data.data : data; // Handle both formats

			setPlans(fetchedPlans);

			// Calculate stats
			const activePlans = fetchedPlans.filter(
				(p: SubscriptionPlan) => p.isActive,
			);
			const totalPrice = fetchedPlans.reduce(
				(sum: number, plan: SubscriptionPlan) => sum + plan.basePrice,
				0,
			);

			// Count plans by tier
			const tierCounts: Record<string, number> = {};
			const revenueByTier: Record<string, number> = {};

			fetchedPlans.forEach((plan: SubscriptionPlan) => {
				if (!tierCounts[plan.tier]) tierCounts[plan.tier] = 0;
				if (!revenueByTier[plan.tier]) revenueByTier[plan.tier] = 0;

				tierCounts[plan.tier]++;
				if (plan.isActive) {
					revenueByTier[plan.tier] += plan.basePrice;
				}
			});

			// Find most popular tier
			let mostPopularTier = '';
			let maxCount = 0;

			Object.entries(tierCounts).forEach(([tier, count]) => {
				if (count > maxCount) {
					maxCount = count;
					mostPopularTier = tier;
				}
			});

			setStats({
				totalPlans: fetchedPlans.length,
				activePlans: activePlans.length,
				averagePrice: fetchedPlans.length
					? totalPrice / fetchedPlans.length
					: 0,
				mostPopularTier,
				revenueByTier,
			});

			setError(null);
		} catch (err) {
			setError(err as Error);
			console.error('Error fetching plans:', err);
		} finally {
			setIsLoading(false);
			setIsRefreshing(false);
		}
	}, []);

	const refreshPlans = useCallback(() => {
		return fetchPlans(true);
	}, [fetchPlans]);

	const togglePlanStatus = useCallback(
		async (planId: string, newStatus: boolean) => {
			try {
				const response = await fetch('/api/admin/plans', {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						id: planId,
						isActive: newStatus,
					}),
				});

				if (!response.ok) {
					throw new Error('Failed to update plan status');
				}

				// Update local state
				setPlans(
					plans.map((plan) =>
						plan.id === planId ? { ...plan, isActive: newStatus } : plan,
					),
				);

				return true;
			} catch (err) {
				console.error('Error updating plan status:', err);
				throw err;
			}
		},
		[plans],
	);

	// Initial fetch
	useEffect(() => {
		fetchPlans();
	}, [fetchPlans]);

	return {
		plans,
		isLoading,
		isRefreshing,
		error,
		stats,
		refreshPlans,
		togglePlanStatus,
	};
}
