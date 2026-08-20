"use client";

import {
  BarChart3,
  Building2,
  CalendarCheck,
  LayoutDashboard,
  UsersRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Employees", href: "/dashboard/employees", icon: UsersRound },
  { label: "Departments", href: "/dashboard/departments", icon: Building2 },
  { label: "Attendance", href: "/dashboard/attendance", icon: CalendarCheck },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
];

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-slate-950/50 transition md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-label="Main navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-slate-950 text-white transition-transform duration-200 md:sticky md:top-0 md:h-screen md:w-64 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-18 items-center justify-between border-b border-white/10 px-5">
          <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-500 text-sm font-bold">
              SF
            </span>
            <span className="text-lg font-semibold">StaffFlow</span>
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white md:hidden"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-6">
          {navigation.map(({ label, href, icon: Icon }) => {
            const active =
              href === "/dashboard" ? pathname === href : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-4 text-xs leading-5 text-slate-500">
          People operations in one place.
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
