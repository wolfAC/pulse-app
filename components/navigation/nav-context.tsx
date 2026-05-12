"use client";

import {
  BarChart3,
  Heart,
  PiggyBank,
  LayoutDashboard,
  Target,
  Settings,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
}

export const primaryNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/" },
  { label: "Goals", icon: Target, href: "/goals" },
  {
    label: "Performance",
    icon: BarChart3,
    href: "/performance",
  },
  { label: "Health", icon: Heart, href: "/health" },
  { label: "Finance", href: "/finance", icon: PiggyBank },
];

export const secondaryNavItems: NavItem[] = [
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Help", icon: HelpCircle, href: "/help" },
];
