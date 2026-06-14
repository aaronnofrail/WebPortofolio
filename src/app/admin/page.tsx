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
      // Fetch dynamic password from storage, fallback to "admin"
      const currentPassword = localStorage.getItem("admin_password") || "admin";

      if (username.trim() === "admin" && password.trim() === currentPassword) {
        sessionStorage.setItem("admin_authorized", "true");
        router.push("/admin/dashboard");
      } else {
        setErrorMsg("ACCESS DENIED");
        setLoading(false);
      }
    }, 800);
  };

  return (
    <div className="w-full max-w-[440px] mx-auto space-y-8 font-code relative z-20">
      {/* Security Sentinel Header */}
      <div className="text-center space-y-2">
        <div className="border border-primary px-3 py-1 inline-block text-label-sm font-bold text-secondary uppercase tracking-widest bg-surface-container-low">
          [ secure_gateway ]
        </div>
        <h1 className="font-headline-lg text-headline-lg font-bold uppercase tracking-tighter mt-4">
          LOGIN
        </h1>
      </div>

      {/* Login Prompt Form */}
      <div className="border border-primary bg-background p-6 md:p-8 space-y-8 relative overflow-hidden">
        {/* Decorative Terminal Header */}
        <div className="absolute top-0 left-0 w-full h-8 bg-primary text-on-primary flex items-center px-4 justify-between select-none">
          <span className="font-code text-[10px] uppercase tracking-tighter">
            auth.terminal_v1.0.4
          </span>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 bg-on-primary rounded-full opacity-50 animate-pulse"></div>
            <div className="w-2 h-2 bg-on-primary rounded-full opacity-50"></div>
            <div className="w-2 h-2 bg-on-primary rounded-full opacity-50"></div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="pt-6 space-y-6">
          {/* Identifier Field */}
          <div className="space-y-2">
            <label
              className="font-label-sm text-label-sm text-primary flex items-center gap-2 font-bold"
              htmlFor="identifier"
            >
              <span className="material-symbols-outlined text-[16px]">person</span>
              IDENTIFIER:
            </label>
            <input
              autoComplete="off"
              className="w-full bg-transparent border-0 border-b border-primary p-2 font-code text-body-md focus:ring-0 placeholder:opacity-35 outline-none focus:border-b-2"
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
              className="font-label-sm text-label-sm text-primary flex items-center gap-2 font-bold"
              htmlFor="access_code"
            >
              <span className="material-symbols-outlined text-[16px]">lock</span>
              ACCESS_CODE:
            </label>
            <input
              className="w-full bg-transparent border-0 border-b border-primary p-2 font-code text-body-md focus:ring-0 placeholder:opacity-35 outline-none focus:border-b-2"
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
            <div className="text-error font-bold text-label-sm border border-error bg-error-container p-3 flex items-center gap-2 animate-shake">
              <span className="material-symbols-outlined text-sm">warning</span>
              {errorMsg}
            </div>
          )}

          {/* Authorize Button */}
          <button
            type="submit"
            disabled={loading}
            className="group w-full border border-primary bg-primary text-on-primary py-4 px-6 font-code text-body-md hover:bg-background hover:text-primary transition-all duration-200 active:scale-95 flex items-center justify-center gap-4 cursor-pointer disabled:opacity-45"
          >
            <span className="font-bold tracking-widest uppercase">
              {loading ? "AUTHORIZING..." : "access"}
            </span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              {/* arrow_forward */}
            </span>
          </button>
        </form>

        {/* Terminal Footnote */}
        <div className="border-t border-primary/10 pt-4 flex justify-between items-center text-[10px] text-secondary">
          {/* <span>HOST: GATEWAY_NODE_01</span> */}
          {/* <span className="font-bold">KEYS: admin // admin</span> */}
        </div>
      </div>
    </div>
  );
}
