import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
	title: 'API Documentation | NoteMeet',
	description:
		'Integrate NoteMeet into your applications with our comprehensive API.',
};

export default function ApiDocsPage() {
	return (
		<div className="container mx-auto px-4 py-16">
			<h1 className="text-4xl font-bold mb-8 text-center">API Documentation</h1>

			<div className="mb-8">
				<p className="text-lg mb-4">
					Welcome to the NoteMeet API documentation. Our API allows you to
					integrate NoteMeet&apos;s powerful meeting management and analysis
					features into your own applications.
				</p>
				<Button className="disabled">Get API Key</Button>
				{/* note : coming soon */}
				<span className="text-gray-500 text-xs ml-2">Coming soon</span>
			</div>

			<Tabs defaultValue="authentication">
				<TabsList className="mb-4">
					<TabsTrigger value="authentication">Authentication</TabsTrigger>
					<TabsTrigger value="endpoints">Endpoints</TabsTrigger>
					<TabsTrigger value="examples">Examples</TabsTrigger>
				</TabsList>

				<TabsContent value="authentication">
					<Card>
						<CardHeader>
							<CardTitle>Authentication</CardTitle>
						</CardHeader>
						<CardContent>
							<p>
								To authenticate your API requests, include your API key in the
								header of each request:
							</p>
							<pre className="bg-gray-100 p-4 rounded mt-4">
								<code>{`Authorization: Bearer YOUR_API_KEY`}</code>
							</pre>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="endpoints">
					<Card>
						<CardHeader>
							<CardTitle>API Endpoints</CardTitle>
						</CardHeader>
						<CardContent>
							<ul className="list-disc pl-6 space-y-2">
								<li>
									<code>/api/meetings</code> - Manage meetings
								</li>
								<li>
									<code>/api/transcripts</code> - Retrieve meeting transcripts
								</li>
								<li>
									<code>/api/summaries</code> - Generate and retrieve meeting
									summaries
								</li>
								<li>
									<code>/api/users</code> - Manage user accounts
								</li>
							</ul>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="examples">
					<Card>
						<CardHeader>
							<CardTitle>Example: Create a Meeting</CardTitle>
						</CardHeader>
						<CardContent>
							<pre className="bg-gray-100 p-4 rounded">
								<code>
									{`POST /api/meetings
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "title": "Team Standup",
  "date": "2023-07-01",
  "time": "09:00",
  "participants": ["user1@example.com", "user2@example.com"]
}`}
								</code>
							</pre>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
