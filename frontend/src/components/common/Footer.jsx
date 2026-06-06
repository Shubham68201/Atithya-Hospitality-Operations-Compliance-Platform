import { Link } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { FaLinkedinIn, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-[#C8D8E8]">
      {/* Top wave divider */}
      <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <h3 className="font-cinzel text-gold text-2xl tracking-[3px] mb-1">ATITHYA</h3>
          <p className="text-xs text-[#9BB0C9] tracking-wider mb-4">BY SHRI PERUMAL</p>
          <p className="text-sm leading-relaxed text-[#8EA8C3] mb-6">
            India's first unified hospitality operations & compliance platform.
            Check In Se Compliance Tak — Sab Automatic.
          </p>
          <div className="flex gap-3">
            {[
              { icon: FaLinkedinIn, href: "#" },
              { icon: FaTwitter,    href: "#" },
              { icon: FaInstagram,  href: "#" },
            ].map(({ icon: Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-[#9BB0C9] hover:border-gold hover:text-gold transition-colors"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold text-ivory text-sm tracking-wider uppercase mb-5">Quick Links</h4>
          <ul className="space-y-3">
            {[
              { to: "/",          label: "Home" },
              { to: "/about",     label: "About Us" },
              { to: "/solutions", label: "Solutions" },
              { to: "/careers",   label: "Careers" },
              { to: "/contact",   label: "Contact" },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="text-sm text-[#8EA8C3] hover:text-gold transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gold/50 inline-block" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Solutions */}
        <div>
          <h4 className="font-semibold text-ivory text-sm tracking-wider uppercase mb-5">Platform</h4>
          <ul className="space-y-3">
            {[
              "Guest Check-In Automation",
              "Compliance Management",
              "Operations Dashboard",
              "Staff Management",
              "Analytics & Reports",
              "CMS & Website Tools",
            ].map((item) => (
              <li key={item}>
                <span className="text-sm text-[#8EA8C3] flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-gold/50 inline-block" />
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-ivory text-sm tracking-wider uppercase mb-5">Contact</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <FiMapPin className="text-gold mt-0.5 flex-shrink-0" size={15} />
              <span className="text-sm text-[#8EA8C3] leading-relaxed">
                AIC-MFIE-IMS-BHU<br />Varanasi, Uttar Pradesh
              </span>
            </li>
            <li className="flex items-center gap-3">
              <FiPhone className="text-gold flex-shrink-0" size={15} />
              <a href="tel:+918828273581" className="text-sm text-[#8EA8C3] hover:text-gold transition-colors">
                +91 8828273581
              </a>
            </li>
            <li className="flex items-center gap-3">
              <FiMail className="text-gold flex-shrink-0" size={15} />
              <a href="mailto:sriperumal.aperio@gmail.com" className="text-sm text-[#8EA8C3] hover:text-gold transition-colors break-all">
                sriperumal.aperio@gmail.com
              </a>
            </li>
          </ul>

          <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10">
            <p className="text-xs text-[#9BB0C9] leading-relaxed">
              <span className="text-gold font-medium">Incubated at</span><br />
              AIC-MFIE-IMS-BHU, Varanasi
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#5A7A9A]">
            © {year} Shri Perumal Hospitality Innovations Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="#" className="text-xs text-[#5A7A9A] hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-xs text-[#5A7A9A] hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
