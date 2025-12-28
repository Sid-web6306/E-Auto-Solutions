import { DealersList } from "./dealers-map";

export const metadata = {
  title: "Dealers",
};

export default function DealersPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Dealer Network</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-black/70 dark:text-white/70">
        Find authorized dealers and service centers near you. Our network spans across India 
        to provide you with the best sales and service experience.
      </p>

      <div className="mt-8">
        <DealersList />
      </div>
    </div>
  );
}
