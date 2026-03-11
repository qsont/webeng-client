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

  return (<footer className="flex flex-col justify-center items-center w-full bg-black p-6">

    {/* Icons */}
    <div className="flex gap-6 m-4">
      {footerBtns.map((item) => (
        <a href={item.href}>
          <i className={`${item.icon} text-white ${item.hoverColor} transition-colors text-3xl`}></i>
        </a>
      ))}
    </div>

    {/* Site map */}
    <div className="flex gap-6 text-white text-sm">
      {navItems.map((item) => (
        <a href={item.href}>{item.name}</a>
      ))}
    </div>

  </footer>);
}

export default Footer;