"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGate from "@/components/PortfolioGate";
import { translations } from "@/data/translations";

export default function AboutPage() {
  const t = translations.en;
  const [bioDescription, setBioDescription] = useState<string | null>(null);

  useEffect(() => {
    const isSanityConfigured =
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "aaronnofrail_project";

    if (isSanityConfigured) {
      import("@/sanity/client").then(({ client }) => {
        client
          .fetch(`*[_type == "bio"][0]`)
          .then((fetched: any) => {
            if (fetched && fetched.description) {
              setBioDescription(fetched.description);
            } else {
              loadFromLocalStorage();
            }
          })
          .catch((err) => {
            console.error("Failed to fetch bio from Sanity, using localStorage fallback:", err);
            loadFromLocalStorage();
          });
      });
    } else {
      loadFromLocalStorage();
    }

    function loadFromLocalStorage() {
      const storedBio = localStorage.getItem("aaronnofrail_bio");
      if (storedBio) {
        try {
          const parsed = JSON.parse(storedBio);
          if (parsed.description) {
            setBioDescription(parsed.description);
            return;
          }
        } catch (e) {}
      }
      setBioDescription(t.about.bio);
    }
  }, []);

  if (bioDescription === null) {
    return (
      <PortfolioGate>
        <Navbar />
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-24 md:py-32 font-mono flex items-center justify-center min-h-[50vh] bg-white dark:bg-black text-black dark:text-white">
          <div className="text-xl font-bold animate-pulse">&gt; Loading Biography...</div>
        </main>
        <Footer />
      </PortfolioGate>
    );
  }

  const coreLanguages = ["HTML5", "CSS3", "JavaScript", "TypeScript", "Go (Golang)", "Python", "Rust", "SQL"];
  const frameworksUI = ["React.js", "Next.js", "TailwindCSS", "Node.js", "Express.js", "gRPC"];
  const toolsEcosystem = ["Git", "GitHub", "Figma", "Burp Suite", "Wireshark", "Aperisolve", "IDA Pro", "Ghidra", "Docker", "Linux"];

  return (
    <PortfolioGate>
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-24 md:py-32 font-mono transition-colors duration-300 bg-white dark:bg-black text-black dark:text-white">
        
        {/* Header */}
        <header className="mb-12 md:mb-16">
          <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-center md:text-left">
            {t.about.title}
          </h2>
        </header>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
          
          {/* Card 1: 👋 Intro Card */}
          <div className="relative border-2 border-black dark:border-neutral-700 rounded-[2rem] p-6 flex flex-col justify-between hover:shadow-neo transition-all duration-300 overflow-hidden md:col-span-2 bg-white dark:bg-neutral-900 min-h-[280px] md:min-h-[300px]">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold leading-tight uppercase">
                {t.about.greeting}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {bioDescription || t.about.bio}
              </p>
            </div>
            
            <div className="pt-6">
              <a
                href="#"
                className="group relative inline-flex items-center gap-2 px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-[0.2em] rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-neo-btn"
              >
                <span className="material-symbols-outlined relative z-10 text-[14px]">download</span>
                <span className="relative z-10">{t.about.resumeBtn}</span>
              </a>
            </div>
          </div>

          {/* Card 2: Interactive Lanyard Card */}
          <div className="relative border-2 border-black dark:border-neutral-700 rounded-[2rem] p-6 flex flex-col justify-between hover:shadow-neo transition-all duration-300 overflow-hidden md:col-span-1 bg-neutral-100 dark:bg-neutral-800 min-h-[300px]">
            <div className="flex flex-col items-center justify-center text-center h-full gap-4 py-4">
              <div className="w-24 h-24 rounded-full border-2 border-black dark:border-neutral-500 overflow-hidden bg-white p-1">
                <img
                  alt="Avatar Mascot"
                  className="w-full h-full object-cover transform scale-110 origin-center"
                  src="/assets/profile.jpeg"
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-lg">@aaronnofrail</h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-widest flex items-center justify-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-ping"></span>
                  ONLINE
                </p>
              </div>
              <Link
                href="/contact"
                className="px-4 py-2 border border-black dark:border-neutral-600 rounded-full bg-white dark:bg-neutral-900 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors shadow-neo-btn"
              >
                hire me
              </Link>
            </div>
          </div>

          {/* Card 3: Graduation Card */}
          <div className="relative border-2 border-black dark:border-neutral-700 rounded-[2rem] p-6 flex flex-col justify-between hover:shadow-neo transition-all duration-300 bg-neutral-100 dark:bg-neutral-800 md:col-span-1 min-h-[250px]">
            <div className="flex flex-col h-full justify-between gap-4">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white dark:bg-neutral-900 border border-black dark:border-neutral-600 rounded-full">
                  <span className="material-symbols-outlined text-black dark:text-white block text-[24px]">school</span>
                </div>
                <span className="text-[9px] font-bold border border-black px-2 py-1 rounded-full bg-black text-white uppercase tracking-wider">
                  {t.about.graduated}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h5 className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase flex items-center gap-1 mb-1">
                    {t.about.school}
                  </h5>
                  <h4 className="font-bold text-md uppercase leading-tight">
                    {t.about.major}
                  </h4>
                </div>
                
                <div className="space-y-1">
                  <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                    {t.about.coursework}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {t.about.courses.map((course) => (
                      <span
                        key={course}
                        className="px-2 py-1 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded text-[9px] font-semibold text-neutral-600 dark:text-neutral-300"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-300 dark:border-neutral-600">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black">3.81</span>
                  <div className="flex flex-col justify-end pb-1">
                    <span className="text-[9px] font-bold uppercase text-blue-800 dark:text-blue-400 leading-tight">
                      {t.about.gpaStatus}
                    </span>
                    <span className="text-[9px] font-semibold text-neutral-500 dark:text-neutral-400">
                      / 4.00 {t.about.gpaLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Tech Stack Card */}
          <div className="relative border-2 border-black dark:border-neutral-700 rounded-[2rem] p-6 flex flex-col justify-between hover:shadow-neo transition-all duration-300 md:col-span-2 bg-white dark:bg-neutral-900 min-h-[300px]">
            <div className="flex items-center gap-3 mb-6 border-b-2 border-black/10 dark:border-white/10 pb-4">
              <div className="p-2 bg-black text-white dark:bg-white dark:text-black rounded-lg">
                <span className="material-symbols-outlined block text-[20px]">terminal</span>
              </div>
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                {t.about.techTitle}
              </h3>
            </div>
            
            <div className="flex flex-col gap-5">
              <div>
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
                  {t.about.techSubLanguages}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {coreLanguages.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-bold px-3 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
                  {t.about.techSubFrameworks}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {frameworksUI.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-bold px-3 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-2">
                  {t.about.techSubTools}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {toolsEcosystem.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-bold px-3 py-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Workflow Philosophy Card */}
          <div className="relative border-2 border-black dark:border-neutral-700 rounded-[2rem] p-6 flex flex-col justify-between hover:shadow-neo transition-all duration-300 md:col-span-3 bg-neutral-100 dark:bg-neutral-900 relative min-h-[220px]">
            <div className="absolute top-2 right-6 text-[8rem] font-serif text-black/5 dark:text-white/5 pointer-events-none select-none">
              &quot;
            </div>
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-stretch h-full relative z-10">
              <div className="flex-shrink-0 flex flex-col items-center justify-center w-full md:w-1/3 text-center md:text-left md:items-start border-b-2 md:border-b-0 md:border-r-2 border-black/10 dark:border-white/10 pb-6 md:pb-0 md:pr-10">
                <div className="p-3 bg-black text-white dark:bg-white dark:text-black rounded-full mb-3 shadow-neo">
                  <span className="material-symbols-outlined block text-[24px]">developer_board</span>
                </div>
                <h3 className="text-lg md:text-xl font-black uppercase leading-tight tracking-tight">
                  {t.about.philosophyTitle}
                </h3>
              </div>
              <div className="flex-grow flex flex-col justify-center w-full">
                <p className="text-xs md:text-sm text-neutral-800 dark:text-neutral-300 leading-relaxed text-center md:text-left">
                  {t.about.philosophyText}
                </p>
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                  <span className="text-[8px] font-black px-3 py-1 bg-black text-white rounded-full uppercase tracking-widest">
                    SYSTEM SECURITY
                  </span>
                  <span className="text-[8px] font-black px-3 py-1 bg-white dark:bg-transparent border border-black dark:border-white text-black dark:text-white rounded-full uppercase tracking-widest">
                    AI-DRIVEN DEV
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 6: My Focus Card */}
          <div className="relative border-2 border-black dark:border-neutral-700 rounded-[2rem] p-6 flex flex-col justify-between hover:shadow-neo transition-all duration-300 md:col-span-3 bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-900 dark:hover:bg-neutral-100 min-h-[160px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center w-full h-full">
              <div>
                <h3 className="text-xl md:text-2xl font-black uppercase mb-1">{t.about.focusTitle}</h3>
                <p className="text-neutral-400 dark:text-neutral-500 text-xs leading-relaxed">
                  Combining System Architecture with robust cybersecurity protocols to design lightweight and resilient systems.
                </p>
              </div>
              
              <div className="flex gap-3 justify-start md:justify-end flex-wrap">
                <div className="flex items-center gap-2 px-4 py-2.5 border border-neutral-800 dark:border-neutral-200 rounded-xl bg-neutral-900 dark:bg-neutral-100 hover:border-white dark:hover:border-black transition-colors duration-300 group">
                  <span className="material-symbols-outlined text-[18px] text-neutral-400 dark:text-neutral-600 block">dns</span>
                  <span className="font-bold text-xs tracking-wide">{t.about.focusBackend}</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 border border-neutral-800 dark:border-neutral-200 rounded-xl bg-neutral-900 dark:bg-neutral-100 hover:border-white dark:hover:border-black transition-colors duration-300 group">
                  <span className="material-symbols-outlined text-[18px] text-neutral-400 dark:text-neutral-600 block">security</span>
                  <span className="font-bold text-xs tracking-wide">{t.about.focusSec}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </PortfolioGate>
  );
}
