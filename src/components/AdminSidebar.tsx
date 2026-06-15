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
    "flex items-center text-on-primary bg-primary font-bold px-6 py-3 border-b border-primary font-code text-code border-l-4 transition-all duration-75";
  const inactiveClass =
    "flex items-center text-primary px-6 py-3 hover:bg-secondary-container transition-colors font-code text-code";

  const getIconClass = (isActive: boolean) =>
    isActive
      ? "w-5 h-5 mr-3 object-contain invert dark:invert-0"
      : "w-5 h-5 mr-3 object-contain dark:invert";

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 border-r border-primary bg-surface fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-primary">
        <div className="flex items-center gap-3 mb-4">
          {/* <div className="w-10 h-10 border border-primary flex items-center justify-center overflow-hidden shrink-0">
            <img
              alt="System Administrator Avatar"
              className="w-full h-full object-cover"
              src="/assets/ach_contributor.png"
            />
          </div> */}
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary">aaronnofrail</h1>
          </div>
        </div>
        {/* <button className="w-full border border-primary py-2 px-4 font-code text-label-sm hover:bg-primary hover:text-on-primary transition-all duration-75 uppercase tracking-widest font-bold cursor-pointer">
          DEPLOY CHANGES
        </button> */}
      </div>

      <nav className="flex-grow py-4 overflow-y-auto">
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

      <div className="mt-auto p-4 space-y-2 border-t border-primary bg-surface-container-low">
        <Link
          className={pathname === "/admin/settings" ? activeClass : "flex items-center text-primary px-6 py-3 hover:bg-secondary-container transition-colors font-code text-code"}
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
          className="flex items-center text-primary px-6 py-3 hover:bg-secondary-container transition-colors font-code text-code"
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
