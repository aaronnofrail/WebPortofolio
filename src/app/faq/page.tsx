"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PortfolioGate from "@/components/PortfolioGate";
import { mockFAQs, FAQ } from "@/data/mockData";
import { translations } from "@/data/translations";
import { getActivityLogs, ActivityLog } from "@/utils/activityLogger";

interface TerminalLine {
  type: "command" | "text" | "error" | "help" | "neofetch" | "faq" | "ls";
  text: string;
  faqList?: FAQ[];
  prompt?: string;
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(mockFAQs);
  const [inputValue, setInputValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [clientIp, setClientIp] = useState("127.0.0.1");
  const [isSubmittingFlag, setIsSubmittingFlag] = useState(false);
  const [isTailing, setIsTailing] = useState(false);
  const [tailedFilename, setTailedFilename] = useState("status.log");

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch client IP
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => setClientIp(data.ip))
      .catch(() => setClientIp("180.251.148.234"));

    // Sync FAQs from localStorage
    const stored = localStorage.getItem("aaronnofrail_faqs");
    if (stored) {
      try {
        setFaqs(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    // Scroll terminal to bottom when lines change
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLines]);

  useEffect(() => {
    if (!isTailing) return;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || (e.ctrlKey && e.key.toLowerCase() === "c")) {
        stopTailing();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isTailing]);

  // Poll logs and simulate traffic when tailing is active
  useEffect(() => {
    if (!isTailing) return;

    let lastLogTime = "";
    const logList = getActivityLogs();
    if (logList.length > 0) {
      lastLogTime = logList[0].time;
    }

    const interval = setInterval(() => {
      const currentLogs = getActivityLogs();
      if (currentLogs.length > 0) {
        const newLogs: ActivityLog[] = [];
        for (const log of currentLogs) {
          if (log.time > lastLogTime) {
            newLogs.push(log);
          } else {
            break;
          }
        }

        if (newLogs.length > 0) {
          lastLogTime = currentLogs[0].time;
          const linesToAppend = [...newLogs].reverse().map(
            (log) => `[${log.time}] ${log.type?.toUpperCase() || "INFO"}: ${log.text}`
          );
          setTerminalLines((prev) => [
            ...prev,
            ...linesToAppend.map((t) => ({ type: "text" as const, text: t })),
          ]);
        }
      }

      // 15% chance to simulate background activity logs to keep terminal scrolling
      if (Math.random() < 0.15) {
        const timeStr = new Date().toISOString().replace("T", " ").substring(0, 19);
        const simLogs = [
          "SYS_PING: Keep-alive packet transmitted to secondary server",
          "DB_STATUS: Connection pool healthy [3/10 active]",
          "MEM_CHECK: Usage stable at 342 MB / 1024 MB",
          "SEC_GUARD: Log integrity check verified [OK]",
        ];
        const randomText = simLogs[Math.floor(Math.random() * simLogs.length)];
        const simLine = `[${timeStr}] INFO: ${randomText}`;
        setTerminalLines((prev) => [
          ...prev,
          { type: "text" as const, text: simLine }
        ]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isTailing]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const t = translations.en;

  const stopTailing = () => {
    setIsTailing(false);
    setTerminalLines((prev) => [
      ...prev,
      { type: "text", text: "^C\n--- Monitoring terminated ---" },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isTailing) {
      e.preventDefault();
      if (e.key === "Escape" || (e.ctrlKey && e.key.toLowerCase() === "c")) {
        stopTailing();
      }
      return;
    }

    if (e.key === "Enter") {
      const command = inputValue.trim();
      if (!command && !isSubmittingFlag) return;

      const newHistory = [...history, command];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length);

      if (isSubmittingFlag) {
        const updatedLines: TerminalLine[] = [
          ...terminalLines,
          { type: "command", text: inputValue, prompt: "aaron@nofrail:~$" },
        ];
        setTerminalLines(updatedLines);
        setInputValue("");
        setIsSubmittingFlag(false);

        setTimeout(() => {
          const flagArgCleaned = command.trim();
          if (flagArgCleaned === "aaron{husnulmawaddah}") {
            setTerminalLines([
              ...updatedLines,
              {
                type: "text",
                text: ">>> she's like a part of me i can't let go",
              },
            ]);
          } else {
            setTerminalLines([
              ...updatedLines,
              {
                type: "error",
                text: `>>> [error] incorrect flag: '${flagArgCleaned}'. access denied.`,
              },
            ]);
          }
        }, 100);
        return;
      }

      const updatedLines: TerminalLine[] = [
        ...terminalLines,
        { type: "command", text: command, prompt: "aaron@nofrail:~$" },
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
      const trimmed = inputValue.trim();
      const parts = trimmed.split(/\s+/);
      if (parts.length > 0) {
        const cmd = parts[0].toLowerCase();
        if (cmd === "cat" || cmd === "tail") {
          let filePrefix = "";
          if (cmd === "tail" && parts[1] === "-f") {
            filePrefix = parts[2] ? parts[2].toLowerCase() : "";
          } else {
            filePrefix = parts[1] ? parts[1].toLowerCase() : "";
          }

          const files = [
            "faq",
            "who-are-u",
            "what-keeps-you-up-at-night",
            "what-is-your-fav-in-ctf",
            "what-is-your-fav-tools",
            "how-to-reach-you",
            "are-you-taken",
            "status.log",
            "cat_status.log",
          ];

          const match = files.find((f) => f.startsWith(filePrefix));
          if (match) {
            if (cmd === "tail") {
              const hasDashF = parts.includes("-f");
              setInputValue(`tail ${hasDashF ? "-f " : ""}${match}`);
            } else {
              setInputValue(`cat ${match}`);
            }
          }
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
      const isStatusLogFile = (arg: string) => {
        const clean = arg.toLowerCase().trim();
        return (
          clean === "status.log" ||
          clean === "status_log" ||
          clean === "status log" ||
          clean === "cat_status.log" ||
          clean === "cat_status" ||
          clean === "cat-status.log" ||
          clean === "cat-status" ||
          clean === "cat status.log" ||
          clean === "cat status log" ||
          clean === "status"
        );
      };

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
  tail -f <filename>               - Monitor file growth in real-time
  reveal identity                  - Display system specifications
  submit <flag>                    - Submit challenge flag
  clear                            - Clear terminal screen

Files available for cat / tail:
  faq                              - The FAQ database
  who-are-u                        - Core profile description
  what-keeps-you-up-at-night       - Logical challenges interest
  what-is-your-fav-in-ctf          - Favorite CTF categories
  what-is-your-fav-tools           - Favorite tools used
  how-to-reach-you                 - Contact information
  are-you-taken                    - Relationship status / interest
  status.log                       - System logs database
  cat_status.log                   - System logs database`,
          },
        ]);
      } else if (mainCommand === "ls") {
        setTerminalLines([
          ...currentLines,
          {
            type: "ls",
            text: "faq    who-are-u    what-keeps-you-up-at-night    what-is-your-fav-in-ctf    what-is-your-fav-tools    how-to-reach-you    are-you-taken    status.log    cat_status.log",
          },
        ]);
      } else if (
        (mainCommand === "reveal" && argument === "identity") ||
        mainCommand === "reveal-identity"
      ) {
        setTerminalLines([
          ...currentLines,
          { type: "neofetch", text: "" },
        ]);
      } else if (mainCommand === "submit") {
        const cleanArg = argument.toLowerCase().trim();
        if (!argument || cleanArg === "flag") {
          setIsSubmittingFlag(true);
          setTerminalLines([
            ...currentLines,
            {
              type: "text",
              text: "Please type your flag:",
            },
          ]);
        } else {
          const flagArg = argument.startsWith("flag ") ? argument.slice(5).trim() : argument.trim();
          if (flagArg === "aaron{husnulmawaddah}") {
            setTerminalLines([
              ...currentLines,
              {
                type: "text",
                text: ">>> she's like a part of me i can't let go",
              },
            ]);
          } else {
            setTerminalLines([
              ...currentLines,
              {
                type: "error",
                text: `>>> [ERROR] INCORRECT FLAG: '${flagArg}'. ACCESS DENIED.`,
              },
            ]);
          }
        }
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
          const storedWho = localStorage.getItem("aaronnofrail_who_are_u");
          const finalDesc =
            storedWho ||
            "Aaron is a security researcher and frontend developer based in the void.";
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
        } else if (isStatusLogFile(argument)) {
          const logList = getActivityLogs();
          const formattedLogs = [...logList].reverse().map(
            (log) => `[${log.time}] ${log.type?.toUpperCase() || "INFO"}: ${log.text}`
          );
          setTerminalLines([
            ...currentLines,
            ...formattedLogs.map((t) => ({ type: "text" as const, text: t })),
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
      } else if (mainCommand === "tail") {
        const cleanArg = argument.replace("-f", "").trim();
        if (isStatusLogFile(cleanArg)) {
          setTailedFilename(cleanArg || "status.log");
          setIsTailing(true);
          const logList = getActivityLogs();
          const logsToShow = [...logList].slice(0, 15).reverse();
          const formattedLogs = logsToShow.map(
            (log) => `[${log.time}] ${log.type?.toUpperCase() || "INFO"}: ${log.text}`
          );
          setTerminalLines([
            ...currentLines,
            { type: "text", text: `>>> Monitoring ${cleanArg} (Press Ctrl+C or Escape to exit)...` },
            ...formattedLogs.map((t) => ({ type: "text" as const, text: t })),
          ]);
        } else {
          setTerminalLines([
            ...currentLines,
            {
              type: "error",
              text: `tail: ${argument}: unsupported file or flag. Usage: tail -f status.log`,
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
        const promptText = line.prompt || "aaron@nofrail:~$";
        return (
          <div key={index} className="flex flex-wrap items-center gap-2 font-mono text-xs md:text-sm">
            <span className="text-neutral-500 select-none">
              {promptText}
            </span>
            <span className="text-black dark:text-white font-bold break-all">{line.text}</span>
          </div>
        );
      case "text":
        return (
          <div key={index} className="whitespace-pre-wrap leading-relaxed text-black dark:text-white break-words font-mono text-xs md:text-sm">
            {line.text}
          </div>
        );
      case "help":
        return (
          <pre key={index} className="whitespace-pre-wrap leading-relaxed text-neutral-600 dark:text-neutral-400 break-words font-mono text-xs md:text-sm max-w-full overflow-x-auto">
            {line.text}
          </pre>
        );
      case "ls":
        return (
          <div key={index} className="text-black dark:text-white font-bold font-mono text-xs md:text-sm break-words max-w-full">
            {line.text}
          </div>
        );
      case "error":
        return (
          <div key={index} className="text-red-500 font-bold font-mono text-xs md:text-sm break-words">
            {line.text}
          </div>
        );
      case "faq":
        return (
          <div key={index} className="flex flex-col gap-6 pl-0 md:pl-4 max-w-full">
            {line.faqList?.map((faq) => (
              <article key={faq.id} className="flex flex-col gap-2">
                <div className="flex gap-2 items-start font-bold font-mono text-xs md:text-sm text-black dark:text-white">
                  <span className="text-neutral-500 select-none">&gt;</span>
                  <h3>{faq.question}</h3>
                </div>
                <div className="pl-4 text-neutral-600 dark:text-neutral-400 max-w-full font-mono text-xs md:text-sm leading-relaxed break-words whitespace-pre-wrap">
                  <p>{faq.answer}</p>
                </div>
              </article>
            ))}
          </div>
        );
      case "neofetch":
        return (
          <div key={index} className="flex flex-col gap-4 font-mono text-xs md:text-sm max-w-full text-black dark:text-white select-text">
            {/* ASCII Art */}
            <pre className="leading-tight select-none overflow-x-auto text-black dark:text-white font-bold">
              {`                                        __            _ _ 
  __ _  __ _ _ __ ___  _ __  _ __   ___/ _|_ __ __ _(_) |
 / _\` |/ _\` | '__/ _ \\| '_ \\| '_ \\ / _ \\ |_| '__/ _\` | | |
| (_| | (_| | | | (_) | | | | | | |  __/  _| | | (_| | | |
 \\__,_|\\__,_|_|  \\___/|_| |_|_| |_|\\___|_| |_|  \\__,_|_|_|`}
            </pre>

            <div className="text-center font-bold tracking-widest text-black dark:text-white my-2">
              aaronnofrail / ICC UH
            </div>

            <div className="flex flex-col gap-3 pl-0 md:pl-4">
              <p className="opacity-90">Welcome to my hidden profile on the darknet.</p>

              <div className="flex flex-col gap-1 mt-1 font-mono">
                <div>
                  <span className="font-bold">Alias:</span> <span className="text-neutral-700 dark:text-neutral-300">aaronnofrail</span>
                </div>
                <div>
                  <span className="font-bold">Affiliation:</span> <span className="text-neutral-700 dark:text-neutral-300">ICC UH / Informatics Hasanuddin University</span>
                </div>
                <div>
                  <span className="font-bold">Specialties:</span> <span className="text-neutral-700 dark:text-neutral-300">Web Exploitation, Cryptography, Forensics, OSINT</span>
                </div>
                <div>
                  <span className="font-bold">Status:</span> <span className="text-neutral-700 dark:text-neutral-300">Seeking Internship / CTF Enthusiast</span>
                </div>
                <div>
                  <span className="font-bold">Contact:</span> <a href="mailto:arundaffa.nahara@gmail.com" className="underline text-neutral-700 dark:text-neutral-300">arundaffa.nahara@gmail.com</a>
                </div>
                <div>
                  <span className="font-bold">Instagram:</span> <a href="https://instagram.com/dfnhrr" target="_blank" rel="noopener noreferrer" className="underline text-neutral-700 dark:text-neutral-300">@dfnhrr</a>
                </div>
              </div>

              <p className="mt-2 font-bold">Client IP detected: <span className="text-neutral-700 dark:text-neutral-300 font-normal">{clientIp}</span></p>

              <p className="italic opacity-85 my-1">"When the tide goes out, you don't find your dreams—you find the anchor you actually built."</p>

              <div className="mt-2 p-4 border border-black/20 dark:border-white/20 bg-black/5 dark:bg-white/5 flex flex-col gap-2 rounded-xl">
                <span className="font-bold">The flag is:</span>
                <span className="opacity-90">{"the flag is 'her' name in aaron{...} format #iykyk"}</span>
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
      <main className="flex-grow w-full max-w-7xl mx-auto px-6 py-24 md:py-32 font-mono transition-colors duration-300 bg-white dark:bg-black text-black dark:text-white relative flex flex-col gap-8">
        
        {/* Heading */}
        <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter">
          {t.faq.title}
        </h1>

        {/* Terminal Window Block */}
        <div
          onClick={focusInput}
          className="w-full max-w-4xl mx-auto border-4 border-black dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 flex flex-col relative overflow-hidden rounded-[2.5rem] shadow-neo-lg min-h-[300px] cursor-text"
        >
          {/* Scoped Scanlines effect */}
          <div className="absolute inset-0 pointer-events-none z-10 scanlines opacity-50 dark:opacity-75"></div>

          {/* Terminal Header Bar */}
          <div className="w-full bg-black dark:bg-neutral-800 text-white font-mono text-xs px-6 py-3.5 flex justify-between items-center select-none shrink-0 border-b-2 border-black dark:border-neutral-700 z-20">
            <span className="font-bold flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 inline-block"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
              <span className="ml-2">tty1</span>
            </span>
            <span>{t.faq.terminalHeader}</span>
          </div>

          {/* Terminal Body Viewport */}
          <div className="p-6 md:p-8 flex-grow flex flex-col gap-6 overflow-y-auto w-full min-h-[250px] max-h-[60vh] custom-scrollbar z-20 relative bg-white dark:bg-neutral-950">
            {/* Rendered History */}
            {terminalLines.map((line, idx) => renderTerminalLine(line, idx))}

            {/* Active Prompt Input */}
            <div className="flex items-center gap-2 flex-wrap font-mono text-xs md:text-sm w-full">
              {isTailing ? (
                <span className="text-red-500 font-bold select-none shrink-0 animate-pulse">
                  [TAIL: {tailedFilename} - press Ctrl+C to terminate]
                </span>
              ) : (
                <span className="text-neutral-500 select-none shrink-0">
                  aaron@nofrail:~$
                </span>
              )}
              <input
                ref={inputRef}
                type="text"
                readOnly={isTailing}
                className={`flex-1 min-w-[150px] bg-transparent text-black dark:text-white font-bold outline-none border-none p-0 m-0 focus:ring-0 focus:outline-none ${isTailing ? "caret-transparent cursor-default select-none" : ""}`}
                style={{
                  border: "none",
                  outline: "none",
                  boxShadow: "none",
                }}
                value={isTailing ? "" : inputValue}
                onChange={(e) => {
                  if (!isTailing) setInputValue(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                autoFocus
                placeholder={isTailing ? "" : "Type 'help' to see available commands"}
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
