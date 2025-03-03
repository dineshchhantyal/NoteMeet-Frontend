import { FormEvent, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Loader2, Mic, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
	input: string;
	isLoading: boolean;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (e: FormEvent<HTMLFormElement>) => void;
	inputRef: React.RefObject<HTMLInputElement> | null;
}

export function ChatInput({
	input,
	isLoading,
	onChange,
	onSubmit,
	inputRef,
}: ChatInputProps) {
	const [recording, setRecording] = useState(false);

	// Mock voice input - in a real app you would use WebSpeechAPI
	const toggleVoiceInput = () => {
		if (recording) {
			setRecording(false);
		} else {
			setRecording(true);
			// In a real implementation, you would start recording here
			setTimeout(() => {
				setRecording(false);
			}, 3000);
		}
	};

	return (
		<div className="border-t border-[#63d392]/20 p-4">
			<form onSubmit={onSubmit} className="flex items-center space-x-2">
				<div className="relative flex-1">
					<Input
						ref={inputRef}
						value={input}
						onChange={onChange}
						placeholder={
							recording ? 'Listening...' : 'Ask something about the meeting...'
						}
						className={cn(
							'flex-1 bg-[#0d5559]/60 border-[#63d392]/30 text-white pl-4 pr-10',
							'placeholder:text-gray-400 focus-visible:ring-[#63d392]/30 focus-visible:border-[#63d392]/50',
							recording && 'bg-[#63d392]/20 animate-pulse',
						)}
						disabled={isLoading || recording}
					/>

					<Button
						type="button"
						size="icon"
						variant="ghost"
						onClick={toggleVoiceInput}
						disabled={isLoading}
						className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 text-gray-400 hover:text-[#63d392] hover:bg-transparent p-0"
					>
						{recording ? (
							<Square className="h-4 w-4 text-red-400" />
						) : (
							<Mic className="h-4 w-4" />
						)}
					</Button>
				</div>

				<Button
					type="submit"
					size="icon"
					disabled={isLoading || !input.trim() || recording}
					className={cn(
						'bg-[#63d392] text-[#0a4a4e] hover:bg-[#63d392]/80',
						'transition-all duration-200',
						isLoading && 'opacity-70',
					)}
				>
					{isLoading ? (
						<Loader2 className="h-5 w-5 animate-spin" />
					) : (
						<Send className="h-5 w-5" />
					)}
				</Button>
			</form>
		</div>
	);
}
