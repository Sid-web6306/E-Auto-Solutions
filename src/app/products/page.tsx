import Link from "next/link";

export const metadata = {
  title: "Products",
};

const products = [
  {
    name: "E-Rickshaw",
    desc: "Comfortable passenger transport for daily commutes.",
    href: "/contact",
  },
  {
    name: "E-Loader",
    desc: "Reliable cargo solutions for last-mile deliveries.",
    href: "/contact",
  },
  {
    name: "Passenger",
    desc: "Modern mobility for shared and personal rides.",
    href: "/contact",
  },
];

export default function ProductsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="mt-2 text-sm text-black/70 dark:text-white/70">
            Explore our range of electric vehicles designed for efficiency and reliability.
          </p>
        </div>
        <Link
          href="/contact"
          className="inline-flex h-10 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          Get a quote
        </Link>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.name}
            className="rounded-3xl border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-black"
          >
            <div className="text-base font-semibold">{p.name}</div>
            <div className="mt-2 text-sm text-black/70 dark:text-white/70">
              {p.desc}
            </div>
            <div className="mt-6">
              <Link
                href={p.href}
                className="text-sm font-semibold text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white"
              >
                Enquire →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
