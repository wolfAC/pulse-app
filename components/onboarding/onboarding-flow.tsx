"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { registerUser, login } from "@/store/slices/auth";
import {
  User,
  Target,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Zap,
  Heart,
  TrendingUp,
  BookOpen,
  Dumbbell,
  Moon,
  Mail,
} from "lucide-react";

interface OnboardingFlowProps {
  onComplete: () => void;
}

interface GoalPreset {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const goalPresets: GoalPreset[] = [
  {
    id: "productivity",
    title: "Boost Productivity",
    description: "Track tasks and improve focus",
    icon: <Zap className="h-6 w-6" />,
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  {
    id: "health",
    title: "Improve Health",
    description: "Monitor fitness and wellness",
    icon: <Heart className="h-6 w-6" />,
    color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  },
  {
    id: "performance",
    title: "Track Performance",
    description: "Measure work achievements",
    icon: <TrendingUp className="h-6 w-6" />,
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  {
    id: "learning",
    title: "Learn New Skills",
    description: "Set learning milestones",
    icon: <BookOpen className="h-6 w-6" />,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  {
    id: "fitness",
    title: "Get Fit",
    description: "Exercise and activity goals",
    icon: <Dumbbell className="h-6 w-6" />,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  {
    id: "sleep",
    title: "Better Sleep",
    description: "Improve sleep quality",
    icon: <Moon className="h-6 w-6" />,
    color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  },
];

const steps = [
  { id: 1, title: "Welcome" },
  { id: 2, title: "Profile" },
  { id: 3, title: "Goals" },
  { id: 4, title: "Finish" },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    pin?: string;
  }>({});

  const validateStep2 = () => {
    const newErrors: { name?: string; email?: string; pin?: string } = {};

    if (!name.trim()) {
      newErrors.name = "Please enter your name";
    }

    if (!email.trim()) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (pin.length !== 6) {
      newErrors.pin = "PIN must be 6 digits";
    } else if (!/^\d+$/.test(pin)) {
      newErrors.pin = "PIN must contain only numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 2 && !validateStep2()) return;

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      return;
    }
    // Register user and open session
    dispatch(
      registerUser({
        email: email.trim().toLowerCase(),
        name: name.trim(),
        pin,
        selectedGoals,
      }),
    );
    dispatch(login({ email: email.trim().toLowerCase() }));
    onComplete();
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((id) => id !== goalId)
        : [...prev, goalId],
    );
  };

  const handlePinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setPin(numericValue);
    if (errors.pin) setErrors((prev) => ({ ...prev, pin: undefined }));
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4">
      {/* Progress Stepper */}
      <div className="w-full max-w-md mb-8">
        <div className="w-full flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-secondary text-muted-foreground",
                  )}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs mt-2 hidden sm:block",
                    currentStep >= step.id
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 w-12 sm:w-16 mx-2 transition-colors duration-300",
                    currentStep > step.id ? "bg-primary" : "bg-secondary",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <Card className="w-full max-w-md">
        {/* Step 1: Welcome */}
        {currentStep === 1 && (
          <>
            <CardHeader className="text-center space-y-4 pb-2">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl sm:text-3xl">
                  Welcome to Pulse
                </CardTitle>
                <CardDescription className="text-base">
                  Track your productivity, health, and goals all in one place.
                  Let&apos;s get you set up in just a few steps.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center p-3 rounded-lg bg-secondary/50">
                  <Target className="h-6 w-6 text-primary mb-2" />
                  <span className="text-xs text-center text-muted-foreground">
                    Set Goals
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg bg-secondary/50">
                  <TrendingUp className="h-6 w-6 text-accent mb-2" />
                  <span className="text-xs text-center text-muted-foreground">
                    Track Progress
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-lg bg-secondary/50">
                  <Heart className="h-6 w-6 text-rose-500 mb-2" />
                  <span className="text-xs text-center text-muted-foreground">
                    Stay Healthy
                  </span>
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 2: Profile */}
        {currentStep === 2 && (
          <>
            <CardHeader className="text-center space-y-4 pb-2">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">Create Your Profile</CardTitle>
                <CardDescription className="text-base">
                  Tell us a bit about yourself and set up a secure PIN.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Your Name
                </label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name)
                      setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  className={cn(
                    "h-12 text-base",
                    errors.name &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium flex items-center gap-1.5"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={cn(
                    "h-12 text-base",
                    errors.email &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Used to identify your account — no emails are sent.
                </p>
              </div>

              {/* PIN */}
              <div className="space-y-2">
                <label
                  htmlFor="pin"
                  className="text-sm font-medium flex items-center gap-1.5"
                >
                  6-Digit PIN
                </label>
                <div className="flex">
                  <InputOTP
                    id="pin"
                    maxLength={6}
                    value={pin}
                    onChange={handlePinChange}
                    autoFocus
                  >
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className={cn(
                            "h-12 w-16 text-lg font-bold",
                            errors.pin &&
                              "border-destructive aria-invalid:border-destructive",
                          )}
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {errors.pin && (
                  <p className="text-sm text-destructive">{errors.pin}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Enter 6 digits for your secure PIN
                </p>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 3: Goals */}
        {currentStep === 3 && (
          <>
            <CardHeader className="text-center space-y-4 pb-2">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">Choose Your Goals</CardTitle>
                <CardDescription className="text-base">
                  Select the areas you want to focus on. You can change these
                  later.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 gap-3">
                {goalPresets.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={cn(
                      "relative p-4 rounded-xl border-2 text-left transition-all duration-200",
                      selectedGoals.includes(goal.id)
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50 hover:bg-secondary/50",
                    )}
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center mb-3 border",
                        goal.color,
                      )}
                    >
                      {goal.icon}
                    </div>
                    <h3 className="font-medium text-sm">{goal.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {goal.description}
                    </p>
                    {selectedGoals.includes(goal.id) && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground mt-4">
                {selectedGoals.length === 0
                  ? "Select at least one goal, or skip to continue"
                  : `${selectedGoals.length} goal${selectedGoals.length > 1 ? "s" : ""} selected`}
              </p>
            </CardContent>
          </>
        )}

        {/* Step 4: Finish */}
        {currentStep === 4 && (
          <>
            <CardHeader className="text-center space-y-4 pb-2">
              <div className="mx-auto w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-accent" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl">You&apos;re All Set!</CardTitle>
                <CardDescription className="text-base">
                  Welcome, {name || "friend"}! Your Pulse dashboard is ready.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/50 space-y-3">
                  <h4 className="font-medium text-sm">Your setup:</h4>
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{name || "User"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm ">{email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {selectedGoals.length > 0
                        ? `${selectedGoals.length} focus area${selectedGoals.length > 1 ? "s" : ""}`
                        : "No goals selected yet"}
                    </span>
                  </div>
                </div>
                {selectedGoals.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedGoals.map((goalId) => {
                      const goal = goalPresets.find((g) => g.id === goalId);
                      if (!goal) return null;
                      return (
                        <div
                          key={goalId}
                          className={cn(
                            "px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5",
                            goal.color,
                          )}
                        >
                          {goal.icon}
                          {goal.title}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </>
        )}

        {/* Navigation */}
        <CardContent className="pt-2 pb-6">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleBack}
                className="flex-1 h-14 text-base"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
            )}
            <Button
              type="button"
              size="lg"
              onClick={handleNext}
              className={cn(
                "h-14 text-base",
                currentStep === 1 ? "w-full" : "flex-1",
              )}
            >
              {currentStep === 4 ? (
                <>
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              ) : currentStep === 3 ? (
                selectedGoals.length === 0 ? (
                  "Skip"
                ) : (
                  "Continue"
                )
              ) : (
                <>
                  {currentStep === 1 ? "Get Started" : "Continue"}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Skip onboarding link */}
      {currentStep < 4 && (
        <button
          type="button"
          onClick={onComplete}
          className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Skip setup for now
        </button>
      )}
    </div>
  );
}
