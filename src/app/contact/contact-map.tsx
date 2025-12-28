"use client";

import { SITE_CONFIG } from "@/lib/constants";

export function ContactMap() {
  const address = encodeURIComponent(
    `${SITE_CONFIG.address.street}, ${SITE_CONFIG.address.city}, ${SITE_CONFIG.address.state}, ${SITE_CONFIG.address.country} ${SITE_CONFIG.address.pincode}`
  );

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
      <iframe
        src={`https://www.google.com/maps?q=${address}&output=embed`}
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Office Location"
      />
    </div>
  );
}
