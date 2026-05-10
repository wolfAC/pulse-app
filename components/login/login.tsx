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
import { cn } from "@/lib/utils";
import { RootState } from "@/store/index";
import { login } from "@/store/slices/auth";
import { ChevronDown, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function Login() {
  const router = useRouter();
  const dispatch = useDispatch();

  const users = useSelector((state: RootState) => state.auth.users);
  const registeredEmails = Object.keys(users);

  const [email, setEmail] = useState(registeredEmails[0] ?? "");
  const [pin, setPin] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    pin?: string;
  }>({});

  const handlePinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setPin(numericValue);
    if (errors.pin) setErrors((prev) => ({ ...prev, pin: undefined }));
  };

  const handleLogin = () => {
    const normalizedEmail = email.trim().toLowerCase();
    const newErrors: { email?: string; pin?: string } = {};

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const user = users[normalizedEmail];

    if (!user) {
      setErrors({ email: "No account found for this email" });
      return;
    }

    if (pin !== user.pin) {
      setErrors({ pin: "Incorrect PIN" });
      setPin("");
      return;
    }

    dispatch(login({ email: normalizedEmail }));
    router.replace("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      {/* App brand */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Zap className="size-5" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-semibold text-base">Pulse</span>
          <span className="text-xs text-muted-foreground">Dashboard</span>
        </div>
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 pb-2 text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription className="text-base">
            Enter your PIN to unlock your dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          {/* Account selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Account</label>
            {registeredEmails.length > 1 ? (
              <div className="relative">
                <select
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setPin("");
                    setErrors({});
                  }}
                  className="w-full h-12 rounded-md border border-input bg-background px-3 pr-8 text-base appearance-none focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {registeredEmails.map((e) => (
                    <option key={e} value={e}>
                      {users[e].name} ({e})
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-5 w-5 text-muted-foreground" />
              </div>
            ) : (
              <Input
                type="email"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setPin("");
                  setErrors({});
                }}
                className="h-12 text-base"
              />
            )}
            {email && users[email.trim().toLowerCase()] && (
              <p className="text-xs text-muted-foreground">
                Signed in as{" "}
                <span className="font-medium text-foreground">
                  {users[email.trim().toLowerCase()].name}
                </span>
              </p>
            )}
          </div>

          {/* PIN display */}
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

          <Button
            size="lg"
            className="h-14 w-full text-base"
            onClick={handleLogin}
            disabled={pin.length < 6}
          >
            Unlock Dashboard
          </Button>

          {/* Register new account link */}
          <p className="text-center text-sm text-muted-foreground">
            Different account?{" "}
            <button
              type="button"
              onClick={() => router.push("/onboarding")}
              className="text-primary hover:underline font-medium"
            >
              Create one
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
