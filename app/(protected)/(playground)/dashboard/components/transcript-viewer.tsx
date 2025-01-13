'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Download, Edit } from 'lucide-react';
import {
	VideoTranscriptResponse,
	Word as OriginalWord,
} from '@/types/video-transcript';

interface Word extends OriginalWord {
	segments?: { text: string; isHighlighted: boolean }[];
}

interface TranscriptViewerProps {
	transcript: VideoTranscriptResponse | null;
}

interface TranscriptViewerProps {
	transcript: VideoTranscriptResponse | null;
}

export function TranscriptViewer({ transcript }: TranscriptViewerProps) {
	const [searchTerm, setSearchTerm] = useState('');

	const formattedTranscript = useMemo(() => {
		if (!transcript) return [];

		return transcript.words.reduce((acc: Word[][], word: Word) => {
			if (acc.length === 0 || word.speaker !== acc[acc.length - 1][0].speaker) {
				acc.push([word]);
			} else {
				acc[acc.length - 1].push(word);
			}
			return acc;
		}, []);
	}, [transcript]);

	const highlightedTranscript = useMemo(() => {
		if (searchTerm === '') return formattedTranscript;

		const regex = new RegExp(`(${searchTerm})`, 'gi');
		return formattedTranscript.map((speakerGroup) =>
			speakerGroup.map((word) => ({
				...word,
				segments: word.text.split(regex).map((segment, index) => ({
					text: segment,
					isHighlighted: index % 2 === 1,
				})),
			})),
		);
	}, [formattedTranscript, searchTerm]);

	const formatTime = (seconds: number) => {
		const date = new Date(seconds * 1000);
		return date.toISOString().substr(11, 8);
	};

	if (!transcript) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>Meeting Transcript</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-gray-600">No transcript available.</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle>Transcript</CardTitle>
				<div className="flex space-x-2">
					<Button variant="outline" size="icon">
						<Download className="h-4 w-4" />
					</Button>
					<Button variant="outline" size="icon">
						<Edit className="h-4 w-4" />
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className="flex items-center space-x-2 mb-4">
					<Search className="h-4 w-4 text-gray-600" />
					<Input
						type="search"
						placeholder="Search transcript..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<ScrollArea className="h-[400px] pr-4">
					{highlightedTranscript.map((speakerGroup, groupIndex) => (
						<div key={groupIndex} className="mb-4">
							<div className="font-semibold text-sm text-white mb-1">
								{speakerGroup[0].speaker || `Speaker ${groupIndex + 1}`}
							</div>
							<p className="text-sm leading-relaxed">
								{speakerGroup.map((word, wordIndex) => (
									<span key={wordIndex} className="relative group">
										{word.segments ? (
											word.segments.map((segment, segmentIndex) => (
												<span
													key={segmentIndex}
													className={
														segment.isHighlighted ? 'bg-yellow-200' : ''
													}
												>
													{segment.text}
												</span>
											))
										) : (
											<span>{word.text}</span>
										)}{' '}
										<span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
											{formatTime(word.start / 1000)}
										</span>
									</span>
								))}
							</p>
						</div>
					))}
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
