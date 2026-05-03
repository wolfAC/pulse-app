"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FormModal,
  TextField,
  NumberField,
  DateField,
  SelectField,
  TextareaField,
  FormRow,
  FormSection,
} from "@/components/ui/form-modal"
import {
  Target,
  ClipboardList,
  Activity,
  Calendar,
  Flag,
  FileText,
  Zap,
  Award,
  MessageSquare,
  BookOpen,
  Moon,
  Footprints,
  Flame,
  Droplets,
  Dumbbell,
} from "lucide-react"

type ModalType = "goal" | "review" | "health" | null

export function FormModalDemo() {
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  // Goal form state
  const [goalTitle, setGoalTitle] = useState("")
  const [goalDescription, setGoalDescription] = useState("")
  const [goalPriority, setGoalPriority] = useState("medium")
  const [goalDueDate, setGoalDueDate] = useState("")

  // Review form state
  const [reviewDate, setReviewDate] = useState(new Date().toISOString().split("T")[0])
  const [reviewPeriod, setReviewPeriod] = useState("daily")
  const [productivity, setProductivity] = useState<number | string>(75)
  const [quality, setQuality] = useState<number | string>(75)
  const [communication, setCommunication] = useState<number | string>(75)
  const [learning, setLearning] = useState<number | string>(75)
  const [reviewNotes, setReviewNotes] = useState("")

  // Health form state
  const [healthDate, setHealthDate] = useState(new Date().toISOString().split("T")[0])
  const [healthType, setHealthType] = useState("steps")
  const [healthValue, setHealthValue] = useState<number | string>("")
  const [workoutDuration, setWorkoutDuration] = useState<number | string>("")
  const [healthNotes, setHealthNotes] = useState("")

  const resetGoalForm = () => {
    setGoalTitle("")
    setGoalDescription("")
    setGoalPriority("medium")
    setGoalDueDate("")
  }

  const resetReviewForm = () => {
    setReviewDate(new Date().toISOString().split("T")[0])
    setReviewPeriod("daily")
    setProductivity(75)
    setQuality(75)
    setCommunication(75)
    setLearning(75)
    setReviewNotes("")
  }

  const resetHealthForm = () => {
    setHealthDate(new Date().toISOString().split("T")[0])
    setHealthType("steps")
    setHealthValue("")
    setWorkoutDuration("")
    setHealthNotes("")
  }

  const handleGoalSubmit = () => {
    // In production, validate and save to database
    console.log("[v0] Goal submitted:", { goalTitle, goalDescription, goalPriority, goalDueDate })
    resetGoalForm()
    setActiveModal(null)
  }

  const handleReviewSubmit = () => {
    console.log("[v0] Review submitted:", {
      reviewDate,
      reviewPeriod,
      productivity,
      quality,
      communication,
      learning,
      reviewNotes,
    })
    resetReviewForm()
    setActiveModal(null)
  }

  const handleHealthSubmit = () => {
    console.log("[v0] Health entry submitted:", {
      healthDate,
      healthType,
      healthValue,
      workoutDuration,
      healthNotes,
    })
    resetHealthForm()
    setActiveModal(null)
  }

  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" },
  ]

  const periodOptions = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ]

  const healthTypeOptions = [
    { value: "sleep", label: "Sleep", icon: Moon },
    { value: "steps", label: "Steps", icon: Footprints },
    { value: "calories", label: "Calories", icon: Flame },
    { value: "water", label: "Water", icon: Droplets },
    { value: "workout", label: "Workout", icon: Dumbbell },
  ]

  const healthUnits: Record<string, string> = {
    sleep: "hours",
    steps: "steps",
    calories: "kcal",
    water: "L",
    workout: "min",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="size-5" />
          Reusable Form Modals
        </CardTitle>
        <CardDescription>
          Consistent form patterns for goals, reviews, and health entries
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setActiveModal("goal")} variant="outline">
            <Target className="size-4" />
            Add Goal
          </Button>
          <Button onClick={() => setActiveModal("review")} variant="outline">
            <ClipboardList className="size-4" />
            Add Review
          </Button>
          <Button onClick={() => setActiveModal("health")} variant="outline">
            <Activity className="size-4" />
            Add Health Entry
          </Button>
        </div>

        {/* Goal Form Modal */}
        <FormModal
          open={activeModal === "goal"}
          onOpenChange={(open) => {
            if (!open) {
              resetGoalForm()
              setActiveModal(null)
            }
          }}
          title="Create New Goal"
          description="Set a goal to track your progress and stay motivated."
          onSubmit={handleGoalSubmit}
          submitLabel="Create Goal"
          size="md"
        >
          <TextField
            name="title"
            label="Goal Title"
            value={goalTitle}
            onChange={setGoalTitle}
            placeholder="Learn a new programming language"
            icon={Target}
            required
          />
          <TextareaField
            name="description"
            label="Description"
            value={goalDescription}
            onChange={setGoalDescription}
            placeholder="Describe what you want to achieve..."
            description="Add details about your goal and how you plan to achieve it."
          />
          <FormRow>
            <SelectField
              name="priority"
              label="Priority"
              value={goalPriority}
              onChange={setGoalPriority}
              options={priorityOptions}
              required
            />
            <DateField
              name="dueDate"
              label="Due Date"
              value={goalDueDate}
              onChange={setGoalDueDate}
              icon={Calendar}
              required
            />
          </FormRow>
        </FormModal>

        {/* Review Form Modal */}
        <FormModal
          open={activeModal === "review"}
          onOpenChange={(open) => {
            if (!open) {
              resetReviewForm()
              setActiveModal(null)
            }
          }}
          title="Add Performance Review"
          description="Track your work performance and identify areas for improvement."
          onSubmit={handleReviewSubmit}
          submitLabel="Save Review"
          size="lg"
        >
          <FormRow>
            <DateField
              name="reviewDate"
              label="Review Date"
              value={reviewDate}
              onChange={setReviewDate}
              icon={Calendar}
              required
            />
            <SelectField
              name="period"
              label="Review Period"
              value={reviewPeriod}
              onChange={setReviewPeriod}
              options={periodOptions}
              required
            />
          </FormRow>

          <FormSection title="Performance Metrics" description="Rate your performance in each area (0-100)">
            <FormRow>
              <NumberField
                name="productivity"
                label="Productivity"
                value={productivity}
                onChange={setProductivity}
                icon={Zap}
                min={0}
                max={100}
                placeholder="75"
              />
              <NumberField
                name="quality"
                label="Quality"
                value={quality}
                onChange={setQuality}
                icon={Award}
                min={0}
                max={100}
                placeholder="75"
              />
            </FormRow>
            <FormRow>
              <NumberField
                name="communication"
                label="Communication"
                value={communication}
                onChange={setCommunication}
                icon={MessageSquare}
                min={0}
                max={100}
                placeholder="75"
              />
              <NumberField
                name="learning"
                label="Learning"
                value={learning}
                onChange={setLearning}
                icon={BookOpen}
                min={0}
                max={100}
                placeholder="75"
              />
            </FormRow>
          </FormSection>

          <TextareaField
            name="notes"
            label="Additional Notes"
            value={reviewNotes}
            onChange={setReviewNotes}
            placeholder="Any highlights, blockers, or areas for improvement..."
            rows={4}
          />
        </FormModal>

        {/* Health Entry Form Modal */}
        <FormModal
          open={activeModal === "health"}
          onOpenChange={(open) => {
            if (!open) {
              resetHealthForm()
              setActiveModal(null)
            }
          }}
          title="Log Health Entry"
          description="Track your daily health metrics and activities."
          onSubmit={handleHealthSubmit}
          submitLabel="Log Entry"
          size="md"
        >
          <FormRow>
            <DateField
              name="healthDate"
              label="Date"
              value={healthDate}
              onChange={setHealthDate}
              icon={Calendar}
              required
            />
            <SelectField
              name="healthType"
              label="Metric Type"
              value={healthType}
              onChange={setHealthType}
              options={healthTypeOptions}
              required
            />
          </FormRow>

          <FormRow>
            <NumberField
              name="value"
              label="Value"
              value={healthValue}
              onChange={setHealthValue}
              unit={healthUnits[healthType]}
              placeholder="Enter value"
              required
            />
            {healthType === "workout" && (
              <NumberField
                name="duration"
                label="Duration"
                value={workoutDuration}
                onChange={setWorkoutDuration}
                unit="minutes"
                placeholder="45"
              />
            )}
          </FormRow>

          <TextareaField
            name="healthNotes"
            label="Notes"
            value={healthNotes}
            onChange={setHealthNotes}
            placeholder="How are you feeling today?"
            rows={2}
          />
        </FormModal>
      </CardContent>
    </Card>
  )
}
