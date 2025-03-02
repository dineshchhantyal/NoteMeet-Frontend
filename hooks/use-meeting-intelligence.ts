import { useState, useEffect } from 'react';
import { MeetingInterface } from '@/types';

interface MeetingInsight {
	type: 'topic' | 'sentiment' | 'action' | 'decision' | 'question';
	text: string;
	confidence: number;
	timestamp?: string;
	speaker?: string;
}

export function useMeetingIntelligence(meeting: MeetingInterface) {
	const [insights, setInsights] = useState<MeetingInsight[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch insights when meeting changes
	useEffect(() => {
		const fetchInsights = async () => {
			if (!meeting.id) return;

			setLoading(true);
			setError(null);

			try {
				const response = await fetch(`/api/meetings/${meeting.id}/insights`);

				if (!response.ok) {
					throw new Error('Failed to fetch meeting insights');
				}

				const data = await response.json();
				setInsights(data.insights || []);
			} catch (err) {
				console.error('Error fetching meeting insights:', err);
				setError('Failed to load meeting insights');
				setInsights([]);
			} finally {
				setLoading(false);
			}
		};

		fetchInsights();
	}, [meeting.id]);

	return {
		insights,
		loading,
		error,
		// Helper functions to filter insights by type
		getTopics: () => insights.filter((i) => i.type === 'topic'),
		getActionItems: () => insights.filter((i) => i.type === 'action'),
		getDecisions: () => insights.filter((i) => i.type === 'decision'),
		getQuestions: () => insights.filter((i) => i.type === 'question'),
		// Function to analyze a custom query using the meeting data
		analyzeQuery: async (query: string) => {
			try {
				const response = await fetch(`/api/meetings/${meeting.id}/analyze`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query }),
				});

				if (!response.ok) {
					throw new Error('Failed to analyze query');
				}

				return await response.json();
			} catch (err) {
				console.error('Error analyzing query:', err);
				throw err;
			}
		},
	};
}
