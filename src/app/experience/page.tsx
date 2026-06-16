"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGate from "@/components/PortfolioGate";
import { mockExperiences, mockAchievements, Experience, Achievement } from "@/data/mockData";
import { translations } from "@/data/translations";

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[] | null>(null);
  const [achievements, setAchievements] = useState<Achievement[] | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    exp_1: true, // Expand the first one by default
  });

  useEffect(() => {
    const isSanityConfigured =
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "aaronnofrail_project";

    if (isSanityConfigured) {
      import("@/sanity/client").then(({ client }) => {
        // Fetch experiences
        client
          .fetch(`*[_type == "experience"]`)
          .then((fetched: any[]) => {
            if (fetched && fetched.length > 0) {
              const mapped = fetched.map((item) => ({
                id: item._id,
                jobTitle: item.jobTitle,
                company: item.company,
                period: item.period,
                responsibilities: item.responsibilities || [],
                tags: item.tags || [],
                status: item.status || "",
              }));
              setExperiences(mapped);
            } else {
              loadExperiencesFromLocalStorage();
            }
          })
          .catch((err) => {
            console.error("Failed to fetch experiences from Sanity, using localStorage fallback:", err);
            loadExperiencesFromLocalStorage();
          });

        // Fetch achievements
        client
          .fetch(`*[_type == "achievement"]`)
          .then((fetched: any[]) => {
            if (fetched && fetched.length > 0) {
              const mapped = fetched.map((item) => ({
                id: item._id,
                title: item.title,
                description: item.description,
                image: item.imageAssetPath || item.image || "",
                tags: item.tags || [],
                credentialUrl: item.credentialUrl || "",
              }));
              setAchievements(mapped);
            } else {
              loadAchievementsFromLocalStorage();
            }
          })
          .catch((err) => {
            console.error("Failed to fetch achievements from Sanity, using localStorage fallback:", err);
            loadAchievementsFromLocalStorage();
          });
      });
    } else {
      loadExperiencesFromLocalStorage();
      loadAchievementsFromLocalStorage();
    }

    function loadExperiencesFromLocalStorage() {
      const storedExp = localStorage.getItem("aaronnofrail_experiences");
      if (storedExp) {
        try {
          setExperiences(JSON.parse(storedExp));
        } catch (e) {}
      }
    }

    function loadAchievementsFromLocalStorage() {
      const storedAch = localStorage.getItem("aaronnofrail_achievements");
      if (storedAch) {
        try {
          setAchievements(JSON.parse(storedAch));
        } catch (e) {}
      }
    }
  }, []);

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const t = translations.en;

  if (experiences === null || achievements === null) {
    return (
      <PortfolioGate>
        <Navbar />
        <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-24 md:py-32 font-mono flex items-center justify-center min-h-[50vh] bg-white dark:bg-black text-black dark:text-white">
          <div className="text-xl font-bold animate-pulse">&gt; LOADING_TIMELINE_LOGS...</div>
        </main>
        <Footer />
      </PortfolioGate>
    );
  }

  const isIcon = (val: string) => {
    if (!val) return true;
    return !val.startsWith("http") && !val.startsWith("/") && !val.startsWith("data:") && !val.includes(".");
  };

  return (
    <PortfolioGate>
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-24 md:py-32 font-mono transition-colors duration-300 bg-white dark:bg-black text-black dark:text-white relative">
        
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

        {/* Timeline Header */}
        <div className="mb-16 md:mb-24 text-center relative z-10">
          <h2 className="text-4xl md:text-8xl font-black uppercase tracking-tighter mb-4 relative inline-block">
            {t.experience.title}
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-lg max-w-xl mx-auto font-medium">
            {t.experience.subtitle}
          </p>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mt-6 animate-pulse">
            [ {t.experience.clickFolder} ]
          </span>
        </div>

        {/* Timeline Timeline section */}
        <div className="relative w-full flex flex-col gap-16 md:gap-24 mb-24 z-10">
          
          {/* Vertical dividing line */}
          <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-neutral-200 dark:bg-neutral-800 transform md:-translate-x-1/2 rounded-full"></div>

          {experiences.map((exp, index) => {
            const isExpanded = !!expandedFolders[exp.id];
            const yearMatch = exp.period.match(/\b(19\d\d|20\d\d)\b/);
            const year = yearMatch ? yearMatch[1] : "2020";
            const isLeft = index % 2 === 0;

            const tRole = {
              jobTitle: exp.jobTitle,
              company: exp.company,
              period: exp.period,
              status: exp.status || "ARCHIVED",
            };

            return (
              <div
                key={exp.id}
                className={`flex flex-col relative w-full items-start md:items-stretch ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Bullet Node */}
                <div className="absolute left-[18px] md:left-1/2 top-10 w-3 h-3 rounded-full bg-black dark:bg-white border-2 border-white dark:border-black transform md:-translate-x-1/2 z-20"></div>

                {/* Folder Content Wrapper */}
                <div
                  className={`w-full md:w-[46%] pl-10 md:pl-0 ${
                    isLeft ? "md:text-left" : "md:text-left"
                  }`}
                >
                  {/* Folder Tab Header */}
                  <div
                    onClick={() => toggleFolder(exp.id)}
                    className={`inline-block border-2 border-black dark:border-neutral-700 border-b-0 bg-neutral-100 dark:bg-neutral-800 rounded-t-xl px-4 py-1.5 font-bold text-xs uppercase cursor-pointer select-none transition-all shadow-[2px_0px_0px_0px_var(--shadow-color)] ${
                      isExpanded ? "translate-y-[2px] text-black dark:text-white" : "text-neutral-500"
                    }`}
                  >
                    📁 {year}
                  </div>

                  {/* Folder Body Card */}
                  <div
                    onClick={() => toggleFolder(exp.id)}
                    className={`border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-b-[2rem] rounded-tr-[2rem] p-6 shadow-neo cursor-pointer transition-all duration-300 relative ${
                      isExpanded ? "border-t-2" : "rounded-tr-[2rem]"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-3">
                      <div>
                        <h3 className="font-black text-xl uppercase tracking-tight text-black dark:text-white">
                          {tRole.jobTitle}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          @ {tRole.company}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="text-[9px] font-bold px-2 py-0.5 bg-black text-white dark:bg-white dark:text-black rounded-full uppercase">
                          {tRole.status}
                        </span>
                        <span className="text-[9px] font-semibold text-neutral-400">
                          {tRole.period}
                        </span>
                      </div>
                    </div>

                    {/* Expandable Inner Content */}
                    {isExpanded && (
                      <div className="space-y-4 animate-fade-in">
                        <ul className="space-y-2.5 text-xs md:text-sm text-neutral-600 dark:text-neutral-400">
                          {exp.responsibilities.map((resp, rIdx) => (
                            <li
                              key={rIdx}
                              className="before:content-['>'] before:mr-2 before:text-black dark:before:text-white before:font-bold"
                            >
                              {resp}
                            </li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                          {exp.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] font-bold px-2 py-0.5 border border-black dark:border-neutral-600 rounded bg-white dark:bg-neutral-800 uppercase"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Folder Closed Indicator */}
                    {!isExpanded && (
                      <div className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest text-center py-2">
                        [ Click to expand ]
                      </div>
                    )}

                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Download Resume Bar */}
        <div className="mt-16 text-center relative z-10">
          <a
            className="inline-block bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-transparent px-8 py-3.5 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-white hover:text-black dark:hover:bg-neutral-100 dark:hover:text-black hover:border-black transition-all shadow-neo cursor-pointer"
            href="#"
          >
            {t.experience.downloadPdf}
          </a>
        </div>

        {/* Achievements Section */}
        <section className="mt-28 relative z-10">
          <div className="mb-12 border-b-2 border-black dark:border-neutral-800 pb-6">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              Achievements
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((ach) => {
              const hasIcon = isIcon(ach.image);

              return (
                <article
                  key={ach.id}
                  className="group border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-[2rem] flex flex-col hover:shadow-neo transition-all duration-300 overflow-hidden"
                >
                  {/* Banner image or icon wrapper */}
                  <div className="aspect-square border-b-2 border-black dark:border-neutral-700 overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center p-6 relative">
                    {ach.credentialUrl ? (
                      <a
                        href={ach.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full h-full flex items-center justify-center cursor-pointer"
                        title="View Credential"
                      >
                        {hasIcon ? (
                          <span
                            className="material-symbols-outlined text-6xl text-black dark:text-white"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            {ach.image || "military_tech"}
                          </span>
                        ) : (
                          <img
                            alt={ach.title}
                            className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                            src={ach.image}
                          />
                        )}
                      </a>
                    ) : (
                      hasIcon ? (
                        <span
                          className="material-symbols-outlined text-6xl text-black dark:text-white"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {ach.image || "military_tech"}
                        </span>
                      ) : (
                        <img
                          alt={ach.title}
                          className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                          src={ach.image}
                        />
                      )
                    )}
                  </div>
                  
                  {/* Details */}
                  <div className="p-6 flex-grow flex flex-col justify-between gap-4">
                    <div>
                      <h3 className="font-black text-lg uppercase tracking-tight text-black dark:text-white mb-2 leading-tight">
                        {ach.title}
                      </h3>
                      <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed">
                        {ach.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      {ach.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-bold px-2 py-0.5 border border-black dark:border-neutral-600 rounded bg-white dark:bg-neutral-800 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

      </main>
      <Footer />
    </PortfolioGate>
  );
}
