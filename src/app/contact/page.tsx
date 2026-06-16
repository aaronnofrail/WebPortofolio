"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGate from "@/components/PortfolioGate";
import { translations } from "@/data/translations";

const catRight0 = `   /\\_/\\     
  ( o.o )___ 
   > ^ <    \\
    / |  / | 
   (  | (  | `;

const catRight1 = `   /\\_/\\     
  ( o.o )___ 
   > ^ <    \\
    \\ |  \\ | 
    ( |  ( | `;

const catLeft0 = `      /\\_/\\  
   ___( o.o )
  /    > ^ < 
   | \\  | \\  
   |  ) |  ) `;

const catLeft1 = `      /\\_/\\  
   ___( o.o )
  /    > ^ < 
   / |  / |  
   ( Y  ( Y  `;

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Freelance",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const [catPos, setCatPos] = useState(0);
  const [catDir, setCatDir] = useState(1); // 1 = right, -1 = left
  const [catFrame, setCatFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCatFrame((prev) => (prev === 0 ? 1 : 0));
      setCatPos((prevPos) => {
        const step = 1.5;
        if (catDir === 1) {
          if (prevPos >= 72) {
            setCatDir(-1);
            return 72;
          }
          return prevPos + step;
        } else {
          if (prevPos <= 0) {
            setCatDir(1);
            return 0;
          }
          return prevPos - step;
        }
      });
    }, 150);
    return () => clearInterval(interval);
  }, [catDir]);

  const t = translations.en;

  const copyEmail = () => {
    navigator.clipboard.writeText("arundaffa.nahara@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("ERROR: Name, Email, and Message are required.");
      return;
    }
    setSubmitting(true);
    
    setTimeout(() => {
      const stored = localStorage.getItem("aaronnofrail_inbox");
      let currentMessages = [];
      if (stored) {
        try {
          currentMessages = JSON.parse(stored);
        } catch (err) {
          currentMessages = [];
        }
      }
      
      const newMsg = {
        id: `msg_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        receivedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        read: false,
      };

      const updated = [newMsg, ...currentMessages];
      localStorage.setItem("aaronnofrail_inbox", JSON.stringify(updated));

      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "Freelance", message: "" });
    }, 1200);
  };

  const subjects = [
    { key: "Freelance", label: "Freelance Project" },
    { key: "Internship", label: "Internship Opportunity" },
    { key: "Inquiry", label: "General Inquiry" },
  ];

  return (
    <PortfolioGate>
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-24 md:py-32 font-mono transition-colors duration-300 bg-white dark:bg-black text-black dark:text-white relative">
        
        {/* Decorative background grid pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative z-10">
          
          {/* Left Column: Direct Info & Socials */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-12">
            <div>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">
                {t.contact.title}
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm leading-relaxed max-w-sm">
                {t.contact.subtitle}
              </p>
            </div>

            {/* Copy Email Card */}
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
                {t.contact.emailLabel}
              </p>
              
              <button
                onClick={copyEmail}
                className="flex items-center gap-4 px-5 py-4 border-2 border-black dark:border-neutral-700 rounded-2xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:border-black transition-all group w-full md:w-auto text-left shadow-neo cursor-pointer"
              >
                <div className="p-2.5 bg-black text-white dark:bg-white dark:text-black rounded-full border border-black dark:border-transparent group-hover:scale-105 transition-transform flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] block">mail</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-black dark:text-white">
                    arundaffa.nahara@gmail.com
                  </span>
                  <span className="text-[10px] text-neutral-400 font-semibold uppercase mt-0.5">
                    {copied ? t.contact.copied : t.contact.copyBtn}
                  </span>
                </div>
              </button>
            </div>

            {/* Socials Card */}
            <div className="border-2 border-black dark:border-neutral-700 p-6 rounded-[2rem] bg-white dark:bg-neutral-900 shadow-neo">
              <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3 mb-4">
                <span className="material-symbols-outlined text-[16px]">folder_open</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  {t.contact.socialsLabel}
                </span>
              </div>
              <ul className="flex flex-col gap-2.5 text-xs">
                <li className="flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 rounded-lg transition-colors group">
                  <a
                    className="flex items-center gap-2 text-black dark:text-white font-bold"
                    href="https://github.com/aaronnofrail"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>GITHUB</span>
                    <span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">
                      arrow_outward
                    </span>
                  </a>
                  <svg className="w-4 h-4 fill-current text-neutral-500 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                </li>
                <li className="flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 rounded-lg transition-colors group">
                  <a
                    className="flex items-center gap-2 text-black dark:text-white font-bold"
                    href="https://www.linkedin.com/in/arundaffa/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>LINKEDIN</span>
                    <span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">
                      arrow_outward
                    </span>
                  </a>
                  <svg className="w-4 h-4 fill-current text-neutral-500 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z"/>
                  </svg>
                </li>
                <li className="flex items-center justify-between hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 rounded-lg transition-colors group">
                  <a
                    className="flex items-center gap-2 text-black dark:text-white font-bold"
                    href="https://www.instagram.com/dfnhrr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>INSTAGRAM</span>
                    <span className="material-symbols-outlined text-[12px] opacity-0 group-hover:opacity-100 transition-opacity">
                      arrow_outward
                    </span>
                  </a>
                  <svg className="w-4 h-4 fill-current text-neutral-500 dark:text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="border-2 border-black dark:border-neutral-700 p-6 md:p-8 rounded-[2rem] bg-white dark:bg-neutral-900 shadow-neo">
              
              <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3 mb-6">
                <span className="material-symbols-outlined text-[16px] text-neutral-400">terminal</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  {t.contact.formTitle}
                </span>
              </div>

              {submitted ? (
                <div className="border-2 border-black dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 p-6 rounded-2xl space-y-4">
                  <p className="text-green-500 font-bold flex items-center gap-1.5 text-xs">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    {t.contact.successTitle}
                  </p>
                  <p className="text-neutral-500 text-xs leading-relaxed">
                    {t.contact.successMsg}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="bg-black dark:bg-white text-white dark:text-black border border-black dark:border-transparent px-4 py-2 text-xs font-bold uppercase rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer shadow-neo-btn"
                  >
                    {t.contact.sendAnother}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-sm">
                  {/* Name field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest" htmlFor="name">
                      {t.contact.formName}
                    </label>
                    <input
                      className="bg-transparent border-0 border-b border-black dark:border-neutral-700 py-2.5 focus:ring-0 focus:border-b-2 focus:border-black dark:focus:border-white text-black dark:text-white rounded-none outline-none font-mono text-sm placeholder:opacity-35"
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="username"
                      required
                    />
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest" htmlFor="email">
                      {t.contact.formEmail}
                    </label>
                    <input
                      className="bg-transparent border-0 border-b border-black dark:border-neutral-700 py-2.5 focus:ring-0 focus:border-b-2 focus:border-black dark:focus:border-white text-black dark:text-white rounded-none outline-none font-mono text-sm placeholder:opacity-35"
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="youremail@gmail.com"
                      required
                    />
                  </div>

                  {/* Subject field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest" htmlFor="subject">
                      {t.contact.formSubject}
                    </label>
                    <select
                      className="bg-white dark:bg-neutral-900 border-2 border-black dark:border-neutral-700 py-2 px-3 focus:ring-0 outline-none font-mono text-sm rounded-lg text-black dark:text-white cursor-pointer"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    >
                      {subjects.map((subj) => (
                        <option key={subj.key} value={subj.key}>
                          {subj.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message field */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest" htmlFor="message">
                      {t.contact.formMsg}
                    </label>
                    <textarea
                      className="bg-transparent border-2 border-black dark:border-neutral-700 p-4 focus:ring-0 outline-none text-black dark:text-white rounded-xl resize-none mt-1 placeholder:opacity-30 text-xs"
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder={t.contact.formPlaceholderMsg}
                      required
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="mt-4 flex justify-end">
                    <button
                      className="group bg-black dark:bg-white text-white dark:text-black border-2 border-black dark:border-transparent px-6 py-3 font-bold text-xs uppercase tracking-widest rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center gap-1.5 shadow-neo-btn cursor-pointer"
                      type="submit"
                      disabled={submitting}
                    >
                      <span>{submitting ? t.contact.formSending : t.contact.formSend}</span>
                      <span className="material-symbols-outlined text-[14px] group-hover:translate-x-1 transition-transform">
                        send
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* ASCII Cat Mascot frame */}
            <div className="border-2 border-black dark:border-neutral-700 p-6 rounded-[2rem] bg-white dark:bg-neutral-900 shadow-neo flex-grow flex flex-col min-h-[180px]">
              <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3 mb-4">
                <span className="material-symbols-outlined text-[16px] text-neutral-400">monitor</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">tail -f cat_status.log</span>
              </div>
              <div className="flex-grow flex items-center justify-start relative overflow-hidden bg-neutral-100 dark:bg-neutral-850 rounded-xl p-4 border border-neutral-200 dark:border-neutral-700 min-h-[120px]">
                <pre
                  className="absolute font-mono text-xs leading-tight text-black dark:text-white select-none pointer-events-none font-bold transition-all duration-[150ms] ease-linear"
                  style={{
                    left: `${catPos}%`,
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  {catDir === 1
                    ? catFrame === 0
                      ? catRight0
                      : catRight1
                    : catFrame === 0
                    ? catLeft0
                    : catLeft1}
                </pre>
                <div className="absolute bottom-2 left-3 text-[9px] text-neutral-400 uppercase tracking-widest font-bold">
                  [STATUS] PATROLLING...
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </PortfolioGate>
  );
}
