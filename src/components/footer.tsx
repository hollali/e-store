import Link from "next/link";
import { MapPin, Mail, Phone, Heart } from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Men", href: "/Men" },
    { name: "Women", href: "/Women" },
    { name: "Accessories", href: "/Accessories" },
    { name: "All Products", href: "/all" },
  ];

  const accountLinks = [
    { name: "Wishlist", href: "/wishlist" },
    { name: "Orders", href: "/orders" },
    { name: "Sign In", href: "/sign-in" },
  ];

  return (
    <footer className="mt-16 bg-white dark:bg-gray-950 border-t dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand + Contact */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <h3 className="text-xl sm:text-2xl font-bold">
                Afric<span className="text-primary">Vogue</span>
              </h3>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
              Discover the latest trends and timeless styles in African fashion.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href="https://maps.app.goo.gl/segckXu4xHSfdwis9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Ashaley Botwe Accra, Ghana
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href="mailto:dheztinykartel@gmail.com"
                  className="hover:text-primary transition-colors"
                >
                  dheztinykartel@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <a href="tel:+2330505306932" className="hover:text-primary transition-colors">
                  0505306932
                </a>
              </div>
            </div>
            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href="https://wa.me/2330505306932"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/africvouge"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
                aria-label="Instagram"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account + Info */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Account
            </h4>
            <ul className="space-y-3 mb-8">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Our Story
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              For over two decades, AfricVogue has celebrated the rich heritage
              of African fashion. Our collections blend contemporary trends with
              timeless elegance, bringing you the finest in African design.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright + Attribution */}
      <div className="border-t dark:border-gray-800 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-500 dark:text-gray-400">
          <p>
            &copy; {year} AfricVogue. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span>Developed with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />
            <span>by</span>
            <a
              href="https://hollali.netlify.app/"
              className="font-semibold hover:text-primary transition-colors"
              rel="noopener noreferrer"
            >
              Hollali
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
