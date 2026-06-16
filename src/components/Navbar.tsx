"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { translations } from "@/data/translations";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/home" || pathname === "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Sync theme
    const savedTheme = localStorage.getItem("portfolio-theme");
    const initialTheme = savedTheme === "light" ? "light" : "dark";
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // Get active translations (always English)
  const t = translations.en;

  const navItems = [
    { name: t.nav.home, href: "/home" },
    { name: t.nav.about, href: "/about" },
    { name: t.nav.experience, href: "/experience" },
    { name: t.nav.projects, href: "/projects" },
    { name: t.nav.faq, href: "/faq" },
    { name: t.nav.contact, href: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 font-mono transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
        {/* Brand / Logo */}
        <div className="flex-shrink-0 z-20 font-bold tracking-tight text-[18px]">
          {isHome ? (
            <div className="h-7 overflow-hidden relative group">
              <Link
                href="/home"
                className="block text-black dark:text-white transition-transform duration-500 ease-in-out transform group-hover:-translate-y-1/2"
              >
                <span className="block h-7 leading-7 lowercase">aaronnofrail</span>
                <span className="block h-7 leading-7 normal-case">Arundaffa Nahara</span>
              </Link>
            </div>
          ) : (
            <Link
              className="text-black dark:text-white hover:text-neutral-500 transition-colors lowercase"
              href="/home"
            >
              aaronnofrail
            </Link>
          )}
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                className={`text-xs font-bold uppercase tracking-widest transition-colors ${
                  isActive
                    ? "text-black dark:text-white border-b-2 border-black dark:border-white pb-1"
                    : "text-neutral-500 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                }`}
                href={item.href}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Desktop Right Hand Side Actions */}
        <div className="flex items-center gap-3 z-20">
          {/* Theme Selector Icon */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all cursor-pointer flex items-center justify-center select-none"
            title="Toggle theme mode"
            aria-label="Toggle theme mode"
          >
            <span className="material-symbols-outlined block text-[18px]">
              {!mounted ? "dark_mode" : theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-full transition-colors md:hidden cursor-pointer"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <span className="material-symbols-outlined block text-[24px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-black/95 p-6 flex flex-col gap-4 font-mono uppercase tracking-widest text-sm transition-all duration-300">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 border-l-4 rounded-r-md ${
                  isActive
                    ? "text-black dark:text-white border-black dark:border-white bg-neutral-100 dark:bg-neutral-950 font-bold"
                    : "text-neutral-500 border-transparent hover:text-black dark:hover:text-white"
                }`}
                href={item.href}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
