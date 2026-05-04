"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HealthEntry, HealthMetricType } from "@/lib/types/health";
import { cn, formatDate } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  Flame,
  Footprints,
  Heart,
  ListFilter,
  Moon,
  Scale,
} from "lucide-react";
import { useState } from "react";

const mockEntries: HealthEntry[] = [
  {
    id: "1",
    date: "2024-01-15",
    type: "sleep",
    value: 7.5,
    unit: "hours",
    notes: "Slept well",
  },
  { id: "2", date: "2024-01-15", type: "steps", value: 8432, unit: "steps" },
  { id: "3", date: "2024-01-15", type: "calories", value: 1845, unit: "kcal" },
  { id: "4", date: "2024-01-15", type: "water", value: 2.5, unit: "L" },
  { id: "5", date: "2024-01-14", type: "sleep", value: 8.0, unit: "hours" },
  { id: "6", date: "2024-01-14", type: "steps", value: 10200, unit: "steps" },
  { id: "7", date: "2024-01-14", type: "calories", value: 2050, unit: "kcal" },
  { id: "8", date: "2024-01-14", type: "water", value: 3.0, unit: "L" },
  {
    id: "9",
    date: "2024-01-13",
    type: "sleep",
    value: 6.8,
    unit: "hours",
    notes: "Late night",
  },
  { id: "10", date: "2024-01-13", type: "steps", value: 7800, unit: "steps" },
  { id: "11", date: "2024-01-13", type: "heart_rate", value: 72, unit: "bpm" },
  { id: "12", date: "2024-01-13", type: "weight", value: 75.5, unit: "kg" },
];

const typeConfig: Record<
  HealthMetricType,
  { icon: typeof Moon; color: string; bgColor: string; label: string }
> = {
  sleep: {
    icon: Moon,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    label: "Sleep",
  },
  steps: {
    icon: Footprints,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    label: "Steps",
  },
  calories: {
    icon: Flame,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    label: "Calories",
  },
  water: {
    icon: Droplets,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
    label: "Water",
  },
  heart_rate: {
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    label: "Heart Rate",
  },
  weight: {
    icon: Scale,
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    label: "Weight",
  },
};

export function HealthLogs() {
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 8;

  const filteredEntries =
    filter === "all"
      ? mockEntries
      : mockEntries.filter((entry) => entry.type === filter);

  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage,
  );

  const formatEntryDate = (dateStr: string) => {
    return formatDate(dateStr, { includeWeekday: true });
  };

  const formatValue = (entry: HealthEntry) => {
    if (entry.type === "steps") {
      return entry.value.toLocaleString();
    }
    if (entry.type === "calories") {
      return entry.value.toLocaleString();
    }
    return entry.value;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <ListFilter className="size-4 text-muted-foreground" />
          Health Logs
        </CardTitle>
        <Select
          value={filter}
          onValueChange={(value) => {
            setFilter(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-35 h-8 text-xs">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="sleep">Sleep</SelectItem>
            <SelectItem value="steps">Steps</SelectItem>
            <SelectItem value="calories">Calories</SelectItem>
            <SelectItem value="water">Water</SelectItem>
            <SelectItem value="heart_rate">Heart Rate</SelectItem>
            <SelectItem value="weight">Weight</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        {/* Table Header - Hidden on mobile */}
        <div className="hidden sm:grid sm:grid-cols-[1fr_120px_100px_80px] gap-4 px-6 py-3 border-y border-border bg-muted/30 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          <span>Type</span>
          <span>Date</span>
          <span className="text-right">Value</span>
          <span className="text-right">Unit</span>
        </div>

        {/* Entries List */}
        <div className="divide-y divide-border">
          {paginatedEntries.map((entry) => {
            const config = typeConfig[entry.type];
            const Icon = config.icon;

            return (
              <div
                key={entry.id}
                className="flex flex-col sm:grid sm:grid-cols-[1fr_120px_100px_80px] gap-2 sm:gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
              >
                {/* Type with Icon */}
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg",
                      config.bgColor,
                    )}
                  >
                    <Icon className={cn("size-4", config.color)} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{config.label}</span>
                    {entry.notes && (
                      <span className="text-xs text-muted-foreground">
                        {entry.notes}
                      </span>
                    )}
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center sm:justify-start pl-11 sm:pl-0">
                  <span className="text-sm text-muted-foreground">
                    {formatEntryDate(entry.date)}
                  </span>
                </div>

                {/* Value */}
                <div className="flex items-center sm:justify-end pl-11 sm:pl-0">
                  <span className="text-sm font-semibold">
                    {formatValue(entry)}
                  </span>
                </div>

                {/* Unit */}
                <div className="flex items-center sm:justify-end pl-11 sm:pl-0">
                  <Badge variant="secondary" className="text-xs font-normal">
                    {entry.unit}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Showing {(currentPage - 1) * entriesPerPage + 1}-
              {Math.min(currentPage * entriesPerPage, filteredEntries.length)}{" "}
              of {filteredEntries.length}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
