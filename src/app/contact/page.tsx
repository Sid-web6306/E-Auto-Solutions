import { EnquiryForm } from "@/components/enquiry-form";
import { SITE_CONFIG } from "@/lib/constants";
import { ContactMap } from "./contact-map";

export const metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-black/70 dark:text-white/70">
            Have questions about pricing, specifications, dealership opportunities, or service? 
            Fill out the form and our team will get back to you shortly.
          </p>

          <div className="mt-8 space-y-3 text-sm text-black/70 dark:text-white/70">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href={`tel:${SITE_CONFIG.phone}`} className="hover:text-emerald-600 transition-colors">
                {SITE_CONFIG.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>sales@sethjiindustries.com</span>
            </div>
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-emerald-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <div>{SITE_CONFIG.address.street}</div>
                <div>{SITE_CONFIG.address.city}, {SITE_CONFIG.address.state}, {SITE_CONFIG.address.country}</div>
                <div>{SITE_CONFIG.address.pincode}</div>
              </div>
            </div>
          </div>

          <ContactMap />
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-black">
          <EnquiryForm sourcePage="/contact" />
        </div>
      </div>
    </div>
  );
}
