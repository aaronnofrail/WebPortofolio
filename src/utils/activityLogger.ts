export interface ActivityLog {
  time: string;
  text: string;
  type?: "info" | "error" | "log";
  opacity: number;
}

export function addActivityLog(text: string, type: "info" | "error" | "log" = "info") {
  if (typeof window === "undefined") return;
  const now = new Date();
  const timeStr = now.toISOString().replace("T", " ").substring(0, 19);
  
  const stored = localStorage.getItem("aaronnofrail_logs");
  let logs: ActivityLog[] = [];
  if (stored) {
    try {
      logs = JSON.parse(stored);
    } catch (e) {
      logs = [];
    }
  }
  
  const newLog: ActivityLog = {
    time: timeStr,
    text,
    type,
    opacity: 1,
  };
  
  // limit to 50 logs
  const updatedLogs = [newLog, ...logs].slice(0, 50);
  localStorage.setItem("aaronnofrail_logs", JSON.stringify(updatedLogs));
}

export function getActivityLogs(): ActivityLog[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("aaronnofrail_logs");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  }
  
  const defaultLogs: ActivityLog[] = [
    { time: "2026-06-15 09:12:04", text: "SYS_INIT: Starting kernel modules... SUCCESS", type: "info", opacity: 0.5 },
    { time: "2026-06-15 10:45:22", text: "UPDATE: Project list refreshed", type: "info", opacity: 1 },
    { time: "2026-06-15 12:00:59", text: "ALERT: Unauthorized terminal access blocked", type: "error", opacity: 1 },
    { time: "2026-06-15 13:15:33", text: "LOG: Cache cleared successfully (245.2 MB)", type: "log", opacity: 1 },
    { time: "2026-06-16 01:00:00", text: "-- STANDBY MODE ENGAGED --", type: "info", opacity: 0.4 }
  ];
  localStorage.setItem("aaronnofrail_logs", JSON.stringify(defaultLogs));
  return defaultLogs;
}
