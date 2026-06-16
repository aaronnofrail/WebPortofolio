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

  useEffect(() => {
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
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImageVal(reader.result);
      }
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
    <div className="space-y-12">
      {/* Page Header */}
      <div className="border-l-4 border-primary pl-6">
        <h2 className="font-headline-lg text-headline-lg uppercase mb-2">
          ACHIEVEMENTS CATALOGUE
        </h2>
        <p className="font-body-lg text-body-lg opacity-70">
          Configure professional validation metrics, awards, and certification logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Side: ACHIEVEMENT_REGISTRY */}
        <section className="lg:col-span-5 space-y-8">
          <div className="border border-primary p-6 bg-surface">
            <header className="border-b border-primary pb-4 mb-8">
              <h2 className="font-headline-md text-headline-md font-bold uppercase tracking-tight">
                {editingId ? "EDIT REGISTRY" : "ACHIEVEMENT REGISTRY"}
              </h2>
            </header>
            
            <form onSubmit={handleSubmit} className="space-y-8 font-code">
              <div className="space-y-2">
                <label className="block text-label-sm font-bold uppercase tracking-wider">
                  Achievement Title
                </label>
                <input
                  className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-primary px-0 py-2 font-code focus:ring-0 outline-none focus:border-b-2"
                  placeholder="e.g. AWS_CERTIFIED_SOLUTIONS_ARCHITECT"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-label-sm font-bold uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  className="w-full bg-transparent border border-primary p-3 font-code focus:ring-0 outline-none"
                  placeholder="Detailed logs of the achievement..."
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-label-sm font-bold uppercase tracking-wider">
                  Badge Type / Icon
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {["military_tech", "workspace_premium", "star", "emoji_events"].map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setImageVal(icon)}
                      className={`border p-2 flex items-center justify-center cursor-pointer ${
                        imageVal === icon
                          ? "bg-primary text-on-primary border-primary"
                          : "border-primary hover:bg-surface-container"
                      }`}
                    >
                      <span className="material-symbols-outlined text-2xl">{icon}</span>
                    </button>
                  ))}
                </div>
                <div className="text-xs text-secondary opacity-60 mb-2">
                  Or enter image URL:
                </div>
                <div className="flex flex-col gap-4">
                  <input
                    className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-primary px-0 py-2 font-code focus:ring-0 outline-none focus:border-b-2"
                    placeholder="https://... or custom icon name"
                    type="text"
                    value={imageVal}
                    onChange={(e) => setImageVal(e.target.value)}
                  />
                  
                  <label className="px-4 py-2 border border-primary text-xs font-bold uppercase cursor-pointer hover:bg-primary hover:text-on-primary transition-all font-code text-center">
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
                  <span className="text-[10px] font-bold text-green-600 uppercase font-code block mt-2">
                    [ Custom Base64 Image Loaded ]
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-label-sm font-bold uppercase tracking-wider">
                  Tags (Comma Separated)
                </label>
                <input
                  className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b border-primary px-0 py-2 font-code focus:ring-0 outline-none focus:border-b-2"
                  placeholder="CLOUD, INFRA, SECURITY"
                  type="text"
                  value={tagsText}
                  onChange={(e) => setTagsText(e.target.value)}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  className="flex-1 bg-primary text-on-primary py-4 font-bold font-code flex justify-center items-center gap-2 hover:bg-surface hover:text-primary border border-primary transition-all cursor-pointer"
                  type="submit"
                >
                  <span className="material-symbols-outlined">
                    {editingId ? "save" : "add_circle"}
                  </span>
                  {editingId ? "COMMIT CHANGES" : "COMMIT TO REGISTRY"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="border border-primary px-4 py-4 font-bold font-code hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
                  >
                    CANCEL
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="p-6 border border-primary bg-secondary-container font-code">
            <h3 className="font-code font-bold mb-2">SYSTEM_NOTICE</h3>
            <p className="text-body-md opacity-70">
              New records are instantly indexed but require a full &apos;DEPLOY_CHANGES&apos; action to propagate to the public API nodes.
            </p>
          </div>
        </section>

        {/* Right Side: ACHIEVEMENT_LIST */}
        <section className="lg:col-span-7 space-y-6">
          <header className="flex justify-between border-b-2 border-primary pb-4 items-center">
            <div>
              <h2 className="font-headline-md text-headline-md font-bold uppercase tracking-tight">
                ACHIEVEMENT LIST
              </h2>
              <p className="text-label-sm opacity-60 font-code">
                COUNT: {String(achievements.length).padStart(2, "0")} ACTIVE RECORDS
              </p>
            </div>
          </header>

          <div className="space-y-4 max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
            {achievements.map((ach) => {
              const isEditing = editingId === ach.id;
              const hasIcon = isIcon(ach.image);

              return (
                <div
                  key={ach.id}
                  className={`border p-6 bg-surface transition-all group ${
                    isEditing ? "border-2 border-primary" : "border-primary hover:bg-secondary-container"
                  }`}
                >
                  <div className="flex gap-6 items-start">
                    <div className="w-24 h-24 border border-primary flex items-center justify-center bg-white shrink-0 overflow-hidden">
                      {hasIcon ? (
                        <span
                          className="material-symbols-outlined text-5xl text-primary"
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
                        <h3 className="font-headline-md font-bold leading-tight break-words uppercase">
                          {ach.title}
                        </h3>
                        <div className="flex gap-2 shrink-0 font-code">
                          <button
                            onClick={() => handleEdit(ach)}
                            className="text-label-sm font-bold border border-primary px-2 py-1 hover:bg-primary hover:text-white transition-all cursor-pointer"
                          >
                            EDIT
                          </button>
                          <button
                            onClick={() => handleDelete(ach.id)}
                            className="text-label-sm font-bold border border-primary px-2 py-1 text-error hover:bg-error hover:text-white transition-all cursor-pointer"
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-body-md font-code mt-3 opacity-80 whitespace-pre-line">
                        {ach.description}
                      </p>
                      
                      <div className="mt-4 pt-4 border-t border-primary/10 flex flex-wrap gap-2">
                        {ach.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 border border-primary text-label-sm uppercase font-bold font-code"
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
              className="border-2 border-dashed border-primary p-8 bg-transparent flex flex-col items-center justify-center opacity-40 hover:opacity-100 cursor-pointer transition-all h-36 font-code"
            >
              <span className="material-symbols-outlined text-4xl mb-2">
                add_box
              </span>
              <span className="font-bold uppercase tracking-widest">
                INIT_NEW_RECORD
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
