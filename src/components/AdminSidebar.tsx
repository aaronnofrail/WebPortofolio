"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const adminNavItems = [
    { name: "DASHBOARD", href: "/admin/dashboard", iconPath: "/assets/dashboard.svg" },
    { name: "BIO", href: "/admin/bio", iconPath: "/assets/bio.svg" },
    { name: "EXPERIENCE", href: "/admin/experience", iconPath: "/assets/experience.svg" },
    { name: "ACHIEVEMENTS", href: "/admin/achievements", iconPath: "/assets/achievements.png" },
    { name: "PROJECT", href: "/admin/projects", iconPath: "/assets/projects.svg" },
    { name: "FAQ", href: "/admin/faq", iconPath: "/assets/faq.svg" },
    { name: "INBOX", href: "/admin/inbox", iconPath: "/assets/inbox.png" },
  ];

  const activeClass =
    "flex items-center gap-3 px-4 py-2.5 mx-3 my-1 border-2 border-black dark:border-neutral-700 bg-black dark:bg-white text-white dark:text-black font-bold uppercase tracking-wider rounded-xl shadow-neo transition-all duration-150 font-mono text-xs";
  const inactiveClass =
    "flex items-center gap-3 px-4 py-2.5 mx-3 my-1 border-2 border-transparent hover:border-black dark:hover:border-neutral-700 bg-transparent text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white font-bold uppercase tracking-wider rounded-xl hover:shadow-neo-btn transition-all duration-150 font-mono text-xs";

  const getIconClass = (isActive: boolean) =>
    isActive
      ? "w-4.5 h-4.5 object-contain invert dark:invert-0 shrink-0"
      : "w-4.5 h-4.5 object-contain dark:invert shrink-0";

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 border-r-2 border-black dark:border-neutral-700 bg-white dark:bg-black fixed left-0 top-0 z-50 transition-colors duration-300">
      <div className="p-6 border-b-2 border-black dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h1 className="text-xl font-black text-black dark:text-white font-mono lowercase tracking-tight">aaronnofrail</h1>
          </div>
        </div>
        <button className="w-full border-2 border-black dark:border-neutral-700 py-2.5 px-4 font-mono text-[10px] bg-white dark:bg-neutral-900 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-150 shadow-neo-btn uppercase tracking-widest font-bold cursor-pointer">
          DEPLOY CHANGES
        </button>
      </div>

      <nav className="flex-grow py-6 overflow-y-auto">
        <div className="space-y-1">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                className={isActive ? activeClass : inactiveClass}
                href={item.href}
              >
                <img
                  src={item.iconPath}
                  alt={`${item.name} icon`}
                  className={getIconClass(isActive)}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-auto p-4 space-y-2 border-t-2 border-black dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
        <Link
          className={pathname === "/admin/settings" ? activeClass : inactiveClass}
          href="/admin/settings"
        >
          <img
            src="/assets/settings.png"
            alt="SETTINGS icon"
            className={getIconClass(pathname === "/admin/settings")}
          />
          SETTINGS
        </Link>
        <Link
          className={inactiveClass}
          href="/home"
          onClick={() => {
            sessionStorage.removeItem("admin_authorized");
          }}
        >
          <img
            src="/assets/logout.png"
            alt="LOGOUT icon"
            className={getIconClass(false)}
          />
          LOGOUT
        </Link>
      </div>
    </aside>
  );
}
