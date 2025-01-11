import Link from 'next/link';

export function MeetingFooter() {
	return (
		<footer className="bg-gray-100 border-t">
			<div className="container mx-auto px-4 py-4">
				<div className="flex justify-between items-center">
					<p className="text-sm text-gray-600">
						&copy; 2024 NoteMeet. All rights reserved.
					</p>
					<nav>
						<ul className="flex space-x-4 text-sm">
							<li>
								<Link href="/help" className="text-gray-600 hover:text-white">
									Help
								</Link>
							</li>
							<li>
								<Link
									href="/privacy"
									className="text-gray-600 hover:text-white"
								>
									Privacy
								</Link>
							</li>
							<li>
								<Link href="/terms" className="text-gray-600 hover:text-white">
									Terms
								</Link>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</footer>
	);
}
