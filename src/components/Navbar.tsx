"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
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

  const navItems = [
    { name: "home", href: "/home" },
    { name: "about", href: "/about" },
    { name: "experience", href: "/experience" },
    { name: "projects", href: "/projects" },
    { name: "faq", href: "/faq" },
    { name: "contact", href: "/contact" },
  ];

  return (
    <header className="w-full top-0 border-b border-primary bg-background z-40 relative">
      <nav className="flex justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-3">
        <div className="font-headline-md text-headline-md font-bold lowercase text-primary">
          <Link
            className="hover:bg-primary hover:text-on-primary transition-all duration-75 px-1"
            href="/home"
          >
            aaronnofrail
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-6 font-body-md text-body-md uppercase tracking-widest items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                className={
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary px-1.5 py-0.5"
                    : "text-secondary hover:text-primary transition-colors duration-150 px-1.5 py-0.5 border-b-2 border-transparent"
                }
                href={item.href}
              >
                {item.name}
              </Link>
            );
          })}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="border border-primary px-2 py-0.5 font-label-sm text-label-sm uppercase hover:bg-primary hover:text-on-primary transition-all cursor-pointer font-code select-none ml-2"
            title="Toggle theme mode"
          >
            {!mounted ? "[ THEME ]" : theme === "dark" ? "[ LIGHT_MODE ]" : "[ DARK_MODE ]"}
          </button>
        </div>

        {/* Mobile Nav Actions */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={toggleTheme}
            className="border border-primary px-1.5 py-0.5 font-code text-[11px] uppercase hover:bg-primary hover:text-on-primary transition-all cursor-pointer select-none"
            title="Toggle theme mode"
          >
            {!mounted ? "THEME" : theme === "dark" ? "LIGHT" : "DARK"}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="border border-primary p-1.5 hover:bg-primary hover:text-on-primary flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined block text-[20px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-primary bg-background p-4 flex flex-col gap-4 font-body-md text-body-md uppercase tracking-widest">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={
                  isActive
                    ? "text-primary font-bold border-l-4 border-primary pl-2 py-1"
                    : "text-secondary hover:text-primary transition-colors duration-150 pl-2 py-1 border-l-4 border-transparent"
                }
                href={item.href}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
