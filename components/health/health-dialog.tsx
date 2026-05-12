"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { HealthMetricType, WorkoutType } from "@/lib/types/health";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/index";
import { addEntry, addWorkout } from "@/store/slices/health";
import {
  Bike,
  Droplets,
  Dumbbell,
  Flame,
  Footprints,
  Heart,
  Moon,
  PersonStanding,
  Scale,
  Waves,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

interface AddEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const metricTypes = [
  {
    type: "sleep" as HealthMetricType,
    icon: Moon,
    label: "Sleep",
    unit: "hours",
    placeholder: "7.5",
  },
  {
    type: "steps" as HealthMetricType,
    icon: Footprints,
    label: "Steps",
    unit: "steps",
    placeholder: "10000",
  },
  {
    type: "calories" as HealthMetricType,
    icon: Flame,
    label: "Calories",
    unit: "kcal",
    placeholder: "2000",
  },
  {
    type: "water" as HealthMetricType,
    icon: Droplets,
    label: "Water",
    unit: "L",
    placeholder: "2.5",
  },
  {
    type: "heart_rate" as HealthMetricType,
    icon: Heart,
    label: "Heart Rate",
    unit: "bpm",
    placeholder: "72",
  },
  {
    type: "weight" as HealthMetricType,
    icon: Scale,
    label: "Weight",
    unit: "kg",
    placeholder: "70",
  },
];

const workoutTypes = [
  { type: "running" as WorkoutType, icon: Footprints, label: "Running" },
  { type: "cycling" as WorkoutType, icon: Bike, label: "Cycling" },
  { type: "swimming" as WorkoutType, icon: Waves, label: "Swimming" },
  { type: "strength" as WorkoutType, icon: Dumbbell, label: "Strength" },
  { type: "yoga" as WorkoutType, icon: PersonStanding, label: "Yoga" },
  { type: "hiit" as WorkoutType, icon: Zap, label: "HIIT" },
];

const emptyForm = {
  value: "",
  duration: "",
  calories: "",
  distance: "",
  workoutName: "",
  notes: "",
};

export function HealthDialog({ open, onOpenChange }: AddEntryDialogProps) {
  const dispatch = useDispatch();

  // Get the logged-in user's email to stamp on entries
  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );

  const [tab, setTab] = useState<"metric" | "workout">("metric");
  const [selectedMetric, setSelectedMetric] =
    useState<HealthMetricType>("steps");
  const [selectedWorkout, setSelectedWorkout] =
    useState<WorkoutType>("running");
  const [form, setForm] = useState(emptyForm);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const set =
    (key: keyof typeof emptyForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const reset = () => {
    setForm(emptyForm);
    setDate(new Date().toISOString().split("T")[0]);
  };

  const handleSubmit = () => {
    if (!currentEmail) return; // no session, shouldn't happen

    if (tab === "metric") {
      if (!form.value) return;
      const config = metricTypes.find((m) => m.type === selectedMetric)!;
      dispatch(
        addEntry({
          id: Date.now().toString(),
          userEmail: currentEmail,
          createdAt: +new Date(),
          type: selectedMetric,
          value: parseFloat(form.value),
          unit: config.unit,
          notes: form.notes || undefined,
        }),
      );
    } else {
      if (!form.workoutName || !form.duration || !form.calories) return;
      dispatch(
        addWorkout({
          id: Date.now().toString(),
          userEmail: currentEmail,
          type: selectedWorkout,
          name: form.workoutName,
          duration: parseInt(form.duration),
          caloriesBurned: parseInt(form.calories),
          distance: form.distance ? parseFloat(form.distance) : undefined,
          notes: form.notes || undefined,
          createdAt: +new Date(),
        }),
      );
    }
    reset();
    onOpenChange(false);
  };

  const selectedMetricConfig = metricTypes.find(
    (m) => m.type === selectedMetric,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Add Health Entry</DialogTitle>
          <DialogDescription>
            Track your health metrics or log a workout session.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "metric" | "workout")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="metric">Health Metric</TabsTrigger>
            <TabsTrigger value="workout">Workout</TabsTrigger>
          </TabsList>

          <TabsContent value="metric" className="space-y-4 mt-4">
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel>Date</FieldLabel>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Metric Type</FieldLabel>
                <div className="grid grid-cols-3 gap-2">
                  {metricTypes.map((metric) => {
                    const Icon = metric.icon;
                    return (
                      <Button
                        key={metric.type}
                        type="button"
                        variant={
                          selectedMetric === metric.type ? "default" : "outline"
                        }
                        className={cn(
                          "h-auto py-3 flex flex-col gap-1",
                          selectedMetric === metric.type &&
                            "ring-2 ring-primary",
                        )}
                        onClick={() => setSelectedMetric(metric.type)}
                      >
                        <Icon className="size-5" />
                        <span className="text-xs">{metric.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </Field>
              <Field>
                <FieldLabel>Value ({selectedMetricConfig?.unit})</FieldLabel>
                <Input
                  type="number"
                  placeholder={selectedMetricConfig?.placeholder}
                  value={form.value}
                  onChange={set("value")}
                />
              </Field>
              <Field>
                <FieldLabel>Notes (optional)</FieldLabel>
                <Textarea
                  placeholder="Add any notes..."
                  value={form.notes}
                  onChange={set("notes")}
                  rows={2}
                />
              </Field>
            </FieldGroup>
          </TabsContent>

          <TabsContent value="workout" className="space-y-4 mt-4">
            <FieldGroup className="gap-4">
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Date</FieldLabel>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Workout Type</FieldLabel>
                  <Select
                    value={selectedWorkout}
                    onValueChange={(v) => setSelectedWorkout(v as WorkoutType)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {workoutTypes.map((type) => (
                        <SelectItem key={type.type} value={type.type}>
                          <div className="flex items-center gap-2">
                            <type.icon className="size-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field>
                <FieldLabel>Workout Name</FieldLabel>
                <Input
                  placeholder="e.g. Morning Run"
                  value={form.workoutName}
                  onChange={set("workoutName")}
                />
              </Field>
              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel>Duration (min)</FieldLabel>
                  <Input
                    type="number"
                    placeholder="45"
                    value={form.duration}
                    onChange={set("duration")}
                  />
                </Field>
                <Field>
                  <FieldLabel>Calories</FieldLabel>
                  <Input
                    type="number"
                    placeholder="300"
                    value={form.calories}
                    onChange={set("calories")}
                  />
                </Field>
                <Field>
                  <FieldLabel>Distance (km)</FieldLabel>
                  <Input
                    type="number"
                    placeholder="5.0"
                    value={form.distance}
                    onChange={set("distance")}
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel>Notes (optional)</FieldLabel>
                <Textarea
                  placeholder="How was your workout?"
                  value={form.notes}
                  onChange={set("notes")}
                  rows={2}
                />
              </Field>
            </FieldGroup>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              reset();
              onOpenChange(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Entry</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
