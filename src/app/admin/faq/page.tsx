"use client";

import { useEffect, useState } from "react";
import { mockFAQs, FAQ } from "@/data/mockData";
import {
  createFAQAction,
  updateFAQAction,
  deleteFAQAction,
} from "@/app/actions/sanityActions";

export default function AdminFAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  const saveToStorage = (updated: FAQ[]) => {
    localStorage.setItem("aaronnofrail_faqs", JSON.stringify(updated));
  };

  const handleClear = () => {
    setQuestion("");
    setAnswer("");
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    if (editingId) {
      // Edit
      const updated = faqs.map((faq) => {
        if (faq.id === editingId) {
          const updatedNode = {
            ...faq,
            question: question.trim(),
            answer: answer.trim(),
          };
          updateFAQAction(faq.id, updatedNode);
          return updatedNode;
        }
        return faq;
      });
      setFaqs(updated);
      saveToStorage(updated);
    } else {
      // Add
      const newFaq: FAQ = {
        id: `faq_${Date.now()}`,
        question: question.trim(),
        answer: answer.trim(),
      };
      createFAQAction(newFaq);
      const updated = [...faqs, newFaq];
      setFaqs(updated);
      saveToStorage(updated);
    }

    handleClear();
  };

  const handleEdit = (faq: FAQ) => {
    setEditingId(faq.id);
    setQuestion(faq.question);
    setAnswer(faq.answer);
  };

  const handleDelete = (id: string) => {
    if (!confirm("CONFIRM_DELETION: This action is irreversible.")) return;
    deleteFAQAction(id);
    const updated = faqs.filter((faq) => faq.id !== id);
    setFaqs(updated);
    saveToStorage(updated);
    if (editingId === id) {
      handleClear();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: FAQ List */}
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between border-b border-primary pb-2">
          <h2 className="font-headline-md text-headline-md font-bold uppercase tracking-tight">
            Existing_Queries
          </h2>
          <span className="font-code text-label-sm opacity-50">
            COUNT: {String(faqs.length).padStart(2, "0")}
          </span>
        </div>
        
        <div className="space-y-4 max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
          {faqs.map((faq, index) => {
            const isEditing = editingId === faq.id;
            
            return (
              <div
                key={faq.id}
                className={`border p-4 bg-surface hover:bg-surface-container-low transition-all group ${
                  isEditing ? "border-2 border-primary shadow-[2px_2px_0px_0px_#000000]" : "border-primary"
                }`}
              >
                <div className="flex justify-between items-start mb-2 font-code">
                  <span className="text-label-sm text-secondary opacity-65">
                    ID: QA_{String(index + 1).padStart(3, "0")}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(faq)}
                      className="p-1 border border-transparent hover:border-primary transition-all cursor-pointer"
                      title="Edit Entry"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        edit_note
                      </span>
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="p-1 border border-transparent hover:border-primary text-error transition-all cursor-pointer"
                      title="Delete Entry"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        delete_sweep
                      </span>
                    </button>
                  </div>
                </div>
                
                <h3 className="font-body-lg font-bold mb-3 flex items-start">
                  <span className="mr-2 text-primary">Q:</span>
                  <span>{faq.question}</span>
                </h3>
                
                <p className="font-body-md text-on-surface-variant border-l border-primary pl-4 py-1 leading-relaxed whitespace-pre-line">
                  <span className="font-bold mr-1">A:</span>
                  {faq.answer}
                </p>
              </div>
            );
          })}

          {faqs.length === 0 && (
            <div className="border border-primary border-dashed p-12 text-center text-secondary font-code">
              NO_FAQ_ENTRIES_DEFINED
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Create New Form */}
      <div className="col-span-12 lg:col-span-5">
        <div className="sticky top-8">
          <div className="border border-primary p-6 bg-surface">
            <div className="mb-8 font-code">
              <h2 className="font-headline-md text-headline-md font-bold uppercase mb-2">
                {editingId ? "Edit_Entry" : "Create_New_Entry"}
              </h2>
              <p className="text-label-sm opacity-60">
                {editingId ? `RECORD_UID: ${editingId}` : "ADDITION_MODULE // v2.0"}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8 font-code">
              <div>
                <label className="block font-code text-label-sm font-bold uppercase mb-2 text-on-surface">
                  Question_Input
                </label>
                <div className="relative group">
                  <input
                    className="w-full bg-transparent border-t-0 border-x-0 border-b border-primary p-2 font-body-md transition-all outline-none focus:border-b-2"
                    placeholder="Enter query text..."
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    maxLength={120}
                    required
                  />
                  <span className="absolute right-2 bottom-2 font-code text-label-sm opacity-20">
                    CHARS: {question.length}/120
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-code text-label-sm font-bold uppercase mb-2 text-on-surface">
                  Response_Textarea
                </label>
                <div className="relative">
                  <textarea
                    className="w-full bg-transparent border border-primary p-2 font-body-md resize-none transition-all outline-none"
                    placeholder="Enter detailed answer here..."
                    rows={6}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    maxLength={500}
                    required
                  />
                  <span className="absolute right-2 bottom-2 font-code text-label-sm opacity-20">
                    CHARS: {answer.length}/500
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  className="w-full border border-primary bg-surface py-3 font-code font-bold hover:bg-primary hover:text-on-primary transition-all cursor-pointer"
                  type="button"
                  onClick={handleClear}
                >
                  CLEAR_FORM
                </button>
                <button
                  className="w-full bg-primary text-on-primary py-3 font-code font-bold hover:bg-surface hover:text-primary border border-primary transition-all cursor-pointer"
                  type="submit"
                >
                  {editingId ? "SAVE_ENTRY" : "COMMIT_ENTRY"}
                </button>
              </div>
            </form>
          </div>

          {/* Documentation Card */}
          <div className="mt-8 border border-primary p-6 bg-secondary-container relative overflow-hidden font-code">
            <div className="relative z-10">
              <h4 className="text-label-sm font-bold flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[16px]">info</span>
                SYSTEM_HINT
              </h4>
              <p className="text-label-sm leading-relaxed opacity-80">
                Entries are automatically indexed for the global knowledge base upon commitment. Ensure responses adhere to the markdown standards defined in ROOT/DOCS.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
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
