export const metadata = {
  title: "Dealers",
};

export default function DealersPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-semibold tracking-tight">Dealer Network</h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-black/70 dark:text-white/70">
        We will add a searchable dealer locator (state/city) backed by Firebase
        Firestore.
      </p>

      <div className="mt-8 rounded-3xl border border-black/10 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-black">
        <div className="text-sm font-semibold">Coming next</div>
        <div className="mt-2 text-sm text-black/70 dark:text-white/70">
          Upload your dealer list (Excel/CSV) and we’ll import it into Firestore.
        </div>
      </div>
    </div>
  );
}
