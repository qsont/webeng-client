import { useState } from "react";
import { Button } from "../ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "../ui/navigation-menu";
import { Menu, X, ChevronDown, User, Settings, LogOut } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { Link, NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";

function Navigation() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

	const navigate = useNavigate();

	const navItems = [
			{ name: "Home", to: "/" },
			{ name: "Products", to: "/shop" },
			{ name: "About", to: "/about" },
			{ name: "Contact Us", to: "/contact" },
		];

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	const toggleProfileDropdown = () => {
		setIsProfileDropdownOpen(!isProfileDropdownOpen);
	};

	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const user = useAuthStore((state) => state.user);
	const logout = useAuthStore((state) => state.logout);

	const handleLogout = async () => {
		await logout();
		setIsProfileDropdownOpen(false);
		navigate("/")
	};

	return (
		<nav className="bg-gray-200/5 backdrop-blur-3xl shadow-md fixed h-fit w-full top-0 z-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Brand */}
					<div className="shrink-0">
						<Link to="/" className="text-2xl font-bold text-brand-accent-600 hover:text-brand-accent-700">
							Graham
						</Link>
					</div>

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-1">
						<NavigationMenu>
							<NavigationMenuList>
								{navItems.map((item) => (
									<NavigationMenuItem key={item.name}>
										<NavLink
											to={item.to}
											className={({ isActive }) =>
												`inline-flex h-16 w-max items-center justify-center px-4 py-2 text-sm font-medium transition-colors focus:outline-none ${
													isActive ? "bg-brand-accent-600/50 border-b-4 border-b-brand-accent-600 text-white" : "hover:text-white hover:bg-brand-accent-600/70"
												}`
											}>
											{item.name}
										</NavLink>
									</NavigationMenuItem>
								))}
							</NavigationMenuList>
						</NavigationMenu>
					</div>

{/* User Profile Dropdown - Desktop */}
				<div className="hidden md:block relative">
					{isAuthenticated ? (
						<div>
							<button
								onClick={toggleProfileDropdown}
								className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-800/20 hover:bg-gray-800/30 transition-colors"
							>
								<Avatar className="h-8 w-8">
									<AvatarImage />
									<AvatarFallback className="bg-brand-accent-600 text-white">
										{user?.name?.[0]?.toUpperCase() || "U"}
									</AvatarFallback>
								</Avatar>
								<div className="text-left">
									<p className="text-sm font-medium text-white">{user?.name}</p>
									<p className="text-xs text-gray-400">User</p>
								</div>
								<ChevronDown className={`h-4 w-4 transition-transform ${isProfileDropdownOpen ? "rotate-180" : ""}`} />
							</button>

							{/* Dropdown Menu */}
							{isProfileDropdownOpen && (
								<div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
									<button
										onClick={() => setIsProfileDropdownOpen(false)}
										className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
									>
										<User className="h-4 w-4" />
										My Profile
									</button>

									<button
										onClick={() => setIsProfileDropdownOpen(false)}
										className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3 transition-colors"
									>
										<Settings className="h-4 w-4" />
										Preferences
									</button>

									<div className="border-t border-gray-200 my-1"></div>

									<button
										onClick={handleLogout}
										className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors rounded-b-lg"
									>
										<LogOut className="h-4 w-4" />
										Logout
									</button>
								</div>
							)}
						</div>
					) : (
						<Button asChild className="bg-brand-accent-600 hover:bg-brand-accent-700 rounded-full text-white px-6">
							<Link to="/auth/login">Login</Link>
						</Button>
					)}
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
							<NavLink
								key={item.name}
								to={item.to}
								className={({ isActive }) =>
									`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
										isActive ? "bg-brand-accent-600 text-white" : "text-gray-700 hover:text-white hover:bg-brand-accent-600"
									}`
								}
								onClick={() => setIsMobileMenuOpen(false)}>
								{item.name}
							</NavLink>
						))}

						{isAuthenticated ? (
							<>
								<div className="px-3 py-3 mt-3 border-t border-gray-200">
									<p className="text-sm font-semibold text-gray-900">{user?.name}</p>
									<p className="text-xs text-gray-600 mt-1">User Account</p>
								</div>
								<button
									onClick={() => setIsMobileMenuOpen(false)}
									className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
								>
									<User className="h-4 w-4" />
									My Profile
								</button>
								<button
									onClick={() => setIsMobileMenuOpen(false)}
									className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
								>
									<Settings className="h-4 w-4" />
									Preferences
								</button>
								<button
									onClick={handleLogout}
									className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
								>
									<LogOut className="h-4 w-4" />
									Logout
								</button>
							</>
						) : (
							<Button asChild className="mt-3 w-full bg-brand-accent-600 hover:bg-brand-accent-700 text-white">
								<Link to="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
									Login
								</Link>
							</Button>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}

export default Navigation;