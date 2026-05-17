// components/ui/view-toggle.tsx

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, List } from "lucide-react";

interface ViewToggleProps {
  value: "grid" | "list";
  onValueChange: (value: "grid" | "list") => void;
}

export function ViewToggle({ value, onValueChange }: ViewToggleProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onValueChange(v as "grid" | "list")}
    >
      <TabsList className="h-auto bg-transparent border p-1">
        <TabsTrigger value="grid" className="gap-1.5 px-3 py-1.5">
          <LayoutGrid className="size-4" />
          <span className="sr-only sm:not-sr-only">Grid</span>
        </TabsTrigger>
        <TabsTrigger value="list" className="gap-1.5 px-3 py-1.5">
          <List className="size-4" />
          <span className="sr-only sm:not-sr-only">List</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
