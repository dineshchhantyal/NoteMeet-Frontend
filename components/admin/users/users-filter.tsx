import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Filter, Search, X } from 'lucide-react';
import { UserFilter, UserRole, UserStatus } from '@/types/admin';

interface UsersFilterProps {
	filter: UserFilter;
	onFilterChange: (filter: UserFilter) => void;
}

export function UsersFilter({ filter, onFilterChange }: UsersFilterProps) {
	const [localFilter, setLocalFilter] = useState<UserFilter>(filter);
	const [showFilters, setShowFilters] = useState(false);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setLocalFilter((prev) => ({ ...prev, search: e.target.value }));
	};

	const handleStatusChange = (value: string) => {
		setLocalFilter((prev) => ({
			...prev,
			status: value as UserStatus | undefined,
		}));
	};

	const handleRoleChange = (value: string) => {
		setLocalFilter((prev) => ({
			...prev,
			role: value as UserRole | undefined,
		}));
	};

	const handleApplyFilter = () => {
		onFilterChange(localFilter);
	};

	const handleResetFilter = () => {
		const resetFilter = { search: '', status: undefined, role: undefined };
		setLocalFilter(resetFilter);
		onFilterChange(resetFilter);
	};

	const hasActiveFilters =
		!!filter.search || filter.status !== undefined || filter.role !== undefined;

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<Input
						placeholder="Search users by name or email..."
						value={localFilter.search}
						onChange={handleSearchChange}
						className="pl-10 bg-[#0a4a4e]/80 border-[#63d392]/20 text-white placeholder:text-gray-400"
					/>
					{localFilter.search && (
						<button
							onClick={() => {
								setLocalFilter((prev) => ({ ...prev, search: '' }));
								if (!showFilters) {
									onFilterChange({ ...filter, search: '' });
								}
							}}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
						>
							<X className="h-4 w-4" />
						</button>
					)}
				</div>
				<Button
					variant={showFilters ? 'default' : 'outline'}
					size="sm"
					onClick={() => setShowFilters(!showFilters)}
					className={
						showFilters
							? 'bg-[#63d392] hover:bg-[#63d392]/80 text-[#0a4a4e]'
							: 'border-[#63d392]/30 text-white'
					}
				>
					<Filter className="mr-2 h-4 w-4" />
					{hasActiveFilters
						? `Filters (${Object.values(filter).filter((v) => v !== undefined && v !== '').length})`
						: 'Filters'}
				</Button>
			</div>

			{showFilters && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-md bg-[#0a4a4e]/80 border border-[#63d392]/20">
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-300">Status</label>
						<Select
							value={localFilter.status || ''}
							onValueChange={handleStatusChange}
						>
							<SelectTrigger className="bg-[#0d5559]/50 border-[#63d392]/20 text-white">
								<SelectValue placeholder="All statuses" />
							</SelectTrigger>
							<SelectContent className="bg-[#0d5559] border-[#63d392]/20 text-white">
								<SelectItem value="">All statuses</SelectItem>
								<SelectItem value={UserStatus.ACTIVE}>Active</SelectItem>
								<SelectItem value={UserStatus.PENDING}>Pending</SelectItem>
								<SelectItem value={UserStatus.SUSPENDED}>Suspended</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-300">Role</label>
						<Select
							value={localFilter.role || ''}
							onValueChange={handleRoleChange}
						>
							<SelectTrigger className="bg-[#0d5559]/50 border-[#63d392]/20 text-white">
								<SelectValue placeholder="All roles" />
							</SelectTrigger>
							<SelectContent className="bg-[#0d5559] border-[#63d392]/20 text-white">
								<SelectItem value="">All roles</SelectItem>
								<SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
								<SelectItem value={UserRole.MODERATOR}>Moderator</SelectItem>
								<SelectItem value={UserRole.USER}>User</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-end gap-2">
						<Button
							onClick={handleApplyFilter}
							className="bg-[#63d392] hover:bg-[#63d392]/80 text-[#0a4a4e]"
						>
							Apply Filters
						</Button>
						{hasActiveFilters && (
							<Button
								variant="outline"
								onClick={handleResetFilter}
								className="border-[#63d392]/30 text-white"
							>
								Reset
							</Button>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
