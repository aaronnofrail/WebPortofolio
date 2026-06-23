"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    setTimeout(() => {
      // Fetch dynamic username and password from storage, fallback to "admin"
      const currentUsername = localStorage.getItem("admin_username") || "admin";
      const currentPassword = localStorage.getItem("admin_password") || "admin";

      if (username.trim() === currentUsername && password.trim() === currentPassword) {
        sessionStorage.setItem("admin_authorized", "true");
        router.push("/admin/dashboard");
      } else {
        setErrorMsg("ACCESS DENIED");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="w-full max-w-[440px] mx-auto space-y-8 font-mono relative z-20">
      {/* Security Sentinel Header */}
      <div className="text-center space-y-2">
        <div className="border-2 border-black dark:border-neutral-700 px-4 py-1.5 inline-block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest bg-neutral-100 dark:bg-neutral-900 rounded-lg shadow-neo-btn">
          [ secure_gateway ]
        </div>
        <h1 className="text-5xl font-black uppercase tracking-tighter mt-4 text-black dark:text-white">
          LOGIN
        </h1>
      </div>

      {/* Login Prompt Form */}
      <div className="border-4 border-black dark:border-neutral-700 bg-white dark:bg-neutral-900 p-6 md:p-8 space-y-8 relative overflow-hidden rounded-[2.5rem] shadow-neo-lg">
        {/* Decorative Terminal Header */}
        <div className="absolute top-0 left-0 w-full h-10 bg-black dark:bg-neutral-800 text-white flex items-center px-6 justify-between select-none border-b-2 border-black dark:border-neutral-700">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
            auth.terminal_v1.0.4
          </span>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="pt-8 space-y-6">
          {/* Identifier Field */}
          <div className="space-y-2">
            <label
              className="text-xs text-black dark:text-white flex items-center gap-2 font-bold uppercase tracking-wider"
              htmlFor="identifier"
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
              IDENTIFIER:
            </label>
            <input
              autoComplete="off"
              className="w-full bg-transparent border-0 border-b-2 border-black dark:border-neutral-700 p-2 font-mono text-sm focus:ring-0 placeholder:opacity-35 outline-none focus:border-b-3 text-black dark:text-white"
              id="identifier"
              name="identifier"
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Access Code Field */}
          <div className="space-y-2">
            <label
              className="text-xs text-black dark:text-white flex items-center gap-2 font-bold uppercase tracking-wider"
              htmlFor="access_code"
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              ACCESS_CODE:
            </label>
            <input
              className="w-full bg-transparent border-0 border-b-2 border-black dark:border-neutral-700 p-2 font-mono text-sm focus:ring-0 placeholder:opacity-35 outline-none focus:border-b-3 text-black dark:text-white"
              id="access_code"
              name="access_code"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="text-red-500 font-bold text-xs border-2 border-red-500 bg-red-500/10 p-3 flex items-center gap-2 animate-shake rounded-xl">
              <span className="material-symbols-outlined text-sm font-bold">warning</span>
              {errorMsg}
            </div>
          )}

          {/* Authorize Button */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full border-2 border-black dark:border-neutral-700 bg-black dark:bg-white text-white dark:text-black py-3.5 px-6 font-mono text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-neo-btn active:scale-95 flex items-center justify-center gap-4 cursor-pointer disabled:opacity-45"
          >
            <span>
              {loading ? "AUTHORIZING..." : "access"}
            </span>
          </button>
        </form>

        {/* Terminal Footnote */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 flex justify-between items-center text-[10px] text-neutral-400">
          <span>HOST: GATEWAY_NODE_01</span>
        </div>
      </div>
    </div>
  );
}
