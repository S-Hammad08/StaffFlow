"use client";

import { Eye, LogOut, Menu } from "lucide-react";
import type { AuthUser } from "@/services/auth.service";

type NavbarProps = {
  user: AuthUser;
  isLoggingOut: boolean;
  onMenuClick: () => void;
  onLogout: () => void;
};

const Navbar = ({ user, isLoggingOut, onMenuClick, onLogout }: NavbarProps) => {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const isDemo = user.role === "demo";

  return (
    <header className="sticky top-0 z-20 flex h-18 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="ml-auto flex items-center gap-3">
        {isDemo && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            Demo · Read-only
          </span>
        )}
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-slate-800">{user.name}</p>
          <p className="text-xs text-slate-500">
            {isDemo ? "Portfolio viewer" : "Administrator"}
          </p>
        </div>
        <div
          aria-hidden="true"
          className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-700"
        >
          {initials}
        </div>
        <button
          type="button"
          onClick={onLogout}
          disabled={isLoggingOut}
          aria-label="Log out"
          className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
