"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGate from "@/components/PortfolioGate";
import { mockProjects, Project } from "@/data/mockData";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  useEffect(() => {
    const stored = localStorage.getItem("aaronnofrail_projects");
    if (stored) {
      try {
        setProjects(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  return (
    <PortfolioGate>
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-12 md:py-24 z-10 relative">
        {/* Header */}
        <header className="mb-16">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-4 flex items-center">
            <span className="text-secondary mr-4">&gt;</span>
            ls -la /PROJECTS
            <span className="terminal-caret ml-2"></span>
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Total {projects.length} directories. Displaying current active developments and archived experiments. System architecture relies heavily on raw performance and minimal dependencies.
          </p>
        </header>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <article
              key={project.id}
              className="border border-primary bg-surface p-6 flex flex-col h-full hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-200 group relative z-20"
            >
              <div className="mb-4 border border-primary aspect-video overflow-hidden bg-primary-container">
                <img
                  src={project.image}
                  alt={`${project.title} Architecture`}
                  className="w-full h-full object-cover block opacity-80 group-hover:opacity-100 transition-opacity grayscale"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/assets/01_cat.png";
                  }}
                />
              </div>
              
              <div className="border-b border-primary pb-4 mb-4 flex justify-between items-start">
                <div>
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mb-1 block">
                    {project.status}
                  </span>
                  <h2 className="font-headline-md text-headline-md text-primary font-bold">
                    {project.title}
                  </h2>
                </div>
                <a
                  className="text-primary hover:bg-primary hover:text-on-primary p-1 border border-transparent hover:border-primary transition-colors flex items-center justify-center"
                  href={project.demoUrl}
                >
                  <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                </a>
              </div>
              
              <p className="font-body-md text-body-md text-on-surface mb-6 flex-grow">
                {project.description}
              </p>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-primary">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-label-sm text-label-sm border border-primary px-2 py-1 uppercase bg-surface-container-highest"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </PortfolioGate>
  );
}
