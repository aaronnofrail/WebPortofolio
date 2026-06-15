"use client";

import { useEffect, useState } from "react";
import { mockBio, Bio } from "@/data/mockData";
import { saveBioAction } from "@/app/actions/sanityActions";
import { addActivityLog } from "@/utils/activityLogger";

export default function AdminBioPage() {
  const [bio, setBio] = useState<Bio | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [grayscale, setGrayscale] = useState(true);
  const [newSkill, setNewSkill] = useState("");
  const [saveStatus, setSaveStatus] = useState<"IDLE" | "SAVING" | "SAVED">("IDLE");

  // Load from localStorage or mock
  useEffect(() => {
    const stored = localStorage.getItem("aaronnofrail_bio");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.description && parsed.description.includes("arundaffa.nahara@gmail.com")) {
          localStorage.removeItem("aaronnofrail_bio");
          setBio(mockBio);
        } else {
          setBio(parsed);
        }
      } catch (e) {
        setBio(mockBio);
      }
    } else {
      setBio(mockBio);
    }

    const storedGrayscale = localStorage.getItem("aaronnofrail_grayscale");
    if (storedGrayscale !== null) {
      setGrayscale(storedGrayscale === "true");
    }
  }, []);

  if (!bio) {
    return (
      <div className="font-code text-body-md animate-pulse">
        &gt; LOADING_BIO_PERSONA...
      </div>
    );
  }

  const handleTextareaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: keyof Bio
  ) => {
    setBio((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: e.target.value,
      };
    });
    setIsDirty(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Bio
  ) => {
    setBio((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: e.target.value,
      };
    });
    setIsDirty(true);
  };

  const handlePhilosophyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Split by double newlines or single newlines depending on structure
    const paragraphs = e.target.value.split("\n\n").filter(Boolean);
    setBio((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        philosophy: paragraphs,
      };
    });
    setIsDirty(true);
  };

  const handleGrayscaleToggle = () => {
    const newVal = !grayscale;
    setGrayscale(newVal);
    localStorage.setItem("aaronnofrail_grayscale", String(newVal));
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    setBio((prev) => {
      if (!prev) return null;
      if (prev.skills.includes(newSkill.trim())) return prev;
      return {
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      };
    });
    setNewSkill("");
    setIsDirty(true);
  };

  const handleDeleteSkill = (skillToDelete: string) => {
    setBio((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        skills: prev.skills.filter((s) => s !== skillToDelete),
      };
    });
    setIsDirty(true);
  };

  const handleCommit = async () => {
    if (!bio) return;
    setSaveStatus("SAVING");
    
    // Save locally
    localStorage.setItem("aaronnofrail_bio", JSON.stringify(bio));
    addActivityLog("BIO: Committed updated persona and bio parameters", "info");
    
    // Attempt saving to Sanity CMS
    const res = await saveBioAction(bio);
    setIsDirty(false);
    
    if (res.success) {
      setSaveStatus("SAVED");
    } else {
      if (res.error === "SANITY_API_WRITE_TOKEN_MISSING") {
        console.warn("Sanity API Write Token missing. Saved changes locally inside browser cache.");
      } else {
        console.error("Sanity save error:", res.error);
      }
      setSaveStatus("SAVED");
    }
    
    setTimeout(() => setSaveStatus("IDLE"), 2000);
  };

  const handleDiscard = () => {
    const stored = localStorage.getItem("aaronnofrail_bio");
    if (stored) {
      setBio(JSON.parse(stored));
    } else {
      setBio(mockBio);
    }
    setIsDirty(false);
  };

  const wordCount = bio.philosophy.join(" ").split(/\s+/).filter(Boolean).length;
  const charCount = bio.philosophy.join("\n\n").length;

  return (
    <div className="space-y-12">
      {/* Unified Bio Editor Header */}
      <div className="border-l-4 border-primary pl-6">
        <h2 className="font-headline-lg text-headline-lg uppercase mb-2">
          Bio &amp; Persona Management
        </h2>
        <p className="font-body-lg text-body-lg opacity-70">
          Unified configuration for identity text, philosophy, and tech stack parameters.
        </p>
      </div>

      <div className="space-y-16">
        {/* Hero Text Configuration */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md font-bold uppercase tracking-tight flex items-center gap-2">
              <span className="material-symbols-outlined">terminal</span>
              Hero Text Configuration
            </h3>
            <span className="font-code text-label-sm opacity-40">
              EDITOR_ID: HERO_TX_01
            </span>
          </div>

          <div className="border border-primary p-1 bg-surface-container">
            <div className="flex items-center gap-2 p-2 border-b border-primary bg-primary text-on-primary font-code text-[11px] uppercase tracking-tighter">
              <div className="flex gap-1.5 shrink-0">
                <div className="w-3 h-3 bg-on-primary rounded-full opacity-30"></div>
                <div className="w-3 h-3 bg-on-primary rounded-full opacity-30"></div>
                <div className="w-3 h-3 bg-on-primary rounded-full opacity-30"></div>
              </div>
              <span className="ml-2">config.sh — root@terminal</span>
            </div>

            <div className="bg-background p-4 space-y-4 font-code text-body-md leading-relaxed">
              <div className="flex items-center gap-2">
                <span className="text-secondary shrink-0">&gt; name=</span>
                <input
                  type="text"
                  value={bio.name}
                  onChange={(e) => handleInputChange(e, "name")}
                  className="bg-transparent border-b border-primary focus:border-b-2 outline-none p-1 flex-1 font-code"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-secondary shrink-0">&gt; role=</span>
                <input
                  type="text"
                  value={bio.role}
                  onChange={(e) => handleInputChange(e, "role")}
                  className="bg-transparent border-b border-primary focus:border-b-2 outline-none p-1 flex-1 font-code"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-secondary shrink-0">&gt; terminal_prompt=</span>
                <input
                  type="text"
                  value={bio.terminalText}
                  onChange={(e) => handleInputChange(e, "terminalText")}
                  className="bg-transparent border-b border-primary focus:border-b-2 outline-none p-1 flex-1 font-code"
                />
              </div>

              <div className="space-y-1">
                <div className="text-secondary">&gt; description_manifesto=</div>
                <textarea
                  value={bio.description}
                  onChange={(e) => handleTextareaChange(e, "description")}
                  className="w-full h-48 bg-background border border-primary p-3 font-code text-body-md focus:outline-none resize-none custom-scrollbar leading-relaxed"
                  spellCheck="false"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-2">
            <button
              onClick={handleDiscard}
              disabled={!isDirty}
              className="border border-primary px-6 py-2 font-code text-label-sm uppercase hover:bg-primary hover:text-on-primary transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-primary cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={handleCommit}
              disabled={!isDirty && saveStatus === "IDLE"}
              className="bg-primary text-on-primary border border-primary px-6 py-2 font-code text-label-sm uppercase hover:bg-background hover:text-primary transition-all disabled:opacity-40 cursor-pointer"
            >
              {saveStatus === "SAVING"
                ? "SAVING..."
                : saveStatus === "SAVED"
                ? "SAVED SUCCESS"
                : "Commit Changes"}
            </button>
          </div>
        </section>

        {/* Hero Image Assets */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h3 className="font-headline-md text-headline-md font-bold uppercase tracking-tight">
                Hero Image Assets
              </h3>
              <span className="material-symbols-outlined text-primary">image</span>
            </div>

            <div className="space-y-2 font-code">
              <label className="font-label-sm text-label-sm block uppercase tracking-wider">
                Source File
              </label>
              <div className="border border-primary border-dashed p-8 flex flex-col items-center justify-center gap-4 bg-surface-container-low hover:bg-surface-variant cursor-pointer transition-colors group">
                <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">
                  cloud_upload
                </span>
                <div className="text-center">
                  <p className="font-body-md text-body-md">
                    Drag &amp; Drop or <span className="underline font-bold">Browse</span>
                  </p>
                  <p className="font-label-sm text-label-sm opacity-50 mt-1">
                    PNG, JPG or WebP (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 font-code">
              <label className="font-label-sm text-label-sm block uppercase tracking-wider">
                Alt Text Metadata
              </label>
              <input
                className="w-full border border-primary bg-background px-4 py-3 font-body-md text-body-md outline-none"
                defaultValue="8-bit style black cat mascot illustration"
                type="text"
              />
            </div>

            <div className="flex items-center justify-between p-4 border border-primary bg-surface-container-low font-code">
              <div className="flex flex-col">
                <span className="font-body-md text-body-md font-bold">
                  Apply Grayscale Filter
                </span>
                <span className="font-label-sm text-label-sm opacity-60 italic">
                  Normalize image contrast to brand standards
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  className="sr-only peer"
                  checked={grayscale}
                  onChange={handleGrayscaleToggle}
                  type="checkbox"
                />
                <div className="w-14 h-7 bg-surface border border-primary peer-checked:bg-primary transition-colors flex items-center px-1">
                  <div className={`w-5 h-5 bg-primary peer-checked:bg-on-primary transition-all flex items-center justify-center ${
                    grayscale ? "translate-x-7 bg-on-primary" : ""
                  }`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {grayscale ? "check" : "close"}
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-4 font-code">
            <label className="font-label-sm text-label-sm block uppercase tracking-wider">
              Current Asset Preview
            </label>
            <div className="border border-primary p-4 bg-[repeating-conic-gradient(var(--checkerboard-color-1)_0%_25%,var(--checkerboard-color-2)_0%_50%)] bg-[length:20px_20px] aspect-square flex items-center justify-center relative overflow-hidden">
              <img
                alt="Profile Mascot"
                className={`max-w-[80%] max-h-[80%] transition-all duration-300 dark:invert ${
                  grayscale ? "grayscale" : ""
                }`}
                src="/assets/01_cat.png"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-background/90 border border-primary p-2 flex justify-between items-center backdrop-blur-sm">
                <div className="flex flex-col">
                  <span className="font-label-sm text-[10px] font-bold">
                    FILE_ID: 01_CAT.PNG
                  </span>
                  <span className="font-label-sm text-[9px] opacity-60">
                    256x256 PX // INDEXED_ALPHA
                  </span>
                </div>
                <span className="material-symbols-outlined text-lg">info</span>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-primary opacity-20" />

        {/* Philosophy Text Editor */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-headline-md text-headline-md font-bold uppercase tracking-tight">
              Philosophy Text Editor
            </h2>
            <div className="text-label-sm font-code opacity-60">
              UTF-8 | LF | TEXT
            </div>
          </div>

          <div className="border border-primary p-4 bg-surface-container-lowest">
            <div className="flex border-b border-primary mb-4 pb-2 text-label-sm font-code opacity-70">
              <div className="mr-6">WORDS: {wordCount}</div>
              <div className="mr-6">CHARS: {charCount}</div>
              <div>STATUS: {isDirty ? "DIRTY" : "CLEAN"}</div>
            </div>
            <textarea
              className="w-full h-80 bg-transparent border-none focus:ring-0 font-code text-body-md resize-none leading-relaxed outline-none"
              value={bio.philosophy.join("\n\n")}
              onChange={handlePhilosophyChange}
              spellCheck="false"
              placeholder="Enter philosophy paragraphs here, separate with a double-enter (blank line)..."
            />
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={handleDiscard}
                disabled={!isDirty}
                className="border border-primary px-6 py-2 font-code text-label-sm uppercase hover:bg-primary hover:text-on-primary transition-all disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-primary cursor-pointer"
              >
                Discard
              </button>
              <button
                onClick={handleCommit}
                disabled={!isDirty && saveStatus === "IDLE"}
                className="bg-primary text-on-primary border border-primary px-6 py-2 font-code text-label-sm uppercase hover:bg-background hover:text-primary transition-all disabled:opacity-40 cursor-pointer"
              >
                {saveStatus === "SAVING"
                  ? "SAVING..."
                  : saveStatus === "SAVED"
                  ? "SAVED SUCCESS"
                  : "Commit to Bio"}
              </button>
            </div>
          </div>
        </section>

        {/* Tech Stack Table Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="font-headline-md text-headline-md font-bold uppercase tracking-tight">
              Tech Stack Configuration
            </h2>
            <form onSubmit={handleAddSkill} className="flex gap-2 font-code">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. Go, Rust..."
                className="bg-transparent border border-primary px-3 py-1 text-body-md outline-none"
              />
              <button
                type="submit"
                className="bg-primary text-on-primary border border-primary px-4 py-1 hover:bg-background hover:text-primary transition-colors flex items-center font-bold text-label-sm uppercase cursor-pointer"
              >
                <span className="material-symbols-outlined mr-1 text-[16px]">
                  add
                </span>
                Add Skill
              </button>
            </form>
          </div>

          <div className="border border-primary overflow-x-auto">
            <table className="w-full border-collapse text-left font-code">
              <thead>
                <tr className="bg-primary text-on-primary">
                  <th className="p-3 border-r border-on-primary font-bold text-label-sm uppercase w-2/3">
                    Technology Name
                  </th>
                  <th className="p-3 font-bold text-label-sm uppercase text-center w-1/3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-body-md">
                {bio.skills.map((skill, index) => (
                  <tr
                    key={skill}
                    className="border-b border-primary hover:bg-surface-container-low transition-colors"
                  >
                    <td className="p-3 border-r border-primary font-bold">
                      {skill}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => handleDeleteSkill(skill)}
                        className="text-error hover:scale-110 transition-transform cursor-pointer"
                        title="Delete Skill"
                      >
                        <span className="material-symbols-outlined">
                          delete
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
                {bio.skills.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="p-8 text-center text-secondary opacity-60"
                    >
                      NO_SKILLS_DEFINED
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Status Bar Footer */}
        <footer className="border border-primary p-3 flex justify-between items-center bg-surface-container-highest">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="font-code text-[11px] uppercase">
                System Online
              </span>
            </div>
            <span className="h-4 w-px bg-primary opacity-20"></span>
            <span className="font-code text-[11px] opacity-60 uppercase">
              Deploy status: Ready
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-code text-[11px] opacity-40">
              UTF-8 // PAPER_THEME_STABLE
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
