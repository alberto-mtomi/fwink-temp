"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Send,
  FileText,
  Settings,
  HelpCircle,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Projects", href: "/projects/proj_01", icon: FolderKanban },
  { name: "RFQs", href: "/rfq/rfq_01", icon: Send },
  { name: "Quotes", href: "/quotes/quote_01", icon: FileText },
];

const bottomNav = [
  { name: "Settings", href: "#", icon: Settings },
  { name: "Help", href: "#", icon: HelpCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[220px] flex-col bg-sidebar-bg text-sidebar-fg">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-forge-600">
          <Flame className="h-4 w-4 text-white" />
        </div>
        <span className="text-[15px] font-semibold tracking-tight text-sidebar-active">
          FWINK
        </span>
      </div>

      {/* Main nav */}
      <nav className="mt-2 flex-1 space-y-0.5 px-3">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href.split("/").slice(0, -1).join("/") + "/");
          // More precise: match "/dashboard" or any sub-route prefix
          const routeBase = "/" + item.href.split("/")[1];
          const active = pathname === item.href || pathname.startsWith(routeBase + "/") || pathname === routeBase;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] font-medium transition-colors",
                active
                  ? "bg-white/10 text-sidebar-active"
                  : "text-sidebar-fg hover:bg-white/[0.06] hover:text-sidebar-active"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="space-y-0.5 border-t border-white/10 px-3 py-3">
        {bottomNav.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-2.5 rounded-lg px-2.5 py-[7px] text-[13px] font-medium text-sidebar-fg transition-colors hover:bg-white/[0.06] hover:text-sidebar-active"
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.name}
          </Link>
        ))}
      </div>

      {/* User */}
      <div className="border-t border-white/10 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-forge-600 text-[11px] font-semibold text-white">
            JR
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-sidebar-active">
              Jamie Reeves
            </p>
            <p className="truncate text-[11px] text-sidebar-fg">Design Lead</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
