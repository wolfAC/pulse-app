"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { currencies } from "@/lib/types/finance";
import { RootState, store } from "@/store/index";
import { AppState } from "@/store/rootReducer";
import { setCurrency, setTheme, type Theme } from "@/store/slices/app";
import { logout, updatePin, updateProfile } from "@/store/slices/auth";
import {
  Bell,
  Download,
  LogOut,
  Palette,
  Shield,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
  className,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function SettingsRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <Label>{label}</Label>
        {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
      </div>
      {children}
    </div>
  );
}

export function SettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  // ── redux state ──────────────────────────────────────────────────────────
  const reduxTheme = useSelector((state: RootState) => state.app.theme);
  const currency = useSelector((state: RootState) => state.app.currency);
  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );
  const user = useSelector((state: RootState) =>
    currentEmail ? state.auth.users[currentEmail] : null,
  );

  const { setTheme: setNextTheme } = useTheme();

  // ── local ui state ───────────────────────────────────────────────────────
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(currentEmail ?? "");
  const [newPin, setNewPin] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [pinError, setPinError] = useState("");
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── helpers ───────────────────────────────────────────────────────────────
  const flash = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const getInitials = (n: string) =>
    n
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  // ── handlers ──────────────────────────────────────────────────────────────
  const handleThemeChange = (value: Theme) => {
    dispatch(setTheme(value));
    setNextTheme(value);
  };

  const handleSaveProfile = () => {
    if (!currentEmail) return;
    dispatch(updateProfile({ email: currentEmail, name }));
    flash();
  };

  const handleUpdatePin = () => {
    if (!currentEmail) return;
    if (newPin.length < 4) {
      setPinError("PIN must be at least 4 digits");
      return;
    }
    dispatch(updatePin({ email: currentEmail, pin: newPin }));
    setNewPin("");
    setPinError("");
    flash();
  };

  const handleExport = () => {
    const state = store.getState();
    const blob = new Blob([JSON.stringify(state, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), {
      href: url,
      download: `backup-${new Date().toISOString().split("T")[0]}.json`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as AppState;
        dispatch({ type: "IMPORT_STATE", payload: parsed });
        setImportSuccess(true);
        setImportError("");
        setTimeout(() => setImportSuccess(false), 3000);
      } catch {
        setImportError("Invalid backup file format");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDeleteAccount = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
      />

      {isSaved && (
        <Alert className="border-success/50 bg-success/10">
          <AlertTitle className="text-success">Saved</AlertTitle>
          <AlertDescription>
            Your changes have been saved successfully.
          </AlertDescription>
        </Alert>
      )}

      {/* ── Profile ──────────────────────────────────────────────────────── */}
      <SettingsSection
        icon={User}
        title="Profile"
        description="Update your personal information"
      >
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
              {name ? getInitials(name) : "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{name || "User"}</p>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button onClick={handleSaveProfile} disabled={!currentEmail}>
            Save Changes
          </Button>
        </div>
      </SettingsSection>

      {/* ── Appearance ───────────────────────────────────────────────────── */}
      <SettingsSection
        icon={Palette}
        title="Appearance"
        description="Customize the look and feel"
      >
        <SettingsRow label="Theme" hint="Select your preferred theme">
          <Select
            value={reduxTheme}
            onValueChange={(v) => handleThemeChange(v as Theme)}
          >
            <SelectTrigger className="w-37.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </SettingsRow>

        <Separator />

        <SettingsRow label="Currency" hint="Default currency for display">
          <Select
            value={currency}
            onValueChange={(v) => dispatch(setCurrency(v))}
          >
            <SelectTrigger className="w-45">
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
        </SettingsRow>
      </SettingsSection>

      {/* ── Notifications ────────────────────────────────────────────────── */}
      <SettingsSection
        icon={Bell}
        title="Notifications"
        description="Configure notification preferences"
      >
        <SettingsRow
          label="Budget Alerts"
          hint="Get notified when approaching budget limits"
        >
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </SettingsRow>

        <Separator />

        <SettingsRow label="Remember Me" hint="Stay logged in on this device">
          <Switch checked={rememberMe} onCheckedChange={setRememberMe} />
        </SettingsRow>
      </SettingsSection>

      {/* ── Security ─────────────────────────────────────────────────────── */}
      <SettingsSection
        icon={Shield}
        title="Security"
        description="Manage your PIN and account security"
      >
        <div className="space-y-2">
          <Label htmlFor="newPin">Update PIN</Label>
          <div className="flex gap-2">
            <Input
              id="newPin"
              type="password"
              placeholder="Enter new 4-6 digit PIN"
              value={newPin}
              onChange={(e) => {
                setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6));
                setPinError("");
              }}
              maxLength={6}
            />
            <Button
              onClick={handleUpdatePin}
              disabled={!currentEmail || newPin.length < 4}
            >
              Update
            </Button>
          </div>
          {pinError ? (
            <p className="text-xs text-destructive">{pinError}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              PIN must be 4-6 digits
            </p>
          )}
        </div>
      </SettingsSection>

      {/* ── Data Management ──────────────────────────────────────────────── */}
      <SettingsSection
        icon={Download}
        title="Data Management"
        description="Export or import your financial data"
      >
        {importSuccess && (
          <Alert className="border-success/50 bg-success/10">
            <AlertDescription className="text-success">
              Data imported successfully!
            </AlertDescription>
          </Alert>
        )}
        {importError && (
          <Alert variant="destructive">
            <AlertDescription>{importError}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleExport}
            className="flex-1 gap-2"
          >
            <Download className="h-4 w-4" /> Export Data
          </Button>
          <Button
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-4 w-4" /> Import Data
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Export creates a JSON backup of all your data. Import will merge with
          existing data.
        </p>
      </SettingsSection>

      {/* ── Danger Zone ──────────────────────────────────────────────────── */}
      <SettingsSection
        icon={Trash2}
        title="Danger Zone"
        description="Irreversible actions"
        className="border-destructive/50"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Sign Out Dialog */}
          <Dialog open={signOutDialogOpen} onOpenChange={setSignOutDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex-1 gap-2">
                <LogOut className="h-4 w-4" /> Sign Out
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sign out?</DialogTitle>
                <DialogDescription>
                  You will be returned to the login screen. Any unsaved changes
                  will be lost.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSignOutDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="default" onClick={handleLogout}>
                  Sign Out
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete All Data Dialog */}
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="flex-1 gap-2">
                <Trash2 className="h-4 w-4" /> Delete All Data
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This will permanently delete all your financial data —
                  transactions, budgets, savings goals, and settings. This
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Yes, delete everything
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SettingsSection>
    </div>
  );
}
