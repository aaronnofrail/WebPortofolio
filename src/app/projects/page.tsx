"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGate from "@/components/PortfolioGate";
import { mockProjects, Project } from "@/data/mockData";
import { translations } from "@/data/translations";

interface CaseStudy {
  problem: string;
  solution: string;
  result: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeCaseStudyProject, setActiveCaseStudyProject] = useState<Project | null>(null);

  useEffect(() => {
    // Read custom projects if available in localStorage
    const stored = localStorage.getItem("aaronnofrail_projects");
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  // Escape key handler to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveCaseStudyProject(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const t = translations.en;

  // Categories mapping
  const getProjectCategory = (project: Project): string => {
    const tags = project.tags.map((t) => t.toLowerCase());
    if (tags.includes("rust") || tags.includes("go") || tags.includes("grpc")) return "Systems";
    if (tags.includes("react") || tags.includes("css") || tags.includes("npm") || tags.includes("typescript")) return "Web";
    if (tags.includes("solidity") || tags.includes("cryptography")) return "Cryptography";
    if (tags.includes("python") || tags.includes("bash") || tags.includes("cli")) return "CLI";
    return "Web";
  };

  const categories = [
    { key: "All", label: t.projects.filterAll },
    { key: "Web", label: t.projects.filterWeb },
  ];

  // Assign mock metric scores and case study content
  const projectDetails: Record<string, { metrics: { perf: string; sec: string; rel: string }; caseStudy: CaseStudy }> = {
    proj_1: {
      metrics: { perf: ">98%", sec: "95%", rel: "99%" },
      caseStudy: {
        problem: "Legacy message brokers suffered from delivery overhead and message latency on high-throughput nodes.",
        solution: "Engineered a custom binary message broker in Rust over TCP using custom serialization. Implemented sub-millisecond delivery with Redis caching.",
        result: "Reduced server memory footprint by 65% and delivery latency by 85%."
      }
    },
    proj_2: {
      metrics: { perf: "100%", sec: "90%", rel: "92%" },
      caseStudy: {
        problem: "Modern UI libraries import bulky stylesheets and JavaScript runtime, causing slow first contentful paint (FCP).",
        solution: "Designed a keyboard-first CSS-in-JS brutalist UI library using pure CSS variables and zero-runtime styles.",
        result: "Achieved 100/100 Lighthouse performance score with 0KB JS runtime overhead."
      }
    },
    proj_3: {
      metrics: { perf: "85%", sec: "99%", rel: "95%" },
      caseStudy: {
        problem: "Online identity verification methods rely on centralized databases vulnerable to credential harvesting.",
        solution: "Implemented decentralized identity protocol on Ethereum using zero-knowledge snarks to verify claims offline.",
        result: "Completely secured user details while verifying authenticity in under 12 seconds."
      }
    },
    proj_4: {
      metrics: { perf: "94%", sec: "85%", rel: "90%" },
      caseStudy: {
        problem: "Visualizing heavy server directory tree hierarchies and file ownership takes too long over SSH terminals.",
        solution: "Built a Python command line interface tool utilizing binary tree traversal and custom ASCII table builders to visualize memory mapping.",
        result: "Reduced file indexing time by 90% using multithreading indexing queues."
      }
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (selectedCategory === "All") return true;
    return getProjectCategory(project) === selectedCategory;
  });

  return (
    <PortfolioGate>
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-24 md:py-32 font-mono transition-colors duration-300 bg-white dark:bg-black text-black dark:text-white relative">
        
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

        {/* Header */}
        <header className="mb-12 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
              {t.projects.title}
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm md:text-base max-w-xl mt-4">
              {t.projects.subtitle}
            </p>
          </div>
        </header>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap gap-2.5 mb-10 md:mb-12 border-b-2 border-black/10 dark:border-white/10 pb-6">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-5 py-2.5 text-xs font-bold uppercase tracking-widest rounded border-2 border-black dark:border-neutral-700 transition-all cursor-pointer shadow-neo-btn ${
                  isActive
                    ? "bg-black dark:bg-white text-white dark:text-black"
                    : "bg-white dark:bg-neutral-900 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 text-neutral-500">{t.projects.noProjects}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {filteredProjects.map((project) => {
              const details = projectDetails[project.id] || {
                metrics: { perf: "90%", sec: "90%", rel: "90%" },
                caseStudy: { problem: "", solution: "", result: "" }
              };

              return (
                <article
                  key={project.id}
                  className="group border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 rounded-[2rem] p-6 flex flex-col hover:shadow-neo-lg transition-all duration-300 relative"
                >
                  {/* Aspect Video Image Container */}
                  <div className="mb-6 border-2 border-black dark:border-neutral-700 aspect-video overflow-hidden rounded-xl bg-neutral-100 relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover block filter grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 opacity-90 group-hover:opacity-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/assets/01_cat.png";
                      }}
                    />
                  </div>

                  {/* Top tags and status info */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-bold px-2 py-0.5 border border-black dark:border-neutral-500 rounded bg-white dark:bg-neutral-800 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-[9px] font-bold px-2.5 py-1 bg-black text-white dark:bg-white dark:text-black rounded-full uppercase tracking-wider">
                      {project.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="border-b-2 border-black/10 dark:border-white/10 pb-4 mb-4">
                    <h3 className="text-2xl md:text-3xl font-black uppercase text-black dark:text-white leading-tight">
                      {project.title}
                    </h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed mt-2 h-[72px] overflow-hidden line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* 3-Column Metrics Panel */}
                  <div className="grid grid-cols-3 gap-3 border-l-2 border-black dark:border-neutral-500 pl-4 mb-6">
                    <div>
                      <p className="text-sm font-black text-black dark:text-white">{details.metrics.perf}</p>
                      <p className="text-[8px] text-neutral-400 uppercase tracking-widest">{t.projects.metrics.perf}</p>
                    </div>
                    <div>
                      <p className="text-sm font-black text-black dark:text-white">{details.metrics.sec}</p>
                      <p className="text-[8px] text-neutral-400 uppercase tracking-widest">{t.projects.metrics.sec}</p>
                    </div>
                    <div>
                      <p className="text-sm font-black text-black dark:text-white">{details.metrics.rel}</p>
                      <p className="text-[8px] text-neutral-400 uppercase tracking-widest">{t.projects.metrics.rel}</p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-4 mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800 justify-between items-center">
                    <button
                      onClick={() => setActiveCaseStudyProject(project)}
                      className="group/btn relative flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-black dark:text-white cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">article</span>
                      <span>{t.projects.readCase}</span>
                    </button>
                    
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center gap-1.5 shadow-neo-btn"
                    >
                      <span>{t.projects.visitSite}</span>
                      <span className="material-symbols-outlined text-[12px]">arrow_outward</span>
                    </a>
                  </div>

                </article>
              );
            })}
          </div>
        )}

        {/* Case Study Modal Sheet */}
        {activeCaseStudyProject && (() => {
          const details = projectDetails[activeCaseStudyProject.id] || {
            caseStudy: { problem: "", solution: "", result: "" }
          };

          return (
            <div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
              onClick={() => setActiveCaseStudyProject(null)} // Close on background click
            >
              <div
                className="w-full max-w-2xl bg-white dark:bg-neutral-900 border-4 border-black dark:border-neutral-600 rounded-[2rem] p-6 md:p-8 relative shadow-neo-lg max-h-[85vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()} // Stop bubbling
              >
                {/* Close Button */}
                <button
                  onClick={() => setActiveCaseStudyProject(null)}
                  className="absolute top-4 right-4 p-2 bg-neutral-100 dark:bg-neutral-800 rounded-full border border-black dark:border-neutral-500 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer flex items-center justify-center shadow-neo-btn"
                  title="Close Case Study"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>

                <header className="mb-6 pb-4 border-b-2 border-black/10 dark:border-white/10 pr-8">
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                    CASE STUDY
                  </span>
                  <h2 className="text-3xl font-black uppercase text-black dark:text-white mt-1 leading-tight">
                    {activeCaseStudyProject.title}
                  </h2>
                </header>

                <div className="space-y-6 text-sm leading-relaxed">
                  
                  {/* Problem block */}
                  <section className="space-y-2">
                    <h4 className="font-black text-xs uppercase tracking-wider text-red-500 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      PROBLEM
                    </h4>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      {details.caseStudy.problem}
                    </p>
                  </section>

                  {/* Solution block */}
                  <section className="space-y-2">
                    <h4 className="font-black text-xs uppercase tracking-wider text-green-500 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">psychology</span>
                      SOLUTION
                    </h4>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      {details.caseStudy.solution}
                    </p>
                  </section>

                  {/* Result block */}
                  <section className="space-y-2">
                    <h4 className="font-black text-xs uppercase tracking-wider text-blue-500 flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">task_alt</span>
                      RESULT & IMPACT
                    </h4>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      {details.caseStudy.result}
                    </p>
                  </section>
                </div>

                <div className="mt-8 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                  <button
                    onClick={() => setActiveCaseStudyProject(null)}
                    className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black font-black uppercase text-xs tracking-wider rounded-lg border border-black dark:border-transparent hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-neo-btn cursor-pointer"
                  >
                    [ CLOSE ]
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

      </main>
      <Footer />
    </PortfolioGate>
  );
}
