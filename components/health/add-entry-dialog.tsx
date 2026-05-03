"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { Moon, Footprints, Flame, Droplets, Heart, Scale, Dumbbell, Bike, Waves, PersonStanding, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import type { HealthMetricType, WorkoutType } from "@/lib/types/health"

interface AddEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const metricTypes: { type: HealthMetricType; icon: typeof Moon; label: string; unit: string; placeholder: string }[] = [
  { type: "sleep", icon: Moon, label: "Sleep", unit: "hours", placeholder: "7.5" },
  { type: "steps", icon: Footprints, label: "Steps", unit: "steps", placeholder: "10000" },
  { type: "calories", icon: Flame, label: "Calories", unit: "kcal", placeholder: "2000" },
  { type: "water", icon: Droplets, label: "Water", unit: "L", placeholder: "2.5" },
  { type: "heart_rate", icon: Heart, label: "Heart Rate", unit: "bpm", placeholder: "72" },
  { type: "weight", icon: Scale, label: "Weight", unit: "kg", placeholder: "70" },
]

const workoutTypes: { type: WorkoutType; icon: typeof Dumbbell; label: string }[] = [
  { type: "running", icon: Footprints, label: "Running" },
  { type: "cycling", icon: Bike, label: "Cycling" },
  { type: "swimming", icon: Waves, label: "Swimming" },
  { type: "strength", icon: Dumbbell, label: "Strength" },
  { type: "yoga", icon: PersonStanding, label: "Yoga" },
  { type: "hiit", icon: Zap, label: "HIIT" },
]

export function AddEntryDialog({ open, onOpenChange }: AddEntryDialogProps) {
  const [tab, setTab] = useState<"metric" | "workout">("metric")
  const [selectedMetric, setSelectedMetric] = useState<HealthMetricType>("steps")
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutType>("running")
  const [value, setValue] = useState("")
  const [duration, setDuration] = useState("")
  const [calories, setCalories] = useState("")
  const [distance, setDistance] = useState("")
  const [workoutName, setWorkoutName] = useState("")
  const [notes, setNotes] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])

  const selectedMetricConfig = metricTypes.find(m => m.type === selectedMetric)

  const handleSubmit = () => {
    // In a real app, this would save to a database
    onOpenChange(false)
    // Reset form
    setValue("")
    setDuration("")
    setCalories("")
    setDistance("")
    setWorkoutName("")
    setNotes("")
    setDate(new Date().toISOString().split("T")[0])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Health Entry</DialogTitle>
          <DialogDescription>
            Track your health metrics or log a workout session.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={tab} onValueChange={(v) => setTab(v as "metric" | "workout")}>
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
                    const Icon = metric.icon
                    return (
                      <Button
                        key={metric.type}
                        type="button"
                        variant={selectedMetric === metric.type ? "default" : "outline"}
                        className={cn(
                          "h-auto py-3 flex flex-col gap-1",
                          selectedMetric === metric.type && "ring-2 ring-primary"
                        )}
                        onClick={() => setSelectedMetric(metric.type)}
                      >
                        <Icon className="size-5" />
                        <span className="text-xs">{metric.label}</span>
                      </Button>
                    )
                  })}
                </div>
              </Field>
              
              <Field>
                <FieldLabel>Value ({selectedMetricConfig?.unit})</FieldLabel>
                <Input 
                  type="number"
                  placeholder={selectedMetricConfig?.placeholder}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </Field>
              
              <Field>
                <FieldLabel>Notes (optional)</FieldLabel>
                <Textarea 
                  placeholder="Add any notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  <Select value={selectedWorkout} onValueChange={(v) => setSelectedWorkout(v as WorkoutType)}>
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
                  value={workoutName}
                  onChange={(e) => setWorkoutName(e.target.value)}
                />
              </Field>
              
              <div className="grid grid-cols-3 gap-4">
                <Field>
                  <FieldLabel>Duration (min)</FieldLabel>
                  <Input 
                    type="number"
                    placeholder="45"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </Field>
                
                <Field>
                  <FieldLabel>Calories</FieldLabel>
                  <Input 
                    type="number"
                    placeholder="300"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                  />
                </Field>
                
                <Field>
                  <FieldLabel>Distance (km)</FieldLabel>
                  <Input 
                    type="number"
                    placeholder="5.0"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                  />
                </Field>
              </div>
              
              <Field>
                <FieldLabel>Notes (optional)</FieldLabel>
                <Textarea 
                  placeholder="How was your workout?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </Field>
            </FieldGroup>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Add Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
