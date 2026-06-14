"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGate from "@/components/PortfolioGate";
import { mockExperiences, mockAchievements, Experience, Achievement } from "@/data/mockData";

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>(mockExperiences);
  const [achievements, setAchievements] = useState<Achievement[]>(mockAchievements);

  useEffect(() => {
    const storedExp = localStorage.getItem("aaronnofrail_experiences");
    if (storedExp) {
      try {
        setExperiences(JSON.parse(storedExp));
      } catch (e) {}
    }

    const storedAch = localStorage.getItem("aaronnofrail_achievements");
    if (storedAch) {
      try {
        setAchievements(JSON.parse(storedAch));
      } catch (e) {}
    }
  }, []);

  const isIcon = (val: string) => {
    return !val.startsWith("http") && !val.startsWith("/") && !val.includes(".");
  };

  return (
    <PortfolioGate>
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-12 md:py-24 z-10 relative">
        
        {/* Experience Header */}
        <div className="mb-16 border-b border-primary pb-8">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary flex items-center gap-2">
            <span className="text-secondary">&gt;</span> history | grep "experience" <span className="terminal-caret"></span>
          </h1>
        </div>

        {/* Timeline Section */}
        <div className="space-y-12">
          {experiences.map((exp, index) => {
            const isLast = index === experiences.length - 1;
            return (
              <div key={exp.id} className="relative pl-8 group">
                {/* Vertical Timeline line */}
                {!isLast && (
                  <div className="absolute left-[7px] top-[24px] bottom-[-48px] w-[1px] bg-primary"></div>
                )}
                {/* Bullet node */}
                <div className="absolute left-0 top-1 w-4 h-4 border border-primary bg-background flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary"></div>
                </div>

                <div className="border border-primary bg-background p-6 hover:-translate-y-1 transition-transform duration-200">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 border-b border-surface-dim pb-4 gap-2">
                    <div>
                      <h2 className="font-headline-md text-headline-md text-primary font-bold">{exp.jobTitle}</h2>
                      <p className="font-code text-code text-secondary mt-1">@ {exp.company}</p>
                    </div>
                    <div className="font-code text-code text-primary bg-surface-container px-3 py-1 border border-primary self-start uppercase">
                      {exp.period}
                    </div>
                  </div>

                  <ul className="space-y-3 font-code text-code text-on-surface">
                    {exp.responsibilities.map((resp, rIndex) => (
                      <li key={rIndex} className="before:content-['>'] before:mr-2 before:text-primary">
                        {resp}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {exp.tags.map((tag) => (
                      <span key={tag} className="font-label-sm text-label-sm border border-primary px-2 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <a
            className="inline-block bg-primary text-on-primary border border-primary px-6 py-3 font-code text-code hover:bg-background hover:text-primary hover:border-2 transition-all cursor-pointer"
            href="#"
          >
            Download Full Resume .PDF
          </a>
        </div>

        {/* Achievements Section */}
        <section className="mb-24 mt-24">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary flex items-center gap-4 pb-8 border-b border-primary">
            <span className="text-secondary">&gt;</span> history | grep "achievements" <span className="terminal-caret"></span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mt-12">
            {achievements.map((ach) => {
              const hasIcon = isIcon(ach.image);

              return (
                <article
                  key={ach.id}
                  className="group border border-primary bg-background flex flex-col hover:-translate-y-1 transition-transform duration-200"
                >
                  <div className="aspect-square border-b border-primary overflow-hidden bg-surface-container-highest flex items-center justify-center p-4 relative">
                    {hasIcon ? (
                      <span
                        className="material-symbols-outlined text-7xl text-primary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {ach.image || "military_tech"}
                      </span>
                    ) : (
                      <img
                        alt={ach.title}
                        className="w-full h-full object-contain filter grayscale"
                        src={ach.image}
                      />
                    )}
                  </div>
                  
                  <div className="p-6 flex-grow flex flex-col">
                    <h3 className="font-headline-md text-headline-md text-primary font-bold mb-2">
                      {ach.title}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow">
                      {ach.description}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-2">
                      {ach.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-primary px-2 py-1 font-label-sm text-label-sm text-primary uppercase"
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
