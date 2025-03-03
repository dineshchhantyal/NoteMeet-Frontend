'use client';
import * as React from 'react';
import Link from 'next/link';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { ChevronDown } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const FORM_ROUTES = [
	{
		route: '/admin/forms/early-access-submissions',
		label: 'Early Access Submissions',
		description: 'View and manage early access submissions',
		icon: 'FileText',
	},
	{
		route: '/admin/forms/job-applications',
		label: 'Job Applications',
		description: 'View and manage job applications',
		icon: 'Briefcase',
	},
];

const SUBSCRIPTION_ROUTES = [
	{
		route: '/admin/plans',
		label: 'Plans',
		description: 'View and manage plans',
		icon: 'Package',
	},
];

const BILLING_ROUTES = [
	{
		route: '/admin/billings/invoices',
		label: 'Invoices',
		description: 'View and manage invoices',
		icon: 'Receipt',
	},
	{
		route: '/admin/billings/payments',
		label: 'Payments',
		description: 'View and manage payments',
		icon: 'CreditCard',
	},
];

const USER_ROUTES = [
	{
		route: '/admin/users/list',
		label: 'User List',
		description: 'View and manage users',
		icon: 'Users',
	},
];

const ALL_ROUTES = [
	{
		route: '/admin/all/overview',
		label: 'Overview',
		description: 'View and manage all',
		icon: 'Layout',
	},
];

const NEWSLETTER_ROUTES = [
	{
		route: '/admin/newsletter',
		label: 'Subscribers',
		description: 'View and manage newsletter subscribers',
		icon: 'Mail',
	},
];

const LINKS = [
	{
		label: 'Forms',
		routes: FORM_ROUTES,
		icon: 'ClipboardList',
	},
	{
		label: 'Users',
		routes: USER_ROUTES,
		icon: 'Users',
	},
	{
		label: 'Billing',
		routes: BILLING_ROUTES,
		icon: 'CreditCard',
	},
	{
		label: 'Subscriptions',
		routes: SUBSCRIPTION_ROUTES,
		icon: 'Package',
	},
	{
		label: 'Newsletter',
		routes: NEWSLETTER_ROUTES,
		icon: 'Mail',
	},
	{
		label: 'All',
		routes: ALL_ROUTES,
		icon: 'Grid',
	},
];

const NavigationMenu = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
	<NavigationMenuPrimitive.Root
		ref={ref}
		className={cn(
			'relative z-10 flex max-w-max flex-1 items-center justify-center',
			className,
		)}
		{...props}
	>
		{children}
		<NavigationMenuViewport />
	</NavigationMenuPrimitive.Root>
));
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName;

const NavigationMenuList = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.List>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.List
		ref={ref}
		className={cn(
			'group flex flex-1 list-none items-center justify-center space-x-1',
			className,
		)}
		{...props}
	/>
));
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName;

const NavigationMenuItem = NavigationMenuPrimitive.Item;

const navigationMenuTriggerStyle = cva(
	'group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
);

const NavigationMenuTrigger = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
	<NavigationMenuPrimitive.Trigger
		ref={ref}
		className={cn(navigationMenuTriggerStyle(), 'group', className)}
		{...props}
	>
		{children}{' '}
		<ChevronDown
			className="relative top-[1px] ml-1 h-3 w-3 transition duration-300 group-data-[state=open]:rotate-180"
			aria-hidden="true"
		/>
	</NavigationMenuPrimitive.Trigger>
));
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName;

const NavigationMenuContent = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.Content
		ref={ref}
		className={cn(
			'w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto',
			className,
		)}
		{...props}
	/>
));
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName;

const NavigationMenuLink = NavigationMenuPrimitive.Link;

const NavigationMenuViewport = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
	<div className={cn('absolute left-0 top-full flex justify-center')}>
		<NavigationMenuPrimitive.Viewport
			className={cn(
				'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-[#0d5559] text-white shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
				className,
			)}
			ref={ref}
			{...props}
		/>
	</div>
));
NavigationMenuViewport.displayName =
	NavigationMenuPrimitive.Viewport.displayName;

const NavigationMenuIndicator = React.forwardRef<
	React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
	React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
	<NavigationMenuPrimitive.Indicator
		ref={ref}
		className={cn(
			'top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in',
			className,
		)}
		{...props}
	>
		<div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-[#63d392] shadow-md" />
	</NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName =
	NavigationMenuPrimitive.Indicator.displayName;

const AdminSubHeader = () => {
	const pathname = usePathname();

	// Helper function to determine if a route is active
	const isRouteActive = (route: string) => {
		return pathname.startsWith(route);
	};

	// Helper function to determine if any route in a category is active
	const isCategoryActive = (routes: Array<{ route: string }>) => {
		return routes.some((item) => isRouteActive(item.route));
	};

	return (
		<header className="bg-[#0a4a4e] shadow-lg border-b border-[#63d392]/20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					<h1 className="text-2xl font-semibold text-white">Admin Dashboard</h1>
					<NavigationMenu>
						<NavigationMenuList>
							{LINKS.map((link) => {
								const isActive = isCategoryActive(link.routes);
								return (
									<NavigationMenuItem key={link.label}>
										<div className="flex items-center">
											<NavigationMenuTrigger
												className={cn(
													'text-gray-200 hover:bg-[#156469]/50 hover:text-white',
													isActive &&
														'bg-[#156469]/70 text-[#63d392] font-semibold',
												)}
											>
												{link.label}
											</NavigationMenuTrigger>
											<NavigationMenuContent>
												<ul className="grid w-[400px] gap-2 p-4 md:grid-cols-1">
													{link.routes.map((route) => {
														const isRouteHighlighted = isRouteActive(
															route.route,
														);
														return (
															<li key={route.route}>
																<NavigationMenuLink asChild>
																	<Link
																		href={route.route}
																		className={cn(
																			'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors',
																			isRouteHighlighted
																				? 'bg-[#156469] text-[#63d392]'
																				: 'hover:bg-[#156469]/50 text-gray-100',
																		)}
																	>
																		<div className="flex items-center justify-between">
																			<div>
																				<div className="text-sm font-medium leading-none mb-1">
																					{route.label}
																				</div>
																				<p className="line-clamp-2 text-xs leading-snug text-gray-300">
																					{route.description}
																				</p>
																			</div>
																			{isRouteHighlighted && (
																				<div className="w-2 h-2 rounded-full bg-[#63d392]" />
																			)}
																		</div>
																	</Link>
																</NavigationMenuLink>
															</li>
														);
													})}
												</ul>
											</NavigationMenuContent>
											{isActive && <NavigationMenuIndicator />}
										</div>
									</NavigationMenuItem>
								);
							})}
						</NavigationMenuList>
					</NavigationMenu>
				</div>
			</div>
		</header>
	);
};

export default AdminSubHeader;
