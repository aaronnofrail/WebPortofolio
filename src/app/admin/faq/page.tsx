"use client";

import { useEffect, useState } from "react";
import { mockFAQs, FAQ } from "@/data/mockData";
import {
  createFAQAction,
  updateFAQAction,
  deleteFAQAction,
} from "@/app/actions/sanityActions";
import { addActivityLog } from "@/utils/activityLogger";

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"IDLE" | "SAVING" | "SAVED" | "ERROR">("IDLE");

  useEffect(() => {
    const isSanityConfigured =
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "aaronnofrail_project";

    if (isSanityConfigured) {
      import("@/sanity/client").then(({ client }) => {
        client
          .fetch(`*[_type == "faq"] | order(order asc)`)
          .then((fetched: any[]) => {
            if (fetched && fetched.length > 0) {
              const mapped = fetched.map((item) => ({
                id: item._id,
                question: item.question,
                answer: item.answer,
              }));
              setFaqs(mapped);
            } else {
              loadFromLocalStorage();
            }
          })
          .catch((err) => {
            console.error("Failed to fetch FAQs from Sanity, using localStorage fallback:", err);
            loadFromLocalStorage();
          });
      });
    } else {
      loadFromLocalStorage();
    }

    function loadFromLocalStorage() {
      const stored = localStorage.getItem("aaronnofrail_faqs");
      if (stored) {
        try {
          setFaqs(JSON.parse(stored));
        } catch (e) {
          setFaqs(mockFAQs);
        }
      } else {
        setFaqs(mockFAQs);
      }
    }
  }, []);

  const saveToStorage = (updated: FAQ[]) => {
    localStorage.setItem("aaronnofrail_faqs", JSON.stringify(updated));
  };

  const handleClear = () => {
    setQuestion("");
    setAnswer("");
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;
    setSaveStatus("SAVING");

    try {
      if (editingId) {
        // Edit
        const updatedNode = {
          question: question.trim(),
          answer: answer.trim(),
        };

        const res = await updateFAQAction(editingId, updatedNode);
        if (res && !res.success) {
          console.error("Failed to update FAQ in Sanity:", res.error);
          setSaveStatus("ERROR");
          setTimeout(() => setSaveStatus("IDLE"), 2000);
          return;
        }

        const updated = faqs.map((faq) => {
          if (faq.id === editingId) {
            return {
              ...faq,
              ...updatedNode,
            };
          }
          return faq;
        });
        setFaqs(updated);
        saveToStorage(updated);
        addActivityLog(`FAQ: Updated query '${updatedNode.question.substring(0, 30)}...'`, "info");
      } else {
        // Add
        const newFaq: FAQ = {
          id: `faq_${Date.now()}`,
          question: question.trim(),
          answer: answer.trim(),
        };

        const res = await createFAQAction(newFaq);
        if (res && !res.success) {
          console.error("Failed to create FAQ in Sanity:", res.error);
          setSaveStatus("ERROR");
          setTimeout(() => setSaveStatus("IDLE"), 2000);
          return;
        }

        const updated = [...faqs, newFaq];
        setFaqs(updated);
        saveToStorage(updated);
        addActivityLog(`FAQ: Created new query '${newFaq.question.substring(0, 30)}...'`, "info");
      }

      setSaveStatus("SAVED");
      setTimeout(() => setSaveStatus("IDLE"), 2000);
      handleClear();
    } catch (err) {
      console.error("Failed to save FAQ:", err);
      setSaveStatus("ERROR");
      setTimeout(() => setSaveStatus("IDLE"), 2000);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
  };

  const handleDelete = (id: string) => {
    if (!confirm("CONFIRM_DELETION: This action is irreversible.")) return;
    const deletedFaq = faqs.find((f) => f.id === id);
    const questionStr = deletedFaq ? deletedFaq.question.substring(0, 30) : id;
    deleteFAQAction(id);
    const updated = faqs.filter((faq) => faq.id !== id);
    setFaqs(updated);
    saveToStorage(updated);
    addActivityLog(`FAQ: Deleted query '${questionStr}...'`, "error");
    if (editingId === id) {
      handleClear();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-black dark:text-white">
      {/* Left Column: FAQ List */}
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between border-b-2 border-black dark:border-neutral-700 pb-2">
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Existing Queries
          </h2>
          <span className="font-mono text-xs font-bold text-neutral-400">
            COUNT: {String(faqs.length).padStart(2, "0")}
          </span>
        </div>
        
        <div className="space-y-6 max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
          {faqs.map((faq, index) => {
            const isEditing = editingId === faq.id;
            
            return (
              <div
                key={faq.id}
                className={`border-2 p-5 bg-white dark:bg-neutral-900 rounded-[2rem] hover:shadow-neo shadow-neo-btn transition-all group ${
                  isEditing ? "border-black dark:border-white ring-2 ring-black dark:ring-white" : "border-black dark:border-neutral-700"
                }`}
              >
                <div className="flex justify-between items-start mb-3 font-mono text-xs">
                  <span className="text-neutral-400 font-bold">
                    ID: QA {String(index + 1).padStart(3, "0")}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="px-2.5 py-1 border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white text-[10px] font-bold uppercase rounded-lg shadow-neo-btn cursor-pointer"
                      title="Edit Entry"
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="px-2.5 py-1 border-2 border-red-500 bg-white dark:bg-neutral-900 text-red-500 text-[10px] font-bold uppercase rounded-lg shadow-neo-btn cursor-pointer"
                      title="Delete Entry"
                    >
                      DEL
                    </button>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold mb-3 flex items-start">
                  <span className="mr-2 text-neutral-500">Q:</span>
                  <span>{faq.question}</span>
                </h3>
                
                <p className="text-sm text-neutral-600 dark:text-neutral-300 border-l-2 border-black dark:border-neutral-700 pl-4 py-1 leading-relaxed whitespace-pre-line">
                  <span className="font-bold mr-1">A:</span>
                  {faq.answer}
                </p>
              </div>
            );
          })}

          {faqs.length === 0 && (
            <div className="border-4 border-dashed border-black dark:border-neutral-700 p-12 text-center text-neutral-400 font-mono rounded-[2rem]">
              NO_FAQ_ENTRIES_DEFINED
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Create New Form */}
      <div className="col-span-12 lg:col-span-5">
        <div className="sticky top-8">
          <div className="border-4 border-black dark:border-neutral-700 p-6 md:p-8 bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-neo-lg">
            <div className="mb-6 font-mono border-b-2 border-black/10 dark:border-white/10 pb-4">
              <h2 className="text-2xl font-black uppercase mb-1">
                {editingId ? "Edit Entry" : "Create New Entry"}
              </h2>
              <p className="text-[10px] opacity-60">
                {editingId ? `RECORD_UID: ${editingId}` : "ADDITION_MODULE // v2.0"}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="font-mono">
              <fieldset disabled={saveStatus === "SAVING"} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase mb-2">
                  Question Input
                </label>
                <div className="relative group">
                  <input
                    className="w-full bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white"
                    placeholder="Enter query text..."
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    maxLength={120}
                    required
                  />
                  <span className="absolute right-3 bottom-3 text-[9px] opacity-35">
                    {question.length}/120
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase mb-2">
                  Response Textarea
                </label>
                <div className="relative">
                  <textarea
                    className="w-full bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white text-black dark:text-white resize-none"
                    placeholder="Enter detailed answer here..."
                    rows={6}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    maxLength={500}
                    required
                  />
                  <span className="absolute right-3 bottom-3 text-[9px] opacity-35">
                    {answer.length}/500
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  className="w-full border-2 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-white py-3 rounded-xl font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all shadow-neo-btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono text-xs uppercase"
                  type="button"
                  onClick={handleClear}
                  disabled={saveStatus === "SAVING"}
                >
                  CLEAR FORM
                </button>
                <button
                  className="w-full bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-transparent py-3 rounded-xl font-bold hover:bg-neutral-850 dark:hover:bg-neutral-100 transition-all shadow-neo-btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono text-xs uppercase"
                  type="submit"
                  disabled={saveStatus === "SAVING"}
                >
                  {saveStatus === "SAVING"
                    ? "SAVING..."
                    : saveStatus === "SAVED"
                    ? "SAVED [OK]"
                    : saveStatus === "ERROR"
                    ? "SAVE ERROR"
                    : editingId
                    ? "SAVE ENTRY"
                    : "COMMIT ENTRY"}
                </button>
              </div>
              </fieldset>
            </form>
          </div>

          {/* Documentation Card */}
          <div className="mt-8 border-2 border-black dark:border-neutral-700 p-6 bg-neutral-100 dark:bg-neutral-800 rounded-[2rem] relative overflow-hidden font-mono shadow-neo">
            <div className="relative z-10">
              <h4 className="text-xs font-bold flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[16px] font-bold">info</span>
                SYSTEM HINT
              </h4>
              <p className="text-[11px] leading-relaxed opacity-80">
                Entries are automatically indexed for the global knowledge base upon commitment. Ensure responses adhere to the markdown standards defined in ROOT/DOCS.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <span className="material-symbols-outlined text-[120px]">
                terminal
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
