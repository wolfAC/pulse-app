"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import emailjs from "@emailjs/browser";
import {
  Bug,
  Lightbulb,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Mail,
  ExternalLink,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";
import { RootState } from "@/store/index";

// ─── EmailJS config ───────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "service_4hmed0c";
const EMAILJS_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "template_l9ummtz";
const EMAILJS_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "vY-VPec8ajHsSlQK8";

// ─── Types ────────────────────────────────────────────────────────────────────
type Category = "feedback" | "bug" | "feature";

interface CategoryMeta {
  id: Category;
  label: string;
  description: string;
  icon: React.ReactNode;
  activeColor: string;
  badgeClass: string;
  ring: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const CATEGORIES: CategoryMeta[] = [
  {
    id: "feedback",
    label: "General Feedback",
    description: "Share your thoughts",
    icon: <MessageSquare className="h-4 w-4" />,
    activeColor: "border-blue-500/40 bg-blue-500/10 text-blue-400",
    badgeClass: "bg-blue-500/15 text-blue-400 border-blue-500/20",
    ring: "ring-blue-500/30",
  },
  {
    id: "bug",
    label: "Bug Report",
    description: "Something isn't working",
    icon: <Bug className="h-4 w-4" />,
    activeColor: "border-red-500/40 bg-red-500/10 text-red-400",
    badgeClass: "bg-red-500/15 text-red-400 border-red-500/20",
    ring: "ring-red-500/30",
  },
  {
    id: "feature",
    label: "Feature Request",
    description: "Suggest something new",
    icon: <Lightbulb className="h-4 w-4" />,
    activeColor: "border-amber-500/40 bg-amber-500/10 text-amber-400",
    badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/20",
    ring: "ring-amber-500/30",
  },
];

const PLACEHOLDERS: Record<Category, string> = {
  feedback:
    "Tell us what you think about Pulse. What do you love? What could be better?",
  bug: "Describe the issue — what happened, what you expected, and steps to reproduce it.",
  feature:
    "What would you like to see in Pulse? Describe the feature and how it would help you.",
};

const SUBJECTS: Record<Category, string> = {
  feedback: "Feedback",
  bug: "Bug Report",
  feature: "Feature Request",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function SupportPage() {
  const currentEmail = useSelector((s: RootState) => s.auth.currentEmail);
  const users = useSelector((s: RootState) => s.auth.users);
  const userName = currentEmail ? (users[currentEmail]?.name ?? "") : "";

  const [category, setCategory] = useState<Category>("feedback");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [replyTo, setReplyTo] = useState(currentEmail ?? "");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const selectedMeta = CATEGORIES.find((c) => c.id === category)!;

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: userName || replyTo || "Pulse User",
          email: replyTo || "no-reply@pulse.app",
          category: SUBJECTS[category],
          subject:
            subject ||
            `${SUBJECTS[category]} from ${userName || replyTo || "Pulse User"}`,
          message,
          time: new Date().toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        },
        EMAILJS_PUBLIC_KEY,
      );
      setStatus("success");
    } catch (e) {
      console.error(e);
      setErrorMsg("Failed to send. Please try again or email us directly.");
      setStatus("error");
    }
  };

  const handleReset = () => {
    setStatus("idle");
    setMessage("");
    setSubject("");
    setErrorMsg("");
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <PageHeader
        title="Support"
        description="Get help, report bugs, or share feedback"
      />

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 max-w-2xl pt-4">
          {/* ── Success state ─────────────────────────────────────────────── */}
          {status === "success" ? (
            <Card>
              <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-green-500">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold">Message sent!</p>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Thanks for reaching out. We&apos;ll get back to you
                    {replyTo ? ` at ${replyTo}` : ""} as soon as possible.
                  </p>
                </div>
                <div className="flex gap-3 pt-1">
                  <Button variant="outline" onClick={handleReset}>
                    Send another
                  </Button>
                  <Button onClick={() => window.history.back()}>Go back</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* ── Category ──────────────────────────────────────────────── */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle>Type</CardTitle>
                      <CardDescription>
                        What kind of message is this?
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={cn(
                          "flex flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition-all",
                          category === cat.id
                            ? cn(
                                cat.activeColor,
                                "ring-2 ring-offset-2 ring-offset-background",
                                cat.ring,
                              )
                            : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40",
                        )}
                      >
                        <div
                          className={cn(
                            "rounded-lg p-1.5 border",
                            category === cat.id
                              ? cat.activeColor
                              : "border-border bg-muted/30",
                          )}
                        >
                          {cat.icon}
                        </div>
                        <div>
                          <p className="text-xs font-semibold leading-tight">
                            {cat.label}
                          </p>
                          <p className="text-[10px] text-muted-foreground leading-snug mt-0.5 hidden sm:block">
                            {cat.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* ── Message form ──────────────────────────────────────────── */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <CardTitle>Message</CardTitle>
                        <Badge
                          variant="outline"
                          className={cn("text-[11px]", selectedMeta.badgeClass)}
                        >
                          {selectedMeta.label}
                        </Badge>
                      </div>
                      <CardDescription>
                        Fill in the details below
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Reply-to */}
                  <div className="space-y-2">
                    <Label htmlFor="replyTo">Your email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="replyTo"
                        type="email"
                        inputMode="email"
                        placeholder="you@example.com"
                        value={replyTo}
                        onChange={(e) => setReplyTo(e.target.value)}
                        className="h-11 pl-9"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Subject */}
                  <div className="space-y-2">
                    <Label htmlFor="subject">
                      Subject{" "}
                      <span className="text-muted-foreground font-normal">
                        (optional)
                      </span>
                    </Label>
                    <Input
                      id="subject"
                      placeholder={`${SUBJECTS[category]} — short summary`}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder={PLACEHOLDERS[category]}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={6}
                      className="resize-none text-sm leading-relaxed"
                    />
                    <p className="text-[11px] text-muted-foreground text-right">
                      {message.length} characters
                    </p>
                  </div>

                  {/* Error */}
                  {status === "error" && (
                    <div className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit */}
                  <Button
                    className="w-full h-11"
                    onClick={handleSubmit}
                    disabled={!message.trim() || status === "sending"}
                  >
                    {status === "sending" ? (
                      <span className="flex items-center gap-2">
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Sending…
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Send {selectedMeta.label}
                      </span>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* ── Direct contact ────────────────────────────────────────── */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <CardTitle>Direct Contact</CardTitle>
                      <CardDescription>
                        Prefer to email us directly?
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <a
                    href="mailto:support.pulse.app@gmail.com"
                    className="flex items-center gap-2 text-sm text-primary underline underline-offset-2"
                  >
                    <Mail className="h-4 w-4" />
                    support.pulse.app@gmail.com
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-xs text-muted-foreground mt-2">
                    We typically respond within 24–48 hours.
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
