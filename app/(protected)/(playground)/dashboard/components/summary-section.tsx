import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Summary {
	keyTopics?: string[];
	actionItems?: string[];
	sentiment?: string;
}

interface SummarySectionProps {
	summary?: Summary;
}

export function SummarySection({ summary }: SummarySectionProps) {
	if (!summary) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Meeting Summary</CardTitle>
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
				<CardTitle>Meeting Summary</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{summary.keyTopics && summary.keyTopics.length > 0 && (
						<div>
							<h3 className="font-semibold mb-2">Key Topics</h3>
							<ul className="list-disc list-inside">
								{summary.keyTopics.map((topic, index) => (
									<li key={index}>{topic}</li>
								))}
							</ul>
						</div>
					)}
					{summary.actionItems && summary.actionItems.length > 0 && (
						<div>
							<h3 className="font-semibold mb-2">Action Items</h3>
							<ul className="list-disc list-inside">
								{summary.actionItems.map((item, index) => (
									<li key={index}>{item}</li>
								))}
							</ul>
						</div>
					)}
					{summary.sentiment && (
						<div>
							<h3 className="font-semibold mb-2">Sentiment Analysis</h3>
							<p>{summary.sentiment}</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
