import { FaChrome, FaGlobe } from 'react-icons/fa';

const supportedBrowsers = [
	{
		name: 'Google Chrome',
		icon: FaChrome,
		version: '88+',
	},
	{
		name: 'Microsoft Edge',
		icon: FaGlobe,
		version: '88+',
	},
	{
		name: 'Brave',
		icon: FaGlobe,
		version: '1.0+',
	},
];

export default function BrowserSupport() {
	return (
		<div className="container mx-auto px-4 py-12 border-0 md:border-t bg-white md:rounded-t-lg">
			<h3 className="text-xl font-semibold text-center mb-8">
				Supported Browsers
			</h3>
			<div className="flex justify-center gap-8 flex-wrap">
				{supportedBrowsers.map((browser) => (
					<div key={browser.name} className="flex items-center gap-2">
						<browser.icon className="h-6 w-6 " />
						<div>
							<p className="font-medium">{browser.name}</p>
							<p className="text-sm">Version {browser.version}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
