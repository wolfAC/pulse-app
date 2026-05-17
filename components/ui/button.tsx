import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

// ─── Ripple ───────────────────────────────────────────────────────────────────

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

function useRipple() {
  const [ripples, setRipples] = React.useState<Ripple[]>([]);

  const addRipple = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x, y, size }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  };

  return { ripples, addRipple };
}

// ─── Ripple color per variant ─────────────────────────────────────────────────

const rippleColor: Record<string, string> = {
  default: "bg-white/25",
  destructive: "bg-white/20",
  outline: "bg-foreground/10",
  secondary: "bg-foreground/10",
  ghost: "bg-foreground/10",
  link: "bg-transparent",
};

// ─── Component ────────────────────────────────────────────────────────────────

function Button({
  className,
  variant,
  size,
  asChild = false,
  onMouseDown,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  const { ripples, addRipple } = useRipple();
  const color = rippleColor[variant ?? "default"] ?? "bg-white/20";

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    addRipple(e);
    onMouseDown?.(e);
  };

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onMouseDown={handleMouseDown}
      {...props}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className={cn(
            "pointer-events-none absolute rounded-full animate-ripple",
            color,
          )}
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
          }}
        />
      ))}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
