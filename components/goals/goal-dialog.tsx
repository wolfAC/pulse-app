"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import type { Goal, Priority } from "@/lib/types/goal";

interface GoalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal | null;
  onSave: (goal: Partial<Goal>) => void;
}

export function GoalDialog({
  open,
  onOpenChange,
  goal,
  onSave,
}: GoalDialogProps) {
  const isEditing = !!goal;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [milestones, setMilestones] = useState<Goal["milestones"]>([]);
  const [tasks, setTasks] = useState<Goal["tasks"]>([]);
  const [newMilestone, setNewMilestone] = useState("");
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setDescription(goal.description);
      setPriority(goal.priority);
      setDueDate(goal.dueDate);
      setMilestones(goal.milestones ?? []);
      setTasks(goal.tasks ?? []);
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      setMilestones([]);
      setTasks([]);
    }
    setNewMilestone("");
    setNewTask("");
  }, [goal, open]);

  const progress = (() => {
    const total = milestones.length + tasks.length;
    if (total === 0) return goal?.progress ?? 0;
    const done =
      milestones.filter((m) => m.completed).length +
      tasks.filter((t) => t.completed).length;
    return Math.round((done / total) * 100);
  })();

  const addMilestone = () => {
    if (!newMilestone.trim()) return;
    setMilestones((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        title: newMilestone.trim(),
        completed: false,
      },
    ]);
    setNewMilestone("");
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: Date.now().toString(), title: newTask.trim(), completed: false },
    ]);
    setNewTask("");
  };

  const toggleMilestone = (id: string) =>
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, completed: !m.completed } : m)),
    );

  const toggleTask = (id: string) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    );

  const deleteMilestone = (id: string) =>
    setMilestones((prev) => prev.filter((m) => m.id !== id));

  const deleteTask = (id: string) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const handleSubmit = () => {
    if (!title || !dueDate) return;
    onSave({
      ...(goal && { id: goal.id }),
      title,
      description,
      priority,
      dueDate,
      milestones,
      tasks,
      progress,
      ...(!isEditing ? { status: "active" as const } : {}),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Goal" : "Create Goal"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update goal details, milestones and tasks."
              : "Set a new goal to track your progress."}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">
              Details
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="flex-1"
              disabled={!isEditing && !title}
            >
              Progress{" "}
              {isEditing && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {progress}%
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── Details tab ── */}
          <TabsContent value="details" className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Learn a new language"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your goal..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={priority}
                  onValueChange={(v) => setPriority(v as Priority)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>

          {/* ── Progress tab ── */}
          <TabsContent value="progress" className="mt-4 space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Overall Progress</span>
                <span className="text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <Separator />

            {/* Milestones */}
            <div className="space-y-3">
              <Label>Milestones</Label>
              <div className="space-y-2">
                {milestones.map((m) => (
                  <div key={m.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={m.completed}
                      onCheckedChange={() => toggleMilestone(m.id)}
                    />
                    <span
                      className={`flex-1 text-sm ${m.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {m.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteMilestone(m.id)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add milestone…"
                  value={newMilestone}
                  onChange={(e) => setNewMilestone(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addMilestone())
                  }
                  className="h-8 text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addMilestone}
                  className="shrink-0"
                >
                  <Plus className="size-3.5" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Tasks */}
            <div className="space-y-3">
              <Label>Tasks</Label>
              <div className="space-y-2">
                {tasks.map((t) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={t.completed}
                      onCheckedChange={() => toggleTask(t.id)}
                    />
                    <span
                      className={`flex-1 text-sm ${t.completed ? "line-through text-muted-foreground" : ""}`}
                    >
                      {t.title}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteTask(t.id)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add task…"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTask())
                  }
                  className="h-8 text-sm"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={addTask}
                  className="shrink-0"
                >
                  <Plus className="size-3.5" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!title || !dueDate}>
            {isEditing ? "Save Changes" : "Create Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
