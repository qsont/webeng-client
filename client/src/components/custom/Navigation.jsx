import { useState } from "react";
import { Button } from "../ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "../ui/navigation-menu";
import { Menu, X } from "lucide-react";

function Navigation() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const navItems = [
		{ name: "Home", href: "#home" },
		{ name: "Products", href: "#products" },
		{ name: "About", href: "#about" },
		{ name: "Contact Us", href: "#contact" },
	];

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<nav className="bg-gray-200/5 backdrop-blur-3xl shadow-md fixed w-full top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Brand */}
					<div className="flex-shrink-0">
						<a href="#" className="text-2xl font-bold text-brand-accent-600 hover:text-brand-accent-700">
							Graham
						</a>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-1">
						<NavigationMenu>
							<NavigationMenuList>
								{navItems.map((item) => (
									<NavigationMenuItem key={item.name}>
										<a
											href={item.href}
											className="inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-white hover:bg-brand-accent-600 focus:outline-none focus:ring-2 focus:ring-brand-accent-500 focus:ring-offset-2"
										>
											{item.name}
										</a>
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>
					</div>

					<div className="hidden md:block">
						<Button asChild className="bg-brand-accent-600 hover:bg-brand-accent-700 rounded-full text-white px-6">
							<a href="/login">Login</a>
						</Button>
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<Button
							variant="ghost"
							size="icon"
							onClick={toggleMobileMenu}
							aria-label="Toggle menu"
							aria-expanded={isMobileMenuOpen}
						>
							{isMobileMenuOpen ? (
								<X className="h-6 w-6 text-brand-accent-600" />
							) : (
								<Menu className="h-6 w-6 text-brand-accent-600" />
							)}
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden border-t border-gray-200">
					<div className="px-2 pt-2 pb-3 space-y-1">
						{navItems.map((item) => (
							<a
								key={item.name}
								href={item.href}
								className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-white hover:bg-brand-accent-600 transition-colors"
								onClick={() => setIsMobileMenuOpen(false)}
							>
								{item.name}
							</a>
						))}
					</div>
				</div>
			)}
		</nav>
	);
}

export default Navigation;