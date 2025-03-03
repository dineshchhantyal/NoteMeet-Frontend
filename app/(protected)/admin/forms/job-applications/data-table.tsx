'use client';

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
	SortingState,
	getSortedRowModel,
	ColumnFiltersState,
	getFilteredRowModel,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting,
			columnFilters,
		},
	});

	return (
		<div>
			{/* Search */}
			<div className="flex items-center py-4">
				<Input
					placeholder="Filter by name or position..."
					value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('name')?.setFilterValue(event.target.value)
					}
					className="max-w-sm bg-[#0d5559]/50 border-[#63d392]/30 text-white placeholder:text-gray-400"
				/>
			</div>

			{/* Table */}
			<div className="rounded-md overflow-hidden border border-[#63d392]/20">
				<Table>
					<TableHeader className="bg-[#0d5559]/60">
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								key={headerGroup.id}
								className="hover:bg-transparent border-[#63d392]/20"
							>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											key={header.id}
											className="text-[#63d392] font-medium"
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
									className="border-[#63d392]/10 hover:bg-[#156469]/50"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="text-gray-300">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center text-white"
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between mt-4">
				<div className="text-sm text-gray-300">
					Showing{' '}
					{table.getState().pagination.pageIndex *
						table.getState().pagination.pageSize +
						1}{' '}
					to{' '}
					{Math.min(
						(table.getState().pagination.pageIndex + 1) *
							table.getState().pagination.pageSize,
						table.getFilteredRowModel().rows.length,
					)}{' '}
					of {table.getFilteredRowModel().rows.length} entries
				</div>

				<Pagination>
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() => table.previousPage()}
								className={`${!table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : ''} text-white hover:text-[#63d392]`}
							/>
						</PaginationItem>

						{Array.from({ length: Math.min(5, table.getPageCount()) }).map(
							(_, i) => (
								<PaginationItem key={i}>
									<PaginationLink
										onClick={() => table.setPageIndex(i)}
										isActive={table.getState().pagination.pageIndex === i}
										className={`${
											table.getState().pagination.pageIndex === i
												? 'bg-[#63d392] text-[#0a4a4e]'
												: 'text-white hover:text-[#63d392]'
										}`}
									>
										{i + 1}
									</PaginationLink>
								</PaginationItem>
							),
						)}

						{table.getPageCount() > 5 && <PaginationEllipsis />}

						<PaginationItem>
							<PaginationNext
								onClick={() => table.nextPage()}
								className={`${!table.getCanNextPage() ? 'pointer-events-none opacity-50' : ''} text-white hover:text-[#63d392]`}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			</div>
		</div>
	);
}
