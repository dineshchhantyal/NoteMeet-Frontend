'use client';

import { motion, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
	Mic,
	MicOff,
	Video,
	VideoOff,
	Users,
	MessageSquare,
	Clock,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Sample participants
const participants = [
	{
		name: 'Sarah Johnson',
		role: 'Marketing Director',
		avatar: '/avatars/sarah.png',
		initials: 'SJ',
		speaking: true,
	},
	{
		name: 'Michael Chen',
		role: 'Product Manager',
		avatar: '/avatars/alex.png',
		initials: 'MC',
		speaking: false,
	},
	{
		name: 'Emma Garcia',
		role: 'Sales Lead',
		avatar: '/avatars/taylor.png',
		initials: 'EG',
		speaking: false,
	},
	{
		name: 'David Wong',
		role: 'Creative Director',
		avatar: '/avatars/miguel.png',
		initials: 'DW',
		speaking: false,
	},
];

// Sample transcript lines for marketing meeting
const marketingChat = [
	{ speaker: 'Sarah', text: "Let's review our Q1 campaign performance today." },
	{
		speaker: 'Emma',
		text: 'The social media ads outperformed our expectations by 27%.',
	},
	{
		speaker: 'Michael',
		text: 'Website traffic is up 35% compared to last quarter.',
	},
	{
		speaker: 'David',
		text: 'Our audience engagement has doubled on LinkedIn.',
	},
];

export const Step2Recording = () => {
	const [elapsedTime, setElapsedTime] = useState(0);
	const [currentLine, setCurrentLine] = useState(0);
	const [isMuted, setIsMuted] = useState(false);
	const [isVideoOff, setIsVideoOff] = useState(false);

	// Animation for speaker highlight
	const speakerControls = useAnimation();

	// Format time as MM:SS
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
			.toString()
			.padStart(2, '0');
		const secs = (seconds % 60).toString().padStart(2, '0');
		return `${mins}:${secs}`;
	};

	// Simulate meeting progression
	useEffect(() => {
		const timer = setInterval(() => {
			setElapsedTime((prev) => prev + 1);
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	// Advance through chat lines
	useEffect(() => {
		if (elapsedTime % 5 === 0 && elapsedTime > 0) {
			setCurrentLine((prev) => (prev + 1) % marketingChat.length);

			// Highlight current speaker
			const currentSpeaker = marketingChat[currentLine].speaker;
			const speakerIndex = participants.findIndex(
				(p) => p.name.split(' ')[0] === currentSpeaker,
			);

			// Reset all speakers
			participants.forEach((p) => (p.speaking = false));

			// Set current speaker
			if (speakerIndex >= 0) {
				participants[speakerIndex].speaking = true;
			}

			// Animate speaker highlight
			speakerControls.start({
				scale: [1, 1.05, 1],
				opacity: [1, 1, 1],
				transition: { duration: 0.5 },
			});
		}
	}, [elapsedTime, currentLine, speakerControls]);

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 bg-[#0a1f21] rounded-lg overflow-hidden relative">
				{/* NoteMeet recording indicator */}
				<motion.div
					className="absolute top-3 left-3 z-20 flex items-center bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md"
					animate={{ opacity: [0.7, 1, 0.7] }}
					transition={{ repeat: Infinity, duration: 2 }}
				>
					<div className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
					<span className="text-white text-xs">NoteMeet Recording</span>
				</motion.div>

				{/* Main video grid */}
				<div className="grid grid-cols-2 gap-2 h-full p-3">
					{participants.map((person, idx) => (
						<motion.div
							key={idx}
							className={`relative bg-[#156469]/40 rounded-md overflow-hidden flex items-center justify-center ${
								person.speaking ? 'ring-2 ring-[#63d392]' : ''
							}`}
							animate={person.speaking ? speakerControls : {}}
						>
							{isVideoOff ? (
								<div className="h-full w-full flex flex-col items-center justify-center">
									<Avatar className="h-16 w-16">
										<AvatarImage src={person.avatar} />
										<AvatarFallback className="bg-[#156469] text-white">
											{person.initials}
										</AvatarFallback>
									</Avatar>
									<p className="text-white text-xs mt-2">{person.name}</p>
								</div>
							) : (
								<div className="h-full w-full bg-gradient-to-br from-[#156469] to-[#0a1f21]">
									{/* Simulated video */}
									<div className="h-full flex flex-col items-center justify-center">
										<div className="h-3/4 w-3/4 rounded-full bg-gradient-to-br from-[#156469]/50 to-[#0a1f21]/50 flex items-center justify-center">
											<Avatar className="h-16 w-16">
												<AvatarImage src={person.avatar} />
												<AvatarFallback className="bg-[#156469] text-white">
													{person.initials}
												</AvatarFallback>
											</Avatar>
										</div>
									</div>
								</div>
							)}

							{/* Speaker name tag */}
							<div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-xs text-white flex items-center">
								{person.speaking && (
									<motion.div
										className="h-1.5 w-1.5 rounded-full bg-[#63d392] mr-1"
										animate={{ scale: [1, 1.5, 1] }}
										transition={{ repeat: Infinity, duration: 1.5 }}
									/>
								)}
								{person.name}
							</div>
						</motion.div>
					))}
				</div>

				{/* Meeting controls */}
				<div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-3 flex justify-center space-x-4">
					<button
						className={`p-2.5 rounded-full ${isMuted ? 'bg-red-500/80' : 'bg-[#156469]/80'}`}
						onClick={() => setIsMuted(!isMuted)}
					>
						{isMuted ? (
							<MicOff className="h-5 w-5 text-white" />
						) : (
							<Mic className="h-5 w-5 text-white" />
						)}
					</button>

					<button
						className={`p-2.5 rounded-full ${isVideoOff ? 'bg-red-500/80' : 'bg-[#156469]/80'}`}
						onClick={() => setIsVideoOff(!isVideoOff)}
					>
						{isVideoOff ? (
							<VideoOff className="h-5 w-5 text-white" />
						) : (
							<Video className="h-5 w-5 text-white" />
						)}
					</button>

					<button className="p-2.5 rounded-full bg-[#156469]/80">
						<Users className="h-5 w-5 text-white" />
					</button>

					<button className="p-2.5 rounded-full bg-[#156469]/80">
						<MessageSquare className="h-5 w-5 text-white" />
					</button>

					<div className="flex items-center px-3 rounded-full bg-[#156469]/30">
						<Clock className="h-4 w-4 text-[#63d392] mr-1" />
						<span className="text-white text-sm">
							{formatTime(elapsedTime)}
						</span>
					</div>
				</div>
			</div>

			{/* Live transcript */}
			<div className="mt-4 bg-[#156469]/10 rounded-lg p-3 border border-[#156469]/30 max-h-[120px] overflow-y-auto">
				<div className="flex justify-between items-center mb-2">
					<h4 className="text-[#63d392] text-xs uppercase tracking-wider">
						Live Transcript
					</h4>
					<Badge className="bg-[#63d392]/20 text-[#63d392] text-xs">
						AI-Powered
					</Badge>
				</div>

				<div className="space-y-2">
					{marketingChat
						.slice(0, Math.min(currentLine + 1, marketingChat.length))
						.map((line, idx) => (
							<motion.div
								key={idx}
								className="flex"
								initial={{ opacity: 0, x: -5 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3 }}
							>
								<span className="text-[#63d392] text-xs font-medium mr-2 whitespace-nowrap">
									{line.speaker}:
								</span>
								<span className="text-white text-xs">{line.text}</span>
							</motion.div>
						))}
				</div>

				{currentLine < marketingChat.length - 1 && (
					<motion.div
						className="text-[#63d392]/70 text-xs italic mt-1"
						animate={{ opacity: [0.5, 1, 0.5] }}
						transition={{ repeat: Infinity, duration: 2 }}
					>
						Transcribing in real-time...
					</motion.div>
				)}
			</div>
		</div>
	);
};
