"use client";

import { useEffect } from "react";

import { getClientAnalytics } from "@/lib/firebase-client";

export function FirebaseAnalytics() {
  useEffect(() => {
    void getClientAnalytics();
  }, []);

  return null;
}
