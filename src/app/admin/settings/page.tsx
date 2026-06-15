"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminSettingsPage() {
  const [password, setPassword] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedPassword = localStorage.getItem("admin_password") || "admin";
    setPassword(storedPassword);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("admin_password", password.trim());
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
    localStorage.removeItem("aaronnofrail_bio");
    localStorage.removeItem("aaronnofrail_experiences");
    localStorage.removeItem("aaronnofrail_achievements");
    localStorage.removeItem("aaronnofrail_projects");
    localStorage.removeItem("aaronnofrail_faqs");
    localStorage.removeItem("aaronnofrail_inbox");

    // Reset password state
    setPassword("admin");
    
    setSaveSuccess(false);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      window.location.reload();
    }, 1500);
  };

  return (
    <div className="space-y-12">
      {/* Page Header */}
      <section className="border-b-2 border-primary pb-8 flex justify-between items-center">
        <div className="space-y-2">
          <h2 className="font-headline-lg text-headline-lg font-bold uppercase tracking-tight">
            SYSTEM_CONFIGURATION
          </h2>
          <p className="font-code text-body-md text-secondary uppercase tracking-tight">
            MANAGE CORE INTERFACE AND SECURITY PARAMETERS
          </p>
        </div>
        <div className="w-12 h-12 opacity-40 grayscale">
          <img
            alt="Mascot"
            className="w-full h-full object-contain dark:invert"
            src="/assets/01_cat.png"
          />
        </div>
      </section>

      {/* Save Success Toast */}
      {showNotification && (
        <div className="border border-primary bg-surface p-4 flex items-center justify-between animate-pulse font-code text-body-md">
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-green-600">verified_user</span>
            {saveSuccess ? "SYS_CONF_UPDATE: SUCCESSFUL_COMMIT" : "SYS_CONF_RESET: RESTORING_KERNEL_DEFAULTS..."}
          </span>
          <span className="text-[10px] text-secondary">OS_STATUS: OK</span>
        </div>
      )}

      {/* Grid Layout */}
      <div className="flex flex-col gap-16 max-w-3xl mx-auto">
        <div className="col-span-12 space-y-12">
          {/* Security Protocol Section */}
          <section className="mb-8">
            <h3 className="text-headline-md font-headline-md font-bold border-b border-primary/20 pb-2 mb-8">
              SETTINGS
            </h3>
            
            <form onSubmit={handleSave} className="space-y-8">
              <div className="space-y-2">
                <label className="block font-code text-label-sm uppercase opacity-60">
                  New Password
                </label>
                <input
                  className="w-full bg-surface border border-primary px-4 py-3 font-code focus:ring-0 outline-none text-body-lg"
                  placeholder="ENTER NEW CODE"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Footer Actions inside form */}
              <div className="mt-24 pt-12 border-t-2 border-primary flex flex-col md:flex-row justify-center gap-6">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-8 py-4 border border-primary font-code text-body-md hover:bg-secondary-container transition-all active:scale-95 w-full md:w-64 cursor-pointer font-bold uppercase tracking-wider"
                >
                  RESET_TO_DEFAULTS
                </button>
                <button
                  type="submit"
                  className="px-12 py-4 bg-primary text-on-primary font-bold font-code text-body-md border border-primary hover:bg-background hover:text-primary transition-all active:scale-95 settings-save-button w-full md:w-80 cursor-pointer uppercase tracking-wider"
                >
                  SAVE_CHANGES
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
