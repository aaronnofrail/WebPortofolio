"use client";

import { useEffect, useState } from "react";
import { mockExperiences, Experience } from "@/data/mockData";
import {
  createExperienceAction,
  updateExperienceAction,
  deleteExperienceAction
} from "@/app/actions/sanityActions";
import { addActivityLog } from "@/utils/activityLogger";

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [startPeriod, setStartPeriod] = useState("");
  const [endPeriod, setEndPeriod] = useState("");
  const [responsibilitiesText, setResponsibilitiesText] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [statusVal, setStatusVal] = useState("active"); // "active" or "archived"
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"IDLE" | "SAVING" | "SAVED" | "ERROR">("IDLE");

  useEffect(() => {
    const isSanityConfigured =
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "aaronnofrail_project";

    if (isSanityConfigured) {
      import("@/sanity/client").then(({ client }) => {
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
              loadFromLocalStorage();
            }
          })
          .catch((err) => {
            console.error("Failed to fetch experiences from Sanity, using localStorage fallback:", err);
            loadFromLocalStorage();
          });
      });
    } else {
      loadFromLocalStorage();
    }

    function loadFromLocalStorage() {
      const stored = localStorage.getItem("aaronnofrail_experiences");
      if (stored) {
        try {
          setExperiences(JSON.parse(stored));
        } catch (e) {
          setExperiences(mockExperiences);
        }
      } else {
        setExperiences(mockExperiences);
      }
    }
  }, []);

  const saveToStorage = (updated: Experience[]) => {
    localStorage.setItem("aaronnofrail_experiences", JSON.stringify(updated));
  };

  const handleClear = () => {
    setJobTitle("");
    setCompany("");
    setStartPeriod("");
    setEndPeriod("");
    setResponsibilitiesText("");
    setTagsText("");
    setStatusVal("active");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !company.trim()) return;
    setSaveStatus("SAVING");

    const responsibilities = responsibilitiesText
      .split("\n")
      .map((r) => r.trim().replace(/^>\s*/, "").replace(/^\*\s*/, ""))
      .filter(Boolean);

    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const periodStr = `${startPeriod || "N/A"} — ${endPeriod || "PRESENT"}`.toUpperCase();

    try {
      if (editingId) {
        // Edit mode
        const updatedNode = {
          jobTitle: jobTitle.trim(),
          company: company.trim(),
          period: periodStr,
          responsibilities,
          tags,
          status: statusVal === "active" ? "ACTIVE" : "ARCHIVED",
        };
        const res = await updateExperienceAction(editingId, updatedNode);
        if (res && !res.success) {
          console.error("Failed to update experience in Sanity:", res.error);
          setSaveStatus("ERROR");
          setTimeout(() => setSaveStatus("IDLE"), 2000);
          return;
        }

        const updated = experiences.map((exp) => {
          if (exp.id === editingId) {
            return {
              ...exp,
              ...updatedNode,
            };
          }
          return exp;
        });
        setExperiences(updated);
        saveToStorage(updated);
        addActivityLog(`EXPERIENCE: Updated experience configuration for '${updatedNode.jobTitle}' at '${updatedNode.company}'`, "info");
      } else {
        // Add mode
        const newExp: Experience = {
          id: `exp_${Date.now()}`,
          jobTitle: jobTitle.trim(),
          company: company.trim(),
          period: periodStr,
          status: statusVal === "active" ? "ACTIVE" : "ARCHIVED",
          responsibilities,
          tags,
        };
        const res = await createExperienceAction(newExp);
        if (res && !res.success) {
          console.error("Failed to create experience in Sanity:", res.error);
          setSaveStatus("ERROR");
          setTimeout(() => setSaveStatus("IDLE"), 2000);
          return;
        }

        const updated = [newExp, ...experiences];
        setExperiences(updated);
        saveToStorage(updated);
        addActivityLog(`EXPERIENCE: Added experience for '${newExp.jobTitle}' at '${newExp.company}'`, "info");
      }

      setSaveStatus("SAVED");
      setTimeout(() => setSaveStatus("IDLE"), 2000);
      handleClear();
    } catch (err) {
      console.error("Failed to save experience:", err);
      setSaveStatus("ERROR");
      setTimeout(() => setSaveStatus("IDLE"), 2000);
    }
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp.id);
    setJobTitle(exp.jobTitle);
    setCompany(exp.company);

    // Parse period (e.g., "JAN 2022 — PRESENT")
    const parts = exp.period.split("—");
    if (parts.length === 2) {
      setStartPeriod(parts[0].trim());
      setEndPeriod(parts[1].trim());
    } else {
      setStartPeriod(exp.period);
      setEndPeriod("");
    }

    setResponsibilitiesText(exp.responsibilities.map((r) => `* ${r}`).join("\n"));
    setTagsText(exp.tags.join(", "));
    setStatusVal(exp.status?.toLowerCase().includes("active") ? "active" : "archived");
  };

  const handleDelete = (id: string) => {
    if (!confirm("CONFIRM_DELETION: This action is irreversible.")) return;
    const deletedExp = experiences.find((e) => e.id === id);
    const titleStr = deletedExp ? `${deletedExp.jobTitle} at ${deletedExp.company}` : id;
    deleteExperienceAction(id);
    const updated = experiences.filter((exp) => exp.id !== id);
    setExperiences(updated);
    saveToStorage(updated);
    addActivityLog(`EXPERIENCE: Deleted experience record '${titleStr}'`, "error");
    if (editingId === id) {
      handleClear();
    }
  };

  return (
    <div className="flex-grow flex flex-col md:flex-row gap-12 text-black dark:text-white">
      {/* Left: ADD_EXPERIENCE FORM */}
      <section className="w-full md:w-1/2 space-y-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight border-b-4 border-black dark:border-neutral-700 inline-block pb-2 mb-4">
            {editingId ? "EDIT EXPERIENCE" : "ADD EXPERIENCE"}
          </h2>
          <p className="font-mono text-xs text-neutral-500 dark:text-neutral-400 max-w-md leading-relaxed">
            {editingId
              ? `Modifying node ${editingId}. Ensure correct timeline parameters.`
              : "Initialize a new career node by defining parameters below. Ensure exact timestamps for chronology validation."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-lg font-mono">
          <fieldset disabled={saveStatus === "SAVING"} className="space-y-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-black dark:text-neutral-300 block">
              JOB TITLE
            </label>
            <input
              className="w-full bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white font-mono"
              placeholder="e.g. SENIOR_SYSTEMS_ARCHITECT"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-black dark:text-neutral-300 block">
              COMPANY
            </label>
            <input
              className="w-full bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white font-mono"
              placeholder="e.g. NEO_TECH_CORP"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-black dark:text-neutral-300 block">
                START DATE
              </label>
              <input
                className="w-full bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white font-mono"
                placeholder="e.g. JAN 2022"
                type="text"
                value={startPeriod}
                onChange={(e) => setStartPeriod(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-black dark:text-neutral-300 block">
                END DATE
              </label>
              <input
                className="w-full bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white font-mono"
                placeholder="e.g. PRESENT"
                type="text"
                value={endPeriod}
                onChange={(e) => setEndPeriod(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-black dark:text-neutral-300 block">
              STATUS
            </label>
            <div className="flex gap-6 pt-1 font-mono text-sm">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={statusVal === "active"}
                  onChange={() => setStatusVal("active")}
                  className="accent-black dark:accent-white"
                />
                Active Entry
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="status"
                  value="archived"
                  checked={statusVal === "archived"}
                  onChange={() => setStatusVal("archived")}
                  className="accent-black dark:accent-white"
                />
                Archived Entry
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-black dark:text-neutral-300 block">
              KEY RESPONSIBILITIES (one per line)
            </label>
            <textarea
              className="w-full bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white font-mono resize-none"
              placeholder="* Execute modular deployments&#10;* Maintain system integrity&#10;* Lead engineering sprints"
              rows={6}
              value={responsibilitiesText}
              onChange={(e) => setResponsibilitiesText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-black dark:text-neutral-300 block">
              TAGS (comma separated)
            </label>
            <input
              className="w-full bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white font-mono"
              placeholder="React, TypeScript, Postgres"
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button
              className="px-6 py-3.5 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-transparent font-bold font-mono text-xs uppercase tracking-widest rounded-xl hover:bg-neutral-850 dark:hover:bg-neutral-100 transition-all shadow-neo-btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5"
              type="submit"
              disabled={saveStatus === "SAVING"}
            >
              {saveStatus === "SAVING"
                ? "SAVING..."
                : saveStatus === "SAVED"
                ? "SAVED SUCCESS"
                : saveStatus === "ERROR"
                ? "SAVE ERROR"
                : editingId
                ? "COMMIT CHANGES"
                : "COMMIT ENTRY"}
              <span className="material-symbols-outlined text-[16px]">
                {saveStatus === "SAVING"
                  ? "sync"
                  : saveStatus === "SAVED"
                  ? "check"
                  : saveStatus === "ERROR"
                  ? "error"
                  : editingId
                  ? "save"
                  : "add_task"}
              </span>
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleClear}
                disabled={saveStatus === "SAVING"}
                className="border-2 border-black dark:border-neutral-700 px-6 py-3.5 rounded-xl font-bold hover:bg-neutral-100 dark:hover:bg-neutral-850 transition-all shadow-neo-btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-black dark:text-white font-mono text-xs uppercase"
              >
                CANCEL
              </button>
            )}
          </div>
          </fieldset>
        </form>
      </section>

      {/* Right: EXPERIENCE_LIST */}
      <section className="w-full md:w-1/2 p-6 bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-[2rem] shadow-neo space-y-8">
        <div className="flex justify-between items-end border-b-2 border-black dark:border-neutral-700 pb-4">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-black dark:text-white">
              EXPERIENCE LIST
            </h2>
            <p className="font-mono text-[10px] text-neutral-400 mt-1 uppercase font-bold tracking-wider">
              TOTAL RECORDS: [{experiences.length.toString().padStart(2, "0")}]
            </p>
          </div>
        </div>

        <div className="space-y-10 h-[700px] overflow-y-auto pr-2 custom-scrollbar">
          {experiences.map((exp, index) => {
            const isEditing = editingId === exp.id;
            const statusLabel = exp.status || (exp.period.includes("PRESENT") ? "ACTIVE" : "ARCHIVED");
            const isActive = statusLabel.toLowerCase().includes("active");

            return (
              <article
                key={exp.id}
                className={`border-2 p-6 relative transition-all duration-200 hover:-translate-y-0.5 rounded-[2rem] bg-white dark:bg-neutral-900 shadow-neo hover:shadow-neo-lg text-black dark:text-white ${
                  isEditing ? "border-black dark:border-white ring-2 ring-black dark:ring-white" : "border-black dark:border-neutral-700"
                }`}
              >
                <div
                  className={`absolute -top-3.5 left-6 px-3 py-1 font-mono text-[10px] uppercase border-2 rounded-full font-bold shadow-neo-btn ${
                    isActive
                      ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-neutral-700"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-black dark:border-neutral-700"
                  }`}
                >
                  {statusLabel} [{String(index + 1).padStart(2, "0")}]
                </div>

                <div className="flex justify-between items-start mb-6 mt-2">
                  <div>
                    <h3 className="text-xl font-bold leading-snug">
                      {exp.jobTitle}
                    </h3>
                    <p className="font-mono text-xs text-neutral-400 mt-1">
                      {exp.company} // {exp.period}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="px-2.5 py-1 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white text-[10px] font-bold uppercase rounded-lg shadow-neo-btn cursor-pointer flex items-center justify-center"
                      title="Edit Entry"
                    >
                      <span className="material-symbols-outlined text-[16px]">edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="px-2.5 py-1 border-2 border-red-500 bg-white dark:bg-neutral-900 text-red-500 text-[10px] font-bold uppercase rounded-lg shadow-neo-btn cursor-pointer flex items-center justify-center"
                      title="Remove Entry"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>

                <ul className="font-mono text-xs space-y-2 mb-6 text-neutral-600 dark:text-neutral-300">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i} className="leading-relaxed">&gt; {resp}</li>
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
              </article>
            );
          })}

          {experiences.length === 0 && (
            <div className="border-4 border-dashed border-black dark:border-neutral-700 p-12 text-center text-neutral-400 font-mono rounded-[2rem]">
              NO_EXPERIENCE_RECORDS_FOUND
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
