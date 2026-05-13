"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { useSelector } from "react-redux";
import { RootState, store } from "@/store";
import { useEffect } from "react";

function PrimaryColorInjector() {
  const primaryColor = useSelector(
    (state: RootState) => state.app.primaryColor,
  );

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", primaryColor);
    root.style.setProperty("--ring", primaryColor);
    root.style.setProperty("--accent", primaryColor);
    root.style.setProperty("--sidebar-primary", primaryColor);
    root.style.setProperty("--chart-1", primaryColor);
  }, [primaryColor]);

  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  useEffect(() => {
    const primaryColor = store.getState().app.primaryColor;
    const root = document.documentElement;
    root.style.setProperty("--primary", primaryColor);
    root.style.setProperty("--ring", primaryColor);
    root.style.setProperty("--accent", primaryColor);
    root.style.setProperty("--sidebar-primary", primaryColor);
    root.style.setProperty("--chart-1", primaryColor);
  }, []);

  return (
    <NextThemesProvider {...props} disableTransitionOnChange>
      <PrimaryColorInjector />
      {children}
    </NextThemesProvider>
  );
}
