"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addActivityLog } from "@/utils/activityLogger";
import {
  saveBioAction,
  updateExperienceAction,
  updateAchievementAction,
  updateProjectAction,
  updateFAQAction,
} from "@/app/actions/sanityActions";

export default function AdminSettingsPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedPassword = localStorage.getItem("admin_password") || "admin";
    setPassword(storedPassword);
    const storedUsername = localStorage.getItem("admin_username") || "admin";
    setUsername(storedUsername);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("admin_password", password.trim());
    localStorage.setItem("admin_username", username.trim());
    addActivityLog("SETTINGS: Admin authentication credentials updated", "info");
    setSaveSuccess(true);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleReset = () => {
    if (!confirm("CONFIRM_RESET: Reset all configurations and database tables to default?")) return;
    
    // Clear all storage keys related to portfolio config
    localStorage.removeItem("admin_password");
    localStorage.removeItem("admin_username");
    localStorage.removeItem("aaronnofrail_bio");
    localStorage.removeItem("aaronnofrail_who_are_u");
    localStorage.removeItem("aaronnofrail_experiences");
    localStorage.removeItem("aaronnofrail_achievements");
    localStorage.removeItem("aaronnofrail_projects");
    localStorage.removeItem("aaronnofrail_faqs");
    localStorage.removeItem("aaronnofrail_inbox");
    localStorage.removeItem("aaronnofrail_logs");

    // Reset state
    setPassword("admin");
    setUsername("admin");
    
    addActivityLog("SETTINGS: System reset to factory defaults triggered", "error");
    setSaveSuccess(false);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      window.location.reload();
    }, 1500);
  };

  const handleSync = async () => {
    if (!confirm("CONFIRM_SYNC: Sync all local storage configurations and records to Sanity CMS? This will replace or add documents to Sanity database.")) return;
    
    setSyncing(true);
    setSyncResult("SYNCING: Starting transmission...");

    try {
      let count = 0;

      // 1. Sync Bio
      const storedBio = localStorage.getItem("aaronnofrail_bio");
      if (storedBio) {
        setSyncResult("SYNCING: Transmitting Bio...");
        const parsed = JSON.parse(storedBio);
        const res = await saveBioAction(parsed);
        if (res.success) count++;
      }

      // 2. Sync Experiences
      const storedExp = localStorage.getItem("aaronnofrail_experiences");
      if (storedExp) {
        setSyncResult("SYNCING: Transmitting Experiences...");
        const parsed = JSON.parse(storedExp);
        for (const exp of parsed) {
          const res = await updateExperienceAction(exp.id, exp);
          if (res.success) count++;
        }
      }

      // 3. Sync Achievements
      const storedAch = localStorage.getItem("aaronnofrail_achievements");
      if (storedAch) {
        setSyncResult("SYNCING: Transmitting Achievements...");
        const parsed = JSON.parse(storedAch);
        for (const ach of parsed) {
          const res = await updateAchievementAction(ach.id, ach);
          if (res.success) count++;
        }
      }

      // 4. Sync Projects
      const storedProj = localStorage.getItem("aaronnofrail_projects");
      if (storedProj) {
        setSyncResult("SYNCING: Transmitting Projects...");
        const parsed = JSON.parse(storedProj);
        for (const proj of parsed) {
          const res = await updateProjectAction(proj.id, proj);
          if (res.success) count++;
        }
      }

      // 5. Sync FAQs
      const storedFaq = localStorage.getItem("aaronnofrail_faqs");
      if (storedFaq) {
        setSyncResult("SYNCING: Transmitting FAQs...");
        const parsed = JSON.parse(storedFaq);
        for (const faq of parsed) {
          const res = await updateFAQAction(faq.id, faq);
          if (res.success) count++;
        }
      }

      setSyncResult(`SYNC_COMPLETE: Successfully transmitted ${count} records to Sanity CMS!`);
      addActivityLog(`SETTINGS: Synced local cache data to Sanity CMS (${count} documents)`, "info");
    } catch (err: any) {
      console.error(err);
      setSyncResult(`SYNC_FAILED: ${err.message || "Unknown transmission error"}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="space-y-12 text-black dark:text-white font-mono">
      {/* Page Header */}
      <section className="border-b-2 border-black dark:border-neutral-700 pb-8 flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-tight">
            SYSTEM_CONFIGURATION
          </h2>
          <p className="text-xs opacity-60 uppercase tracking-tight">
            MANAGE CORE INTERFACE AND SECURITY PARAMETERS
          </p>
        </div>
        <div className="w-12 h-12 opacity-40 grayscale shrink-0">
          <img
            alt="Mascot"
            className="w-full h-full object-contain dark:invert"
            src="/assets/01_cat.png"
          />
        </div>
      </section>

      {/* Save Success Toast */}
      {showNotification && (
        <div className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4 rounded-[2rem] shadow-neo flex items-center justify-between animate-pulse text-xs font-bold">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-green-600 font-bold">verified_user</span>
            {saveSuccess ? "SYS_CONF_UPDATE: SUCCESSFUL_COMMIT" : "SYS_CONF_RESET: RESTORING_KERNEL_DEFAULTS..."}
          </span>
          <span className="text-[10px] opacity-50">OS_STATUS: OK</span>
        </div>
      )}

      {/* Grid Layout */}
      <div className="flex flex-col gap-12 max-w-3xl mx-auto">
        <div className="space-y-12">
          {/* Sanity CMS Sync Section */}
          <section className="border-2 border-black dark:border-neutral-700 p-6 md:p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 shadow-neo-lg">
            <h3 className="text-lg font-black border-b-2 border-black/10 dark:border-white/10 pb-2 mb-4 uppercase">
              SANITY_CMS_SYNCHRONIZATION
            </h3>
            <p className="text-xs opacity-60 uppercase tracking-tight mb-6">
              Migrate your local device configurations and cache data to the online Sanity database.
            </p>

            <button
              type="button"
              disabled={syncing}
              onClick={handleSync}
              className="px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-transparent rounded-xl font-bold text-xs uppercase hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all cursor-pointer shadow-neo-btn disabled:opacity-50"
            >
              {syncing ? "SYNCING..." : "SYNC LOCAL CACHE TO SANITY"}
            </button>

            {syncResult && (
              <div className="mt-4 p-4 border-2 border-black dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 font-mono text-xs rounded-xl break-all">
                &gt;&gt;&gt; {syncResult}
              </div>
            )}
          </section>

          {/* Security Protocol Section */}
          <section className="border-2 border-black dark:border-neutral-700 p-6 md:p-8 rounded-[2.5rem] bg-white dark:bg-neutral-900 shadow-neo-lg">
            <h3 className="text-lg font-black border-b-2 border-black/10 dark:border-white/10 pb-2 mb-6 uppercase">
              Security Protocol & Settings
            </h3>
            
            <form onSubmit={handleSave} className="space-y-6">
              {/* Admin Username */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase opacity-60">
                  Admin Username
                </label>
                <input
                  className="w-full bg-white dark:bg-neutral-950 border-2 border-black dark:border-neutral-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm"
                  placeholder="ENTER ADMIN USERNAME"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              {/* Admin Password */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase opacity-60">
                  New Password
                </label>
                <input
                  className="w-full bg-white dark:bg-neutral-950 border-2 border-black dark:border-neutral-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-sm"
                  placeholder="ENTER NEW CODE"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Footer Actions inside form */}
              <div className="pt-8 border-t-2 border-black/10 dark:border-white/10 flex flex-col sm:flex-row justify-center gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-8 py-3.5 border-2 border-red-500 bg-white dark:bg-neutral-900 text-red-500 font-bold text-xs uppercase hover:bg-red-50 dark:hover:bg-red-950/20 transition-all rounded-xl cursor-pointer shadow-neo-btn w-full sm:w-1/2"
                >
                  RESET TO DEFAULTS
                </button>
                <button
                  type="submit"
                  className="px-12 py-3.5 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-transparent font-bold text-xs uppercase hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all rounded-xl cursor-pointer shadow-neo-btn w-full sm:w-1/2"
                >
                  SAVE CHANGES
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
