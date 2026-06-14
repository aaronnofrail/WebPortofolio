"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      <nav className="flex justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-6">
        <div className="font-headline-lg text-headline-lg font-bold lowercase text-primary">
          <Link
            className="hover:bg-primary hover:text-on-primary transition-all duration-75 px-1"
            href="/home"
          >
            aaronnofrail
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 font-body-lg text-body-lg uppercase tracking-widest items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                className={
                  isActive
                    ? "text-primary font-bold border-b-2 border-primary px-2 py-1"
                    : "text-secondary hover:text-primary transition-colors duration-150 px-2 py-1 border-b-2 border-transparent"
                }
                href={item.href}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden border border-primary p-2 hover:bg-primary hover:text-on-primary flex items-center justify-center cursor-pointer"
        >
          <span className="material-symbols-outlined block text-[24px]">
            {mobileMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </nav>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-primary bg-background p-4 flex flex-col gap-4 font-body-lg text-body-lg uppercase tracking-widest">
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
