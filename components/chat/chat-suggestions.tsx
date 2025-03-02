import { Button } from '@/components/ui/button';
import { FileText, CheckCircle, User, BarChart2, Calendar } from 'lucide-react';
import { ChatSuggestion } from './types';

interface ChatSuggestionsProps {
	onSelect: (text: string) => void;
}

export function ChatSuggestions({ onSelect }: ChatSuggestionsProps) {
	const suggestions: ChatSuggestion[] = [
		{
			text: 'Summarize this meeting',
			icon: <FileText className="h-3.5 w-3.5 mr-2" />,
		},
		{
			text: 'What action items were assigned?',
			icon: <CheckCircle className="h-3.5 w-3.5 mr-2" />,
		},
		{
			text: 'Who participated the most?',
			icon: <User className="h-3.5 w-3.5 mr-2" />,
		},
		{
			text: 'What were the key decisions?',
			icon: <BarChart2 className="h-3.5 w-3.5 mr-2" />,
		},
		{
			text: 'When is the next follow-up?',
			icon: <Calendar className="h-3.5 w-3.5 mr-2" />,
		},
	];

	return (
		<>
			{suggestions.map((suggestion, index) => (
				<Button
					key={index}
					variant="outline"
					size="sm"
					onClick={() => onSelect(suggestion.text)}
					className="flex items-center justify-start text-left h-auto py-2 bg-[#0d5559]/60 border-[#63d392]/30 hover:bg-[#156469]/60 text-gray-100"
				>
					{suggestion.icon}
					<span className="truncate">{suggestion.text}</span>
				</Button>
			))}
		</>
	);
}
