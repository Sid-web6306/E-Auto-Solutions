import Link from "next/link";

export const metadata = {
  title: "Downloads",
};

export default function DownloadsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Downloads</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-black/70 dark:text-white/70">
        Brochures, spec sheets and warranty documents will be added here. We can
        host files on Firebase Storage.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {[
          { title: "Product Brochure", href: "#" },
          { title: "Specifications", href: "#" },
          { title: "Warranty", href: "#" },
        ].map((d) => (
          <div
            key={d.title}
            className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-black"
          >
            <div className="text-sm font-semibold">{d.title}</div>
            <div className="mt-4">
              <Link
                href={d.href}
                className="text-sm font-semibold text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white"
              >
                Download →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
