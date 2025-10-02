"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Shield, Users, History, Package, Loader2, LayoutDashboard } from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Usuarios", href: "/admin/users", icon: Users },
  { label: "Historial", href: "/admin/historial", icon: History },
  { label: "Inventario", href: "/admin/inventario", icon: Package },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/sign-in");
      return;
    }
    const role = (session.user as any)?.role;
    if (role !== "admin") {
      router.push("/home");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-white to-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-slate-700" />
          <p className="text-sm text-slate-600">Cargando panel de administración...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-50 font-[var(--font-dmsans)]">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/80 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2 text-slate-900 font-semibold">
            <Shield className="h-5 w-5" />
            <span className="hidden sm:inline-block">Administración</span>
          </Link>
          <nav className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {navItems.map(item => {
              const Icon = item.icon;
              const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    "group inline-flex items-center gap-2 rounded-full px-4 h-10 text-sm font-medium transition-colors " +
                    (active
                      ? "bg-slate-900 text-white shadow"
                      : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300")
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-4">
            {session && (
              <span className="text-xs sm:text-sm text-slate-500 truncate max-w-[160px]">
                {(session.user as any)?.fullName || session.user?.email}
              </span>
            )}
          </div>
        </div>
      </header>
      {/* Page Content */}
      <div className="pb-16">{children}</div>
    </div>
  );
}
