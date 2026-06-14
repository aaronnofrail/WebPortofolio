"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGate from "@/components/PortfolioGate";
import { mockBio, Bio } from "@/data/mockData";

export default function HomePage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [bio, setBio] = useState<Bio>(mockBio);
  const [grayscale, setGrayscale] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("aaronnofrail_bio");
    if (stored) {
      try {
        setBio(JSON.parse(stored));
      } catch (e) {}
    }

    const storedGrayscale = localStorage.getItem("aaronnofrail_grayscale");
    if (storedGrayscale !== null) {
      setGrayscale(storedGrayscale === "true");
    }

    const fullLogs = [
      "> ROOT SEQUENCE INITIATED",
      "> Loading modules... [OK]",
      "> Establishing secure connection... [OK]",
      "> Retrieving portfolio data... [OK]",
      "> SYS.READY: Standing by for input."
    ];
    
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < fullLogs.length) {
        setLogs((prev) => [...prev, fullLogs[currentIdx]]);
        currentIdx++;
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <PortfolioGate>
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-12 z-10 relative">
        <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
          
          {/* Main Bio Content */}
          <div className="col-span-1 md:col-span-8 flex flex-col gap-6">
            <div className="border border-primary bg-surface p-6 md:p-8 relative">
              <div className="absolute top-0 right-0 bg-primary text-on-primary font-label-sm text-label-sm px-2 py-1 border-l border-b border-primary">
                SYSTEM.READY
              </div>
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg mt-4 mb-2">
                {bio.terminalText.startsWith(">") ? bio.terminalText : `> ${bio.terminalText}`}
                <span className="terminal-caret ml-1"></span>
              </h1>
              
              <div className="font-body-md text-body-md text-secondary border-l-2 border-primary pl-4 my-6 space-y-4 whitespace-pre-line">
                {bio.description}
              </div>

              <div className="flex flex-wrap gap-2 mt-8">
                {bio.skills.map((skill) => (
                  <span
                    key={skill}
                    className="border border-primary px-3 py-1 font-label-sm text-label-sm uppercase hover:bg-primary hover:text-on-primary transition-colors cursor-default"
                  >
                    [ {skill} ]
                  </span>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-primary flex gap-4">
                <Link
                  href="/contact"
                  className="bg-primary text-on-primary border border-primary px-6 py-2 font-body-md text-body-md hover:bg-surface hover:text-primary hover:border-2 transition-all block"
                >
                  [ CONTACT ]
                </Link>
                <Link
                  href="/experience"
                  className="bg-surface text-primary border border-primary px-6 py-2 font-body-md text-body-md hover:bg-primary hover:text-on-primary transition-all block"
                >
                  [ JOURNEY ]
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar Mascot & Logs */}
          <div className="col-span-1 md:col-span-4 flex flex-col gap-6">
            {/* Mascot Image */}
            <div className="border border-primary bg-surface p-4 flex justify-center items-center aspect-square md:aspect-auto md:h-48 overflow-hidden">
              <img
                alt="8-bit style black cat mascot"
                className={`w-full h-full object-cover contrast-125 mix-blend-multiply dark:mix-blend-normal dark:invert ${
                  grayscale ? "grayscale" : ""
                }`}
                src="/assets/01_cat.png"
              />
            </div>
            
            {/* Terminal logs sequence */}
            <div className="border border-primary bg-surface font-code text-code p-4 flex flex-col h-64 overflow-y-auto">
              <div className="border-b border-primary pb-2 mb-2 flex justify-between items-center text-secondary font-label-sm text-label-sm">
                <span>sys_log.txt</span>
                <span className="material-symbols-outlined text-sm">terminal</span>
              </div>
              <ul className="space-y-2 text-primary opacity-80">
                {logs.map((log, index) => (
                  <li key={index} className="transition-all duration-150">
                    {log}
                  </li>
                ))}
                {logs.length < 5 && (
                  <li>
                    &gt; <span className="inline-block w-2.5 h-4 bg-primary align-middle cursor-blink"></span>
                  </li>
                )}
              </ul>
            </div>
          </div>

        </section>
      </main>
      <Footer />
    </PortfolioGate>
  );
}
