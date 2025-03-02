import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	ListChecks,
	MessageSquare,
	Target,
	ThumbsUp,
	ThumbsDown,
	Meh,
} from 'lucide-react';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface Summary {
	keyTopics?: string[];
	actionItems?: string[];
	sentiment?: string;
}

interface SummarySectionProps {
	summary?: Summary;
}

const getSentimentIcon = (sentiment: string) => {
	switch (sentiment.toLowerCase()) {
		case 'positive':
			return <ThumbsUp className="text-green-500" />;
		case 'negative':
			return <ThumbsDown className="text-red-500" />;
		default:
			return <Meh className="text-yellow-500" />;
	}
};

export function SummarySection({ summary }: SummarySectionProps) {
	if (!summary) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center space-x-2">
						<MessageSquare className="h-5 w-5" />
						<span>Meeting Summary</span>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">No summary available.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center space-x-2">
					<MessageSquare className="h-5 w-5" />
					<span>Meeting Summary</span>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{summary.keyTopics && summary.keyTopics.length > 0 && (
					<Collapsible defaultOpen>
						<CollapsibleTrigger className="flex items-center space-x-2">
							<Target className="h-5 w-5" />
							<h3 className="font-semibold">Key Topics</h3>
						</CollapsibleTrigger>
						<CollapsibleContent className="mt-2">
							<div className="grid gap-2 pl-7">
								{summary.keyTopics.map((topic, index) => (
									<div key={index} className="flex items-center space-x-2">
										<span className="text-sm">{topic}</span>
									</div>
								))}
							</div>
						</CollapsibleContent>
					</Collapsible>
				)}

				{summary.actionItems && summary.actionItems.length > 0 && (
					<Collapsible defaultOpen>
						<CollapsibleTrigger className="flex items-center space-x-2">
							<ListChecks className="h-5 w-5" />
							<h3 className="font-semibold">Action Items</h3>
						</CollapsibleTrigger>
						<CollapsibleContent className="mt-2">
							<div className="grid gap-2 pl-7">
								{summary.actionItems.map((item, index) => (
									<div key={index} className="flex items-center space-x-2">
										<span className="text-sm">{item}</span>
									</div>
								))}
							</div>
						</CollapsibleContent>
					</Collapsible>
				)}

				{summary.sentiment && (
					<div className="flex items-center space-x-4">
						{getSentimentIcon(summary.sentiment)}
						<div className="flex-1">
							<h3 className="font-semibold mb-1">Overall Sentiment</h3>
							<p className="text-sm text-muted-foreground capitalize">
								{summary.sentiment}
							</p>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
