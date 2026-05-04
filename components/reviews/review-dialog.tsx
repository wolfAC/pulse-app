"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Review,
  ReviewPeriod,
  ReviewMetrics,
  metricLabels,
} from "@/lib/types/review";
import { Zap, Award, MessageSquare, BookOpen, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review?: Review | null;
  onSave: (review: Omit<Review, "id" | "overallScore">) => void;
}

const metricIcons = {
  productivity: Zap,
  quality: Award,
  communication: MessageSquare,
  learning: BookOpen,
};

export function ReviewDialog({
  open,
  onOpenChange,
  review,
  onSave,
}: ReviewDialogProps) {
  const [date, setDate] = useState("");
  const [period, setPeriod] = useState<ReviewPeriod>("daily");
  const [metrics, setMetrics] = useState<ReviewMetrics>({
    productivity: 75,
    quality: 75,
    communication: 75,
    learning: 75,
  });
  const [highlights, setHighlights] = useState<string[]>([]);
  const [blockers, setBlockers] = useState<string[]>([]);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [newHighlight, setNewHighlight] = useState("");
  const [newBlocker, setNewBlocker] = useState("");
  const [newImprovement, setNewImprovement] = useState("");

  useEffect(() => {
    if (review) {
      setDate(review.date);
      setPeriod(review.period);
      setMetrics(review.metrics);
      setHighlights(review.highlights);
      setBlockers(review.blockers);
      setImprovements(review.improvements);
      setNotes(review.notes || "");
    } else {
      const today = new Date().toISOString().split("T")[0];
      setDate(today);
      setPeriod("daily");
      setMetrics({
        productivity: 75,
        quality: 75,
        communication: 75,
        learning: 75,
      });
      setHighlights([]);
      setBlockers([]);
      setImprovements([]);
      setNotes("");
    }
  }, [review, open]);

  const handleAddItem = (
    type: "highlight" | "blocker" | "improvement",
    value: string,
    setValue: (v: string) => void,
  ) => {
    if (!value.trim()) return;
    switch (type) {
      case "highlight":
        setHighlights([...highlights, value.trim()]);
        break;
      case "blocker":
        setBlockers([...blockers, value.trim()]);
        break;
      case "improvement":
        setImprovements([...improvements, value.trim()]);
        break;
    }
    setValue("");
  };

  const handleRemoveItem = (
    type: "highlight" | "blocker" | "improvement",
    index: number,
  ) => {
    switch (type) {
      case "highlight":
        setHighlights(highlights.filter((_, i) => i !== index));
        break;
      case "blocker":
        setBlockers(blockers.filter((_, i) => i !== index));
        break;
      case "improvement":
        setImprovements(improvements.filter((_, i) => i !== index));
        break;
    }
  };

  const handleSave = () => {
    onSave({
      date,
      period,
      metrics,
      highlights,
      blockers,
      improvements,
      notes: notes || undefined,
    });
    onOpenChange(false);
  };

  const ItemInput = ({
    label,
    value,
    onChange,
    onAdd,
    items,
    onRemove,
    type,
    colorClass,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    onAdd: () => void;
    items: string[];
    onRemove: (index: number) => void;
    type: string;
    colorClass: string;
  }) => (
    <div className="space-y-2">
      <Label className={colorClass}>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Add ${type}...`}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), onAdd())}
          className="flex-1"
        />
        <Button type="button" size="icon" variant="outline" onClick={onAdd}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {items.map((item, idx) => (
            <span
              key={idx}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs",
                colorClass === "text-accent"
                  ? "bg-accent/20"
                  : colorClass === "text-destructive"
                    ? "bg-destructive/20"
                    : "bg-primary/20",
              )}
            >
              {item}
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {review ? "Edit Review" : "Add Performance Review"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Date and Period */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Period</Label>
              <Tabs
                value={period}
                onValueChange={(v) => setPeriod(v as ReviewPeriod)}
              >
                <TabsList className="w-full">
                  <TabsTrigger value="daily" className="flex-1">
                    Daily
                  </TabsTrigger>
                  <TabsTrigger value="weekly" className="flex-1">
                    Weekly
                  </TabsTrigger>
                  <TabsTrigger value="monthly" className="flex-1">
                    Monthly
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-4">
            <Label>Performance Metrics</Label>
            {(Object.keys(metrics) as Array<keyof ReviewMetrics>).map((key) => {
              const Icon = metricIcons[key];
              return (
                <div key={key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      {metricLabels[key]}
                    </div>
                    <span className="text-sm font-medium">{metrics[key]}%</span>
                  </div>
                  <Slider
                    value={[metrics[key]]}
                    onValueChange={([value]) =>
                      setMetrics({ ...metrics, [key]: value })
                    }
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              );
            })}
          </div>

          {/* Highlights, Blockers, Improvements */}
          <ItemInput
            label="Highlights"
            value={newHighlight}
            onChange={setNewHighlight}
            onAdd={() =>
              handleAddItem("highlight", newHighlight, setNewHighlight)
            }
            items={highlights}
            onRemove={(idx) => handleRemoveItem("highlight", idx)}
            type="highlight"
            colorClass="text-accent"
          />

          <ItemInput
            label="Blockers"
            value={newBlocker}
            onChange={setNewBlocker}
            onAdd={() => handleAddItem("blocker", newBlocker, setNewBlocker)}
            items={blockers}
            onRemove={(idx) => handleRemoveItem("blocker", idx)}
            type="blocker"
            colorClass="text-destructive"
          />

          <ItemInput
            label="Areas for Improvement"
            value={newImprovement}
            onChange={setNewImprovement}
            onAdd={() =>
              handleAddItem("improvement", newImprovement, setNewImprovement)
            }
            items={improvements}
            onRemove={(idx) => handleRemoveItem("improvement", idx)}
            type="improvement"
            colorClass="text-primary"
          />

          {/* Notes */}
          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional notes..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {review ? "Save Changes" : "Add Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
