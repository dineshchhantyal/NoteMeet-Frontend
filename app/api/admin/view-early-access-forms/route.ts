import { db } from '@/lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method === 'GET') {
		try {
			const forms = await db.earlyAccessForm.findMany({
				orderBy: { createdAt: 'desc' },
			});
			res.status(200).json({ success: true, data: forms });
		} catch (error) {
			console.error(error);
			res.status(500).json({ success: false, error: 'Internal Server Error' });
		}
	} else if (req.method === 'PATCH') {
		const { id, status, isVerified } = req.body;

		try {
			const updatedEntry = await db.earlyAccessForm.update({
				where: { id },
				data: {
					status,
					isVerified,
				},
			});
			res.status(200).json({ success: true, data: updatedEntry });
		} catch (error) {
			console.error(error);
			res.status(500).json({ success: false, error: 'Internal Server Error' });
		}
	} else {
		res.setHeader('Allow', ['GET']);
		res.status(405).end(`Method ${req.method} Not Allowed`);
	}
}
