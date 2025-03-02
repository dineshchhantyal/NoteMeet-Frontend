const jobs: Job[] = [
	{
		id: 1, // changed from 'dev-001' to number
		title: 'Full Stack Developer',
		department: 'Engineering',
		location: 'Remote',
		type: 'Part-time (Unpaid)',
		description:
			'We are looking for an experienced Senior Full Stack Developer to join our growing engineering team. This role requires proficiency in both front-end and back-end technologies, including React and TypeScript for the UI, and expertise with PostgreSQL for data management. The ideal candidate will contribute to the development and maintenance of a cloud-native application utilizing serverless architecture powered by AWS Lambda. This is an unpaid role that will help NoteMeet grow as a group of individuals with aligned mindsets.',
		requirements: [
			'3+ years of experience with React and TypeScript',
			'Strong knowledge of PostgreSQL and database optimization',
			'Experience with AWS Lambda and serverless architecture',
			'Familiarity with CI/CD pipelines and DevOps practices',
			'Strong problem-solving and analytical skills',
			'Excellent communication and collaboration abilities',
		],
	},
	{
		id: 2, // changed from 'ai-001' to number
		title: 'AI Developer',
		department: 'Research & Development',
		location: 'Remote',
		type: 'Part-time (Unpaid)',
		description:
			'We are seeking a skilled AI Developer to join our team, focusing on the development and integration of advanced AI-driven features. This position requires working closely with API endpoints, training datasets, and enhancing AI systems that assist with tasks such as automated meeting summaries and data processing. This is an unpaid role that will help NoteMeet grow as a group of individuals with aligned mindsets.',
		requirements: [
			'MS/PhD in Computer Science, AI, or related field',
			'Experience with ML frameworks (TensorFlow, PyTorch)',
			'Strong programming skills in Python',
			'Knowledge of NLP and text summarization techniques',
			'Experience with RESTful APIs',
			'Understanding of cloud-based AI services',
		],
	},
	// ... similar changes for other jobs
];

export default jobs;
