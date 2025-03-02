'use client';
import { useState, useMemo, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Download, Copy, Clock, Sparkles } from 'lucide-react';
import {
	VideoTranscriptResponse,
	Word as OriginalWord,
} from '@/types/video-transcript';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
	const [showConfidence, setShowConfidence] = useState(false);
	const scrollAreaRef = useRef<HTMLDivElement>(null);
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
				description: 'Transcript text copied to clipboard',
				duration: 2000,
			});
		}
	};

	const downloadTranscript = () => {
		if (transcript) {
			const text = transcript.text;
			const blob = new Blob([text], { type: 'text/plain' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'meeting-transcript.txt';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			toast({
				title: 'Downloaded',
				description: 'Transcript downloaded successfully',
				duration: 2000,
			});
		}
	};

	const highlightSearchTerm = (text: string) => {
		if (!searchTerm) return text;

		// Case-insensitive search with word boundaries for better results
		const regex = new RegExp(`(\\b${searchTerm}\\b)`, 'gi');
		const parts = text.split(regex);

		return (
			<span>
				{parts.map((part, i) =>
					part.toLowerCase() === searchTerm.toLowerCase() ? (
						<span key={i} className="bg-[#63d392]/30 text-white px-0.5 rounded">
							{part}
						</span>
					) : (
						part
					),
				)}
			</span>
		);
	};

	const filteredSentences = useMemo(() => {
		if (!searchTerm) return sentences;
		return sentences.filter((sentence) =>
			sentence.text.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [sentences, searchTerm]);

	const getConfidenceColor = (confidence: number) => {
		if (confidence > 0.8)
			return 'bg-[#63d392]/20 text-[#63d392] border-[#63d392]/30';
		if (confidence > 0.6)
			return 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30';
		return 'bg-red-500/20 text-red-400 border-red-500/30';
	};

	if (!transcript) {
		return (
			<div className="bg-[#156469]/30 backdrop-blur-sm border-[#63d392]/20 p-6 rounded-xl text-white text-center">
				<div className="flex flex-col items-center justify-center py-8">
					<div className="bg-[#0d5559]/70 p-4 rounded-full mb-4">
						<Search className="h-6 w-6 text-[#63d392]/80" />
					</div>
					<p className="text-gray-300 mb-1">No transcript available</p>
					<p className="text-xs text-gray-400">
						Transcript will appear here once the meeting is processed
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-[#156469]/30 backdrop-blur-sm border-[#63d392]/20 rounded-xl text-white overflow-hidden">
			<div className="border-b border-[#63d392]/20 p-4 space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-medium flex items-center">
						<Search className="h-4 w-4 mr-2 text-[#63d392]" />
						Transcript
						{searchTerm && (
							<Badge className="ml-2 bg-[#63d392]/20 text-[#63d392] border-0">
								{filteredSentences.length} results
							</Badge>
						)}
					</h3>
					<div className="flex space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowConfidence(!showConfidence)}
							className="bg-[#0d5559]/50 hover:bg-[#0d5559] text-white border-[#63d392]/30 hover:border-[#63d392]/50"
						>
							<Sparkles className="h-3.5 w-3.5 mr-1 text-[#63d392]" />
							{showConfidence ? 'Hide' : 'Show'} Confidence
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={copyToClipboard}
							className="bg-[#0d5559]/50 hover:bg-[#0d5559] text-white border-[#63d392]/30 hover:border-[#63d392]/50"
						>
							<Copy className="h-3.5 w-3.5 mr-1 text-[#63d392]" />
							Copy
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={downloadTranscript}
							className="bg-[#0d5559]/50 hover:bg-[#0d5559] text-white border-[#63d392]/30 hover:border-[#63d392]/50"
						>
							<Download className="h-3.5 w-3.5 mr-1 text-[#63d392]" />
							Download
						</Button>
					</div>
				</div>
				<div className="relative">
					<Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#63d392]" />
					<Input
						placeholder="Search transcript..."
						className="pl-8 bg-[#0d5559]/50 border-[#63d392]/30 text-white placeholder:text-gray-300 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
			</div>

			<ScrollArea className="h-[500px]" ref={scrollAreaRef}>
				<div className="p-4 space-y-2">
					{filteredSentences.length > 0 ? (
						filteredSentences.map((sentence, index) => (
							<div
								key={index}
								className={cn(
									'flex items-start p-3 rounded-lg transition-colors',
									'border border-[#63d392]/20 hover:bg-[#0d5559]/60 bg-[#0d5559]/30',
									searchTerm && 'animate-pulse-once',
								)}
							>
								<div className="flex flex-col items-center space-y-1 min-w-[60px] mr-3 justify-center">
									<div className="p-1.5 bg-[#156469]/50 rounded-full">
										<Clock className="h-3.5 w-3.5 text-[#63d392]" />
									</div>
									<span className="text-xs text-gray-300">
										{formatTimestamp(sentence.startTime)}
									</span>
								</div>

								<div className="flex-1 space-y-2">
									<p className="text-sm leading-relaxed text-gray-100">
										{highlightSearchTerm(sentence.text)}
									</p>

									{showConfidence && (
										<div className="flex items-center gap-3 mt-1.5">
											<Badge
												variant="outline"
												className={cn(
													'text-xs h-5',
													getConfidenceColor(sentence.confidence),
												)}
											>
												<Sparkles className="h-3 w-3 mr-1" />
												{Math.round(sentence.confidence * 100)}% confidence
											</Badge>

											<span className="text-xs text-gray-400">
												Duration:{' '}
												{formatTimestamp(sentence.endTime - sentence.startTime)}
											</span>
										</div>
									)}
								</div>
							</div>
						))
					) : (
						<div className="flex flex-col items-center justify-center py-6 text-center">
							<div className="bg-[#0d5559]/70 p-3 rounded-full mb-3">
								<Search className="h-5 w-5 text-[#63d392]/80" />
							</div>
							<p className="text-gray-300">No results found</p>
							<p className="text-xs text-gray-400 mt-1">
								Try a different search term
							</p>
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
}
