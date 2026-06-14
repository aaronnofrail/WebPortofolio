"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGate from "@/components/PortfolioGate";
import { mockBio, Bio } from "@/data/mockData";

export default function AboutPage() {
  const [bio, setBio] = useState<Bio>(mockBio);

  useEffect(() => {
    const stored = localStorage.getItem("aaronnofrail_bio");
    if (stored) {
      try {
        setBio(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  const frontendStack = [
    { permissions: "-rwxr-xr-x", owner: "aaron", size: "4096", date: "Oct 12 09:41", name: "React.js" },
    { permissions: "-rw-r--r--", owner: "aaron", size: "2048", date: "Nov 15 10:30", name: "TypeScript" },
    { permissions: "-rwxr-xr-x", owner: "aaron", size: "1024", date: "Dec 01 11:15", name: "TailwindCSS" },
  ];

  const backendStack = [
    { permissions: "-rwxr-xr-x", owner: "aaron", size: "4096", date: "Oct 20 13:22", name: "Go (Golang)" },
    { permissions: "-rw-r--r--", owner: "aaron", size: "2048", date: "Nov 03 14:22", name: "Node.js" },
    { permissions: "drwxr-xr-x", owner: "root", size: "8192", date: "Sep 28 16:04", name: "PostgreSQL" },
    { permissions: "-rw-r--r--", owner: "root", size: "4096", date: "Dec 10 08:50", name: "Redis" },
  ];

  return (
    <PortfolioGate>
      <Navbar />
      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-12 md:py-24 space-y-16 z-10 relative">
        {/* Header */}
        <header>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary flex items-center">
            &gt; whoami<span className="terminal-caret ml-2"></span>
          </h1>
        </header>

        {/* Philosophy Block */}
        <section className="border border-primary bg-surface p-6 md:p-8">
          <div className="border-b border-primary pb-4 mb-6 flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md text-primary">philosophy.txt</h2>
            <span className="font-label-sm text-label-sm text-secondary uppercase">READ-ONLY</span>
          </div>
          <div className="font-body-lg text-body-lg text-on-surface space-y-6">
            {bio.philosophy.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="space-y-12">
          {/* Frontend stack */}
          <div>
            <h2 className="font-headline-md text-headline-md text-primary mb-6 flex items-center">
              &gt; ls -l ./tech_stack/frontend
            </h2>
            <div className="border border-primary bg-surface overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-primary font-code text-code text-secondary">
                    <th className="p-4 font-normal">Permissions</th>
                    <th className="p-4 font-normal">Owner</th>
                    <th className="p-4 font-normal">Size</th>
                    <th className="p-4 font-normal">Date Modified</th>
                    <th className="p-4 font-normal">Name</th>
                  </tr>
                </thead>
                <tbody className="font-code text-code text-on-surface">
                  {frontendStack.map((tech) => (
                    <tr
                      key={tech.name}
                      className="border-b border-surface-dim hover:bg-surface-variant transition-colors last:border-b-0"
                    >
                      <td className="p-4">{tech.permissions}</td>
                      <td className="p-4">{tech.owner}</td>
                      <td className="p-4">{tech.size}</td>
                      <td className="p-4">{tech.date}</td>
                      <td className="p-4 text-primary font-medium">{tech.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Backend stack */}
          <div>
            <h2 className="font-headline-md text-headline-md text-primary mb-6 flex items-center">
              &gt; ls -l ./tech_stack/backend
            </h2>
            <div className="border border-primary bg-surface overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-primary font-code text-code text-secondary">
                    <th className="p-4 font-normal">Permissions</th>
                    <th className="p-4 font-normal">Owner</th>
                    <th className="p-4 font-normal">Size</th>
                    <th className="p-4 font-normal">Date Modified</th>
                    <th className="p-4 font-normal">Name</th>
                  </tr>
                </thead>
                <tbody className="font-code text-code text-on-surface">
                  {backendStack.map((tech) => (
                    <tr
                      key={tech.name}
                      className="border-b border-surface-dim hover:bg-surface-variant transition-colors last:border-b-0"
                    >
                      <td className="p-4">{tech.permissions}</td>
                      <td className="p-4">{tech.owner}</td>
                      <td className="p-4">{tech.size}</td>
                      <td className="p-4">{tech.date}</td>
                      <td className="p-4 text-primary font-medium">{tech.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PortfolioGate>
  );
}
