"use client";

import { useEffect } from "react";
import { incrementViewsAction } from "@/app/actions/sanityActions";

export default function ViewsTracker() {
  useEffect(() => {
    // Only count views once per session
    if (typeof window === "undefined") return;

    const sessionViewed = sessionStorage.getItem("portfolio_viewed");
    if (!sessionViewed) {
      sessionStorage.setItem("portfolio_viewed", "true");

      const isSanityConfigured =
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
        process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "aaronnofrail_project";

      if (isSanityConfigured) {
        incrementViewsAction()
          .then((res) => {
            if (res.success && res.count) {
              localStorage.setItem("aaronnofrail_views", String(res.count));
            } else {
              fallbackIncrement();
            }
          })
          .catch((err) => {
            console.error("Failed to increment views in Sanity:", err);
            fallbackIncrement();
          });
      } else {
        fallbackIncrement();
      }
    }

    function fallbackIncrement() {
      const stored = localStorage.getItem("aaronnofrail_views");
      let count = 1243;
      if (stored) {
        count = parseInt(stored, 10);
      }
      const newCount = count + 1;
      localStorage.setItem("aaronnofrail_views", String(newCount));
    }
  }, []);

  return null;
}
