"use client";

import { usePathname } from "next/navigation";

export default function AdminHeader() {
  const pathname = usePathname();

  // Extract page label from path
  // e.g., /admin/dashboard -> dashboard
  const segment = pathname.split("/").pop() || "dashboard";
  const pathLabel = `admin / ${segment}`;

  return (
    <header className="h-16 flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop border-b border-primary bg-surface sticky top-0 z-40 shrink-0">
      <div className="flex items-center gap-2">
        <span className="font-code text-code font-bold text-primary uppercase">
          &gt; {pathLabel}
        </span>
        <span className="terminal-caret"></span>
      </div>
      <div className="flex items-center gap-8 h-full">
        <div className="h-full border-l border-primary px-6 flex items-center bg-surface-container-lowest">
          <span className="font-code text-label-sm font-bold text-primary">SYSTEM_UPTIME: 99.9%</span>
        </div>
      </div>
    </header>
  );
}
