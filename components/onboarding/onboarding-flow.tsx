"use client";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { login, registerUser } from "@/store/slices/auth";
import { setCurrency } from "@/store/slices/app";
import { currencies } from "@/lib/types/finance";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Dumbbell,
  Heart,
  Mail,
  Moon,
  Target,
  TrendingUp,
  User,
  Wallet,
  Zap,
  PiggyBank,
  BarChart3,
  DollarSign,
} from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";

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
    icon: <Zap className="h-5 w-5" />,
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  {
    id: "health",
    title: "Improve Health",
    description: "Monitor fitness and wellness",
    icon: <Heart className="h-5 w-5" />,
    color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  },
  {
    id: "performance",
    title: "Track Performance",
    description: "Measure work achievements",
    icon: <TrendingUp className="h-5 w-5" />,
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  {
    id: "learning",
    title: "Learn New Skills",
    description: "Set learning milestones",
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  {
    id: "fitness",
    title: "Get Fit",
    description: "Exercise and activity goals",
    icon: <Dumbbell className="h-5 w-5" />,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  {
    id: "sleep",
    title: "Better Sleep",
    description: "Improve sleep quality",
    icon: <Moon className="h-5 w-5" />,
    color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  },
];

const budgetCategories = [
  { id: "food", label: "Food & Dining", icon: "🍔" },
  { id: "transport", label: "Transportation", icon: "🚗" },
  { id: "shopping", label: "Shopping", icon: "🛍️" },
  { id: "entertainment", label: "Entertainment", icon: "🎬" },
  { id: "bills", label: "Bills & Utilities", icon: "⚡" },
  { id: "healthcare", label: "Healthcare", icon: "❤️" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "travel", label: "Travel", icon: "✈️" },
];

const steps = [
  { id: 1, title: "Welcome" },
  { id: 2, title: "Profile" },
  { id: 3, title: "Finance" },
  { id: 4, title: "Goals" },
  { id: 5, title: "Finish" },
];

// Fixed card body height — profile step is tallest, all others match it
const CARD_BODY_CLASS = "h-[480px] flex flex-col";

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const dispatch = useDispatch();

  const [currentStep, setCurrentStep] = useState(1);

  // profile
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    pin?: string;
  }>({});

  // finance
  const [selectedCurrency, setSelectedCurrency] = useState("INR");
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [selectedBudgetCats, setSelectedBudgetCats] = useState<string[]>([]);
  const [monthlySavingsGoal, setMonthlySavingsGoal] = useState("");

  // goals
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // ── validation ────────────────────────────────────────────────────────────
  const validateStep2 = () => {
    const newErrors: { name?: string; email?: string; pin?: string } = {};
    if (!name.trim()) newErrors.name = "Please enter your name";
    if (!email.trim()) newErrors.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      newErrors.email = "Please enter a valid email address";
    if (pin.length !== 6) newErrors.pin = "PIN must be 6 digits";
    else if (!/^\d+$/.test(pin))
      newErrors.pin = "PIN must contain only numbers";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleNext = () => {
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      return;
    }
    dispatch(setCurrency(selectedCurrency));
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

  const toggleGoal = (id: string) =>
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );

  const toggleBudgetCat = (id: string) =>
    setSelectedBudgetCats((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );

  const handlePinChange = (value: string) => {
    setPin(value.replace(/\D/g, "").slice(0, 6));
    if (errors.pin) setErrors((prev) => ({ ...prev, pin: undefined }));
  };

  const currencySymbol =
    currencies
      .find((c) => c.value === selectedCurrency)
      ?.label.match(/\((.+)\)/)?.[1] ?? "₹";

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4">
      {/* Progress stepper */}
      <div className="w-full max-w-md mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300",
                    currentStep > step.id
                      ? "bg-primary text-primary-foreground"
                      : currentStep === step.id
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-secondary text-muted-foreground",
                  )}
                >
                  {currentStep > step.id ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-1.5 hidden sm:block",
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
                    "h-0.5 w-8 sm:w-12 mx-1.5 transition-colors duration-300",
                    currentStep > step.id ? "bg-primary" : "bg-secondary",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Card — fixed height */}
      <Card className="w-full max-w-md flex flex-col">
        {/* ── Step 1: Welcome ─────────────────────────────────────────────── */}
        {currentStep === 1 && (
          <div className={CARD_BODY_CLASS}>
            <CardHeader className="text-center space-y-3 pb-2 pt-8">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl sm:text-3xl">
                  Welcome to Pulse
                </CardTitle>
                <CardDescription className="text-base">
                  Track your finance, health, and goals all in one place.
                  Let&apos;s get you set up in just a few steps.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex items-center pt-6">
              <div className="grid grid-cols-3 gap-3 w-full">
                {[
                  {
                    icon: <Target className="h-6 w-6 text-primary" />,
                    label: "Set Goals",
                  },
                  {
                    icon: <TrendingUp className="h-6 w-6 text-accent" />,
                    label: "Track Progress",
                  },
                  {
                    icon: <Heart className="h-6 w-6 text-rose-500" />,
                    label: "Stay Healthy",
                  },
                  {
                    icon: <Wallet className="h-6 w-6 text-emerald-500" />,
                    label: "Budget Smart",
                  },
                  {
                    icon: <BarChart3 className="h-6 w-6 text-violet-500" />,
                    label: "Performance",
                  },
                  {
                    icon: <PiggyBank className="h-6 w-6 text-amber-500" />,
                    label: "Save More",
                  },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center p-3 rounded-xl bg-secondary/50 gap-2"
                  >
                    {icon}
                    <span className="text-xs text-center text-muted-foreground leading-tight">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        )}

        {/* ── Step 2: Profile ──────────────────────────────────────────────── */}
        {currentStep === 2 && (
          <div className={CARD_BODY_CLASS}>
            <CardHeader className="text-center space-y-3 pb-2 pt-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl">Create Your Profile</CardTitle>
                <CardDescription>
                  Tell us about yourself and set up a secure PIN.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center space-y-4 py-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium">
                  Full Name
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
                    "h-11",
                    errors.name &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium">
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
                    "h-11",
                    errors.email &&
                      "border-destructive focus-visible:ring-destructive",
                  )}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Used to identify your account — no emails are sent.
                </p>
              </div>

              {/* PIN */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">6-Digit PIN</label>
                <InputOTP maxLength={6} value={pin} onChange={handlePinChange}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className={cn(
                          "h-11 w-11 text-base font-bold",
                          errors.pin && "border-destructive",
                        )}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                {errors.pin ? (
                  <p className="text-xs text-destructive">{errors.pin}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    You&apos;ll use this PIN to unlock the app.
                  </p>
                )}
              </div>
            </CardContent>
          </div>
        )}

        {/* ── Step 3: Finance setup ────────────────────────────────────────── */}
        {currentStep === 3 && (
          <div className={CARD_BODY_CLASS}>
            <CardHeader className="text-center space-y-3 pb-2 pt-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-emerald-500" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl">Finance Setup</CardTitle>
                <CardDescription>
                  Configure your currency, income, and budget categories.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-start space-y-4 py-4 overflow-y-auto">
              {/* Currency */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Currency</label>
                <Select
                  value={selectedCurrency}
                  onValueChange={setSelectedCurrency}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Monthly income */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Monthly Income{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {currencySymbol}
                  </span>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="h-11 pl-8"
                  />
                </div>
              </div>

              {/* Savings goal */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Monthly Savings Goal{" "}
                  <span className="text-muted-foreground font-normal">
                    (optional)
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {currencySymbol}
                  </span>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={monthlySavingsGoal}
                    onChange={(e) => setMonthlySavingsGoal(e.target.value)}
                    className="h-11 pl-8"
                  />
                </div>
              </div>

              {/* Budget categories */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Budget Categories{" "}
                  <span className="text-muted-foreground font-normal">
                    (pick what applies)
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {budgetCategories.map((cat) => {
                    const selected = selectedBudgetCats.includes(cat.id);
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => toggleBudgetCat(cat.id)}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-all",
                          selected
                            ? "border-primary bg-primary/8 text-foreground"
                            : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <span>{cat.icon}</span>
                        <span className="truncate text-xs">{cat.label}</span>
                        {selected && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary ml-auto shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </div>
        )}

        {/* ── Step 4: Goals ────────────────────────────────────────────────── */}
        {currentStep === 4 && (
          <div className={CARD_BODY_CLASS}>
            <CardHeader className="text-center space-y-3 pb-2 pt-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl">Choose Your Goals</CardTitle>
                <CardDescription>
                  Select the areas you want to focus on. You can change these
                  later.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2.5 flex-1">
                {goalPresets.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => toggleGoal(goal.id)}
                    className={cn(
                      "relative p-3.5 rounded-xl border-2 text-left transition-all duration-200",
                      selectedGoals.includes(goal.id)
                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50 hover:bg-secondary/50",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center mb-2.5 border",
                        goal.color,
                      )}
                    >
                      {goal.icon}
                    </div>
                    <h3 className="font-medium text-sm leading-tight">
                      {goal.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                      {goal.description}
                    </p>
                    {selectedGoals.includes(goal.id) && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-center text-muted-foreground pt-3">
                {selectedGoals.length === 0
                  ? "Select at least one goal, or skip to continue"
                  : `${selectedGoals.length} goal${selectedGoals.length > 1 ? "s" : ""} selected`}
              </p>
            </CardContent>
          </div>
        )}

        {/* ── Step 5: Finish ───────────────────────────────────────────────── */}
        {currentStep === 5 && (
          <div className={CARD_BODY_CLASS}>
            <CardHeader className="text-center space-y-3 pb-2 pt-8">
              <div className="mx-auto w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-accent" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl">You&apos;re All Set!</CardTitle>
                <CardDescription className="text-base">
                  Welcome, {name || "friend"}! Your Pulse dashboard is ready.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center py-4 space-y-4">
              {/* Summary card */}
              <div className="p-4 rounded-xl bg-secondary/50 space-y-2.5">
                <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                  Your setup
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">{name || "User"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate">{email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">
                      {currencies.find((c) => c.value === selectedCurrency)
                        ?.label ?? selectedCurrency}
                      {monthlyIncome &&
                        ` · Income ${currencySymbol}${Number(monthlyIncome).toLocaleString()}/mo`}
                    </span>
                  </div>
                  {selectedBudgetCats.length > 0 && (
                    <div className="flex items-center gap-3">
                      <Wallet className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm">
                        {selectedBudgetCats.length} budget categor
                        {selectedBudgetCats.length > 1 ? "ies" : "y"}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Target className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">
                      {selectedGoals.length > 0
                        ? `${selectedGoals.length} focus area${selectedGoals.length > 1 ? "s" : ""}`
                        : "No goals selected yet"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Goal chips */}
              {selectedGoals.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedGoals.map((goalId) => {
                    const goal = goalPresets.find((g) => g.id === goalId);
                    if (!goal) return null;
                    return (
                      <div
                        key={goalId}
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5",
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
            </CardContent>
          </div>
        )}

        {/* Navigation — always outside the fixed-height body */}
        <CardContent className="pt-0 pb-6">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleBack}
                className="flex-1 h-12 text-base"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <Button
              type="button"
              size="lg"
              onClick={handleNext}
              className={cn(
                "h-12 text-base",
                currentStep === 1 ? "w-full" : "flex-1",
              )}
            >
              {currentStep === steps.length ? (
                <>
                  Go to Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : currentStep === 4 && selectedGoals.length === 0 ? (
                "Skip"
              ) : currentStep === 3 ? (
                "Continue"
              ) : (
                <>
                  {currentStep === 1 ? "Get Started" : "Continue"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
