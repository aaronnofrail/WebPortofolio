"use client";

import { useEffect, useState } from "react";
import { mockAchievements, Achievement } from "@/data/mockData";
import {
  createAchievementAction,
  updateAchievementAction,
  deleteAchievementAction,
} from "@/app/actions/sanityActions";
import { addActivityLog } from "@/utils/activityLogger";

export default function AdminAchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagsText, setTagsText] = useState("");
  const [imageVal, setImageVal] = useState("military_tech"); // default icon name or URL
  const [editingId, setEditingId] = useState<string | null>(null);
  const [credentialUrl, setCredentialUrl] = useState("");

  useEffect(() => {
    const isSanityConfigured =
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "aaronnofrail_project";

    if (isSanityConfigured) {
      import("@/sanity/client").then(({ client }) => {
        client
          .fetch(`*[_type == "achievement"]`)
          .then((fetched: any[]) => {
            if (fetched && fetched.length > 0) {
              const mapped = fetched.map((item) => ({
                id: item._id,
                title: item.title,
                description: item.description,
                image: item.imageAssetPath || item.image || "",
                tags: item.tags || [],
                credentialUrl: item.credentialUrl || "",
              }));
              setAchievements(mapped);
            } else {
              loadFromLocalStorage();
            }
          })
          .catch((err) => {
            console.error("Failed to fetch achievements from Sanity, using localStorage fallback:", err);
            loadFromLocalStorage();
          });
      });
    } else {
      loadFromLocalStorage();
    }

    function loadFromLocalStorage() {
      const stored = localStorage.getItem("aaronnofrail_achievements");
      if (stored) {
        try {
          setAchievements(JSON.parse(stored));
        } catch (e) {
          setAchievements(mockAchievements);
        }
      } else {
        setAchievements(mockAchievements);
      }
    }
  }, []);

  const saveToStorage = (updated: Achievement[]) => {
    localStorage.setItem("aaronnofrail_achievements", JSON.stringify(updated));
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setTagsText("");
    setImageVal("military_tech");
    setEditingId(null);
    setCredentialUrl("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result !== "string") return;
      const img = new window.Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setImageVal(compressedBase64);
        } else {
          setImageVal(reader.result as string);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const tags = tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // If it's a simple word, treat it as a material symbol icon, otherwise a URL
    const imagePath = imageVal.trim();

    if (editingId) {
      // Edit
      const updated = achievements.map((ach) => {
        if (ach.id === editingId) {
          const updatedNode = {
            ...ach,
            title: title.trim().toUpperCase(),
            description: description.trim(),
            tags,
            image: imagePath,
            credentialUrl: credentialUrl.trim(),
          };
          updateAchievementAction(ach.id, updatedNode);
          addActivityLog(`ACHIEVEMENT: Updated configuration for '${updatedNode.title}'`, "info");
          return updatedNode;
        }
        return ach;
      });
      setAchievements(updated);
      saveToStorage(updated);
    } else {
      // Add
      const newAch: Achievement = {
        id: `ach_${Date.now()}`,
        title: title.trim().toUpperCase(),
        description: description.trim(),
        tags,
        image: imagePath,
        credentialUrl: credentialUrl.trim(),
      };
      createAchievementAction(newAch);
      const updated = [...achievements, newAch];
      setAchievements(updated);
      saveToStorage(updated);
      addActivityLog(`ACHIEVEMENT: Created new achievement '${newAch.title}'`, "info");
    }

    handleClear();
  };

  const handleEdit = (ach: Achievement) => {
    setEditingId(ach.id);
    setTitle(ach.title);
    setDescription(ach.description);
    setTagsText(ach.tags.join(", "));
    setImageVal(ach.image);
    setCredentialUrl(ach.credentialUrl || "");
  };

  const handleDelete = (id: string) => {
    if (!confirm("CONFIRM_DELETION: This action is irreversible.")) return;
    const deletedAch = achievements.find((a) => a.id === id);
    const titleStr = deletedAch ? deletedAch.title : id;
    deleteAchievementAction(id);
    const updated = achievements.filter((ach) => ach.id !== id);
    setAchievements(updated);
    saveToStorage(updated);
    addActivityLog(`ACHIEVEMENT: Deleted achievement '${titleStr}'`, "error");
    if (editingId === id) {
      handleClear();
    }
  };

  const isIcon = (val: string) => {
    if (!val) return true;
    return !val.startsWith("http") && !val.startsWith("/") && !val.startsWith("data:") && !val.includes(".");
  };

  return (
    <div className="space-y-12 text-black dark:text-white">
      {/* Page Header */}
      <div className="border-l-4 border-black dark:border-neutral-700 pl-6">
        <h2 className="text-4xl font-black uppercase mb-2">
          ACHIEVEMENTS CATALOGUE
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-mono">
          Configure professional validation metrics, awards, and certification logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: ACHIEVEMENT_REGISTRY */}
        <section className="lg:col-span-5 space-y-8">
          <div className="border-4 border-black dark:border-neutral-700 p-6 md:p-8 bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-neo-lg">
            <header className="border-b-2 border-black/10 dark:border-white/10 pb-4 mb-6">
              <h2 className="text-2xl font-black uppercase">
                {editingId ? "EDIT REGISTRY" : "ACHIEVEMENT REGISTRY"}
              </h2>
            </header>
            
            <form onSubmit={handleSubmit} className="space-y-6 font-mono">
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider">
                  Achievement Title
                </label>
                <input
                  className="w-full bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white"
                  placeholder="e.g. AWS_CERTIFIED_SOLUTIONS_ARCHITECT"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  className="w-full bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white resize-none"
                  placeholder="Detailed logs of the achievement..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider">
                  Badge Type / Icon
                </label>
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {["military_tech", "workspace_premium", "star", "emoji_events"].map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setImageVal(icon)}
                      className={`border-2 rounded-xl p-2.5 flex items-center justify-center cursor-pointer transition-all bg-white dark:bg-neutral-900 text-black dark:text-white hover:scale-[1.02] shadow-neo-btn ${
                        imageVal === icon
                          ? "border-black dark:border-white ring-2 ring-black dark:ring-white"
                          : "border-black/30 dark:border-neutral-700 opacity-60"
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl font-bold">{icon}</span>
                    </button>
                  ))}
                </div>
                <div className="text-xs text-neutral-400 opacity-80 mb-2">
                  Or enter image URL:
                </div>
                <div className="flex flex-col gap-4">
                  <input
                    className="w-full bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white"
                    placeholder="https://... or custom icon name"
                    type="text"
                    value={imageVal}
                    onChange={(e) => setImageVal(e.target.value)}
                  />
                  
                  <label className="px-4 py-2.5 border-2 border-black dark:border-neutral-700 rounded-xl text-xs font-bold uppercase cursor-pointer hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-mono text-center shadow-neo-btn bg-white dark:bg-neutral-900">
                    UPLOAD IMAGE FILE
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                {imageVal.startsWith("data:") && (
                  <span className="text-[10px] font-bold text-green-600 uppercase block mt-2">
                    [ Custom Base64 Image Loaded ]
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider">
                  Credential URL (Optional)
                </label>
                <input
                  className="w-full bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white"
                  placeholder="https://credentials.com/..."
                  type="text"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider">
                  Tags (Comma Separated)
                </label>
                <input
                  className="w-full bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white"
                  placeholder="CLOUD, INFRA, SECURITY"
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  className="flex-1 bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-transparent py-3.5 rounded-xl font-bold font-mono text-xs flex justify-center items-center gap-2 hover:bg-neutral-850 dark:hover:bg-neutral-100 transition-all shadow-neo-btn cursor-pointer"
                  type="submit"
                >
                  <span className="material-symbols-outlined font-bold text-sm">
                    {editingId ? "save" : "add_circle"}
                  </span>
                  {editingId ? "COMMIT CHANGES" : "COMMIT TO REGISTRY"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white px-4 py-3.5 font-bold font-mono text-xs rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all shadow-neo-btn cursor-pointer"
                  >
                    CANCEL
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="p-6 border-2 border-black dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 rounded-[2rem] font-mono shadow-neo relative overflow-hidden">
            <h3 className="font-bold mb-2 text-xs">SYSTEM_NOTICE</h3>
            <p className="text-[11px] opacity-70 leading-relaxed">
              New records are instantly indexed but require a full &apos;DEPLOY_CHANGES&apos; action to propagate to the public API nodes.
            </p>
          </div>
        </section>

        {/* Right Side: ACHIEVEMENT_LIST */}
        <section className="lg:col-span-7 space-y-6">
          <header className="flex justify-between border-b-2 border-black dark:border-neutral-700 pb-4 items-center">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">
                ACHIEVEMENT LIST
              </h2>
              <p className="text-[10px] opacity-60 font-mono font-bold uppercase tracking-wider mt-1">
                COUNT: {String(achievements.length).padStart(2, "0")} ACTIVE RECORDS
              </p>
            </div>
          </header>

          <div className="space-y-6 max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
            {achievements.map((ach) => {
              const isEditing = editingId === ach.id;
              const hasIcon = isIcon(ach.image);

              return (
                <div
                  key={ach.id}
                  className={`border-2 p-6 bg-white dark:bg-neutral-900 rounded-[2.5rem] transition-all group shadow-neo hover:shadow-neo-lg ${
                    isEditing ? "border-black dark:border-white ring-2 ring-black dark:ring-white" : "border-black dark:border-neutral-700"
                  }`}
                >
                  <div className="flex gap-6 items-start">
                    <div className="w-20 h-20 border-2 border-black dark:border-neutral-700 rounded-2xl flex items-center justify-center bg-neutral-50 dark:bg-neutral-800 shrink-0 overflow-hidden relative shadow-neo-btn">
                      {hasIcon ? (
                        <span
                          className="material-symbols-outlined text-4xl text-black dark:text-white"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {ach.image || "military_tech"}
                        </span>
                      ) : (
                        <img
                          src={ach.image}
                          alt={ach.title}
                          className="w-full h-full object-cover grayscale"
                        />
                      )}
                    </div>
                    
                    <div className="flex-grow flex flex-col min-w-0">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-lg font-bold leading-snug break-words uppercase">
                          {ach.title}
                        </h3>
                        <div className="flex gap-2 shrink-0 font-mono text-[10px]">
                          <button
                            onClick={() => handleEdit(ach)}
                            className="px-2.5 py-1 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white font-bold uppercase rounded-lg shadow-neo-btn cursor-pointer"
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => handleDelete(ach.id)}
                            className="px-2.5 py-1 border-2 border-red-500 bg-white dark:bg-neutral-900 text-red-500 font-bold uppercase rounded-lg shadow-neo-btn cursor-pointer"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                      
                      <p className="font-mono text-xs mt-3 opacity-80 leading-relaxed whitespace-pre-line text-neutral-600 dark:text-neutral-300">
                        {ach.description}
                      </p>
                      
                      <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-1.5">
                        {ach.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] font-bold px-2 py-0.5 border border-black dark:border-neutral-600 rounded bg-white dark:bg-neutral-800 uppercase"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Achievement Card Empty / Add */}
            <div
              onClick={() => {
                handleClear();
                document.querySelector("input")?.focus();
              }}
              className="border-4 border-dashed border-black dark:border-neutral-700 rounded-[2.5rem] p-8 bg-transparent flex flex-col items-center justify-center opacity-40 hover:opacity-100 hover:scale-[1.01] cursor-pointer transition-all h-36 font-mono shadow-neo"
            >
              <span className="material-symbols-outlined text-4xl mb-2 font-bold">
                add_box
              </span>
              <span className="font-bold uppercase tracking-widest text-xs">
                INIT_NEW_RECORD
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
