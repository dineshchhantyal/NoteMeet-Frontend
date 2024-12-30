const AdminPage = () => {
	return (
		<div className="min-h-screen bg-gray-100">
			<main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<h1 className="text-4xl font-bold text-gray-900 mb-8">
					Admin Dashboard
				</h1>
				<div className="space-y-6">
					{/* Add your admin dashboard content here */}
					<div className="bg-white p-6 rounded-lg shadow-md">
						<h2 className="text-2xl font-semibold text-gray-900">
							Welcome to the Admin Dashboard
						</h2>
						<p className="text-gray-600 mt-2">
							Use the navigation menu above to manage forms, users, billings,
							subscriptions, and more.
						</p>
					</div>
					<div className="bg-white p-6 rounded-lg shadow-md">
						<h2 className="text-2xl font-semibold text-gray-900">
							Recent Activities
						</h2>
						<p className="text-gray-600 mt-2">
							Here you can see the recent activities and updates.
						</p>
						{/* Add recent activities content here */}
					</div>
					<div className="bg-white p-6 rounded-lg shadow-md">
						<h2 className="text-2xl font-semibold text-gray-900">Statistics</h2>
						<p className="text-gray-600 mt-2">
							Overview of the key metrics and statistics.
						</p>
						{/* Add statistics content here */}
					</div>
				</div>
			</main>
		</div>
	);
};

export default AdminPage;
