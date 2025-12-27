import { EnquiryForm } from "@/components/enquiry-form";

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
            Send an enquiry for pricing, specifications, dealership, or service.
            This form submits directly to your backend API.
          </p>

          <div className="mt-8 space-y-2 text-sm text-black/70 dark:text-white/70">
            <div>Phone: +91 XXXXXXXXXX</div>
            <div>Email: sales@eauto.com</div>
            <div>Address: (Add your address)</div>
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-black">
          <EnquiryForm sourcePage="/contact" />
        </div>
      </div>
    </div>
  );
}
