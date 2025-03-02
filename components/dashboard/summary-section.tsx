import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ListChecks,
	MessageSquare,
	Target,
	ThumbsUp,
	ThumbsDown,
	Meh,
	Copy,
	Download,
} from 'lucide-react';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Summary {
	keyTopics?: string[];
	actionItems?: string[];
	sentiment?: string;
}

interface SummarySectionProps {
	summary?: Summary;
	isLoading?: boolean;
}

const getSentimentIcon = (sentiment: string) => {
	const size = 'h-5 w-5';
	switch (sentiment.toLowerCase()) {
		case 'positive':
			return <ThumbsUp className={`${size} text-[#63d392]`} />;
		case 'negative':
			return <ThumbsDown className={`${size} text-red-500`} />;
		default:
			return <Meh className={`${size} text-yellow-500`} />;
	}
};

const getSentimentBadgeStyle = (sentiment: string) => {
	switch (sentiment.toLowerCase()) {
		case 'positive':
			return 'bg-[#63d392]/20 text-[#4eb97b] border-[#63d392]/30';
		case 'negative':
			return 'bg-red-500/10 text-red-500 border-red-500/30';
		default:
			return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
	}
};

export function SummarySection({
	summary,
	isLoading = false,
}: SummarySectionProps) {
	const [copiedTopic, setCopiedTopic] = useState<number | null>(null);
	const [copiedAction, setCopiedAction] = useState<number | null>(null);

	const handleCopy = (
		text: string,
		type: 'topic' | 'action',
		index: number,
	) => {
		navigator.clipboard.writeText(text);
		if (type === 'topic') {
			setCopiedTopic(index);
			setTimeout(() => setCopiedTopic(null), 2000);
		} else {
			setCopiedAction(index);
			setTimeout(() => setCopiedAction(null), 2000);
		}
	};

	const downloadSummary = () => {
		if (!summary) return;

		const content = `# Meeting Summary\n\n## Key Topics\n${summary.keyTopics?.map((topic) => `- ${topic}`).join('\n') || 'None'}\n\n## Action Items\n${summary.actionItems?.map((item) => `- ${item}`).join('\n') || 'None'}\n\n## Overall Sentiment\n${summary.sentiment || 'Not specified'}`;

		const blob = new Blob([content], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'meeting-summary.md';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	if (isLoading) {
		return (
			<Card className="bg-[#156469]/30 border-[#63d392]/20 text-white">
				<CardHeader className="border-b border-[#63d392]/20">
					<CardTitle className="flex items-center space-x-2 text-white">
						<MessageSquare className="h-5 w-5 text-[#63d392]" />
						<span>Meeting Summary</span>
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6 pt-4">
					<div className="flex items-center space-x-2 mb-2">
						<Target className="h-5 w-5 text-[#63d392]" />
						<Skeleton className="h-5 w-40 bg-[#0d5559]/70" />
					</div>
					<div className="space-y-2 pl-7">
						<Skeleton className="h-4 w-full bg-[#0d5559]/70" />
						<Skeleton className="h-4 w-3/4 bg-[#0d5559]/70" />
						<Skeleton className="h-4 w-5/6 bg-[#0d5559]/70" />
					</div>

					<div className="flex items-center space-x-2 mb-2">
						<ListChecks className="h-5 w-5 text-[#63d392]" />
						<Skeleton className="h-5 w-40 bg-[#0d5559]/70" />
					</div>
					<div className="space-y-2 pl-7">
						<Skeleton className="h-4 w-full bg-[#0d5559]/70" />
						<Skeleton className="h-4 w-2/3 bg-[#0d5559]/70" />
					</div>

					<div className="flex items-center space-x-2">
						<Skeleton className="h-8 w-8 rounded-full bg-[#0d5559]/70" />
						<div className="space-y-2">
							<Skeleton className="h-5 w-32 bg-[#0d5559]/70" />
							<Skeleton className="h-4 w-24 bg-[#0d5559]/70" />
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (
		!summary ||
		(!summary.keyTopics?.length &&
			!summary.actionItems?.length &&
			!summary.sentiment)
	) {
		return (
			<Card className="bg-[#156469]/30 border-[#63d392]/20 text-white">
				<CardHeader className="border-b border-[#63d392]/20">
					<CardTitle className="flex items-center space-x-2 text-white">
						<MessageSquare className="h-5 w-5 text-[#63d392]" />
						<span>Meeting Summary</span>
					</CardTitle>
				</CardHeader>
				<CardContent className="pt-6">
					<div className="flex flex-col items-center justify-center py-8 text-center">
						<div className="bg-[#0d5559]/70 p-4 rounded-full mb-4">
							<MessageSquare className="h-6 w-6 text-[#63d392]/80" />
						</div>
						<p className="text-gray-300 mb-1">No summary available yet</p>
						<p className="text-xs text-gray-400 max-w-sm">
							Summary will be generated once the meeting recording is processed.
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-[#156469]/30 border-[#63d392]/20 text-white shadow-md">
			<CardHeader className="border-b border-[#63d392]/20">
				<CardTitle className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						<MessageSquare className="h-5 w-5 text-[#63d392]" />
						<span>Meeting Summary</span>
					</div>
					<Button
						variant="outline"
						size="sm"
						className="h-8 bg-[#0d5559]/50 border-[#63d392]/30 text-white hover:bg-[#0d5559] hover:text-[#63d392]"
						onClick={downloadSummary}
					>
						<Download className="h-4 w-4 mr-1" />
						Export
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6 pt-4">
				{summary.keyTopics && summary.keyTopics.length > 0 && (
					<Collapsible defaultOpen>
						<CollapsibleTrigger className="flex items-center space-x-2 group w-full text-left">
							<Target className="h-5 w-5 text-[#63d392] group-hover:text-[#63d392]" />
							<h3 className="font-semibold group-hover:text-[#63d392] transition-colors">
								Key Topics
							</h3>
						</CollapsibleTrigger>
						<CollapsibleContent className="mt-3">
							<div className="grid gap-2 pl-7">
								{summary.keyTopics.map((topic, index) => (
									<div
										key={index}
										className="group flex items-start space-x-2 bg-[#0d5559]/30 p-2 rounded-md hover:bg-[#0d5559]/50 transition-colors"
									>
										<span className="text-sm flex-1">{topic}</span>
										<Button
											variant="ghost"
											size="sm"
											className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
											onClick={() => handleCopy(topic, 'topic', index)}
										>
											{copiedTopic === index ? (
												<Badge className="bg-[#63d392]/20 text-[#63d392] border-0 px-1 py-0 h-5 text-xs">
													Copied!
												</Badge>
											) : (
												<Copy className="h-3.5 w-3.5 text-gray-400 hover:text-[#63d392]" />
											)}
										</Button>
									</div>
								))}
							</div>
						</CollapsibleContent>
					</Collapsible>
				)}

				{summary.actionItems && summary.actionItems.length > 0 && (
					<Collapsible defaultOpen>
						<CollapsibleTrigger className="flex items-center space-x-2 group w-full text-left">
							<ListChecks className="h-5 w-5 text-[#63d392] group-hover:text-[#63d392]" />
							<h3 className="font-semibold group-hover:text-[#63d392] transition-colors">
								Action Items
							</h3>
						</CollapsibleTrigger>
						<CollapsibleContent className="mt-3">
							<div className="grid gap-2 pl-7">
								{summary.actionItems.map((item, index) => (
									<div
										key={index}
										className="group flex items-start space-x-2 bg-[#0d5559]/30 p-2 rounded-md hover:bg-[#0d5559]/50 transition-colors"
									>
										<span className="text-sm flex-1">{item}</span>
										<Button
											variant="ghost"
											size="sm"
											className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
											onClick={() => handleCopy(item, 'action', index)}
										>
											{copiedAction === index ? (
												<Badge className="bg-[#63d392]/20 text-[#63d392] border-0 px-1 py-0 h-5 text-xs">
													Copied!
												</Badge>
											) : (
												<Copy className="h-3.5 w-3.5 text-gray-400 hover:text-[#63d392]" />
											)}
										</Button>
									</div>
								))}
							</div>
						</CollapsibleContent>
					</Collapsible>
				)}

				{summary.sentiment && (
					<div className="flex items-center space-x-4 bg-[#0d5559]/30 p-3 rounded-md">
						<div className="bg-[#0d5559]/50 p-2 rounded-full">
							{getSentimentIcon(summary.sentiment)}
						</div>
						<div className="flex-1">
							<h3 className="font-semibold mb-1">Overall Sentiment</h3>
							<Badge
								variant="outline"
								className={cn(
									'text-xs font-normal capitalize px-2 py-0.5',
									getSentimentBadgeStyle(summary.sentiment),
								)}
							>
								{summary.sentiment}
							</Badge>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
