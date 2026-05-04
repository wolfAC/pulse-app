"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNavItems } from "./nav-context";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {primaryNavItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <div
                className={cn(
                  "flex items-center justify-center rounded-full p-1.5 transition-all",
                  isActive && "bg-primary/10",
                )}
              >
                <Icon
                  className={cn(
                    "size-5 transition-transform",
                    isActive && "scale-110",
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium leading-none",
                  isActive && "font-semibold",
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute -top-0.5 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
      {/* Safe area padding for devices with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
