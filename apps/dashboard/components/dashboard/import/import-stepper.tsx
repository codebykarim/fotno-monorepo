import { Check } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface Step {
  label: string;
}

export function ImportStepper({
  steps,
  currentStep,
}: {
  steps: Step[];
  currentStep: number;
}) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={step.label} className="flex items-center gap-2">
            {index > 0 && (
              <div
                className={cn(
                  "h-px w-8 sm:w-12",
                  isCompleted ? "bg-primary" : "bg-border",
                )}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  isCompleted &&
                    "bg-primary text-primary-foreground",
                  isActive &&
                    "border-2 border-primary bg-primary/10 text-primary",
                  !isCompleted &&
                    !isActive &&
                    "border-2 border-muted-foreground/25 text-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={cn(
                  "hidden text-sm font-medium sm:inline",
                  isActive
                    ? "text-foreground"
                    : isCompleted
                      ? "text-primary"
                      : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
