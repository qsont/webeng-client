import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
  ];

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/shop" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="flex flex-col w-full bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto w-full">
        {/* Brand */}
        <div>
          <h3 className="text-xl font-bold text-brand-accent-500 mb-3">Graham</h3>
          <p className="text-sm text-gray-400 leading-relaxed">Premium ice cream bars crafted with quality ingredients and passion.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-white mb-3">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm">
            {navItems.map((item) => (
              <Link key={item.name} to={item.href} className="text-gray-400 hover:text-brand-accent-500 transition-colors">
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-semibold text-white mb-3">Contact</h4>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2 items-start text-gray-400">
              <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>hello@graham.com</span>
            </div>
            <div className="flex gap-2 items-start text-gray-400">
              <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex gap-2 items-start text-gray-400">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>123 Graham Street</span>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="font-semibold text-white mb-3">Follow Us</h4>
          <div className="flex gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-400 hover:text-brand-accent-500 transition-colors"
                  aria-label={link.label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-400">
        <p>&copy; {currentYear} Graham. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;