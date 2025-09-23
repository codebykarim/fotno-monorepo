import { cn } from "../lib/utils";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <div
      className={cn(
        "relative w-40 h-10 left-1/2 -translate-x-1/2 mb-8",
        className
      )}
    >
      <img
        src="/logo.png"
        alt="FOTNO Logo"
        className="w-full h-full object-cover"
      />
    </div>
  );
}

export default Logo;
