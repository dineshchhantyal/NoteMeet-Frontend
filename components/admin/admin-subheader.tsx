import * as React from 'react';
import Link from 'next/link';
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu';
import { ChevronDown } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const FORM_ROUTES = [
	{
		route: '/admin/forms/early-access-submissions',
		label: 'Early Access Submissions',
		description: 'View and manage early access submissions',
	},
	{
		route: '/admin/forms/job-applications',
		label: 'Job Applications',
		description: 'View and manage job applications',
	},
];

const SUBSCRIPTION_ROUTES = [
	{
		route: '/admin/plans',
		label: 'Plans',
		description: 'View and manage plans',
	},
];

const BILLING_ROUTES = [
	{
		route: '/admin/billings/invoices',
		label: 'Invoices',
		description: 'View and manage invoices',
	},
	{
		route: '/admin/billings/payments',
		label: 'Payments',
		description: 'View and manage payments',
	},
];

const USER_ROUTES = [
	{
		route: '/admin/users/list',
		label: 'User List',
		description: 'View and manage users',
	},
];

const ALL_ROUTES = [
	{
		route: '/admin/all/overview',
		label: 'Overview',
		description: 'View and manage all',
	},
];

const LINKS = [
	{
		label: 'Forms',
		routes: FORM_ROUTES,
	},
	{
		label: 'Users',
		routes: USER_ROUTES,
	},
	{
		label: 'Billing',
		routes: BILLING_ROUTES,
	},
	{
		label: 'Subscriptions',
		routes: SUBSCRIPTION_ROUTES,
	},
	{
		label: 'All',
		routes: ALL_ROUTES,
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
	'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
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
			'left-0 top-0 w-full data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 md:absolute md:w-auto ',
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
				'origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 md:w-[var(--radix-navigation-menu-viewport-width)]',
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
		<div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
	</NavigationMenuPrimitive.Indicator>
));
NavigationMenuIndicator.displayName =
	NavigationMenuPrimitive.Indicator.displayName;

const AdminSubHeader = () => {
	return (
		<header className="bg-white shadow-sm">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16 items-center">
					<h1 className="text-2xl font-semibold text-gray-900">Admin</h1>
					<NavigationMenu>
						<NavigationMenuList>
							{LINKS.map((link) => (
								<NavigationMenuItem key={link.label}>
									<NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
									<NavigationMenuContent>
										<ul className="flex flex-row p-2">
											{link.routes.map((route) => (
												<li
													key={route.route}
													className="flex flex-col p-2 hover:bg-gray-100 rounded-md group"
												>
													<NavigationMenuLink asChild>
														<Link href={route.route}>
															<p className="text-sm font-medium">
																{route.label}
															</p>
															<p className="text-xs text-muted-foreground">
																{route.description}
															</p>
														</Link>
													</NavigationMenuLink>
												</li>
											))}
										</ul>
									</NavigationMenuContent>
								</NavigationMenuItem>
							))}
						</NavigationMenuList>
					</NavigationMenu>
				</div>
			</div>
		</header>
	);
};

export default AdminSubHeader;
