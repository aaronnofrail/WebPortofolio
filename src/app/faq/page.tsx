"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGate from "@/components/PortfolioGate";
import { mockFAQs, FAQ } from "@/data/mockData";

interface TerminalLine {
  type: "command" | "text" | "error" | "help" | "neofetch" | "faq" | "ls";
  text: string;
  faqList?: FAQ[];
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(mockFAQs);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([

  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("aaronnofrail_faqs");
    if (stored) {
      try {
        setFaqs(JSON.parse(stored));
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    // Scroll terminal to bottom when lines change
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLines]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const command = inputValue.trim();
      if (!command) return;

      // Add to history list for up/down arrow indexing
      const newHistory = [...history, command];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length);

      // Add entered command line to terminal
      const updatedLines: TerminalLine[] = [
        ...terminalLines,
        { type: "command", text: command },
      ];

      setTerminalLines(updatedLines);
      setInputValue("");
      processCommand(command, updatedLines);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex - 1;
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInputValue(history[nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = historyIndex + 1;
      if (nextIndex < history.length) {
        setHistoryIndex(nextIndex);
        setInputValue(history[nextIndex]);
      } else {
        setHistoryIndex(history.length);
        setInputValue("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      // Auto-complete file names
      const parts = inputValue.split(" ");
      if (parts[0] === "cat" && parts[1] !== undefined) {
        const filePrefix = parts[1].toLowerCase();
        const files = [
          "faq",
          "who-are-u",
          "what-keeps-you-up-at-night",
          "what-is-your-fav-in-ctf",
          "what-is-your-fav-tools",
          "how-to-reach-you",
          "are-you-taken",
        ];
        const match = files.find((f) => f.startsWith(filePrefix));
        if (match) {
          setInputValue(`cat ${match}`);
        }
      }
    }
  };

  const processCommand = (commandStr: string, currentLines: TerminalLine[]) => {
    const cleanCommand = commandStr.toLowerCase().trim();
    const parts = cleanCommand.split(/\s+/);
    const mainCommand = parts[0];
    const argument = parts.slice(1).join(" ");

    setTimeout(() => {
      if (mainCommand === "clear") {
        setTerminalLines([]);
      } else if (mainCommand === "help") {
        setTerminalLines([
          ...currentLines,
          {
            type: "help",
            text: `Available commands:
  help                             - Show this menu
  ls                               - List files in current directory
  cat <filename>                   - Display contents of a file
  neofetch                         - Display system specifications
  clear                            - Clear terminal screen

Files available for cat:
  faq                              - The FAQ database
  who-are-u                        - Core profile description
  what-keeps-you-up-at-night       - Logical challenges interest
  what-is-your-fav-in-ctf          - Favorite CTF categories
  what-is-your-fav-tools           - Favorite tools used
  how-to-reach-you                 - Contact information
  are-you-taken                    - Relationship status / interest`,
          },
        ]);
      } else if (mainCommand === "ls") {
        setTerminalLines([
          ...currentLines,
          {
            type: "ls",
            text: "faq    who-are-u    what-keeps-you-up-at-night    what-is-your-fav-in-ctf    what-is-your-fav-tools    how-to-reach-you    are-you-taken",
          },
        ]);
      } else if (mainCommand === "neofetch") {
        setTerminalLines([
          ...currentLines,
          { type: "neofetch", text: "" },
        ]);
      } else if (mainCommand === "cat") {
        if (!argument) {
          setTerminalLines([
            ...currentLines,
            {
              type: "error",
              text: "cat: missing filename. Usage: cat <filename>. Type 'help' for files.",
            },
          ]);
        } else if (
          argument === "frequently_asked_questions.txt" ||
          argument === "faq" ||
          argument === "frequently_asked_questions"
        ) {
          setTerminalLines([
            ...currentLines,
            {
              type: "faq",
              text: "",
              faqList: faqs,
            },
          ]);
        } else if (argument === "who-are-u") {
          const storedBio = localStorage.getItem("aaronnofrail_bio");
          let bioDesc = "";
          if (storedBio) {
            try {
              const parsed = JSON.parse(storedBio);
              if (parsed.description && parsed.description.includes("Computer Science geek")) {
                localStorage.removeItem("aaronnofrail_bio");
              } else {
                bioDesc = parsed.description;
              }
            } catch (e) { }
          }
          const finalDesc =
            bioDesc ||
            "aaronnofrail, also known as Arundaffa Nahara, is a Undergraduate Student from the Informatics Engineering department at Universitas Hasanuddin. Currently in his 2nd semester. He is currently looking for internship/freelance opportunities. if you're interested, please contact him via email.";
          setTerminalLines([
            ...currentLines,
            { type: "text", text: finalDesc },
          ]);
        } else if (argument === "what-keeps-you-up-at-night") {
          setTerminalLines([
            ...currentLines,
            {
              type: "text",
              text: "I enjoy challenges that require logic, carefulness, and creativity. especially Capture the Flag.",
            },
          ]);
        } else if (argument === "what-is-your-fav-in-ctf") {
          setTerminalLines([
            ...currentLines,
            {
              type: "text",
              text: "Web Exploitation, Cryptography, Forensics and OSINT.",
            },
          ]);
        } else if (argument === "what-is-your-fav-tools") {
          setTerminalLines([
            ...currentLines,
            {
              type: "text",
              text: "I mostly use Aperisolve, Wireshark, Burp Suite, CyberChef, Dcode, OSINT Framework, Ghidra, IDA, pwntools and custom scripts for solving challenges.",
            },
          ]);
        } else if (argument === "how-to-reach-you") {
          setTerminalLines([
            ...currentLines,
            {
              type: "text",
              text: "The best way to reach me is via email at arundaffa.nahara@gmail.com — I'm open to internships, colaborations, projects, and mentorship opportunities.",
            },
          ]);
        } else if (argument === "are-you-taken") {
          setTerminalLines([
            ...currentLines,
            {
              type: "text",
              text: "yes, i’m happily married to mai sakurajima — but if you're interested to work with me, feel free to reach me via email at arundaffa.nahara@gmail.com or DM me on instagram @dfnhrr",
            },
          ]);
        } else {
          setTerminalLines([
            ...currentLines,
            {
              type: "error",
              text: `cat: ${argument}: No such file. Type 'ls' to see list of files.`,
            },
          ]);
        }
      } else {
        setTerminalLines([
          ...currentLines,
          {
            type: "error",
            text: `bash: ${commandStr}: command not found. Type 'help' to see list of commands.`,
          },
        ]);
      }
    }, 100);
  };

  const renderTerminalLine = (line: TerminalLine, index: number) => {
    switch (line.type) {
      case "command":
        return (
          <div key={index} className="flex flex-wrap items-center gap-2 font-code">
            <span className="text-secondary select-none">aaron@nofrail:~$</span>
            <span className="text-primary font-bold break-all">{line.text}</span>
          </div>
        );
      case "text":
        return (
          <div key={index} className="whitespace-pre-wrap leading-relaxed text-primary break-words font-code">
            {line.text}
          </div>
        );
      case "help":
        return (
          <pre key={index} className="whitespace-pre-wrap leading-relaxed text-secondary break-words font-code max-w-full overflow-x-auto">
            {line.text}
          </pre>
        );
      case "ls":
        return (
          <div key={index} className="text-primary font-bold font-code break-words max-w-full">
            {line.text}
          </div>
        );
      case "error":
        return (
          <div key={index} className="text-error font-bold font-code break-words">
            {line.text}
          </div>
        );
      case "faq":
        return (
          <div key={index} className="flex flex-col gap-6 pl-0 md:pl-4 max-w-full">
            {line.faqList?.map((faq) => (
              <article key={faq.id} className="flex flex-col gap-2">
                <div className="flex gap-2 items-start font-bold font-code text-code text-primary">
                  <span className="text-secondary select-none">&gt;</span>
                  <h3>{faq.question}</h3>
                </div>
                <div className="pl-4 text-on-surface-variant max-w-full font-code text-code leading-relaxed break-words whitespace-pre-wrap">
                  <p>{faq.answer}</p>
                </div>
              </article>
            ))}
          </div>
        );
      case "neofetch":
        return (
          <div key={index} className="flex flex-col md:flex-row gap-8 items-start max-w-full overflow-x-auto">
            {/* ASCII Art */}
            <pre className="font-code text-code leading-none text-secondary hidden md:block select-none shrink-0">
              {`    /\\  /\\
   /  \\/  \\
  /        \\
 /__________\\
 |   ____   |
 |  |    |  |
 |__|    |__|`}
            </pre>

            {/* System Specs */}
            <div className="flex flex-col gap-1 w-full max-w-md font-code shrink-0">
              <div className="flex gap-2">
                <span className="text-secondary font-bold w-24">OS:</span>
                <span>aaronnofrail</span>
              </div>
              <div className="flex gap-2">
                <span className="text-secondary font-bold w-24">Host:</span>
                <span>Frontend Engineer</span>
              </div>
              <div className="flex gap-2">
                <span className="text-secondary font-bold w-24">Uptime:</span>
                <span>1 years Experience</span>
              </div>
              <div className="flex gap-2">
                <span className="text-secondary font-bold w-24">Packages:</span>
                <span>React, NextJS, TypeScript, Tailwind, Node</span>
              </div>
              <div className="flex gap-2">
                <span className="text-secondary font-bold w-24">Shell:</span>
                <span>bash 5.1.16</span>
              </div>
              <div className="flex gap-2">
                <span className="text-secondary font-bold w-24">Theme:</span>
                <span>Paper Terminal [Light]</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <PortfolioGate>
      <Navbar />
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col gap-8 relative z-10">
        {/* Heading */}
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          &gt; ./faq.sh
        </h1>

        {/* Terminal Output Component */}
        <div
          onClick={focusInput}
          className="w-full border border-primary bg-surface flex flex-col relative overflow-hidden cursor-text min-h-[80px]"
        >
          {/* Terminal Header Bar */}
          <div className="w-full bg-primary text-on-primary font-label-sm text-label-sm px-4 py-2 flex justify-between items-center select-none shrink-0">
            <span>tty1</span>
            <span>aaron@nofrail: ~</span>
          </div>

          {/* Terminal Body */}
          <div className="p-6 md:p-8 flex-grow flex flex-col gap-6 overflow-y-auto w-full max-w-4xl mx-auto min-h-[80px] max-h-[70vh] custom-scrollbar">
            {/* Rendered History */}
            {terminalLines.map((line, idx) => renderTerminalLine(line, idx))}

            {/* Active Prompt Input */}
            <div className="flex items-center gap-2 flex-wrap font-code w-full">
              <span className="text-secondary select-none shrink-0">
                aaron@nofrail:~$
              </span>
              <input
                ref={inputRef}
                type="text"
                className="flex-1 min-w-[150px] bg-transparent text-primary font-bold outline-none font-code text-code p-0 m-0 border-none focus:ring-0 focus:outline-none"
                style={{
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                }}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                autoFocus
                placeholder="Type 'help' to see available commands"
              />
            </div>
            <div ref={terminalEndRef} />
          </div>
        </div>
      </main>
      <Footer />
    </PortfolioGate>
  );
}
