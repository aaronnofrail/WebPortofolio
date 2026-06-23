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
  const [whoAreU, setWhoAreU] = useState("");

  // Load from localStorage or mock
  useEffect(() => {
    const isSanityConfigured =
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "aaronnofrail_project";

    if (isSanityConfigured) {
      import("@/sanity/client").then(({ client }) => {
        client
          .fetch(`*[_type == "bio"][0]`)
          .then((fetched: any) => {
            if (fetched) {
              setBio({
                name: fetched.name || mockBio.name,
                role: fetched.role || mockBio.role,
                terminalText: fetched.terminalText || mockBio.terminalText,
                description: fetched.description || mockBio.description,
                philosophy: fetched.philosophy || mockBio.philosophy,
                skills: fetched.skills || mockBio.skills,
              });
            } else {
              loadFromLocalStorage();
            }
          })
          .catch((err) => {
            console.error("Failed to fetch bio from Sanity, using localStorage fallback:", err);
            loadFromLocalStorage();
          });
      });
    } else {
      loadFromLocalStorage();
    }

    function loadFromLocalStorage() {
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
    }

    const storedGrayscale = localStorage.getItem("aaronnofrail_grayscale");
    if (storedGrayscale !== null) {
      setGrayscale(storedGrayscale === "true");
    }
    
    const storedWho = localStorage.getItem("aaronnofrail_who_are_u") || "Aaron is a security researcher and frontend developer based in the void.";
    setWhoAreU(storedWho);
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
    localStorage.setItem("aaronnofrail_who_are_u", whoAreU.trim());
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
    const storedWho = localStorage.getItem("aaronnofrail_who_are_u") || "Aaron is a security researcher and frontend developer based in the void.";
    setWhoAreU(storedWho);
    setIsDirty(false);
  };

  const wordCount = bio.philosophy.join(" ").split(/\s+/).filter(Boolean).length;
  const charCount = bio.philosophy.join("\n\n").length;

  return (
    <div className="space-y-12">
      {/* Unified Bio Editor Header */}
      <div className="border-l-4 border-black dark:border-neutral-700 pl-6">
        <h2 className="text-4xl font-black uppercase mb-2 text-black dark:text-white">
          Bio &amp; Persona Management
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-mono">
          Unified configuration for identity text, philosophy, and tech stack parameters.
        </p>
      </div>

      <div className="space-y-16">
        {/* Hero Text Configuration */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold uppercase tracking-tight flex items-center gap-2 text-black dark:text-white">
              <span className="material-symbols-outlined text-lg">terminal</span>
              Hero Text Configuration
            </h3>
            <span className="font-mono text-xs opacity-40 text-black dark:text-white">
              EDITOR_ID: HERO_TX_01
            </span>
          </div>

          <div className="border-4 border-black dark:border-neutral-700 rounded-[2.5rem] bg-white dark:bg-neutral-900 shadow-neo-lg overflow-hidden">
            <div className="flex items-center gap-2 p-3.5 border-b-2 border-black dark:border-neutral-700 bg-black dark:bg-neutral-800 text-white font-mono text-[11px] uppercase tracking-wider">
              <div className="flex gap-1.5 shrink-0">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
                <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              </div>
              <span className="ml-2">config.sh — root@terminal</span>
            </div>

            <div className="p-6 md:p-8 space-y-6 font-mono text-sm leading-relaxed text-black dark:text-white">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400 shrink-0">&gt; name=</span>
                <input
                  type="text"
                  value={bio.name}
                  onChange={(e) => handleInputChange(e, "name")}
                  className="bg-transparent border-0 border-b-2 border-black dark:border-neutral-700 focus:border-black dark:focus:border-neutral-500 outline-none p-1 flex-1 font-mono text-black dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-neutral-400 shrink-0">&gt; role=</span>
                <input
                  type="text"
                  value={bio.role}
                  onChange={(e) => handleInputChange(e, "role")}
                  className="bg-transparent border-0 border-b-2 border-black dark:border-neutral-700 focus:border-black dark:focus:border-neutral-500 outline-none p-1 flex-1 font-mono text-black dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-neutral-400 shrink-0">&gt; terminal_prompt=</span>
                <input
                  type="text"
                  value={bio.terminalText}
                  onChange={(e) => handleInputChange(e, "terminalText")}
                  className="bg-transparent border-0 border-b-2 border-black dark:border-neutral-700 focus:border-black dark:focus:border-neutral-500 outline-none p-1 flex-1 font-mono text-black dark:text-white"
                />
              </div>

              <div className="space-y-2">
                <div className="text-neutral-400">&gt; description_manifesto=</div>
                <textarea
                  value={bio.description}
                  onChange={(e) => handleTextareaChange(e, "description")}
                  className="w-full h-48 bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-xl p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none custom-scrollbar leading-relaxed text-black dark:text-white"
                  spellCheck="false"
                />
              </div>

              <div className="space-y-2 mt-4">
                <div className="text-neutral-400">&gt; terminal_who_are_u_response=</div>
                <textarea
                  value={whoAreU}
                  onChange={(e) => {
                    setWhoAreU(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full h-24 bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-xl p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none custom-scrollbar leading-relaxed text-black dark:text-white"
                  spellCheck="false"
                  placeholder="Aaron is a security researcher and frontend developer based in the void."
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={handleDiscard}
              disabled={!isDirty}
              className="border-2 border-black dark:border-neutral-700 px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all shadow-neo-btn disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer text-black dark:text-white"
            >
              Discard
            </button>
            <button
              onClick={handleCommit}
              disabled={!isDirty && saveStatus === "IDLE"}
              className="bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-transparent px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase hover:bg-neutral-850 dark:hover:bg-neutral-100 transition-all shadow-neo-btn disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold uppercase tracking-tight text-black dark:text-white">
                Hero Image Assets
              </h3>
              <span className="material-symbols-outlined text-black dark:text-white">image</span>
            </div>

            <div className="space-y-2 font-mono text-black dark:text-white">
              <label className="text-xs font-bold uppercase tracking-wider block">
                Source File
              </label>
              <div className="border-2 border-dashed border-black dark:border-neutral-700 p-8 rounded-[2rem] flex flex-col items-center justify-center gap-4 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors shadow-neo group relative">
                <span className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform">
                  cloud_upload
                </span>
                <div className="text-center">
                  <p className="text-sm font-bold">
                    Drag &amp; Drop or <span className="underline">Browse</span>
                  </p>
                  <p className="text-xs opacity-50 mt-1">
                    PNG, JPG or WebP (Max 5MB)
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 font-mono text-black dark:text-white">
              <label className="text-xs font-bold uppercase tracking-wider block">
                Alt Text Metadata
              </label>
              <input
                className="w-full border-2 border-black dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white font-mono"
                defaultValue="8-bit style black cat mascot illustration"
                type="text"
              />
            </div>

            <div className="flex items-center justify-between p-4 border-2 border-black dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 shadow-neo font-mono text-black dark:text-white">
              <div className="flex flex-col">
                <span className="text-sm font-bold">
                  Apply Grayscale Filter
                </span>
                <span className="text-xs opacity-60 italic mt-0.5">
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
                <div className="w-14 h-7 bg-neutral-200 dark:bg-neutral-800 border-2 border-black dark:border-neutral-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-black dark:after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 dark:peer-checked:bg-green-600 transition-colors"></div>
              </label>
            </div>
          </div>

          <div className="space-y-4 font-mono text-black dark:text-white">
            <label className="text-xs font-bold uppercase tracking-wider block">
              Current Asset Preview
            </label>
            <div className="border-2 border-black dark:border-neutral-700 p-6 bg-[repeating-conic-gradient(var(--checkerboard-color-1)_0%_25%,var(--checkerboard-color-2)_0%_50%)] bg-[length:20px_20px] aspect-square flex items-center justify-center relative overflow-hidden rounded-[2rem] shadow-neo">
              <img
                alt="Profile Mascot"
                className={`max-w-[70%] max-h-[70%] transition-all duration-300 dark:invert ${
                  grayscale ? "grayscale" : ""
                }`}
                src="/assets/01_cat.png"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-neutral-900/95 border-2 border-black dark:border-neutral-700 p-3 flex justify-between items-center rounded-xl font-mono">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold">
                    FILE_ID: 01_CAT.PNG
                  </span>
                  <span className="text-[9px] opacity-60 mt-0.5">
                    256x256 PX // INDEXED_ALPHA
                  </span>
                </div>
                <span className="material-symbols-outlined text-lg">info</span>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-black dark:border-neutral-700 opacity-20" />

        {/* Philosophy Text Editor */}
        <section className="space-y-4 text-black dark:text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Philosophy Text Editor
            </h2>
            <div className="text-xs font-mono opacity-60">
              UTF-8 | LF | TEXT
            </div>
          </div>

          <div className="border-4 border-black dark:border-neutral-700 rounded-[2.5rem] p-6 bg-white dark:bg-neutral-900 shadow-neo-lg">
            <div className="flex border-b-2 border-black/10 dark:border-white/10 mb-4 pb-2 text-xs font-mono opacity-70">
              <div className="mr-6">WORDS: {wordCount}</div>
              <div className="mr-6">CHARS: {charCount}</div>
              <div>STATUS: {isDirty ? "DIRTY" : "CLEAN"}</div>
            </div>
            <textarea
              className="w-full h-80 bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-xl p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white resize-none leading-relaxed text-black dark:text-white"
              value={bio.philosophy.join("\n\n")}
              onChange={handlePhilosophyChange}
              spellCheck="false"
              placeholder="Enter philosophy paragraphs here, separate with a double-enter (blank line)..."
            />
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={handleDiscard}
                disabled={!isDirty}
                className="border-2 border-black dark:border-neutral-700 px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all shadow-neo-btn disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed cursor-pointer text-black dark:text-white"
              >
                Discard
              </button>
              <button
                onClick={handleCommit}
                disabled={!isDirty && saveStatus === "IDLE"}
                className="bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-transparent px-6 py-2.5 rounded-xl font-mono text-xs font-bold uppercase hover:bg-neutral-850 dark:hover:bg-neutral-100 transition-all shadow-neo-btn disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
        <section className="space-y-6 text-black dark:text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Tech Stack Configuration
            </h2>
            <form onSubmit={handleAddSkill} className="flex gap-2 font-mono">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. Go, Rust..."
                className="p-2 border-2 border-black dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 text-black dark:text-white text-sm outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
              <button
                type="submit"
                className="bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-transparent px-4 py-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 rounded-xl font-bold text-xs uppercase shadow-neo-btn cursor-pointer flex items-center"
              >
                <span className="material-symbols-outlined mr-1 text-[16px] font-bold">
                  add
                </span>
                Add Skill
              </button>
            </form>
          </div>

          <div className="border-2 border-black dark:border-neutral-700 rounded-[2rem] overflow-hidden shadow-neo">
            <table className="w-full border-collapse text-left font-mono">
              <thead>
                <tr className="bg-black dark:bg-neutral-800 text-white border-b-2 border-black dark:border-neutral-700">
                  <th className="p-4 font-bold text-xs uppercase w-2/3">
                    Technology Name
                  </th>
                  <th className="p-4 font-bold text-xs uppercase text-center w-1/3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {bio.skills.map((skill, index) => (
                  <tr
                    key={skill}
                    className="border-b border-black/10 dark:border-neutral-800/50 hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <td className="p-4 font-bold">
                      {skill}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDeleteSkill(skill)}
                        className="text-red-500 hover:scale-115 transition-transform cursor-pointer"
                        title="Delete Skill"
                      >
                        <span className="material-symbols-outlined font-bold text-lg">
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
                      className="p-8 text-center text-neutral-400 opacity-60"
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
        <footer className="border-2 border-black dark:border-neutral-700 rounded-xl p-4 flex justify-between items-center bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white font-mono shadow-neo">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[11px] font-bold uppercase">
                System Online
              </span>
            </div>
            <span className="h-4 w-0.5 bg-black/10 dark:bg-white/10 shrink-0"></span>
            <span className="text-[11px] opacity-60 font-bold uppercase">
              Deploy status: Ready
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] opacity-40">
              UTF-8 // PAPER_THEME_STABLE
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
