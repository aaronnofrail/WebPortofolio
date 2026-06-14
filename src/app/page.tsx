"use client";

import Link from "next/link";

export default function SplashPage() {
  const handleStart = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("portfolio_started", "true");
    }
  };

  return (
    <div className="bg-background text-primary min-h-screen flex items-center justify-center scanlines relative overflow-hidden w-full">
      {/* Editorial Page Borders */}
      <div className="absolute inset-0 border-8 border-surface pointer-events-none z-10 hidden md:block"></div>
      <div className="absolute inset-0 border-[1px] border-primary pointer-events-none z-20 m-4 hidden md:block"></div>

      <main className="text-center flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop z-30 min-h-screen w-full h-full">
        <div className="mb-12 md:mb-16">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg font-bold lowercase tracking-tight mb-4 text-center">
            aaronnofrail portfolio
            <span className="inline-block w-3 h-6 bg-primary ml-1 align-middle cursor-blink"></span>
          </h1>
          <p className="font-body-md text-body-md md:font-body-lg md:text-body-lg text-secondary uppercase tracking-widest text-center">
            click start to get started
          </p>
        </div>

        <Link
          href="/home"
          onClick={handleStart}
          className="font-code text-code bg-surface text-primary border border-primary px-12 py-4 hover:bg-primary hover:text-on-primary transition-colors duration-150 uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-4 focus:ring-offset-background group block cursor-pointer"
        >
          <span className="flex items-center gap-2 justify-center">
            [ START ]
          </span>
        </Link>
      </main>

      <div className="absolute bottom-8 left-8 hidden md:block">
        <p className="font-label-sm text-label-sm text-outline">SYS.INIT.LOADING_COMPLETE</p>
      </div>
      <div className="absolute bottom-8 right-8 hidden md:block">
        <p className="font-label-sm text-label-sm text-outline">v.2026.1</p>
      </div>
    </div>
  );
}
