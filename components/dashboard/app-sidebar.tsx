"use client";

import {
  primaryNavItems,
  secondaryNavItems,
} from "@/components/navigation/nav-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { RootState } from "@/store";
import { logout } from "@/store/slices/auth";
import { LogOut, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export function AppSidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const router = useRouter();

  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);

  const currentEmail = useSelector(
    (state: RootState) => state.auth.currentEmail,
  );

  const user = useSelector((state: RootState) =>
    currentEmail ? state.auth.users[currentEmail] : null,
  );

  // Initials from name for avatar fallback
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const handleSignOut = () => {
    dispatch(logout());
    router.replace("/login");
  };

  return (
    <>
      <Sidebar collapsible="icon">
        {/* Header */}
        <SidebarHeader className="border-b border-sidebar-border pb-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="gap-3">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Zap className="size-4" />
                </div>

                {/* Hide when collapsed */}
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                  <span className="font-semibold">Pulse</span>
                  <span className="text-xs text-muted-foreground">
                    Dashboard
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Content */}
        <SidebarContent>
          {/* Main */}
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {primaryNavItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          {/* Support */}
          <SidebarGroup>
            <SidebarGroupLabel>Support</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {secondaryNavItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href);

                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.label}
                      >
                        <Link href={item.href}>
                          <item.icon className="size-4" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <SidebarFooter className="border-t border-sidebar-border pt-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="gap-3">
                <Avatar className="size-8">
                  <AvatarImage
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                    alt="User"
                  />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                {/* Hide when collapsed */}
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                  <span className="font-medium text-sm truncate">
                    {user?.name ?? "—"}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {user?.email ?? "—"}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Sign Out"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => setSignOutDialogOpen(true)}
              >
                <LogOut className="size-4" />
                <span>Sign Out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Sign Out Confirmation Dialog — rendered outside Sidebar to avoid z-index issues */}
      <Dialog open={signOutDialogOpen} onOpenChange={setSignOutDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign out?</DialogTitle>
            <DialogDescription>
              You will be returned to the login screen. Any unsaved changes will
              be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSignOutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="default" onClick={handleSignOut}>
              Sign Out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
