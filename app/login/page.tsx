"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { setAuthenticated } from "@/store/slices/app";
import { ArrowLeft, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handlePinChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 6);

    setPin(numericValue);

    if (error) {
      setError("");
    }
  };

  const handleLogin = () => {
    const savedPin = localStorage.getItem("user_pin");
    console.log(pin, savedPin);
    if (pin !== savedPin) {
      setError("Invalid PIN");
      return;
    }

    sessionStorage.setItem("authenticated", "true");

    dispatch(setAuthenticated(true));

    router.replace("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-4 pb-2 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <User className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>

            <CardDescription className="text-base">
              Enter your secure PIN to continue.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">6-Digit PIN</label>

            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <div
                  key={index}
                  className={cn(
                    "flex h-14 flex-1 items-center justify-center rounded-lg border-2 text-lg font-bold",
                    pin.length > index
                      ? "border-primary bg-primary/5"
                      : "border-border bg-secondary/30",
                    error && "border-destructive",
                  )}
                >
                  {pin[index] ? "•" : ""}
                </div>
              ))}
            </div>

            {error && (
              <p className="text-center text-sm text-destructive">{error}</p>
            )}

            <div className="grid grid-cols-3 gap-2 pt-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "del"].map((num, i) => (
                <Button
                  key={i}
                  type="button"
                  variant="secondary"
                  className={cn(
                    "h-14 text-xl font-medium",
                    num === null && "invisible",
                  )}
                  disabled={num === null}
                  onClick={() => {
                    if (num === "del") {
                      handlePinChange(pin.slice(0, -1));
                    } else if (num !== null && pin.length < 6) {
                      handlePinChange(pin + num);
                    }
                  }}
                >
                  {num === "del" ? <ArrowLeft className="h-5 w-5" /> : num}
                </Button>
              ))}
            </div>
          </div>

          <Button
            size="lg"
            className="h-14 w-full text-base"
            onClick={handleLogin}
          >
            Unlock Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
