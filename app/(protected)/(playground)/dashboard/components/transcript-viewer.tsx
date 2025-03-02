'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Download, Copy, Clock } from 'lucide-react';

import {
	VideoTranscriptResponse,
	Word as OriginalWord,
} from '@/types/video-transcript';
import { useToast } from '@/hooks/use-toast';

interface Word extends OriginalWord {
	segments?: { text: string; isHighlighted: boolean }[];
}

interface Sentence {
	text: string;
	startTime: number;
	endTime: number;
	confidence: number;
	words: Word[];
}

interface TranscriptViewerProps {
	transcript: VideoTranscriptResponse | null;
}

export function TranscriptViewer({ transcript }: TranscriptViewerProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const { toast } = useToast();

	const sentences = useMemo(() => {
		if (!transcript?.words) return [];

		const sentences: Sentence[] = [];
		let currentSentence: Word[] = [];

		transcript.words.forEach((word, index) => {
			currentSentence.push(word);

			// Check if word ends with sentence-ending punctuation or is last word
			if (word.text.match(/[.!?]$/) || index === transcript.words.length - 1) {
				const sentenceText = currentSentence.map((w) => w.text).join(' ');
				const avgConfidence =
					currentSentence.reduce((acc, w) => acc + w.confidence, 0) /
					currentSentence.length;

				sentences.push({
					text: sentenceText,
					startTime: currentSentence[0].start,
					endTime: currentSentence[currentSentence.length - 1].end,
					confidence: avgConfidence,
					words: [...currentSentence],
				});

				currentSentence = [];
			}
		});

		return sentences;
	}, [transcript?.words]);

	const formatTimestamp = (ms: number) => {
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
	};

	const copyToClipboard = () => {
		if (transcript) {
			navigator.clipboard.writeText(transcript.text);
			toast({
				title: 'Copied to clipboard',
				duration: 2000,
			});
		}
	};

	const highlightSearchTerm = (text: string) => {
		if (!searchTerm) return text;
		const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
		return (
			<span>
				{parts.map((part, i) =>
					part.toLowerCase() === searchTerm.toLowerCase() ? (
						<span key={i} className="bg-yellow-200 dark:bg-yellow-800">
							{part}
						</span>
					) : (
						part
					),
				)}
			</span>
		);
	};

	return (
		<Card className="h-full">
			<CardHeader className="space-y-4">
				<CardTitle className="flex items-center justify-between">
					<span>Transcript</span>
					<div className="space-x-2">
						<Button variant="outline" size="sm" onClick={copyToClipboard}>
							<Copy className="h-4 w-4 mr-2" />
							Copy
						</Button>
						<Button variant="outline" size="sm">
							<Download className="h-4 w-4 mr-2" />
							Download
						</Button>
					</div>
				</CardTitle>
				<div className="relative">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search transcript..."
						className="pl-8"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[500px] pr-4">
					<div className="space-y-6">
						{sentences.map((sentence, index) => (
							<div
								key={index}
								className="flex items-start space-x-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
							>
								<div className="flex flex-col items-center space-y-1 min-w-[80px] justify-center">
									<Clock className="h-4 w-4 text-muted-foreground" />
									<span className="text-xs text-muted-foreground">
										{formatTimestamp(sentence.startTime)}
									</span>
								</div>
								<div className="flex-1 space-y-2 items-center justify-center">
									<p className="text-sm leading-relaxed">
										{highlightSearchTerm(sentence.text)}
									</p>
									{/* <div className="flex items-center space-x-4 text-xs text-muted-foreground">
										<span>
											Duration:{' '}
											{formatTimestamp(sentence.endTime - sentence.startTime)}
										</span>
										<span>
											Confidence: {Math.round(sentence.confidence * 100)}%
										</span>
									</div> */}
								</div>
							</div>
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
