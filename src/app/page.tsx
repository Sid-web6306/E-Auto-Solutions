import Link from "next/link";

const stats = [
  { value: "10,000+", label: "Happy Customers" },
  { value: "500+", label: "Dealers Nationwide" },
  { value: "100km", label: "Average Range" },
  { value: "24/7", label: "Service Support" },
];

const products = [
  {
    title: "E-Rickshaw",
    desc: "Comfortable passenger transport with superior build quality for daily city commutes.",
    icon: "🛺",
    features: ["6 Seater", "100km Range", "Fast Charging"],
  },
  {
    title: "E-Loader",
    desc: "Heavy-duty cargo solutions designed for last-mile deliveries and commercial use.",
    icon: "🚛",
    features: ["500kg Capacity", "Low Maintenance", "Durable Build"],
  },
  {
    title: "E-Cart",
    desc: "Versatile electric carts perfect for urban logistics and small businesses.",
    icon: "🛒",
    features: ["Compact Design", "Easy Maneuver", "Cost Effective"],
  },
];

const features = [
  {
    icon: "⚡",
    title: "High Performance",
    desc: "Powerful motor delivering smooth acceleration and consistent speed on all terrains.",
  },
  {
    icon: "🔋",
    title: "Long Battery Life",
    desc: "Advanced lithium-ion batteries with 100+ km range on a single charge.",
  },
  {
    icon: "💰",
    title: "Low Running Cost",
    desc: "Save up to 80% on fuel costs compared to petrol/diesel vehicles.",
  },
  {
    icon: "🛡️",
    title: "Built to Last",
    desc: "Robust chassis and premium components designed for Indian road conditions.",
  },
  {
    icon: "🔧",
    title: "Easy Maintenance",
    desc: "Minimal moving parts mean lower maintenance costs and longer life.",
  },
  {
    icon: "🌿",
    title: "Eco Friendly",
    desc: "Zero emissions contributing to a cleaner and greener environment.",
  },
];

const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Delhi",
    text: "Best investment for my business. Running cost is almost nothing compared to my old auto. Highly recommend E-Auto!",
    rating: 5,
  },
  {
    name: "Suresh Patel",
    location: "Gujarat",
    text: "The build quality is excellent. Been running for 2 years without any major issues. Great service support too.",
    rating: 5,
  },
  {
    name: "Mohammad Ali",
    location: "UP",
    text: "Very comfortable for passengers. My daily earnings have increased because of low running costs.",
    rating: 5,
  },
];

export default function Home() {
  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="text-white animate-fade-in-up">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                India&apos;s Trusted EV Brand
              </div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Electric Mobility
                <span className="block text-green-200">Built for India</span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-white/80 max-w-lg">
                Experience the future of transportation with our range of electric vehicles. 
                Superior performance, unmatched reliability, and zero emissions.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/products" className="btn-primary inline-flex items-center justify-center gap-2">
                  Explore Products
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link href="/contact" className="btn-secondary inline-flex items-center justify-center gap-2 !bg-white/10 !text-white !border-white/30 hover:!bg-white hover:!text-emerald-700">
                  Book Test Drive
                </Link>
              </div>
            </div>
            
            <div className="relative animate-slide-in-right delay-200">
              <div className="relative mx-auto h-80 w-full max-w-md lg:h-96">
                <div className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                  <div className="text-center text-white/60">
                    <div className="text-8xl mb-4 animate-float">🛺</div>
                    <p className="text-sm">Your vehicle image here</p>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 rounded-2xl bg-white p-4 shadow-2xl animate-fade-in delay-500">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                      <span className="text-2xl">⚡</span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Starting from</div>
                      <div className="text-lg font-bold text-gray-900">₹1.2 Lakh*</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-8 z-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 md:grid-cols-4 md:gap-8 md:p-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-2xl font-bold text-emerald-600 sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
              Our Products
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Choose Your Perfect Ride
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              From passenger transport to heavy cargo, we have the right electric vehicle for every need.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {products.map((product, i) => (
              <div
                key={product.title}
                className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-lg ring-1 ring-black/5 card-hover animate-fade-in-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="absolute -right-8 -top-8 text-9xl opacity-10 transition-transform duration-500 group-hover:scale-110">
                  {product.icon}
                </div>
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-3xl shadow-lg">
                    {product.icon}
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-900">{product.title}</h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">{product.desc}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {product.features.map((f) => (
                      <span key={f} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        {f}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/products"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    View Details
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/products" className="btn-primary inline-flex items-center gap-2">
              View All Products
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
              Why Choose Us
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Built Different. Built Better.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Every E-Auto vehicle is engineered for performance, reliability, and your peace of mind.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 card-hover animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
              Testimonials
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Loved by Thousands
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Don&apos;t just take our word for it. Here&apos;s what our customers say.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="rounded-3xl bg-white p-8 shadow-lg ring-1 ring-black/5 card-hover animate-fade-in-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex gap-1">
                  {[...Array(t.rating)].map((_, j) => (
                    <span key={j} className="text-xl text-amber-400">★</span>
                  ))}
                </div>
                <p className="mt-4 text-gray-600 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-600">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-hero py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl animate-fade-in-up">
            Ready to Go Electric?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80 animate-fade-in-up delay-100">
            Get in touch with us for pricing, test drives, or dealership opportunities. 
            Our team is ready to help you make the switch.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up delay-200">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-emerald-700 shadow-lg transition-all hover:bg-gray-100 hover:shadow-xl"
            >
              Contact Sales
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/dealers"
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              Find Nearest Dealer
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-white/60 text-sm animate-fade-in-up delay-300">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +91 XXXXXXXXXX
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              sales@eauto.com
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
