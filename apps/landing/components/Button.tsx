import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";

const baseStyles = {
  solid:
    "group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 transition-colors",
  outline:
    "group inline-flex ring-1 items-center justify-center rounded-full py-2 px-4 text-sm focus:outline-hidden transition-colors",
};

const variantStyles = {
  solid: {
    main: "bg-foreground text-background hover:bg-foreground/85 focus-visible:outline-primary",
    secondary:
      "bg-primary text-primary-foreground hover:bg-primary/85 focus-visible:outline-primary",
    white:
      "bg-card text-foreground hover:bg-card/90 focus-visible:outline-card",
  },
  outline: {
    main: "ring-foreground/30 text-foreground hover:text-primary hover:ring-primary/50 active:bg-primary/5",
    slate:
      "ring-border text-muted-foreground hover:text-foreground hover:ring-foreground/30 active:bg-accent",
    white:
      "ring-white/30 text-white hover:ring-white/60 active:ring-white/40 active:text-white/80 focus-visible:outline-white",
  },
};

type ButtonProps = (
  | {
      variant?: "solid";
      color?: keyof typeof variantStyles.solid;
    }
  | {
      variant: "outline";
      color?: keyof typeof variantStyles.outline;
    }
) &
  (
    | Omit<React.ComponentPropsWithoutRef<typeof Link>, "color">
    | (Omit<React.ComponentPropsWithoutRef<"button">, "color"> & {
        href?: undefined;
      })
  );

export function Button({ className, ...props }: ButtonProps) {
  props.variant ??= "solid";
  props.color ??= "main";

  className = cn(
    baseStyles[props.variant],
    props.variant === "outline"
      ? variantStyles.outline[props.color]
      : props.variant === "solid"
        ? variantStyles.solid[props.color]
        : undefined,
    className
  );

  return typeof props.href === "undefined" ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  );
}
