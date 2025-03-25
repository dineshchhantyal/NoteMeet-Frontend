import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface UsersPaginationProps {
	currentPage: number;
	pageSize: number;
	total: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (pageSize: number) => void;
}

export function UsersPagination({
	currentPage,
	pageSize,
	total,
	onPageChange,
	onPageSizeChange,
}: UsersPaginationProps) {
	const totalPages = Math.ceil(total / pageSize);

	// Create an array of page numbers to display
	const getPageNumbers = () => {
		const pages = [];
		const maxVisiblePages = 5;

		// Always show first page
		pages.push(1);

		// Calculate range around current page
		let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
		const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);

		// Adjust if we're near the start or end
		if (endPage - startPage < maxVisiblePages - 3) {
			startPage = Math.max(2, endPage - (maxVisiblePages - 3));
		}

		// Add ellipsis after first page if needed
		if (startPage > 2) {
			pages.push('ellipsis1');
		}

		// Add pages in the middle
		for (let i = startPage; i <= endPage; i++) {
			pages.push(i);
		}

		// Add ellipsis before last page if needed
		if (endPage < totalPages - 1) {
			pages.push('ellipsis2');
		}

		// Always show last page if there is more than one page
		if (totalPages > 1) {
			pages.push(totalPages);
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
			<div className="text-sm text-gray-300">
				Showing{' '}
				<span className="font-medium text-white">
					{total === 0 ? 0 : (currentPage - 1) * pageSize + 1}
				</span>{' '}
				to{' '}
				<span className="font-medium text-white">
					{Math.min(currentPage * pageSize, total)}
				</span>{' '}
				of <span className="font-medium text-white">{total}</span> users
			</div>

			<div className="flex items-center gap-4">
				<div className="flex items-center gap-2">
					<span className="text-sm text-gray-300">Show:</span>
					<Select
						value={pageSize.toString()}
						onValueChange={(value) => onPageSizeChange(Number(value))}
					>
						<SelectTrigger className="h-8 w-[70px] bg-[#0d5559]/50 border-[#63d392]/20 text-white">
							<SelectValue>{pageSize}</SelectValue>
						</SelectTrigger>
						<SelectContent className="bg-[#0d5559] border-[#63d392]/20 text-white">
							<SelectItem value="10">10</SelectItem>
							<SelectItem value="25">25</SelectItem>
							<SelectItem value="50">50</SelectItem>
							<SelectItem value="100">100</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
								className={`${
									currentPage === 1
										? 'pointer-events-none opacity-50'
										: 'text-[#63d392] hover:text-[#63d392]/80'
								}`}
							/>
						</PaginationItem>

						{pageNumbers.map((page, i) => (
							<PaginationItem key={i}>
								{page === 'ellipsis1' || page === 'ellipsis2' ? (
									<PaginationEllipsis className="text-gray-400" />
								) : (
									<PaginationLink
										isActive={page === currentPage}
										onClick={() =>
											typeof page === 'number' && onPageChange(page)
										}
										className={`${
											page === currentPage
												? 'bg-[#63d392] text-[#0a4a4e]'
												: 'text-white hover:bg-[#156469]/30'
										}`}
									>
										{page}
									</PaginationLink>
								)}
							</PaginationItem>
						))}

						<PaginationItem>
							<PaginationNext
								onClick={() =>
									currentPage < totalPages && onPageChange(currentPage + 1)
								}
								className={`${
									currentPage === totalPages
										? 'pointer-events-none opacity-50'
										: 'text-[#63d392] hover:text-[#63d392]/80'
								}`}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
}
