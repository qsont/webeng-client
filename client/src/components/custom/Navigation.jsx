import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
} from "../ui/navigation-menu";
import { Menu, X, ChevronDown, User, LogOut, Sun, Moon, ShoppingCart } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { Link, NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import useThemeStore from "@/store/themeStore";
import useCartStore from "@/store/cartStore";

function Navigation() {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
	const profileDropdownRef = useRef(null);

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
	const theme = useThemeStore((state) => state.theme);
	const toggleTheme = useThemeStore((state) => state.toggleTheme);
	const cartItems = useCartStore((state) => state.cartItems);
	const fetchCart = useCartStore((state) => state.fetchCart);
	const isDark = theme === "dark";
	const cartCount = cartItems.reduce((sum, item) => sum + Number(item?.quantity ?? 0), 0);
	const didFetchCartRef = useRef(false);

	useEffect(() => {
		if (isAuthenticated && !didFetchCartRef.current) {
			didFetchCartRef.current = true;
			fetchCart();
		}

		if (!isAuthenticated) {
			didFetchCartRef.current = false;
		}
	}, [isAuthenticated, fetchCart]);

	useEffect(() => {
		if (!isProfileDropdownOpen) {
			return undefined;
		}

		const handleClickOutside = (event) => {
			if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
				setIsProfileDropdownOpen(false);
			}
		};

		const handleEscape = (event) => {
			if (event.key === "Escape") {
				setIsProfileDropdownOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("keydown", handleEscape);

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("keydown", handleEscape);
		};
	}, [isProfileDropdownOpen]);

	const handleLogout = async () => {
		await logout();
		setIsProfileDropdownOpen(false);
		navigate("/")
	};

	return (
		<nav className="fixed top-0 z-50 h-fit w-full border-b border-border bg-background/80 shadow-md backdrop-blur-3xl">
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
													isActive
														? "border-b-4 border-b-brand-accent-500 bg-brand-accent-600 text-white"
														: "text-foreground hover:bg-brand-accent-100 hover:text-brand-accent-800 dark:hover:bg-brand-accent-900/40 dark:hover:text-brand-accent-100"
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
				<div className="hidden md:flex md:items-center md:gap-2 relative">
					{isAuthenticated ? (
						<div className="flex items-center gap-2">
							<Button
								asChild
								variant="ghost"
								size="icon"
								className="relative rounded-md"
							>
								<Link to="/cart" aria-label="Open cart">
									<ShoppingCart className="h-5 w-5 text-brand-accent-700 dark:text-brand-accent-200" />
									{cartCount > 0 ? (
										<span className="absolute -right-1 -top-1 min-w-5 rounded-md bg-brand-accent-600 px-1 text-center text-[10px] font-bold leading-5 text-white">
											{cartCount}
										</span>
									) : null}
								</Link>
							</Button>

							<div ref={profileDropdownRef} className="relative">
								<button
									onClick={toggleProfileDropdown}
									className="flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2 transition-colors hover:bg-muted"
								>
									<Avatar className="h-8 w-8">
										<AvatarImage />
										<AvatarFallback className="bg-brand-accent-600 text-white">
											{user?.name?.[0]?.toUpperCase() || "U"}
										</AvatarFallback>
									</Avatar>
									<div className="text-left">
										<p className="text-sm font-medium text-foreground">{user?.name}</p>
										<p className="text-xs text-muted-foreground">User</p>
									</div>
									<ChevronDown className={`h-4 w-4 transition-transform ${isProfileDropdownOpen ? "rotate-180" : ""}`} />
								</button>

								{/* Dropdown Menu */}
								{isProfileDropdownOpen && (
									<div className="absolute right-0 z-50 mt-2 w-56 rounded-md border border-border bg-popover py-2 shadow-xl">
									<Link
										to="/orders"
										onClick={() => setIsProfileDropdownOpen(false)}
										className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-popover-foreground transition-colors hover:bg-muted"
									>
										<User className="h-4 w-4" />
										My Orders
									</Link>

									<div className="flex items-center justify-between px-4 py-2 text-sm text-popover-foreground">
										<div className="flex items-center gap-2">
											{isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
											<span>{isDark ? "Dark mode" : "Light mode"}</span>
										</div>
										<button
											type="button"
											role="switch"
											aria-label="Toggle dark mode"
											aria-checked={isDark}
											onClick={toggleTheme}
											className={`relative h-6 w-11 rounded-full border transition-colors ${
												isDark
													? "border-brand-violet-400 bg-brand-violet-600"
													: "border-brand-violet-500 bg-brand-violet-200"
											}`}
										>
											<span
												className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full shadow-sm transition-transform ${
													isDark ? "bg-white" : "bg-brand-violet-700"
												} ${
													isDark ? "translate-x-5" : "translate-x-0"
												}`}
											/>
										</button>
									</div>

									<div className="my-1 border-t border-border"></div>

									<button
										onClick={handleLogout}
										className="flex w-full items-center gap-3 rounded-b-md px-4 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
									>
										<LogOut className="h-4 w-4" />
										Logout
									</button>
									</div>
								)}
							</div>
						</div>
					) : (
						<Button asChild className="bg-brand-accent-600 hover:bg-brand-accent-700 rounded-md text-white px-6">
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
				<div className="border-t border-border md:hidden">
					<div className="px-2 pt-2 pb-3 space-y-1">
						{navItems.map((item) => (
							<NavLink
								key={item.name}
								to={item.to}
								className={({ isActive }) =>
									`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
										isActive
											? "bg-brand-accent-600 text-white"
											: "text-foreground hover:bg-brand-accent-100 hover:text-brand-accent-800 dark:hover:bg-brand-accent-900/40 dark:hover:text-brand-accent-100"
									}`
								}
								onClick={() => setIsMobileMenuOpen(false)}>
								{item.name}
							</NavLink>
						))}

						{isAuthenticated ? (
							<>
								<NavLink
									to="/cart"
									className={({ isActive }) =>
										`flex items-center justify-between rounded-md px-3 py-2 text-base font-medium transition-colors ${
											isActive
												? "bg-brand-accent-600 text-white"
												: "text-foreground hover:bg-brand-accent-100 hover:text-brand-accent-800 dark:hover:bg-brand-accent-900/40 dark:hover:text-brand-accent-100"
										}`
									}
									onClick={() => setIsMobileMenuOpen(false)}
								>
									<span className="flex items-center gap-2">
										<ShoppingCart className="h-4 w-4" />
										Cart
									</span>
									{cartCount > 0 ? (
										<span className="rounded-md bg-brand-accent-600 px-2 py-0.5 text-xs font-bold text-white">
											{cartCount}
										</span>
									) : null}
								</NavLink>

								<div className="mt-3 border-t border-border px-3 py-3">
									<p className="text-sm font-semibold text-foreground">{user?.name}</p>
									<p className="mt-1 text-xs text-muted-foreground">User Account</p>
								</div>
								<Link
									to="/orders"
									onClick={() => setIsMobileMenuOpen(false)}
									className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-muted"
								>
									<User className="h-4 w-4" />
									My Orders
								</Link>
								<div className="flex items-center justify-between px-3 py-2 text-sm text-foreground">
									<div className="flex items-center gap-2">
										{isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
										<span>{isDark ? "Dark mode" : "Light mode"}</span>
									</div>
									<button
										type="button"
										role="switch"
										aria-label="Toggle dark mode"
										aria-checked={isDark}
										onClick={toggleTheme}
										className={`relative h-6 w-11 rounded-full border transition-colors ${
											isDark
												? "border-brand-violet-400 bg-brand-violet-600"
												: "border-brand-violet-500 bg-brand-violet-200"
										}`}
									>
										<span
											className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full shadow-sm transition-transform ${
												isDark ? "bg-white" : "bg-brand-violet-700"
											} ${
												isDark ? "translate-x-5" : "translate-x-0"
											}`}
										/>
									</button>
								</div>
								<button
									onClick={handleLogout}
									className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
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