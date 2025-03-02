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
	CheckCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Sample participants for a business meeting (non-technical)
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

export const Step2Recording = () => {
	const [elapsedTime, setElapsedTime] = useState(0);
	const [currentSpeaker, setCurrentSpeaker] = useState(0);
	const [isMuted, setIsMuted] = useState(false);
	const [isVideoOff, setIsVideoOff] = useState(false);
	const [joinedStatus, setJoinedStatus] = useState('joining'); // joining, recording

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

	// Cycle through speakers periodically
	useEffect(() => {
		if (elapsedTime % 5 === 0 && elapsedTime > 0) {
			// Update NoteMeet status after a few seconds
			if (elapsedTime === 5) {
				setJoinedStatus('recording');
			}

			// Reset all speakers
			const updatedParticipants = [...participants];
			updatedParticipants.forEach((p) => (p.speaking = false));

			// Set new speaker
			const nextSpeaker = (currentSpeaker + 1) % participants.length;
			updatedParticipants[nextSpeaker].speaking = true;
			setCurrentSpeaker(nextSpeaker);

			// Animate speaker highlight
			speakerControls.start({
				scale: [1, 1.05, 1],
				transition: { duration: 0.5 },
			});
		}
	}, [elapsedTime, currentSpeaker, speakerControls]);

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 bg-[#0a1f21] rounded-lg overflow-hidden relative">
				{/* NoteMeet recording indicator */}
				<motion.div
					className="absolute top-3 left-3 z-20 flex items-center bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md"
					animate={{ opacity: [0.7, 1, 0.7] }}
					transition={{ repeat: Infinity, duration: 2 }}
				>
					{joinedStatus === 'joining' ? (
						<>
							<div className="h-2 w-2 rounded-full bg-amber-500 mr-2 animate-pulse"></div>
							<span className="text-white text-xs">NoteMeet Joining...</span>
						</>
					) : (
						<>
							<div className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></div>
							<span className="text-white text-xs">NoteMeet Recording</span>
						</>
					)}
				</motion.div>

				{/* Success notification when recording starts */}
				{joinedStatus === 'recording' && elapsedTime < 10 && (
					<motion.div
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0 }}
						className="absolute top-3 right-3 z-20 flex items-center bg-[#63d392]/20 backdrop-blur-sm px-3 py-1.5 rounded-md border border-[#63d392]/30"
					>
						<CheckCircle className="h-4 w-4 text-[#63d392] mr-2" />
						<span className="text-white text-xs">Meeting capture started</span>
					</motion.div>
				)}

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

			{/* Meeting info and recording status */}
			<div className="mt-4 bg-[#156469]/10 rounded-lg p-3 border border-[#156469]/30">
				<div className="flex justify-between items-center mb-2">
					<h4 className="text-white text-sm font-medium">
						Q1 Marketing Strategy Meeting
					</h4>
					<Badge
						className={
							joinedStatus === 'recording'
								? 'bg-red-500/20 text-red-400 text-xs'
								: 'bg-amber-500/20 text-amber-400 text-xs'
						}
					>
						{joinedStatus === 'recording' ? 'Recording' : 'Connecting...'}
					</Badge>
				</div>

				<div className="flex justify-between items-center text-xs text-gray-300 mb-3">
					<div>4 participants</div>
					<div>{formatTime(elapsedTime)}</div>
				</div>

				{joinedStatus === 'recording' && (
					<div className="space-y-1">
						<div className="flex justify-between items-center text-xs">
							<span className="text-[#63d392]">
								NoteMeet is capturing your meeting
							</span>
							<span className="text-white">
								{Math.min(100, Math.floor(elapsedTime * 3.33))}%
							</span>
						</div>
						<Progress
							value={Math.min(100, elapsedTime * 3.33)}
							className="h-1 bg-[#156469]/30"
						/>
					</div>
				)}
			</div>
		</div>
	);
};
