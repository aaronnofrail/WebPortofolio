"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGate from "@/components/PortfolioGate";
import { translations } from "@/data/translations";

export default function HomePage() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    // Format current date
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" };
    setCurrentDate(date.toLocaleDateString("en-US", options).toUpperCase());
  }, []);

  const t = translations.en;

  // Tilted rotations for the hero badges
  const badgeRotations = [
    "rotate-[-3deg]",
    "rotate-[4deg]",
    "rotate-[-6deg]",
    "rotate-[8deg]",
    "rotate-[-2deg]",
  ];

  return (
    <PortfolioGate>
      <Navbar />
      <main className="w-full min-h-[100dvh] bg-white dark:bg-black font-mono overflow-hidden transition-colors duration-300 relative flex flex-col justify-between pt-20">

        {/* Decorative background grid pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

        {/* Hero Section Container */}
        <div className="flex-grow flex flex-col justify-center items-center relative z-10 px-4 mb-20">

          {/* Centered Large Typographic Name Banner */}
          <div className="w-full select-none my-auto flex justify-center items-center">
            <div className="overflow-hidden relative group h-[11vw] w-full cursor-default">
              <div className="flex flex-col transition-transform duration-700 ease-in-out transform group-hover:-translate-y-1/2">
                <h1 className="text-[12vw] leading-[0.8] font-black tracking-tighter text-black dark:text-white text-center h-[11vw] flex items-center justify-center">
                  aaronnofrail
                </h1>
                <h1 className="text-[9vw] leading-[0.8] font-black tracking-tighter text-black dark:text-white text-center normal-case h-[11vw] flex items-center justify-center whitespace-nowrap">
                  Arundaffa Nahara
                </h1>
              </div>
            </div>
          </div>

          {/* Floating Tilted Skill Pills */}
          <div className="absolute inset-x-4 top-[68%] md:top-[65%] flex flex-wrap items-center justify-center gap-3 md:gap-5 z-20">
            {t.hero.skills.map((skill, index) => {
              const rotation = badgeRotations[index % badgeRotations.length];
              const isAccent = index % 2 === 0;

              return (
                <div key={skill} className={rotation}>
                  <div
                    className={`flex items-center justify-center whitespace-nowrap transition-transform duration-300 ease-out hover:scale-105 font-bold text-[10px] md:text-xs uppercase rounded-full px-5 py-2.5 border-2 border-black dark:border-neutral-700 shadow-neo ${isAccent
                        ? "bg-white dark:bg-neutral-900 text-black dark:text-white"
                        : "bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-900 dark:hover:bg-neutral-100"
                      }`}
                  >
                    {skill}
                    {index % 3 === 0 && <span className="ml-1 text-red-500">✦</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Neo-brutalist Bottom Status Bar */}
        <div className="w-full border-t-0.1 border-black dark:border-neutral-700 bg-white dark:bg-neutral-950 text-black dark:text-white font-mono text-[10px] md:text-xs uppercase tracking-wider z-20 relative transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-1 divide-x-2 divide-black dark:divide-neutral-700 text-center md:text-center">

            {/* Status 1: Open to Work */}
            {/* <div className="p-4 flex items-center justify-center md:justify-start gap-3 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors cursor-default group">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
              </span>
              <span className="font-bold">{t.hero.statusOpen}</span>
            </div> */}

            {/* Status 2: Location */}
            {/* <div className="p-4 flex items-center justify-center md:justify-start hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors cursor-default">
              <span>{t.hero.statusLocation}</span>
            </div> */}

            {/* Status 3: Current Time */}
            {/* <div className="p-4 flex items-center justify-center md:justify-start hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors cursor-default">
              <span className="flex gap-2">
                <span className="font-bold">TIME:</span>
                <span>{currentDate || "..."}</span>
              </span>
            </div> */}

            {/* Status 4: Navigation Link */}
            <Link
              href="/about"
              className="p-4 flex items-center justify-center gap-2 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors cursor-pointer group animate-pulse"
            >
              <span>{t.hero.scrollDown}</span>
              <span className="material-symbols-outlined text-sm block">
                arrow_outward
              </span>
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </PortfolioGate>
  );
}
