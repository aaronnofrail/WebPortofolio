"use client";

import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [logs, setLogs] = useState<Array<{ time: string; text: string; type?: string; opacity: number }>>([]);

  useEffect(() => {
    const defaultLogs = [
      { time: "2023-10-24 09:12:04", text: "SYS_INIT: Starting kernel modules... SUCCESS", opacity: 0.5 },
      { time: "2023-10-24 10:45:22", text: "UPDATE: Project 'NeuroInterface' pushed to v2.1.0", type: "info", opacity: 1 },
      { time: "2023-10-24 11:20:15", text: "INBOUND: Message received from client_004@proton.me", opacity: 1 },
      { time: "2023-10-24 12:00:59", text: "ALERT: Authentication attempt failed (IP: 192.168.1.104)", type: "error", opacity: 1 },
      { time: "2023-10-24 13:15:33", text: "LOG: Cache cleared successfully (245.2 MB)", opacity: 1 },
      { time: "2023-10-24 14:40:11", text: "INFO: Portfolio assets sync completed with Cloud_Main", type: "info", opacity: 1 },
      { time: "2023-10-24 15:00:00", text: "-- STANDBY MODE ENGAGED --", opacity: 0.4 }
    ];

    setLogs(defaultLogs);
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="font-headline-lg text-headline-lg font-bold">DASHBOARD OVERVIEW</h2>
        <div className="h-1 bg-primary w-24"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-surface border border-primary p-6 flex flex-col justify-between hover:translate-x-1 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-8">
            <span className="font-code text-label-sm tracking-widest text-secondary uppercase">Total Projects</span>
            <span className="material-symbols-outlined">folder_open</span>
          </div>
          <div>
            <span className="font-headline-lg text-headline-lg leading-none font-bold">12</span>
            <span className="font-code text-label-sm block mt-2 text-secondary">&gt; Active Repositories</span>
          </div>
        </div>
        
        {/* Card 2 */}
        <div className="bg-surface border border-primary p-6 flex flex-col justify-between hover:translate-x-1 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-8">
            <span className="font-code text-label-sm tracking-widest text-secondary uppercase">Unread Messages</span>
            <span className="material-symbols-outlined text-error">inbox</span>
          </div>
          <div>
            <span className="font-headline-lg text-headline-lg text-error leading-none font-bold">5</span>
            <span className="font-code text-label-sm block mt-2 text-secondary">&gt; Urgent Responses Required</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-surface border border-primary p-6 flex flex-col justify-between hover:translate-x-1 hover:-translate-y-1 transition-transform">
          <div className="flex justify-between items-start mb-8">
            <span className="font-code text-label-sm tracking-widest text-secondary uppercase">Total Views</span>
            <span className="material-symbols-outlined">visibility</span>
          </div>
          <div>
            <span className="font-headline-lg text-headline-lg leading-none font-bold">1.2k</span>
            <span className="font-code text-label-sm block mt-2 text-secondary">&gt; Last 30 Cycles</span>
          </div>
        </div>
      </div>

      {/* System Activity Log Section */}
      <div className="bg-surface border border-primary">
        <div className="border-b border-primary p-4 flex justify-between items-center bg-surface-container">
          <h3 className="font-code font-bold uppercase tracking-widest">System Activity Log</h3>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <div className="w-3 h-3 bg-outline rounded-full"></div>
            <div className="w-3 h-3 bg-outline-variant rounded-full"></div>
          </div>
        </div>
        
        <div className="p-6 font-code text-body-md overflow-x-auto">
          <div className="space-y-3">
            {logs.map((log, index) => {
              let logColorClass = "text-primary";
              if (log.type === "error") logColorClass = "text-error font-bold";
              if (log.type === "info") logColorClass = "text-primary font-bold";

              return (
                <div
                  key={index}
                  className="flex gap-4"
                  style={{ opacity: log.opacity }}
                >
                  <span className="text-secondary shrink-0">[{log.time}]</span>
                  <span className={logColorClass}>{log.text}</span>
                </div>
              );
            })}
            
            <div className="pt-4 flex items-center">
              <span className="text-primary font-bold mr-2">ROOT@PORTFOLIO_OS:~$</span>
              <span className="terminal-caret"></span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions & Image Accent */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h4 className="font-headline-md text-headline-md underline underline-offset-8">QUICK_ACTIONS</h4>
          <div className="space-y-4">
            <button className="w-full text-left p-4 border border-primary flex justify-between items-center group hover:bg-primary hover:text-on-primary transition-all font-code cursor-pointer">
              <span>+ NEW_PROJECT_ENTRY</span>
              <span className="material-symbols-outlined transform group-hover:translate-x-2 transition-transform">
                arrow_forward_ios
              </span>
            </button>
            <button className="w-full text-left p-4 border border-primary flex justify-between items-center group hover:bg-primary hover:text-on-primary transition-all font-code cursor-pointer">
              <span>GENERATE_TRAFFIC_REPORT</span>
              <span className="material-symbols-outlined transform group-hover:translate-x-2 transition-transform">
                analytics
              </span>
            </button>
            <button className="w-full text-left p-4 border border-primary flex justify-between items-center group hover:bg-primary hover:text-on-primary transition-all font-code cursor-pointer">
              <span>MANAGE_ENCRYPTION_KEYS</span>
              <span className="material-symbols-outlined transform group-hover:translate-x-2 transition-transform">
                vpn_key
              </span>
            </button>
          </div>
        </div>

        <div className="relative min-h-[250px] border border-primary overflow-hidden grayscale">
          <img
            alt="Brutalist architectural visual"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            src="/assets/admin_brutalist_arch.jpg"
          />
          <div className="absolute inset-0 bg-primary/10"></div>
          <div className="absolute bottom-4 left-4 right-4 bg-surface/90 border border-primary p-4">
            <p className="font-code text-label-sm text-primary font-bold">SYSTEM_RELIABILITY_SCORE: 99.98%</p>
            <p className="font-code text-[10px] text-secondary mt-1">OPERATING_ON_PAPER_THIN_VIRTUAL_NODES</p>
          </div>
        </div>
      </div>
    </div>
  );
}
