import { useState, useEffect, useCallback } from 'react';
import { UserFilter, SortField, User } from '@/types/admin';

export function useUsersList() {
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [filter, setFilter] = useState<UserFilter>({
		search: '',
		status: undefined,
		role: undefined,
	});
	const [sortBy, setSortBy] = useState<{
		field: SortField;
		direction: 'asc' | 'desc';
	}>({
		field: 'createdAt',
		direction: 'desc',
	});

	const fetchUsers = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const queryParams = new URLSearchParams({
				page: page.toString(),
				pageSize: pageSize.toString(),
				sortField: sortBy.field,
				sortDirection: sortBy.direction,
			});

			if (filter.search) {
				queryParams.append('search', filter.search);
			}

			if (filter.status) {
				queryParams.append('status', filter.status);
			}

			if (filter.role) {
				queryParams.append('role', filter.role);
			}

			const response = await fetch(
				`/api/admin/users?${queryParams.toString()}`,
			);

			if (!response.ok) {
				throw new Error('Failed to fetch users');
			}

			const data = await response.json();
			setUsers(data.users);
			setTotal(data.total);
		} catch (error) {
			console.error('Error fetching users:', error);
			setError((error as Error).message);
		} finally {
			setIsLoading(false);
		}
	}, [page, pageSize, filter, sortBy]);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const refresh = useCallback(() => {
		fetchUsers();
	}, [fetchUsers]);

	return {
		users,
		isLoading,
		error,
		total,
		page,
		pageSize,
		setPage,
		setPageSize,
		filter,
		setFilter,
		sortBy,
		setSortBy,
		refresh,
	};
}
