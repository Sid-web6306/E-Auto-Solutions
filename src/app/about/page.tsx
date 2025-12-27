import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
  title: "About",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">About {SITE_CONFIG.name}</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-black/70 dark:text-white/70">
        Add your company story, vision, manufacturing details, and certifications
        here.
      </p>
    </div>
  );
}
