"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PortfolioGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const started = sessionStorage.getItem("portfolio_started");
      if (!started) {
        router.replace("/");
      } else {
        setAuthorized(true);
      }
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="bg-background min-h-screen flex items-center justify-center scanlines text-primary font-code">
        &gt; AUTHORIZING_SESSION...
      </div>
    );
  }

  return <>{children}</>;
}
