import * as React from "react";

import { cn } from "@workspace/ui/lib/utils";

import fotnoLogo from "../assets/fotno-logo.png";
import fotnoLogoWhite from "../assets/fotno-logo-white.png";

export type LogoSize = "xs" | "sm" | "md" | "lg";

export type LogoProps = Omit<
  React.ComponentPropsWithoutRef<"span">,
  "children"
> & {
  invert?: boolean;
  size?: LogoSize;
};

const sizeMap: Record<LogoSize, { wrap: string; img: string }> = {
  xs: { wrap: "h-6 w-16", img: "h-24 w-24" },
  sm: { wrap: "h-8 w-20", img: "h-32 w-32" },
  md: { wrap: "h-10 w-24", img: "h-40 w-40" },
  lg: { wrap: "h-14 w-36", img: "h-56 w-56" },
};

export const Logo = React.forwardRef<HTMLSpanElement, LogoProps>(function Logo(
  { className, invert = false, size = "md", ...props },
  ref,
) {
  const { wrap, img } = sizeMap[size];
  const blackClasses = invert ? "hidden dark:block" : "block dark:hidden";
  const whiteClasses = invert ? "block dark:hidden" : "hidden dark:block";

  return (
    <span
      ref={ref}
      aria-label="Fotno"
      role="img"
      className={cn(
        "relative inline-block shrink-0 overflow-hidden",
        wrap,
        className,
      )}
      {...props}
    >
      <img
        src={fotnoLogo.src}
        alt=""
        decoding="async"
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 object-contain select-none",
          img,
          blackClasses,
        )}
      />
      <img
        src={fotnoLogoWhite.src}
        alt=""
        decoding="async"
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 object-contain select-none",
          img,
          whiteClasses,
        )}
      />
    </span>
  );
});

Logo.displayName = "Logo";

export default Logo;
