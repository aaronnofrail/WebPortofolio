"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getActivityLogs, addActivityLog } from "@/utils/activityLogger";
import { mockProjects } from "@/data/mockData";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<Array<{ time: string; text: string; type?: string; opacity: number }>>([]);
  const [stats, setStats] = useState({
    projects: 0,
    unreadMessages: 0,
    views: 1243,
  });

  const loadData = () => {
    // Get latest logs
    setLogs(getActivityLogs());

    // Calculate dynamic stats
    let projCount = mockProjects.length;
    const storedProjects = localStorage.getItem("aaronnofrail_projects");
    if (storedProjects) {
      try {
        projCount = JSON.parse(storedProjects).length;
      } catch (e) {}
    }

    let unread = 0;
    const storedInbox = localStorage.getItem("aaronnofrail_inbox");
    if (storedInbox) {
      try {
        const inbox = JSON.parse(storedInbox);
        unread = inbox.filter((m: any) => !m.read).length;
      } catch (e) {}
    }

    let viewsVal = 1243;
    const storedViews = localStorage.getItem("aaronnofrail_views");
    if (storedViews) {
      viewsVal = parseInt(storedViews, 10);
    } else {
      localStorage.setItem("aaronnofrail_views", "1243");
    }

    setStats({
      projects: projCount,
      unreadMessages: unread,
      views: viewsVal,
    });

    const isSanityConfigured =
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "aaronnofrail_project";

    if (isSanityConfigured) {
      import("@/sanity/client").then(({ client }) => {
        client
          .fetch(`*[_type == "views"][0]`)
          .then((fetched: any) => {
            if (fetched && typeof fetched.count === "number") {
              localStorage.setItem("aaronnofrail_views", String(fetched.count));
              setStats((prev) => ({
                ...prev,
                views: fetched.count,
              }));
            }
          })
          .catch((err) => {
            console.error("Failed to fetch views from Sanity:", err);
          });
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleNewProject = () => {
    router.push("/admin/projects");
  };

  const handleGenerateReport = () => {
    addActivityLog("REPORT: Traffic analysis triggered by user", "info");
    addActivityLog(`REPORT: Unique Visitors (24h) = ${Math.floor(stats.views * 0.4)} | Total Page Views = ${stats.views}`, "log");
    loadData();
  };

  const handleManageKeys = () => {
    addActivityLog("SEC_KEY: Rotating local SSH and Session keys...", "info");
    addActivityLog("SEC_KEY: Generated new 4096-bit RSA key pair - STATUS: SUCCESS", "log");
    loadData();
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="border-b-2 border-black dark:border-neutral-700 pb-4">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black dark:text-white">DASHBOARD OVERVIEW</h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 */}
        <div 
          onClick={() => router.push("/admin/projects")}
          className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-[2rem] p-6 flex flex-col justify-between hover:shadow-neo shadow-neo-btn transition-all cursor-pointer relative"
        >
          <div className="flex justify-between items-start mb-8">
            <span className="font-mono text-xs font-bold tracking-widest text-neutral-500 dark:text-neutral-400 uppercase">Total Projects</span>
            <span className="material-symbols-outlined text-black dark:text-white">folder_open</span>
          </div>
          <div>
            <span className="text-5xl font-black leading-none text-black dark:text-white">{stats.projects}</span>
            <span className="font-mono text-[10px] block mt-2 text-neutral-500 dark:text-neutral-400">&gt; Active Repositories</span>
          </div>
        </div>
        
        {/* Card 2 */}
        <div 
          onClick={() => router.push("/admin/inbox")}
          className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-[2rem] p-6 flex flex-col justify-between hover:shadow-neo shadow-neo-btn transition-all cursor-pointer relative"
        >
          <div className="flex justify-between items-start mb-8">
            <span className="font-mono text-xs font-bold tracking-widest text-neutral-500 dark:text-neutral-400 uppercase">Unread Messages</span>
            <span className="material-symbols-outlined text-red-500">inbox</span>
          </div>
          <div>
            <span className={`text-5xl font-black leading-none ${stats.unreadMessages > 0 ? "text-red-500 animate-pulse" : "text-black dark:text-white"}`}>{stats.unreadMessages}</span>
            <span className="font-mono text-[10px] block mt-2 text-neutral-500 dark:text-neutral-400">&gt; Urgent Responses Required</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-[2rem] p-6 flex flex-col justify-between hover:shadow-neo shadow-neo-btn transition-all relative">
          <div className="flex justify-between items-start mb-8">
            <span className="font-mono text-xs font-bold tracking-widest text-neutral-500 dark:text-neutral-400 uppercase">Total Views</span>
            <span className="material-symbols-outlined text-black dark:text-white">visibility</span>
          </div>
          <div>
            <span className="text-5xl font-black leading-none text-black dark:text-white">{stats.views}</span>
            <span className="font-mono text-[10px] block mt-2 text-neutral-500 dark:text-neutral-400">&gt; Last 30 Cycles</span>
          </div>
        </div>
      </div>

      {/* System Activity Log Section */}
      <div className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-[2rem] overflow-hidden shadow-neo">
        <div className="border-b-2 border-black dark:border-neutral-700 p-4 flex justify-between items-center bg-neutral-50 dark:bg-neutral-800">
          <h3 className="font-mono font-bold uppercase tracking-widest text-sm text-black dark:text-white">System Activity Log</h3>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
        
        <div className="p-6 font-mono text-xs overflow-x-auto text-black dark:text-white">
          <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
            {logs.map((log, index) => {
              let logColorClass = "text-black dark:text-white";
              if (log.type === "error") logColorClass = "text-red-500 font-bold";
              if (log.type === "info") logColorClass = "text-blue-500 font-bold";

              return (
                <div
                  key={index}
                  className="flex gap-4"
                  style={{ opacity: log.opacity }}
                >
                  <span className="text-neutral-400 shrink-0">[{log.time}]</span>
                  <span className={logColorClass}>{log.text}</span>
                </div>
              );
            })}
            
            <div className="pt-4 flex items-center">
              <span className="text-black dark:text-white font-bold mr-2">ROOT@PORTFOLIO_OS:~$</span>
              <span className="terminal-caret"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Image Accent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h4 className="text-2xl font-black uppercase text-black dark:text-white border-b-2 border-black dark:border-neutral-700 pb-2">QUICK_ACTIONS</h4>
          <div className="space-y-4">
            <button 
              onClick={handleNewProject}
              className="w-full text-left p-4 border-2 border-black dark:border-neutral-700 rounded-xl flex justify-between items-center group bg-white dark:bg-neutral-900 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-neo-btn font-mono text-sm cursor-pointer"
            >
              <span>+ NEW_PROJECT_ENTRY</span>
              <span className="material-symbols-outlined transform group-hover:translate-x-2 transition-transform">
                arrow_forward_ios
              </span>
            </button>
            <button 
              onClick={handleGenerateReport}
              className="w-full text-left p-4 border-2 border-black dark:border-neutral-700 rounded-xl flex justify-between items-center group bg-white dark:bg-neutral-900 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-neo-btn font-mono text-sm cursor-pointer"
            >
              <span>GENERATE_TRAFFIC_REPORT</span>
              <span className="material-symbols-outlined transform group-hover:translate-x-2 transition-transform">
                analytics
              </span>
            </button>
            <button 
              onClick={handleManageKeys}
              className="w-full text-left p-4 border-2 border-black dark:border-neutral-700 rounded-xl flex justify-between items-center group bg-white dark:bg-neutral-900 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-neo-btn font-mono text-sm cursor-pointer"
            >
              <span>MANAGE_ENCRYPTION_KEYS</span>
              <span className="material-symbols-outlined transform group-hover:translate-x-2 transition-transform">
                vpn_key
              </span>
            </button>
          </div>
        </div>

        <div className="relative min-h-[250px] border-2 border-black dark:border-neutral-700 rounded-[2rem] overflow-hidden grayscale shadow-neo">
          <img
            alt="Brutalist architectural visual"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            src="/assets/admin_brutalist_arch.jpg"
          />
          <div className="absolute inset-0 bg-primary/10"></div>
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-neutral-900/95 border-2 border-black dark:border-neutral-700 p-4 rounded-xl">
            <p className="font-mono text-xs text-black dark:text-white font-bold">SYSTEM_RELIABILITY_SCORE: 99.98%</p>
            <p className="font-mono text-[9px] text-neutral-500 dark:text-neutral-400 mt-1">OPERATING_ON_PAPER_THIN_VIRTUAL_NODES</p>
          </div>
        </div>
      </div>
    </div>
  );
}
