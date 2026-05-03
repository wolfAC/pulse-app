"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import { LayoutDashboard, Target, BarChart3, Heart, type LucideIcon } from "lucide-react"

export type NavSection = "dashboard" | "goals" | "performance" | "health"

export interface NavItem {
  id: NavSection
  label: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "goals", label: "Goals", icon: Target },
  { id: "performance", label: "Performance", icon: BarChart3 },
  { id: "health", label: "Health", icon: Heart },
]

interface NavContextType {
  activeSection: NavSection
  setActiveSection: (section: NavSection) => void
  scrollToSection: (section: NavSection) => void
}

const NavContext = createContext<NavContextType | undefined>(undefined)

export function NavProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<NavSection>("dashboard")

  const scrollToSection = useCallback((section: NavSection) => {
    setActiveSection(section)
    const element = document.getElementById(`section-${section}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  return (
    <NavContext.Provider value={{ activeSection, setActiveSection, scrollToSection }}>
      {children}
    </NavContext.Provider>
  )
}

export function useNav() {
  const context = useContext(NavContext)
  if (context === undefined) {
    throw new Error("useNav must be used within a NavProvider")
  }
  return context
}
