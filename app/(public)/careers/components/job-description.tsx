'use client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const JobDescription = ({ description }: { description: string }) => {
	const [isExpanded, setIsExpanded] = useState(false);
	return (
		<Button
			variant="link"
			className="text-sm"
			onClick={() => setIsExpanded(!isExpanded)}
		>
			<span className="text-sm">
				{description.length > 100
					? isExpanded
						? 'Hide job description'
						: 'Read job description'
					: ''}
			</span>
		</Button>
	);
};

export default JobDescription;
