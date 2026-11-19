import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import PaymentCarousel from "@/components/PaymentCarousel";

type FooterLink = { name: string; href: string };

const quickLinks: FooterLink[] = [
  { name: "Home", href: "/" },
  { name: "Men", href: "/Men" },
  { name: "Women", href: "/Women" },
  { name: "Accessories", href: "/Accessories" },
  { name: "All Products", href: "/all" },
];

const accountLinks: FooterLink[] = [
  { name: "Wishlist", href: "/wishlist" },
  { name: "Orders", href: "/orders" },
  { name: "Sign In", href: "/sign-in" },
];

const supportLinks: FooterLink[] = [
  { name: "Shipping & Delivery", href: "/all" },
  { name: "Returns & Exchanges", href: "/all" },
  { name: "All Products", href: "/all" },
];

function FooterLinks({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h4 className="eyebrow">{title}</h4>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={`${link.href}-${link.name}`}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block">
              <h3 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
                Afric<span className="text-primary">Vogue</span>
              </h3>
            </Link>
            <p className="eyebrow mt-4">The African edit</p>
            <p className="mt-3 max-w-sm text-sm leading-7 text-muted-foreground">
              Discover the latest trends and timeless styles in African fashion.
            </p>

            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <a
                  href="https://maps.app.goo.gl/segckXu4xHSfdwis9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-primary"
                >
                  Ashaley Botwe Accra, Ghana
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <a
                  href="mailto:dheztinykartel@gmail.com"
                  className="transition-colors hover:text-primary"
                >
                  dheztinykartel@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <a href="tel:+233505306932" className="transition-colors hover:text-primary">
                  +233 50 530 6932
                </a>
              </div>
            </div>

            <div className="mt-7 flex items-center gap-3">
              <a
                href="https://wa.me/2330505306932"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white shadow-sm ring-1 ring-border/50 transition-transform hover:-translate-y-0.5"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/africvogue"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-sm ring-1 ring-border/50 transition-transform hover:-translate-y-0.5"
                aria-label="Instagram"
              >
                <FaInstagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            <FooterLinks title="Shop" links={quickLinks} />
            <FooterLinks title="Account" links={accountLinks} />

            <div>
              <h4 className="eyebrow">Our story</h4>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                For over two decades, AfricVogue has celebrated the rich heritage
                of African fashion. Our collections blend contemporary trends with
                timeless elegance, bringing you the finest in African design.
              </p>
              <div className="mt-6">
                <FooterLinks title="Support" links={supportLinks} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="eyebrow">Accepted payments</p>
          <div className="mt-2 max-w-md">
            <PaymentCarousel />
          </div>
        </div>
      </div>

      <div className="border-t border-border py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-sm text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>&copy; {year} AfricVogue. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Developed with</span>
            <span className="text-red-500" aria-label="love">&#9829;</span>
            <span>by</span>
            <a
              href="https://hollali.netlify.app/"
              className="font-semibold text-foreground transition-colors hover:text-primary"
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
