"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HealthOverview } from "./health-overview"
import { HealthLogs } from "./health-logs"
import { WorkoutsSection } from "./workouts-section"
import { AddEntryDialog } from "./add-entry-dialog"
import { Activity, Plus, LayoutGrid, ListOrdered, Dumbbell } from "lucide-react"

export function HealthTracker() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10">
              <Activity className="size-5 text-emerald-500" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold">Health Tracker</CardTitle>
              <p className="text-xs text-muted-foreground">Monitor your daily health metrics and workouts</p>
            </div>
          </div>
          <Button onClick={() => setDialogOpen(true)} size="sm">
            <Plus className="size-4 mr-1.5" />
            Add Entry
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="overview" className="gap-2">
                <LayoutGrid className="size-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="logs" className="gap-2">
                <ListOrdered className="size-4" />
                <span className="hidden sm:inline">Logs</span>
              </TabsTrigger>
              <TabsTrigger value="workouts" className="gap-2">
                <Dumbbell className="size-4" />
                <span className="hidden sm:inline">Workouts</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-0">
              <HealthOverview />
            </TabsContent>
            
            <TabsContent value="logs" className="mt-0">
              <HealthLogs />
            </TabsContent>
            
            <TabsContent value="workouts" className="mt-0">
              <WorkoutsSection />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <AddEntryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  )
}
