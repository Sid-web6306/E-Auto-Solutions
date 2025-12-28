"use client";

import { useEffect, useState } from "react";

type Dealer = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  location: string;
  lat?: number;
  lng?: number;
};

export function DealersList() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchAddress, setSearchAddress] = useState("");

  useEffect(() => {
    async function fetchDealers() {
      try {
        const res = await fetch("/api/dealers");
        if (res.ok) {
          const data = await res.json();
          setDealers(data.dealers || []);
        }
      } catch (error) {
        console.error("Failed to fetch dealers:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDealers();
  }, []);

  const filteredDealers = dealers.filter((dealer) => {
    const nameMatch = !searchName || dealer.name.toLowerCase().includes(searchName.toLowerCase());
    const addressMatch = !searchAddress || 
      dealer.address.toLowerCase().includes(searchAddress.toLowerCase()) ||
      dealer.location.toLowerCase().includes(searchAddress.toLowerCase());
    return nameMatch && addressMatch;
  });

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <div className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-black">
        <h3 className="text-sm font-semibold mb-4">Search Dealers</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-xs text-black/60 dark:text-white/60 mb-1.5">Dealer Name</label>
            <input
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="h-10 w-full rounded-lg border border-black/10 bg-transparent px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10"
            />
          </div>
          <div>
            <label className="block text-xs text-black/60 dark:text-white/60 mb-1.5">Address / Location</label>
            <input
              type="text"
              placeholder="Search by address or city..."
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              className="h-10 w-full rounded-lg border border-black/10 bg-transparent px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:border-white/10"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setSearchName(""); setSearchAddress(""); }}
              className="h-10 px-4 rounded-lg text-sm text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-black/60 dark:text-white/60">
          {filteredDealers.length} dealer{filteredDealers.length !== 1 ? "s" : ""} found
        </span>
      </div>

      {loading ? (
        <div className="text-center text-sm text-black/60 dark:text-white/60">
          Loading dealers...
        </div>
      ) : filteredDealers.length === 0 ? (
        <div className="rounded-xl border border-black/10 p-8 text-center text-sm text-black/60 dark:border-white/10 dark:text-white/60">
          {dealers.length === 0
            ? "No dealers available yet. Contact us to become a dealer!"
            : "No dealers match your search."}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDealers.map((dealer) => (
            <div
              key={dealer.id}
              className="rounded-xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-black"
            >
              <h3 className="font-semibold">{dealer.name}</h3>
              <div className="mt-2 space-y-1 text-sm text-black/70 dark:text-white/70">
                <p className="flex items-center gap-2">
                  <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${dealer.phone}`} className="hover:text-emerald-600">
                    {dealer.phone}
                  </a>
                </p>
                <p className="flex items-start gap-2">
                  <svg className="h-4 w-4 text-emerald-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    {dealer.address}
                    <br />
                    <span className="font-medium">{dealer.location}</span>
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
