function Footer() {

  const footerBtns = [
    { icon: 'fi fi-brands-facebook', hoverColor: 'hover:text-[#1877F2]', href: '#' },
    { icon: 'fi fi-brands-google', hoverColor: 'hover:text-[#1877F2]', href: '#' },
    { icon: 'fi fi-brands-whatsapp', hoverColor: 'hover:text-[#25D366]', href: '#' },
  ]

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Products", href: "#products" },
    { name: "About", href: "#about" },
    { name: "Contact Us", href: "#contact" },
  ];

  return (<footer className="flex flex-col justify-center items-center w-full bg-black p-4 sm:p-6 gap-4 sm:gap-6">

    {/* Icons */}
    <div className="flex gap-3 sm:gap-4 md:gap-6 m-2 sm:m-4">
      {footerBtns.map((item) => (
        <a href={item.href}>
          <i className={`${item.icon} text-white ${item.hoverColor} transition-colors text-2xl sm:text-3xl`}></i>
        </a>
      ))}
    </div>

    {/* Site map */}
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 md:gap-6 text-white text-xs sm:text-sm text-center">
      {navItems.map((item) => (
        <a href={item.href}>{item.name}</a>
      ))}
    </div>

  </footer>);
}

export default Footer;