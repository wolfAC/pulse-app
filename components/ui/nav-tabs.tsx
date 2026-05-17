import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { ReactNode } from "react";

interface Tab<T extends string> {
  value: T;
  label: ReactNode; // ← ReactNode instead of string to support counts
}

interface NavTabsProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  tabs: readonly Tab<T>[];
  fullWidthOnMobile?: boolean;
}

export function NavTabs<T extends string>({
  value,
  onValueChange,
  tabs,
  fullWidthOnMobile = true,
}: NavTabsProps<T>) {
  const isMobile = useIsMobile();

  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as T)}>
      <TabsList
        className={`h-auto bg-transparent border p-1 ${
          fullWidthOnMobile && isMobile ? "w-full" : ""
        }`}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="px-3 py-1.5"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
