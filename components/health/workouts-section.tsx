"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { WorkoutCard } from "./workout-card"
import { Dumbbell, Plus, TrendingUp, Flame, Clock } from "lucide-react"
import type { Workout } from "@/lib/types/health"

const mockWorkouts: Workout[] = [
  {
    id: "1",
    date: "2024-01-15",
    type: "running",
    name: "Morning Run",
    duration: 45,
    caloriesBurned: 420,
    distance: 5.2,
    notes: "Felt great, personal best pace!",
  },
  {
    id: "2",
    date: "2024-01-14",
    type: "strength",
    name: "Upper Body",
    duration: 60,
    caloriesBurned: 320,
    notes: "Focused on chest and back",
  },
  {
    id: "3",
    date: "2024-01-13",
    type: "yoga",
    name: "Evening Yoga",
    duration: 30,
    caloriesBurned: 150,
  },
  {
    id: "4",
    date: "2024-01-12",
    type: "cycling",
    name: "Bike Commute",
    duration: 35,
    caloriesBurned: 280,
    distance: 12.5,
  },
  {
    id: "5",
    date: "2024-01-11",
    type: "hiit",
    name: "HIIT Session",
    duration: 25,
    caloriesBurned: 350,
    notes: "High intensity intervals",
  },
  {
    id: "6",
    date: "2024-01-10",
    type: "swimming",
    name: "Pool Laps",
    duration: 40,
    caloriesBurned: 380,
    distance: 1.5,
  },
]

export function WorkoutsSection() {
  const [workouts, setWorkouts] = useState<Workout[]>(mockWorkouts)

  const totalCalories = workouts.reduce((sum, w) => sum + w.caloriesBurned, 0)
  const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0)
  const totalWorkouts = workouts.length

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const handleDelete = (id: string) => {
    setWorkouts(workouts.filter(w => w.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Weekly Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Dumbbell className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalWorkouts}</p>
                <p className="text-xs text-muted-foreground">Workouts this week</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
                <Flame className="size-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalCalories.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Calories burned</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Clock className="size-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatDuration(totalDuration)}</p>
                <p className="text-xs text-muted-foreground">Total duration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workouts List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <TrendingUp className="size-4 text-muted-foreground" />
            Recent Workouts
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {workouts.length} workouts
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {workouts.map((workout) => (
              <WorkoutCard 
                key={workout.id} 
                workout={workout} 
                onDelete={handleDelete}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
