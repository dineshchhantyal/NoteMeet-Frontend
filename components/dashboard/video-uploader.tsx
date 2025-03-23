'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
	Upload,
	X,
	Check,
	AlertTriangle,
	Loader2,
	Video,
	FilePlus2,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { MeetingInterface } from '@/types';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

interface VideoUploaderProps {
	meeting: MeetingInterface;
	onUploadComplete: () => void;
}

export function VideoUploader({
	meeting,
	onUploadComplete,
}: VideoUploaderProps) {
	const [file, setFile] = useState<File | null>(null);
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const [, setProcessing] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const resetUpload = () => {
		setFile(null);
		setProgress(0);
		setError(null);
		if (fileInputRef.current) fileInputRef.current.value = '';
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0];
		if (!selectedFile) return;

		// Validate file type
		const validTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
		if (!validTypes.includes(selectedFile.type)) {
			setError('Please select a valid video file (MP4, WebM, or MOV)');
			return;
		}

		// Validate file size (100MB max)
		const maxSize = 100 * 1024 * 1024; // 100MB
		if (selectedFile.size > maxSize) {
			setError('File size exceeds 100MB limit');
			return;
		}

		setFile(selectedFile);
		setError(null);
	};

	const uploadVideo = async () => {
		if (!file || !meeting.id) return;

		try {
			setUploading(true);
			setProgress(0);

			// Get presigned URL from backend
			const presignedResponse = await fetch(
				`/api/meetings/${meeting.id}/presigned-url/upload`,
			);

			if (!presignedResponse.ok) {
				const error = await presignedResponse.json();
				throw new Error(error.message || 'Failed to get upload URL');
			}

			const { presignedUrl } = await presignedResponse.json();

			// Upload file to S3 using presigned URL with progress tracking
			const xhr = new XMLHttpRequest();

			xhr.upload.addEventListener('progress', (event) => {
				if (event.lengthComputable) {
					const percentage = Math.round((event.loaded / event.total) * 100);
					setProgress(percentage);
				}
			});

			xhr.addEventListener('load', () => {
				if (xhr.status >= 200 && xhr.status < 300) {
					toast.success('Video uploaded successfully');
					setUploading(false);
					setProgress(100);
					setProcessing(true); // Set processing state to true
					onUploadComplete();
				} else {
					setError('Upload failed');
					setUploading(false);
				}
			});

			xhr.addEventListener('error', () => {
				setError('Upload failed');
				setUploading(false);
			});

			xhr.open('PUT', presignedUrl);
			xhr.setRequestHeader('Content-Type', file.type);
			xhr.send(file);
		} catch (err) {
			console.error('Error uploading video:', err);
			setError('Failed to upload video');
			setUploading(false);
		}
	};

	return (
		<Card className="bg-[#156469]/50 border-[#63d392]/30 text-white shadow-lg">
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center text-xl">
					<Video className="h-5 w-5 mr-2 text-[#63d392]" />
					Meeting Recording
				</CardTitle>
				<CardDescription className="text-gray-300">
					{!file
						? 'Add a video recording of your meeting'
						: progress === 100
							? 'Video uploaded and now processing'
							: uploading
								? 'Uploading your video'
								: 'Ready to upload'}
				</CardDescription>
			</CardHeader>

			<CardContent className="pt-4">
				{!file ? (
					<div
						className="border-2 border-dashed border-[#63d392]/30 rounded-lg p-8 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-[#156469]/70 transition-colors"
						onClick={() => fileInputRef.current?.click()}
					>
						<div className="bg-[#0d5559] p-5 rounded-full mb-4 group-hover:bg-[#0a4a4e] transition-colors">
							<FilePlus2 className="h-10 w-10 text-[#63d392]" />
						</div>
						<h3 className="text-lg font-medium mb-2">
							Drop your video file here
						</h3>
						<p className="text-sm text-gray-300 mb-3">
							or click to select a file
						</p>
						<p className="text-xs text-gray-400">
							MP4, WebM or MOV (max 100MB)
						</p>
						<input
							type="file"
							accept="video/mp4,video/webm,video/quicktime"
							onChange={handleFileChange}
							className="hidden"
							ref={fileInputRef}
						/>
					</div>
				) : uploading ? (
					<div className="p-4">
						<div className="mb-2 flex items-center">
							<div className="bg-[#0d5559] p-2 rounded-full mr-3">
								<Loader2 className="h-5 w-5 text-[#63d392] animate-spin" />
							</div>
							<div className="flex-1">
								<div className="flex justify-between mb-1">
									<span className="text-sm text-white font-medium">
										{file.name}
									</span>
									<span className="text-sm font-medium text-[#63d392]">
										{progress}%
									</span>
								</div>
								<Progress value={progress} className="h-2 bg-[#0d5559]" />
							</div>
						</div>
						<p className="text-sm text-gray-300 mt-3">
							Uploading your video... Please keep this window open.
						</p>
					</div>
				) : progress === 100 ? (
					<div className="p-4 flex flex-col items-center text-center">
						<div className="bg-green-500/20 p-4 rounded-full mb-4">
							<Check className="h-8 w-8 text-green-400" />
						</div>
						<h3 className="text-lg font-medium mb-2">Upload Complete!</h3>
						<div className="bg-[#0d5559]/70 rounded-md p-3 mb-4">
							<div className="flex items-center mb-2">
								<Loader2 className="h-4 w-4 mr-2 text-[#63d392] animate-spin" />
								<p className="text-sm font-medium text-white">
									Processing your video
								</p>
							</div>
							<p className="text-xs text-gray-300">
								Your video is now being processed for:
							</p>
							<ul className="text-xs text-gray-300 list-disc pl-5 mt-1 space-y-1">
								<li>Transcoding to web-optimized formats</li>
								<li>Generating automatic transcriptions</li>
								<li>Creating meeting insights & analytics</li>
							</ul>
						</div>
						<p className="text-sm text-gray-300">
							This may take a few minutes. You can continue using NoteMeet while
							we process your video.
						</p>
					</div>
				) : (
					<div className="p-4">
						<div className="mb-4 flex items-center">
							<div className="bg-[#0d5559] p-2 rounded-full mr-3">
								<Video className="h-5 w-5 text-[#63d392]" />
							</div>
							<div className="flex-1">
								<div className="flex justify-between">
									<span className="text-sm text-white font-medium truncate max-w-[14rem]">
										{file.name}
									</span>
									<span className="text-sm text-gray-300">
										{(file.size / (1024 * 1024)).toFixed(2)} MB
									</span>
								</div>
								<p className="text-xs text-gray-400 mt-1">
									{file.type === 'video/mp4'
										? 'MP4 Video'
										: file.type === 'video/webm'
											? 'WebM Video'
											: 'QuickTime Video'}
								</p>
							</div>
						</div>
					</div>
				)}

				{error && (
					<div className="mt-3 bg-red-500/10 border border-red-500/20 rounded-md p-3 flex items-center text-red-400 text-sm">
						<AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
						<p>{error}</p>
					</div>
				)}
			</CardContent>

			<CardFooter
				className={`${!file || progress === 100 ? 'justify-center' : 'justify-end'} gap-3`}
			>
				{!file ? (
					<Button
						onClick={() => fileInputRef.current?.click()}
						className="bg-[#63d392] hover:bg-[#63d392]/90 text-[#0a4a4e]"
					>
						<Upload className="h-4 w-4 mr-2" />
						Select Video
					</Button>
				) : uploading ? (
					<Button
						variant="destructive"
						onClick={() => {
							setUploading(false);
							resetUpload();
						}}
						size="sm"
					>
						<X className="h-4 w-4 mr-1" /> Cancel Upload
					</Button>
				) : progress === 100 ? (
					<Button
						onClick={resetUpload}
						variant="outline"
						className="border-[#63d392]/30 text-white hover:bg-[#156469]/50"
					>
						<Upload className="h-4 w-4 mr-2" />
						Upload Different Video
					</Button>
				) : (
					<>
						<Button
							variant="outline"
							onClick={resetUpload}
							className="border-[#63d392]/30 text-gray-700 hover:bg-[#156469]/50"
						>
							<X className="h-4 w-4 mr-1" /> Cancel
						</Button>
						<Button
							onClick={uploadVideo}
							className="bg-[#63d392] hover:bg-[#63d392]/90 text-[#0a4a4e]"
						>
							<Upload className="h-4 w-4 mr-2" />
							Start Upload
						</Button>
					</>
				)}
			</CardFooter>
		</Card>
	);
}
