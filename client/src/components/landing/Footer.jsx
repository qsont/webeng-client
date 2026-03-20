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
    <footer className="flex w-full flex-col bg-brand-violet-950 text-brand-violet-50">
      {/* Main Footer Content */}
      <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto w-full">
        {/* Brand */}
        <div>
          <h3 className="mb-3 text-xl font-bold text-brand-accent-300">Graham</h3>
          <p className="text-sm leading-relaxed text-brand-violet-200">Premium ice cream bars crafted with quality ingredients and passion.</p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-3 font-semibold text-brand-violet-50">Quick Links</h4>
          <div className="flex flex-col gap-2 text-sm">
            {navItems.map((item) => (
              <Link key={item.name} to={item.href} className="text-brand-violet-200 transition-colors hover:text-brand-accent-300">
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="mb-3 font-semibold text-brand-violet-50">Contact</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2 text-brand-violet-200">
              <Mail className="w-4 h-4 mt-0.5 shrink-0" />
              <span>hello@graham.com</span>
            </div>
            <div className="flex items-start gap-2 text-brand-violet-200">
              <Phone className="w-4 h-4 mt-0.5 shrink-0" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-start gap-2 text-brand-violet-200">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
              <span>123 Graham Street</span>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="mb-3 font-semibold text-brand-violet-50">Follow Us</h4>
          <div className="flex gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-brand-violet-200 transition-colors hover:text-brand-accent-300"
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
      <div className="border-t border-brand-violet-800 px-4 py-4 text-center text-sm text-brand-violet-200 sm:px-6 lg:px-8">
        <p>&copy; {currentYear} Graham. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;