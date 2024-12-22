import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Facebook, Twitter, Linkedin } from 'lucide-react';
import Logo from './ui/Logo';

export function Footer() {
	return (
		<footer className="bg-primary text-white py-12">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
					<div>
						<Logo className="h-24 w-24" />
						<h3 className="font-bold text-lg mb-4">Product</h3>
						<ul className="space-y-2">
							{/* <li><Link href="/features" className="hover:underline">Features</Link></li> */}
							<li>
								<Link href="/pricing" className="hover:underline">
									Pricing
								</Link>
							</li>
							{/* <li><Link href="/integrations" className="hover:underline">Integrations</Link></li> */}
						</ul>
					</div>
					<div>
						<h3 className="font-bold text-lg mb-4">Company</h3>
						<ul className="space-y-2">
							<li>
								<Link href="/about" className="hover:underline">
									About Us
								</Link>
							</li>
							<li>
								<Link href="/careers" className="hover:underline">
									Careers
								</Link>
							</li>
							<li>
								<Link href="/contact" className="hover:underline">
									Contact
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="font-bold text-lg mb-4">Resources</h3>
						<ul className="space-y-2">
							<li>
								<Link href="/early-access" className="hover:underline">
									Early Access
								</Link>
							</li>
							<li>
								<Link href="/blog" className="hover:underline">
									Blog
								</Link>
							</li>
							<li>
								<Link href="/help" className="hover:underline">
									Help Center
								</Link>
							</li>
							<li>
								<Link href="/api-docs" className="hover:underline">
									API Documentation
								</Link>
							</li>
						</ul>
					</div>
					<div>
						<h3 className="font-bold text-lg mb-4">Stay Connected</h3>
						<form className="mb-4">
							<Input
								type="email"
								placeholder="Enter your email"
								className="mb-2 bg-white/10 border-white/20 text-white placeholder-gray-500"
							/>
							<Button
								variant="secondary"
								type="submit"
								className="w-full bg-foreground hover:bg-white/20 text-white border-white/20 p-4"
							>
								Subscribe to Newsletter
							</Button>
						</form>
						<div className="flex space-x-4">
							<Link
								href="#"
								aria-label="Facebook"
								className="hover:text-secondary transition-colors"
							>
								<Facebook className="h-6 w-6" />
							</Link>
							<Link
								href="#"
								aria-label="Twitter"
								className="hover:text-secondary transition-colors"
							>
								<Twitter className="h-6 w-6" />
							</Link>
							<Link
								href="#"
								aria-label="LinkedIn"
								className="hover:text-secondary transition-colors"
							>
								<Linkedin className="h-6 w-6" />
							</Link>
						</div>
					</div>
				</div>
				<div className="border-t border-white/20 pt-8 text-center">
					<p className="mb-4">&copy; 2024 NoteMeet. All rights reserved.</p>
					<div className="flex justify-center space-x-4 mb-4">
						<Link href="/privacy" className="hover:underline">
							Privacy Policy
						</Link>
						<Link href="/terms" className="hover:underline">
							Terms of Service
						</Link>
					</div>
					{/* <div className="flex justify-center space-x-4">
            <img src="/gdpr-compliant.svg" alt="GDPR Compliant" className="h-8" />
            <img src="/iso-certified.svg" alt="ISO Certified" className="h-8" />
          </div> */}
				</div>
			</div>
		</footer>
	);
}
