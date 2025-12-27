import Link from "next/link";

const footerLinks = {
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
    { href: "/dealers", label: "Become a Dealer" },
    { href: "/downloads", label: "Downloads" },
  ],
  products: [
    { href: "/products", label: "E-Rickshaw" },
    { href: "/products", label: "E-Loader" },
    { href: "/products", label: "E-Cart" },
    { href: "/products", label: "Spare Parts" },
  ],
  support: [
    { href: "/contact", label: "Customer Support" },
    { href: "/downloads", label: "User Manuals" },
    { href: "/dealers", label: "Service Centers" },
    { href: "/contact", label: "Warranty" },
  ],
};

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-lg font-bold text-white shadow-lg">
                EA
              </div>
              <div>
                <div className="text-xl font-bold">E-Auto</div>
                <div className="text-sm text-emerald-400">Electric Mobility</div>
              </div>
            </Link>
            <p className="mt-6 max-w-sm text-gray-400 leading-relaxed">
              Leading manufacturer of electric vehicles in India. Committed to sustainable 
              transportation and empowering businesses with reliable, cost-effective mobility solutions.
            </p>
            {/* Social links */}
            <div className="mt-6 flex gap-4">
              {["facebook", "twitter", "instagram", "youtube"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-emerald-600 hover:text-white transition-colors"
                  aria-label={social}
                >
                  {social === "facebook" && (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.77,7.46H14.5v-1.9c0-.9.6-1.1,1-1.1h3V.5h-4.33C10.24.5,9.5,3.44,9.5,5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4Z"/>
                    </svg>
                  )}
                  {social === "twitter" && (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.44,4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96,1.32-2.02-.88.52-1.86.9-2.9,1.1-.82-.88-2-1.43-3.3-1.43-2.5,0-4.55,2.04-4.55,4.54,0,.36.03.7.1,1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6,1.45-.6,2.3,0,1.56.8,2.95,2,3.77-.74-.03-1.44-.23-2.05-.57v.06c0,2.2,1.56,4.03,3.64,4.44-.67.2-1.37.2-2.06.08.58,1.8,2.26,3.12,4.25,3.16C5.78,18.1,3.37,18.74,1,18.46c2,1.3,4.4,2.04,6.97,2.04,8.35,0,12.92-6.92,12.92-12.93,0-.2,0-.4-.02-.6.9-.63,1.96-1.22,2.56-2.14Z"/>
                    </svg>
                  )}
                  {social === "instagram" && (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,2.16c3.2,0,3.58.01,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s-.01,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.17,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33.01,7.05.07c-4.27.2-6.78,2.71-6.98,6.98C.01,8.33,0,8.74,0,12s.01,3.67.07,4.95c.2,4.27,2.71,6.78,6.98,6.98,1.28.06,1.69.07,4.95.07s3.67-.01,4.95-.07c4.27-.2,6.78-2.71,6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.27-2.71-6.78-6.98-6.98C15.67.01,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.41,4.15Z"/>
                    </svg>
                  )}
                  {social === "youtube" && (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.5,6.19a3.02,3.02,0,0,0-2.12-2.14C19.5,3.5,12,3.5,12,3.5s-7.5,0-9.38.55A3.02,3.02,0,0,0,.5,6.19,31.56,31.56,0,0,0,0,12a31.56,31.56,0,0,0,.5,5.81,3.02,3.02,0,0,0,2.12,2.14c1.88.55,9.38.55,9.38.55s7.5,0,9.38-.55a3.02,3.02,0,0,0,2.12-2.14A31.56,31.56,0,0,0,24,12,31.56,31.56,0,0,0,23.5,6.19ZM9.55,15.57V8.43L15.82,12Z"/>
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Links sections */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Company</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-300 hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Products</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-300 hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Support</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-300 hover:text-emerald-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact info bar */}
        <div className="mt-12 flex flex-col gap-6 rounded-2xl bg-gray-800/50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/20">
              <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-400">Call us anytime</div>
              <div className="text-lg font-semibold">+91 XXXXXXXXXX</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/20">
              <svg className="h-6 w-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="text-sm text-gray-400">Email us at</div>
              <div className="text-lg font-semibold">sales@eauto.com</div>
            </div>
          </div>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-600 px-8 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6">
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} E-Auto. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
