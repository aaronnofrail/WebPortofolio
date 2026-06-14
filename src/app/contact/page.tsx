"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGate from "@/components/PortfolioGate";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("ERROR: Name, Email, and Message are required.");
      return;
    }
    setSubmitting(true);
    
    // Simulate submission (writes to localStorage for mockup, and would write to Sanity CMS in production)
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
        subject: formData.subject || "(No Subject)",
        message: formData.message,
        receivedAt: new Date().toISOString().replace("T", " ").substring(0, 19),
        read: false,
      };

      const updated = [newMsg, ...currentMessages];
      localStorage.setItem("aaronnofrail_inbox", JSON.stringify(updated));

      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <PortfolioGate>
      <Navbar />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex flex-col gap-12 z-10 relative">
        
        {/* Header */}
        <header className="flex flex-col gap-4 border-b border-primary pb-8">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg">
            <span className="text-secondary mr-2">&gt;</span>INITIATE_CONTACT<span className="terminal-caret ml-1"></span>
          </h1>
          <p className="font-body-lg text-body-lg max-w-2xl text-on-surface-variant">
            ESTABLISH A SECURE CONNECTION. SYSTEM IS READY TO RECEIVE TRANSMISSIONS.
          </p>
        </header>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Contact Form Block */}
          <div className="md:col-span-8 border border-primary p-6 md:p-8 bg-surface-container-lowest">
            <div className="flex items-center gap-2 border-b border-primary pb-4 mb-6">
              <span className="material-symbols-outlined text-secondary text-sm">terminal</span>
              <span className="font-code text-code text-secondary">echo $CONTACT_METHODS</span>
            </div>
            
            {submitted ? (
              <div className="border border-primary bg-secondary-container p-6 font-code text-code space-y-4">
                <p className="text-primary font-bold">&gt; TRANSMISSION_SUCCESSFUL [OK]</p>
                <p className="text-secondary">Your message has been queued in the system inbox. SYS_ADMIN will inspect the logs shortly.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-primary text-on-primary border border-primary px-4 py-2 hover:bg-surface hover:text-primary transition-colors cursor-pointer"
                >
                  [ SEND ANOTHER MESSAGE ]
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6 font-code text-code">
                <div className="flex flex-col gap-2">
                  <label className="text-secondary" htmlFor="name">&gt; input --name</label>
                  <input
                    className="bg-transparent border-0 border-b border-primary p-2 rounded-none focus:ring-0 focus:border-b-2 text-primary placeholder:opacity-35"
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="ENTER_IDENTIFIER"
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-secondary" htmlFor="email">&gt; input --email</label>
                  <input
                    className="bg-transparent border-0 border-b border-primary p-2 rounded-none focus:ring-0 focus:border-b-2 text-primary placeholder:opacity-35"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="ENTER_ADDRESS"
                    required
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-secondary" htmlFor="subject">&gt; input --subject</label>
                  <input
                    className="bg-transparent border-0 border-b border-primary p-2 rounded-none focus:ring-0 focus:border-b-2 text-primary placeholder:opacity-35"
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="ENTER_PROTOCOL"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-secondary" htmlFor="message">&gt; input --message body</label>
                  <textarea
                    className="bg-transparent border border-primary p-4 rounded-none focus:ring-0 focus:border-2 text-primary resize-none mt-2 placeholder:opacity-35"
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="TYPE_MESSAGE_HERE..."
                    required
                  ></textarea>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    className="group bg-primary text-on-primary border border-primary px-6 py-3 font-code text-code hover:bg-surface-container-lowest hover:text-primary transition-colors flex items-center gap-2 cursor-pointer"
                    type="submit"
                    disabled={submitting}
                  >
                    <span>{submitting ? "./sending..." : "./send.sh"}</span>
                    <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                      send
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
          
          {/* Side Blocks */}
          <div className="md:col-span-4 flex flex-col gap-8">
            {/* Socials Block */}
            <div className="border border-primary p-6 bg-surface-container-lowest">
              <div className="flex items-center gap-2 border-b border-primary pb-4 mb-6">
                <span className="material-symbols-outlined text-secondary text-sm">folder_open</span>
                <span className="font-code text-code text-secondary">ls -la /socials</span>
              </div>
              <ul className="flex flex-col gap-4 font-code text-code">
                <li className="flex items-center gap-4 hover:bg-surface-container-low p-2 -mx-2 transition-colors border-l-2 border-transparent hover:border-primary cursor-pointer group">
                  <span className="text-secondary text-xs">drwxr-xr-x</span>
                  <a
                    className="flex items-center gap-2 group-hover:text-primary text-secondary font-bold"
                    href="https://github.com/aaronnofrail"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GITHUB
                    <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      arrow_outward
                    </span>
                  </a>
                </li>
                <li className="flex items-center gap-4 hover:bg-surface-container-low p-2 -mx-2 transition-colors border-l-2 border-transparent hover:border-primary cursor-pointer group">
                  <span className="text-secondary text-xs">drwxr-xr-x</span>
                  <a
                    className="flex items-center gap-2 group-hover:text-primary text-secondary font-bold"
                    href="https://www.linkedin.com/in/arundaffa/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LINKEDIN
                    <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      arrow_outward
                    </span>
                  </a>
                </li>
                <li className="flex items-center gap-4 hover:bg-surface-container-low p-2 -mx-2 transition-colors border-l-2 border-transparent hover:border-primary cursor-pointer group">
                  <span className="text-secondary text-xs">-rw-r--r--</span>
                  <a
                    className="flex items-center gap-2 group-hover:text-primary text-secondary font-bold"
                    href="https://www.instagram.com/dfnhrr"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    INSTAGRAM
                    <span className="material-symbols-outlined text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      arrow_outward
                    </span>
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Mascot Block */}
            <div className="border border-primary p-6 bg-surface-container-lowest flex-grow flex flex-col">
              <div className="flex items-center gap-2 border-b border-primary pb-4 mb-6">
                <span className="material-symbols-outlined text-secondary text-sm">monitor</span>
                <span className="font-code text-code text-secondary">tail -f /var/log/cat.log</span>
              </div>
              <div className="flex-grow flex items-center justify-center relative overflow-hidden bg-surface-container-low border border-primary p-4 min-h-[120px]">
                <pre className="font-code text-label-sm leading-tight text-primary select-none pointer-events-none">
{`  /\\_/\\
 ( o.o )
  > ^ <`}
                </pre>
                <div className="absolute bottom-2 left-2 text-label-sm text-secondary">
                  [STATUS] IDLE_PURR...
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
