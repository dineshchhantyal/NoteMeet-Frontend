import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	Collapsible,
	CollapsibleTrigger,
	CollapsibleContent,
} from '@/components/ui/collapsible'; // Assuming the library is available
import jobs from './jobs';
import { Separator } from '@/components/ui/separator';

export function JobListings() {
	return (
		<section className="mb-16">
			<h2 className="text-2xl font-semibold mb-8">Open Positions</h2>
			<div className="grid gap-6">
				{jobs.map((job, index) => (
					<Card key={index} className="p-4">
						<CardHeader>
							<CardTitle className="text-lg">{job.title}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-wrap gap-2 mb-4">
								<Badge variant="secondary">{job.department}</Badge>
								<Badge variant="outline">{job.location}</Badge>
								<Badge>{job.type}</Badge>
							</div>
							<Collapsible>
								<CollapsibleTrigger asChild>
									<Button variant="link" className="text-sm">
										Read job description
									</Button>
								</CollapsibleTrigger>
								<CollapsibleContent>
									<CardDescription className="text-base text-gray-500">
										{job.description}
									</CardDescription>
									<Separator className="my-4" />
									<CardDescription className="text-base text-gray-500">
										{job.responsibilities.map((responsibility, index) => (
											<li key={index}>{responsibility}</li>
										))}
									</CardDescription>
								</CollapsibleContent>
							</Collapsible>
						</CardContent>
					</Card>
				))}
			</div>
		</section>
	);
}
