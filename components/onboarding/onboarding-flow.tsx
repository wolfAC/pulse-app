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
  Lock,
  ShieldCheck,
  Smartphone,
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
  example: string;
  icon: React.ReactNode;
  color: string;
}

const goalPresets: GoalPreset[] = [
  {
    id: "productivity",
    title: "Be More Productive",
    description: "Manage tasks and stay focused",
    example: 'e.g. "Did I finish my top 3 tasks today?"',
    icon: <Zap className="h-5 w-5" />,
    color: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  },
  {
    id: "health",
    title: "Improve My Health",
    description: "Log water, sleep, and calories",
    example: 'e.g. "Did I drink 2L of water today?"',
    icon: <Heart className="h-5 w-5" />,
    color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  },
  {
    id: "performance",
    title: "Track My Work",
    description: "Review daily and weekly wins",
    example: 'e.g. "How productive was this week?"',
    icon: <TrendingUp className="h-5 w-5" />,
    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  {
    id: "learning",
    title: "Learn Something New",
    description: "Set milestones for new skills",
    example: 'e.g. "Practice keyboard for 20 mins daily"',
    icon: <BookOpen className="h-5 w-5" />,
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  {
    id: "fitness",
    title: "Get Fit",
    description: "Log workouts and stay active",
    example: 'e.g. "Did I exercise today?"',
    icon: <Dumbbell className="h-5 w-5" />,
    color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  },
  {
    id: "sleep",
    title: "Sleep Better",
    description: "Track sleep hours and quality",
    example: 'e.g. "Did I sleep 7+ hours last night?"',
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

const CARD_BODY_CLASS = "h-[560px] sm:h-[600px] lg:h-[640px] flex flex-col";

// Plain-language feature descriptions for the welcome screen
const features = [
  {
    icon: <Wallet className="h-5 w-5 text-emerald-500" />,
    title: "Track your spending",
    description: "Log expenses and see where your money goes each month",
  },
  {
    icon: <Target className="h-5 w-5 text-primary" />,
    title: "Hit your goals",
    description: "Set targets with due dates and tick off milestones as you go",
  },
  {
    icon: <Zap className="h-5 w-5 text-amber-500" />,
    title: "Build daily habits",
    description:
      "Track streaks for things like reading, exercise, or hydration",
  },
  {
    icon: <Heart className="h-5 w-5 text-rose-500" />,
    title: "Monitor your health",
    description: "Log sleep, steps, water, and workouts in one place",
  },
  {
    icon: <BarChart3 className="h-5 w-5 text-violet-500" />,
    title: "Review your performance",
    description: "Rate your day or week and spot patterns over time",
  },
  {
    icon: <PiggyBank className="h-5 w-5 text-amber-500" />,
    title: "Save toward dreams",
    description: "Set savings targets and watch your progress grow",
  },
];

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

  return (
    <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4">
      {/* Progress stepper */}
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl mb-8">
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

      <Card className="w-full max-w-md sm:max-w-lg lg:max-w-2xl flex flex-col">
        {/* ── Step 1: Welcome ─────────────────────────────────────────────── */}
        {currentStep === 1 && (
          <div className={CARD_BODY_CLASS}>
            <CardHeader className="text-center space-y-2 pb-2 pt-6">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl sm:text-3xl">
                Welcome to Pulse
              </CardTitle>
              <CardDescription className="text-sm">
                Your personal dashboard for finance, health, and goals.
              </CardDescription>

              {/* Privacy notice — prominent but not alarming */}
              <div className="flex items-center justify-center gap-1.5 mt-1 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 w-fit mx-auto">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                  Works offline · No account needed · Your data stays with you
                </span>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-y-auto pt-3 pb-2">
              <p className="text-xs text-muted-foreground text-center mb-3">
                Here&apos;s what you can do with Pulse:
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {features.map(({ icon, title, description }) => (
                  <div
                    key={title}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-secondary/40"
                  >
                    <div className="mt-0.5 shrink-0">{icon}</div>
                    <div>
                      <p className="text-sm font-medium leading-tight">
                        {title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                        {description}
                      </p>
                    </div>
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
                <CardTitle className="text-xl">
                  Set Up Your Local Profile
                </CardTitle>
                <CardDescription>
                  This stays on your device — no sign-up, no server, no
                  verification email.
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col justify-center space-y-4 py-4">
              {/* Name */}
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium">
                  Your Name
                </label>
                <Input
                  id="name"
                  data-cy="onboarding-name-input"
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
                  <p className="text-xs text-destructive" data-cy="onboarding-name-error">{errors.name}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Shown on your dashboard to personalise the experience.
                </p>
              </div
>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </label>
                <Input
                  id="email"
                  data-cy="onboarding-email-input"
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
                  <p className="text-xs text-destructive" data-cy="onboarding-email-error">{errors.email}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Used as a local profile ID — not an account. We never send
                  emails or connect to the internet.
                </p>
              </div
>

              {/* PIN */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">6-Digit PIN</label>
                <InputOTP maxLength={6} value={pin} onChange={handlePinChange} data-cy="onboarding-pin-input">
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
                  <p className="text-xs text-destructive" data-cy="onboarding-pin-error">{errors.pin}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Acts as a screen lock when you step away. Stored only on
                    this device.
                  </p>
                )}
              </div
>
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
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Currency</label>
                <Select
                  value={selectedCurrency}
                  onValueChange={setSelectedCurrency}
                  data-cy="onboarding-currency-select"
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
              </div
>

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
                    data-cy="onboarding-income-input"
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="h-11 pl-8"
                  />
                </div>
              </div>

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
                    data-cy="onboarding-savings-input"
                    type="number"
                    inputMode="numeric"
                    placeholder="0"
                    value={monthlySavingsGoal}
                    onChange={(e) => setMonthlySavingsGoal(e.target.value)}
                    className="h-11 pl-8"
                  />
                </div>
              </div>

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
                        data-cy={`onboarding-budget-cat-${cat.id}`}
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
                <CardTitle className="text-xl">
                  What do you want to improve?
                </CardTitle>
                <CardDescription>
                  Pick the areas that matter most to you. You can always change
                  these later.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-4 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 flex-1">
                {goalPresets.map((goal) => {
                  const isSelected = selectedGoals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => toggleGoal(goal.id)}
                      data-cy={`onboarding-goal-${goal.id}`}
                      className={cn(
                        "relative flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200",
                        isSelected
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-border hover:border-primary/50 hover:bg-secondary/50",
                      )}
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 mt-0.5",
                          goal.color,
                        )}
                      >
                        {goal.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm leading-tight">
                          {goal.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {goal.description}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5 italic">
                          {goal.example}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-center text-muted-foreground pt-3">
                {selectedGoals.length === 0
                  ? "Select at least one, or skip to continue"
                  : `${selectedGoals.length} area${selectedGoals.length > 1 ? "s" : ""} selected`}
              </p>
            </CardContent>
          </div>
        )}

        {/* ── Step 5: Finish ───────────────────────────────────────────────── */}
        {currentStep === 5 && (
          <div className={CARD_BODY_CLASS}>
            <CardHeader className="text-center space-y-2 pb-2 pt-6 shrink-0">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-xl">You're All Set!</CardTitle>
              <CardDescription>
                Welcome, {name || "friend"}! Your Pulse dashboard is ready.
              </CardDescription>
            </CardHeader>

            {/* ↓ overflow-y-auto here — same pattern as steps 3 & 4 */}
            <CardContent className="flex-1 overflow-y-auto py-3 flex flex-col gap-3">
              {/* Summary */}
              <div className="p-3 rounded-xl bg-secondary/50 space-y-2">
                <h4 className="font-medium text-xs text-muted-foreground uppercase tracking-wider">
                  Your setup
                </h4>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm">{name || "User"}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate">{email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-sm">
                      {currencies.find((c) => c.value === selectedCurrency)
                        ?.label ?? selectedCurrency}
                      {monthlyIncome &&
                        ` · ${currencySymbol}${Number(monthlyIncome).toLocaleString()}/mo`}
                    </span>
                  </div>
                  {selectedBudgetCats.length > 0 && (
                    <div className="flex items-center gap-2.5">
                      <Wallet className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-sm">
                        {selectedBudgetCats.length} budget categor
                        {selectedBudgetCats.length > 1 ? "ies" : "y"}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5">
                    <Target className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
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
                          "px-2 py-0.5 rounded-full text-xs font-medium border flex items-center gap-1",
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

              {/* Local storage notice */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/8">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Private by design — your data never leaves this device
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Pulse is built as a desktop app (Electron) and works offline
                    as a PWA. We store everything locally so it works without
                    internet, loads instantly, and you never need an account or
                    subscription. There's no server — nobody can access your
                    data but you.
                  </p>
                </div>
              </div>
            </CardContent>
          </div>
        )}

        {/* Navigation */}
        <CardContent className="pt-0 pb-6">
          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleBack}
                data-cy="onboarding-back-button"
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
              data-cy="onboarding-next-button"
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
