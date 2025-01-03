'use client';

import React from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { EarlyAccessSubmission } from '@/types/early-access';

export function AdminDashboard() {
	const [submissions, setSubmissions] = React.useState<EarlyAccessSubmission[]>(
		[],
	);
	const [loading, setLoading] = React.useState(true);

	const fetchSubmissions = async () => {
		try {
			const { data, error } = await fetch(
				'/api/admin/view-early-access-forms',
			).then((res) => res.json());

			if (error) throw error;
			setSubmissions(data);
		} catch (error) {
			console.error('Error fetching submissions:', error);
		} finally {
			setLoading(false);
		}
	};

	React.useEffect(() => {
		fetchSubmissions();
	}, []);

	const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
		try {
			const { success, data } = await fetch(
				'/api/admin/view-early-access-forms',
				{
					method: 'PATCH',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						id,
						status,
						isVerified: status === 'approved',
					}),
				},
			).then((res) => res.json());
			if (success) {
				setSubmissions((submissions) =>
					submissions.map((submission) =>
						submission.id === id
							? { ...submission, status, isVerified: status === 'approved' }
							: submission,
					),
				);
			} else {
				throw new Error('Failed to update submission');
			}
		} catch (error) {
			console.error('Error updating submission:', error);
		}
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<Loader2 className="animate-spin" size={32} />
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">Early Access Applications</h1>

			<div className="space-y-6">
				{submissions.map((submission) => (
					<div
						key={submission.id}
						className="bg-white p-6 rounded-lg shadow-md space-y-4"
					>
						<div className="flex justify-between items-start">
							<div>
								<h2 className="text-xl font-semibold">{submission.name}</h2>
								<p className="text-gray-600">{submission.email}</p>
								<p className="text-gray-600">{submission.company}</p>
							</div>
							<div className="space-x-2">
								<button
									onClick={() => updateStatus(submission.id, 'approved')}
									disabled={submission.status === 'approved'}
									className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
								>
									<Check size={20} />
								</button>
								<button
									onClick={() => updateStatus(submission.id, 'rejected')}
									disabled={submission.status === 'rejected'}
									className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
								>
									<X size={20} />
								</button>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<p className="font-medium">
									Subscription: {submission.subscription}
								</p>
								<p className="font-medium">
									Payment Method: {submission.paymentMethod}
								</p>
							</div>
							<div>
								<p className="font-medium">
									Status:
									<span
										className={`ml-2 px-2 py-1 rounded text-sm ${
											submission.status === 'approved'
												? 'bg-green-100 text-green-800'
												: submission.status === 'rejected'
													? 'bg-red-100 text-red-800'
													: 'bg-yellow-100 text-yellow-800'
										}`}
									>
										{submission.status.toUpperCase()}
									</span>
								</p>
								<p className="font-medium">
									Verified: {submission.isVerified ? 'Yes' : 'No'}
								</p>
							</div>
						</div>

						{submission.features.length > 0 && (
							<div>
								<p className="font-medium">Requested Features:</p>
								<ul className="list-disc list-inside">
									{submission.features.map((feature) => (
										<li key={feature}>{feature}</li>
									))}
								</ul>
							</div>
						)}

						{submission.message && (
							<div>
								<p className="font-medium">Additional Message:</p>
								<p className="text-gray-600">{submission.message}</p>
							</div>
						)}

						<div className="text-sm text-gray-500">
							Submitted: {new Date(submission.createdAt).toLocaleString()}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
