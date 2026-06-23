"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  // Clean pathname to check if it's the login route
  const isLoginRoute = pathname === "/admin" || pathname === "/admin/";

  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_authorized") === "true";
    if (isLoginRoute) {
      setAuthorized(true);
    } else {
      if (!isAuth) {
        setAuthorized(false);
        router.push("/admin");
      } else {
        setAuthorized(true);
      }
    }
  }, [pathname, isLoginRoute, router]);

  // Loading state while authorization check finishes
  if (authorized === null) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-primary font-code animate-pulse">
        &gt; ESTABLISHING_SECURE_ADMIN_SESSION...
      </div>
    );
  }

  // If unauthorized and not on login page, show loading gate screen
  if (!authorized && !isLoginRoute) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-primary font-code">
        &gt; ACCESS_DENIED. REDIRECTING_TO_AUTHENTICATION_GATEWAY...
      </div>
    );
  }

  // Login page layout: standalone screen centered
  if (isLoginRoute) {
    return (
      <div className="min-h-screen bg-background text-primary selection:bg-primary selection:text-on-primary relative flex items-center justify-center p-6 scanlines">
        {children}
      </div>
    );
  }

  // Authenticated layout: SideNavBar + Top Header + Page Canvas
  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-black text-black dark:text-white selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black scanlines transition-colors duration-300">
      {/* Sidebar Navigation */}
      <AdminSidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col md:ml-64 overflow-hidden h-full">
        {/* Top Header */}
        <AdminHeader />
        
        {/* Scrollable page body */}
        <div className="flex-grow overflow-y-auto bg-neutral-50 dark:bg-neutral-950/40 p-6 md:p-8">
          <div className="max-w-[1100px] mx-auto w-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
