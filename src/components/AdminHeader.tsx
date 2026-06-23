"use client";

import { usePathname } from "next/navigation";

export default function AdminHeader() {
  const pathname = usePathname();

  // Extract page label from path
  // e.g., /admin/dashboard -> dashboard
  const segment = pathname.split("/").pop() || "dashboard";
  const pathLabel = `admin / ${segment}`;

  return (
    <header className="h-16 flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop border-b-2 border-black dark:border-neutral-700 bg-white dark:bg-black sticky top-0 z-40 shrink-0 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <span className="font-mono text-xs font-bold text-black dark:text-white uppercase tracking-wider">
          &gt; {pathLabel}
        </span>
        <span className="terminal-caret"></span>
      </div>
    </header>
  );
}
