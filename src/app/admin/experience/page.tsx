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
    <div className="flex-1 flex flex-col md:flex-row gap-12">
      {/* Left: ADD_EXPERIENCE FORM */}
      <section className="w-full md:w-1/2 space-y-8">
        <div>
          <h2 className="font-headline-lg text-headline-lg font-bold text-primary border-b-4 border-primary inline-block mb-4">
            {editingId ? "EDIT EXPERIENCE" : "ADD EXPERIENCE"}
          </h2>
          <p className="font-code text-body-md text-on-surface-variant max-w-md">
            {editingId
              ? `Modifying node ${editingId}. Ensure correct timeline parameters.`
              : "Initialize a new career node by defining parameters below. Ensure exact timestamps for chronology validation."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-lg font-code">
          <fieldset disabled={saveStatus === "SAVING"} className="space-y-10">
          <div className="space-y-2">
            <label className="text-label-sm font-bold text-primary block">
              JOB TITLE
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-primary p-2 text-body-lg placeholder:text-surface-dim outline-none focus:border-b-2"
              placeholder="e.g. SENIOR_SYSTEMS_ARCHITECT"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-sm font-bold text-primary block">
              COMPANY
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-primary p-2 text-body-lg placeholder:text-surface-dim outline-none focus:border-b-2"
              placeholder="e.g. NEO_TECH_CORP"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-label-sm font-bold text-primary block">
                START DATE
              </label>
              <input
                className="w-full bg-transparent border-0 border-b border-primary p-2 text-body-lg placeholder:text-surface-dim outline-none focus:border-b-2"
                placeholder="e.g. JAN 2022"
                type="text"
                value={startPeriod}
                onChange={(e) => setStartPeriod(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-label-sm font-bold text-primary block">
                END DATE
              </label>
              <input
                className="w-full bg-transparent border-0 border-b border-primary p-2 text-body-lg placeholder:text-surface-dim outline-none focus:border-b-2"
                placeholder="e.g. PRESENT"
                type="text"
                value={endPeriod}
                onChange={(e) => setEndPeriod(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-label-sm font-bold text-primary block">
              STATUS
            </label>
            <div className="flex gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={statusVal === "active"}
                  onChange={() => setStatusVal("active")}
                  className="accent-primary"
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
                  className="accent-primary"
                />
                Archived Entry
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-label-sm font-bold text-primary block">
              KEY RESPONSIBILITIES (one per line)
            </label>
            <textarea
              className="w-full bg-transparent border border-primary p-4 text-body-md placeholder:text-surface-dim resize-none outline-none"
              placeholder="* Execute modular deployments&#10;* Maintain system integrity&#10;* Lead engineering sprints"
              rows={6}
              value={responsibilitiesText}
              onChange={(e) => setResponsibilitiesText(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-label-sm font-bold text-primary block">
              TAGS (comma separated)
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-primary p-2 text-body-lg placeholder:text-surface-dim outline-none focus:border-b-2"
              placeholder="React, TypeScript, Postgres"
              type="text"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
            />
          </div>

          <div className="pt-4 flex gap-4">
            <button
              className="inline-flex items-center justify-center px-8 py-4 text-body-md font-bold text-on-primary bg-primary border border-primary hover:bg-surface hover:text-primary transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
              <span className="ml-2 material-symbols-outlined text-[18px]">
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
                className="border border-primary px-6 py-4 text-body-md font-bold hover:bg-primary hover:text-on-primary transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                CANCEL
              </button>
            )}
          </div>
          </fieldset>
        </form>
      </section>

      {/* Right: EXPERIENCE_LIST */}
      <section className="w-full md:w-1/2 p-6 bg-surface-container-low border border-primary space-y-8">
        <div className="flex justify-between items-end border-b border-primary pb-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg font-bold text-primary uppercase">
              EXPERIENCE LIST
            </h2>
            <p className="font-code text-label-sm text-secondary mt-1">
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
                className={`border bg-surface p-6 relative transition-transform duration-200 hover:-translate-y-1 ${isEditing ? "border-2 border-primary" : "border-primary"
                  }`}
              >
                <div
                  className={`absolute -top-3 left-6 px-3 py-1 font-code text-[10px] uppercase border ${isActive
                      ? "bg-primary text-on-primary border-primary"
                      : "bg-surface-container-high text-primary border-primary"
                    }`}
                >
                  {statusLabel} [{String(index + 1).padStart(2, "0")}]
                </div>

                <div className="flex justify-between items-start mb-6 mt-2">
                  <div>
                    <h3 className="font-headline-md text-headline-md font-bold text-primary">
                      {exp.jobTitle}
                    </h3>
                    <p className="font-code text-body-md text-secondary">
                      {exp.company} // {exp.period}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleEdit(exp)}
                      className="p-1 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
                      title="Edit Entry"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        edit
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(exp.id)}
                      className="p-1 hover:text-error transition-colors flex items-center gap-1 cursor-pointer text-secondary hover:text-error"
                      title="Remove Entry"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete
                      </span>
                    </button>
                  </div>
                </div>

                <ul className="font-code text-body-md space-y-2 mb-6 text-on-surface">
                  {exp.responsibilities.map((resp, i) => (
                    <li key={i}>&gt; {resp}</li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-primary/10">
                  {exp.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 border border-primary text-[10px] font-code"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}

          {experiences.length === 0 && (
            <div className="border border-primary border-dashed p-12 text-center text-secondary font-code">
              NO_EXPERIENCE_RECORDS_FOUND
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
