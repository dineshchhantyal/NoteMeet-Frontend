'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {
	CheckSquare,
	ChevronDown,
	ChevronUp,
	Clock,
	Plus,
	User,
	Trash2,
	Pencil,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { MeetingInterface } from '@/types';
import { Badge } from '@/components/ui/badge';

interface ActionItem {
	id: string;
	text: string;
	completed: boolean;
	assignee: string;
	dueDate?: string;
}

interface ActionItemsTrackerProps {
	meeting: MeetingInterface;
}

export function ActionItemsTracker({ meeting }: ActionItemsTrackerProps) {
	const [actionItems, setActionItems] = useState<ActionItem[]>([]);
	const [loading, setLoading] = useState(true);
	const [expanded, setExpanded] = useState(true);
	const [newItemText, setNewItemText] = useState('');
	const [newItemAssignee, setNewItemAssignee] = useState('');
	const [editing, setEditing] = useState<string | null>(null);
	const [editText, setEditText] = useState('');
	const [editAssignee, setEditAssignee] = useState('');

	// Calculate completion percentage
	const completedItems = actionItems.filter((item) => item.completed).length;
	const completionPercentage =
		actionItems.length > 0
			? Math.round((completedItems / actionItems.length) * 100)
			: 0;

	useEffect(() => {
		if (meeting?.id) {
			setLoading(true);

			// Fetch action items from API
			fetch(`/api/meetings/${meeting.id}/action-items`)
				.then((res) => res.json())
				.then((data) => {
					setActionItems(data.actionItems || []);
					setLoading(false);
				})
				.catch((err) => {
					console.error('Error fetching action items:', err);
					setLoading(false);

					// For demo purposes, generate some sample action items
					const demoItems =
						meeting.summary?.actionItems?.map((item: string, i: number) => ({
							id: `item-${i}`,
							text: item,
							completed: false,
							assignee:
								meeting.participants?.[
									i % (meeting.participants?.length || 1)
								] || 'Unassigned',
						})) || [];

					setActionItems(demoItems);
				});
		}
	}, [meeting?.id]);

	const handleActionItemToggle = (id: string, completed: boolean) => {
		setActionItems((items) =>
			items.map((item) => (item.id === id ? { ...item, completed } : item)),
		);

		// TODO: Update in backend
		fetch(`/api/meetings/${meeting.id}/action-items/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ completed }),
		}).catch((err) => console.error('Error updating action item:', err));
	};

	const addActionItem = () => {
		if (!newItemText.trim()) return;

		const newItem: ActionItem = {
			id: `item-${Date.now()}`,
			text: newItemText,
			completed: false,
			assignee: newItemAssignee || 'Unassigned',
		};

		setActionItems([...actionItems, newItem]);
		setNewItemText('');
		setNewItemAssignee('');

		// TODO: Add to backend
		fetch(`/api/meetings/${meeting.id}/action-items`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newItem),
		}).catch((err) => console.error('Error adding action item:', err));
	};

	const deleteActionItem = (id: string) => {
		setActionItems((items) => items.filter((item) => item.id !== id));

		// TODO: Delete from backend
		fetch(`/api/meetings/${meeting.id}/action-items/${id}`, {
			method: 'DELETE',
		}).catch((err) => console.error('Error deleting action item:', err));
	};

	const startEditing = (item: ActionItem) => {
		setEditing(item.id);
		setEditText(item.text);
		setEditAssignee(item.assignee);
	};

	const saveEdit = (id: string) => {
		setActionItems((items) =>
			items.map((item) =>
				item.id === id
					? { ...item, text: editText, assignee: editAssignee || 'Unassigned' }
					: item,
			),
		);

		setEditing(null);

		// TODO: Update in backend
		fetch(`/api/meetings/${meeting.id}/action-items/${id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text: editText, assignee: editAssignee }),
		}).catch((err) => console.error('Error updating action item:', err));
	};

	// Gets initials from name
	// const getInitials = (name: string) => {
	// 	return name
	// 		.split(' ')
	// 		.map((part) => part[0])
	// 		.join('')
	// 		.toUpperCase();
	// };

	return (
		<div className="bg-[#156469]/30 backdrop-blur-sm rounded-xl border border-[#63d392]/20 overflow-hidden shadow-md">
			<div
				className="flex items-center justify-between bg-[#0d5559]/80 px-4 py-3 border-b border-[#63d392]/20 cursor-pointer"
				onClick={() => setExpanded(!expanded)}
			>
				<div className="flex items-center">
					<div className="bg-[#63d392]/20 p-1.5 rounded-md mr-2">
						<CheckSquare className="h-5 w-5 text-[#63d392]" />
					</div>
					<h3 className="font-medium text-white">Action Items</h3>
					<Badge className="ml-2 bg-[#63d392]/20 text-[#63d392] border-0">
						{completedItems}/{actionItems.length}
					</Badge>
				</div>
				<Button
					variant="ghost"
					size="sm"
					className="text-white hover:bg-[#156469]/50 p-0 h-8 w-8"
				>
					{expanded ? (
						<ChevronUp className="h-5 w-5" />
					) : (
						<ChevronDown className="h-5 w-5" />
					)}
				</Button>
			</div>

			{expanded && (
				<>
					<div className="px-4 py-3">
						<div className="flex items-center justify-between mb-1">
							<p className="text-xs text-[#63d392]">Completion progress</p>
							<p className="text-xs text-white">{completionPercentage}%</p>
						</div>
						<Progress
							value={completionPercentage}
							className="h-2 bg-[#0d5559] [&>div]:bg-[#63d392]"
						/>
					</div>

					<div className="px-4 pb-3 max-h-[300px] overflow-y-auto">
						{loading ? (
							<div className="flex justify-center py-8">
								<div className="animate-spin h-6 w-6 border-2 border-[#63d392] border-t-transparent rounded-full"></div>
							</div>
						) : actionItems.length > 0 ? (
							<ul className="space-y-2">
								{actionItems.map((item) => (
									<li
										key={item.id}
										className={cn(
											'flex items-start py-2 px-3 rounded-md',
											item.completed
												? 'bg-[#63d392]/10 border border-[#63d392]/20'
												: 'bg-[#0d5559]/40 border border-[#0d5559]/60',
										)}
									>
										{editing === item.id ? (
											<div className="w-full">
												<div className="flex mb-2">
													<Input
														value={editText}
														onChange={(e) => setEditText(e.target.value)}
														className="flex-grow bg-[#0d5559]/60 border-[#63d392]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50"
														placeholder="Action item text"
													/>
												</div>
												<div className="flex items-center justify-between">
													<Input
														value={editAssignee}
														onChange={(e) => setEditAssignee(e.target.value)}
														className="flex-grow max-w-[150px] h-7 text-sm bg-[#0d5559]/60 border-[#63d392]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50"
														placeholder="Assignee"
													/>
													<div className="flex space-x-2">
														<Button
															onClick={() => setEditing(null)}
															variant="outline"
															size="sm"
															className="h-7 bg-[#0d5559]/50 hover:bg-[#156469] text-white border-[#63d392]/20"
														>
															Cancel
														</Button>
														<Button
															onClick={() => saveEdit(item.id)}
															size="sm"
															className="h-7 bg-[#63d392] hover:bg-[#4eb97b] text-[#0a4a4e]"
														>
															Save
														</Button>
													</div>
												</div>
											</div>
										) : (
											<>
												<div className="flex-shrink-0 mr-3 mt-1">
													<Checkbox
														id={item.id}
														checked={item.completed}
														onCheckedChange={(checked) =>
															handleActionItemToggle(
																item.id,
																checked as boolean,
															)
														}
														className="border-[#63d392]/50 data-[state=checked]:bg-[#63d392] data-[state=checked]:text-[#0a4a4e]"
													/>
												</div>
												<div className="flex-grow space-y-1">
													<label
														htmlFor={item.id}
														className={cn(
															'text-sm cursor-pointer',
															item.completed
																? 'text-gray-400 line-through'
																: 'text-white',
														)}
													>
														{item.text}
													</label>
													<div className="flex items-center text-xs text-gray-300">
														<User className="h-3 w-3 mr-1 text-[#63d392]/80" />
														<span>{item.assignee}</span>
														{item.dueDate && (
															<>
																<Clock className="h-3 w-3 ml-3 mr-1 text-[#63d392]/80" />
																<span>{item.dueDate}</span>
															</>
														)}
													</div>
												</div>
												<div className="flex space-x-1 ml-2">
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger asChild>
																<Button
																	variant="ghost"
																	size="icon"
																	onClick={() => startEditing(item)}
																	className="h-7 w-7 text-white opacity-50 hover:opacity-100 hover:bg-[#156469]/50"
																>
																	<Pencil className="h-3.5 w-3.5" />
																</Button>
															</TooltipTrigger>
															<TooltipContent className="bg-[#0d5559] border-[#63d392]/20">
																<p>Edit item</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>

													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger asChild>
																<Button
																	variant="ghost"
																	size="icon"
																	onClick={() => deleteActionItem(item.id)}
																	className="h-7 w-7 text-white opacity-50 hover:opacity-100 hover:bg-red-500/20 hover:text-red-400"
																>
																	<Trash2 className="h-3.5 w-3.5" />
																</Button>
															</TooltipTrigger>
															<TooltipContent className="bg-[#0d5559] border-[#63d392]/20">
																<p>Delete item</p>
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												</div>
											</>
										)}
									</li>
								))}
							</ul>
						) : (
							<div className="text-center py-6">
								<p className="text-gray-400 text-sm">No action items yet</p>
							</div>
						)}
					</div>

					<div className="px-4 py-3 bg-[#0d5559]/40 border-t border-[#63d392]/20">
						<div className="flex gap-2">
							<Input
								value={newItemText}
								onChange={(e) => setNewItemText(e.target.value)}
								placeholder="Add a new action item"
								className="flex-grow bg-[#0d5559]/60 border-[#63d392]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50"
							/>
							<Input
								value={newItemAssignee}
								onChange={(e) => setNewItemAssignee(e.target.value)}
								placeholder="Assignee"
								className="w-32 bg-[#0d5559]/60 border-[#63d392]/30 text-white placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50"
							/>
							<Button
								onClick={addActionItem}
								disabled={!newItemText.trim()}
								className="bg-[#63d392] hover:bg-[#4eb97b] text-[#0a4a4e]"
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
