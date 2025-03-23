'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
	Search,
	Download,
	Copy,
	Clock,
	ChevronDown,
	Sparkles,
	ArrowDown,
	ArrowUp,
	BookText,
} from 'lucide-react';
import {
	VideoTranscriptResponse,
	Word as OriginalWord,
} from '@/types/video-transcript';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import { cn } from '@/lib/utils';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Word extends OriginalWord {
	segments?: { text: string; isHighlighted: boolean }[];
}

interface Sentence {
	text: string;
	startTime: number;
	endTime: number;
	confidence: number;
	words: Word[];
	id: string;
}

interface TranscriptViewerProps {
	transcript: VideoTranscriptResponse | null;
	onSegmentClick?: (timeInSeconds: number) => void;
}

export function TranscriptViewer({
	transcript,
	onSegmentClick,
}: TranscriptViewerProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [showConfidence, setShowConfidence] = useState(false);
	const [currentResultIndex, setCurrentResultIndex] = useState(0);
	const scrollAreaRef = useRef<HTMLDivElement>(null);
	const resultRefs = useRef<Record<string, HTMLDivElement>>({});
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
					id: `sentence-${sentences.length}`,
				});

				currentSentence = [];
			}
		});

		return sentences;
	}, [transcript?.words]);

	const formatTimestamp = (ms: number) => {
		const totalSeconds = Math.floor(ms / 1000);
		const minutes = Math.floor(totalSeconds / 60);
		const seconds = totalSeconds % 60;
		return `${minutes}:${String(seconds).padStart(2, '0')}`;
	};

	const copyToClipboard = () => {
		if (transcript) {
			navigator.clipboard.writeText(transcript.text);
			toast({
				title: 'Copied to clipboard',
				description: 'Full transcript copied to clipboard',
				duration: 2000,
			});
		}
	};

	const downloadTranscript = (format: 'txt' | 'md' | 'srt') => {
		if (!transcript) return;

		let content = '';
		let filename = 'meeting-transcript';
		const mimeType = 'text/plain';

		switch (format) {
			case 'txt':
				content = transcript.text;
				filename += '.txt';
				break;
			case 'md':
				content = `# Meeting Transcript\n\n${sentences
					.map((s) => `**[${formatTimestamp(s.startTime)}]** ${s.text}`)
					.join('\n\n')}`;
				filename += '.md';
				break;
			case 'srt':
				content = sentences
					.map((s, i) => {
						const startTimeFormatted = formatSrtTimestamp(s.startTime);
						const endTimeFormatted = formatSrtTimestamp(s.endTime);
						return `${i + 1}\n${startTimeFormatted} --> ${endTimeFormatted}\n${s.text}\n`;
					})
					.join('\n');
				filename += '.srt';
				break;
		}

		const blob = new Blob([content], { type: mimeType });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);

		toast({
			title: 'Downloaded',
			description: `Transcript downloaded as ${format.toUpperCase()}`,
			duration: 2000,
		});
	};

	const formatSrtTimestamp = (ms: number) => {
		const totalSeconds = Math.floor(ms / 1000);
		const hours = Math.floor(totalSeconds / 3600);
		const minutes = Math.floor((totalSeconds % 3600) / 60);
		const seconds = totalSeconds % 60;
		const milliseconds = Math.floor((ms % 1000) / 10);

		return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(milliseconds).padStart(2, '0')}`;
	};

	const highlightSearchTerm = (text: string) => {
		if (!searchTerm) return text;

		// More flexible search that doesn't require full word boundaries
		const escapedSearchTerm = searchTerm.replace(
			/[-\/\\^$*+?.()|[\]{}]/g,
			'\\$&',
		);
		const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
		const parts = text.split(regex);

		return (
			<span>
				{parts.map((part, i) =>
					part.toLowerCase() === searchTerm.toLowerCase() ? (
						<span
							key={i}
							className="bg-[#63d392]/30 text-white px-1 rounded font-medium animate-pulse-slow"
						>
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
		if (confidence >= 0.9)
			return 'bg-[#63d392]/20 text-[#63d392] border-[#63d392]/30';
		if (confidence >= 0.7)
			return 'bg-[#fbbf24]/20 text-[#fbbf24] border-[#fbbf24]/30';
		return 'bg-red-500/20 text-red-400 border-red-500/30';
	};

	const getConfidenceLabel = (confidence: number) => {
		if (confidence >= 0.9) return 'High';
		if (confidence >= 0.7) return 'Medium';
		return 'Low';
	};

	useEffect(() => {
		// Reset current result index when search term changes
		setCurrentResultIndex(0);
	}, [searchTerm]);

	useEffect(() => {
		// Scroll to current search result
		if (filteredSentences.length > 0 && searchTerm) {
			const currentId = filteredSentences[currentResultIndex]?.id;
			if (currentId && resultRefs.current[currentId]) {
				resultRefs.current[currentId].scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				});
			}
		}
	}, [currentResultIndex, filteredSentences, searchTerm]);

	// Navigate to next search result
	const goToNextResult = () => {
		if (currentResultIndex < filteredSentences.length - 1) {
			setCurrentResultIndex(currentResultIndex + 1);
		} else {
			setCurrentResultIndex(0); // Wrap around to first result
		}
	};

	// Navigate to previous search result
	const goToPrevResult = () => {
		if (currentResultIndex > 0) {
			setCurrentResultIndex(currentResultIndex - 1);
		} else {
			setCurrentResultIndex(filteredSentences.length - 1); // Wrap around to last result
		}
	};

	// Copy single sentence
	const copySentence = (text: string) => {
		navigator.clipboard.writeText(text);
		toast({
			title: 'Copied',
			description: 'Sentence copied to clipboard',
			duration: 2000,
		});
	};

	// Add a click handler to transcript segments
	const handleSegmentClick = (startTime: number) => {
		if (onSegmentClick) {
			onSegmentClick(startTime / 1000);
		}
	};

	if (!transcript) {
		return (
			<div className="bg-[#156469]/30 backdrop-blur-sm border border-[#63d392]/20 p-6 rounded-xl text-white text-center">
				<div className="flex flex-col items-center justify-center py-8">
					<div className="bg-[#0d5559]/70 p-4 rounded-full mb-4">
						<BookText className="h-6 w-6 text-[#63d392]/80" />
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
		<div className="bg-[#156469]/30 backdrop-blur-sm border border-[#63d392]/20 rounded-xl text-white overflow-hidden shadow-md">
			<div className="border-b border-[#63d392]/20 p-4 space-y-4">
				<div className="flex items-center justify-between flex-wrap gap-2">
					<h3 className="text-lg font-medium flex items-center">
						<BookText className="h-4 w-4 mr-2 text-[#63d392]" />
						Transcript
						{searchTerm && (
							<Badge className="ml-2 bg-[#63d392]/20 text-[#63d392] border-0">
								{filteredSentences.length > 0 ? (
									<>
										{currentResultIndex + 1}/{filteredSentences.length} results
									</>
								) : (
									'0 results'
								)}
							</Badge>
						)}
					</h3>

					<div className="flex space-x-2">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Toggle
										pressed={showConfidence}
										onPressedChange={setShowConfidence}
										className="bg-[#0d5559]/50 data-[state=on]:bg-[#63d392]/20 data-[state=on]:text-[#63d392] hover:bg-[#0d5559] text-white border-[#63d392]/30"
									>
										<Sparkles className="h-3.5 w-3.5 mr-1" />
										Confidence
									</Toggle>
								</TooltipTrigger>
								<TooltipContent className="bg-[#0d5559] border-[#63d392]/20">
									<p>Show AI confidence scores</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										onClick={copyToClipboard}
										className="bg-[#0d5559]/50 hover:bg-[#0d5559] text-white border-[#63d392]/30 hover:border-[#63d392]/50"
									>
										<Copy className="h-3.5 w-3.5 mr-1 text-[#63d392]" />
										Copy
									</Button>
								</TooltipTrigger>
								<TooltipContent className="bg-[#0d5559] border-[#63d392]/20">
									<p>Copy the full transcript</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<DropdownMenu>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<DropdownMenuTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												className="bg-[#0d5559]/50 hover:bg-[#0d5559] text-white border-[#63d392]/30 hover:border-[#63d392]/50"
											>
												<Download className="h-3.5 w-3.5 mr-1 text-[#63d392]" />
												Download
												<ChevronDown className="h-3 w-3 ml-1" />
											</Button>
										</DropdownMenuTrigger>
									</TooltipTrigger>
									<TooltipContent className="bg-[#0d5559] border-[#63d392]/20">
										<p>Download in different formats</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>

							<DropdownMenuContent className="bg-[#0d5559] border-[#63d392]/20 text-white">
								<DropdownMenuItem
									onClick={() => downloadTranscript('txt')}
									className="hover:bg-[#156469] cursor-pointer"
								>
									Plain Text (.txt)
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => downloadTranscript('md')}
									className="hover:bg-[#156469] cursor-pointer"
								>
									Markdown (.md)
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => downloadTranscript('srt')}
									className="hover:bg-[#156469] cursor-pointer"
								>
									Subtitles (.srt)
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>

				<div className="flex gap-2">
					<div className="relative flex-1">
						<Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-[#63d392]" />
						<Input
							placeholder="Search transcript..."
							className="pl-8 bg-[#0d5559]/50 border-[#63d392]/30 text-white placeholder:text-gray-300 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									if (e.shiftKey) goToPrevResult();
									else goToNextResult();
								}
							}}
						/>
					</div>

					{searchTerm && filteredSentences.length > 0 && (
						<div className="flex">
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="outline"
											size="icon"
											onClick={goToPrevResult}
											className="rounded-r-none bg-[#0d5559]/50 hover:bg-[#0d5559] text-white border-[#63d392]/30"
										>
											<ArrowUp className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent className="bg-[#0d5559] border-[#63d392]/20">
										<p>Previous result (Shift+Enter)</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>

							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											variant="outline"
											size="icon"
											onClick={goToNextResult}
											className="rounded-l-none bg-[#0d5559]/50 hover:bg-[#0d5559] text-white border-[#63d392]/30 border-l-0"
										>
											<ArrowDown className="h-4 w-4" />
										</Button>
									</TooltipTrigger>
									<TooltipContent className="bg-[#0d5559] border-[#63d392]/20">
										<p>Next result (Enter)</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					)}
				</div>
			</div>

			<ScrollArea className="h-[500px]" ref={scrollAreaRef}>
				<div className="p-4 space-y-2">
					{filteredSentences.length > 0 ? (
						filteredSentences.map((sentence, index) => (
							<div
								key={sentence.id}
								ref={(el) => {
									if (el) resultRefs.current[sentence.id] = el;
								}}
								className={cn(
									'flex items-start p-3 rounded-lg transition-colors group',
									'border border-[#63d392]/20 hover:bg-[#0d5559]/60 bg-[#0d5559]/30',
									currentResultIndex === index &&
										searchTerm &&
										'ring-2 ring-[#63d392]/50',
									'pb-3 border-b border-[#63d392]/10 last:border-0 transition-colors hover:bg-[#156469]/50 p-2 rounded',
								)}
								onClick={() => handleSegmentClick(sentence.startTime)}
							>
								<div className="flex flex-col items-center space-y-1 min-w-[60px] mr-3 justify-center">
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger asChild>
												<div className="p-1.5 bg-[#156469]/50 rounded-full">
													<Clock className="h-3.5 w-3.5 text-[#63d392]" />
												</div>
											</TooltipTrigger>
											<TooltipContent className="bg-[#0d5559] border-[#63d392]/20">
												<p>Timestamp</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
									<span className="text-xs text-gray-300">
										{formatTimestamp(sentence.startTime)}
									</span>
								</div>

								<div className="flex-1 space-y-2">
									<p className="text-sm leading-relaxed text-gray-100">
										{highlightSearchTerm(sentence.text)}
									</p>

									{showConfidence && (
										<div className="flex items-center gap-3 mt-2">
											<Badge
												variant="outline"
												className={cn(
													'text-xs h-5',
													getConfidenceColor(sentence.confidence),
												)}
											>
												<Sparkles className="h-3 w-3 mr-1" />
												{getConfidenceLabel(sentence.confidence)} (
												{Math.round(sentence.confidence * 100)}%)
											</Badge>

											<span className="text-xs text-gray-400">
												Duration:{' '}
												{formatTimestamp(sentence.endTime - sentence.startTime)}
											</span>
										</div>
									)}
								</div>

								<Button
									variant="ghost"
									size="icon"
									onClick={() => copySentence(sentence.text)}
									className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7 bg-[#0d5559]/50 hover:bg-[#156469]"
								>
									<Copy className="h-3 w-3 text-[#63d392]" />
								</Button>
							</div>
						))
					) : (
						<div className="flex flex-col items-center justify-center py-8 text-center">
							<div className="bg-[#0d5559]/70 p-3 rounded-full mb-3">
								<Search className="h-5 w-5 text-[#63d392]/80" />
							</div>
							<p className="text-gray-300">No results found</p>
							<p className="text-xs text-gray-400 mt-1">
								Try a different search term or
								<Button
									variant="link"
									size="sm"
									onClick={() => setSearchTerm('')}
									className="text-xs text-[#63d392] px-1 py-0 h-auto"
								>
									clear the search
								</Button>
							</p>
						</div>
					)}
				</div>
			</ScrollArea>
		</div>
	);
}
