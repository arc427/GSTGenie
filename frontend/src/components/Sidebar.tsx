"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FileSpreadsheet,
  BarChart2,
  Lightbulb,
} from "lucide-react";

type Item = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const items: Item[] = [
  { label: "Dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
  { label: "Invoices", href: "/invoices", icon: <FileText size={18} /> },
  { label: "Filings", href: "/filings", icon: <FileSpreadsheet size={18} /> },
  { label: "Reports", href: "/reports", icon: <BarChart2 size={18} /> },
  { label: "Insights", href: "/insights", icon: <Lightbulb size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 bg-slate-900 text-slate-100 flex flex-col py-6">
      {/* Logo */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-sky-500 shadow-lg shadow-sky-500/40" />
          <div>
            <div className="text-lg font-semibold tracking-tight">
              GSTGenie
            </div>
            <div className="text-[11px] text-slate-400">
              Your Agentic AI Tax Co-Pilot
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1 text-sm">
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link key={item.label} href={item.href}>
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition
              ${
                isActive
                  ? "bg-slate-800 text-white shadow-inner"
                  : "text-slate-300 hover:bg-slate-800/70 hover:text-white"
              }`}
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800/60">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
