"use client";

import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { PhoneInputComponent } from "@workspace/ui/components/phone";
import { Album } from "lucide-react";

const getViewerIdKey = (shareToken: string) =>
  `fotno_gallery_viewer_${shareToken}`;
const getViewerNameKey = (shareToken: string) =>
  `fotno_gallery_viewer_name_${shareToken}`;

interface IdentityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareToken: string;
  onIdentified: (viewerId: string, viewerName: string) => void;
}

export function IdentityDialog({
  open,
  onOpenChange,
  shareToken,
  onIdentified,
}: IdentityDialogProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [phoneValue, setPhoneValue] = useState("");
  const [nameValue, setNameValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (step === 1) {
      if (!phoneValue || phoneValue.length < 8) return;

      setSubmitting(true);
      try {
        // Check if this phone already has identity (from favorites)
        const res = await fetch(
          `/api/gallery/${encodeURIComponent(shareToken)}/favorites?viewerId=${encodeURIComponent(phoneValue)}`,
          { cache: "no-store" },
        );
        if (res.ok) {
          const data = await res.json();
          if (data?.viewerName) {
            // Known user — sign in directly
            sessionStorage.setItem(getViewerIdKey(shareToken), phoneValue);
            sessionStorage.setItem(
              getViewerNameKey(shareToken),
              data.viewerName,
            );
            onIdentified(phoneValue, data.viewerName);
            onOpenChange(false);
            return;
          }
        }
      } catch {
        // continue to step 2
      } finally {
        setSubmitting(false);
      }
      setStep(2);
      return;
    }

    // Step 2: save identity with name
    if (!nameValue.trim()) return;
    sessionStorage.setItem(getViewerIdKey(shareToken), phoneValue);
    sessionStorage.setItem(getViewerNameKey(shareToken), nameValue.trim());
    onIdentified(phoneValue, nameValue.trim());
    onOpenChange(false);
  };

  const handleClose = (value: boolean) => {
    if (!value) {
      // Reset state on close
      setStep(1);
      setPhoneValue("");
      setNameValue("");
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Album className="h-4 w-4 text-primary" />
            {step === 1 ? "Create Your Album" : "What\u2019s your name?"}
          </DialogTitle>
          <DialogDescription>
            {step === 1
              ? "Enter your phone number to get started. Use the same number you use for favorites."
              : "We didn\u2019t find an account for this number. Enter your name to continue."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {step === 1 && (
            <PhoneInputComponent
              value={phoneValue}
              onChange={setPhoneValue}
              label="Phone number"
              placeholder="Enter your phone number"
            />
          )}
          {step === 2 && (
            <div className="space-y-1.5">
              <label htmlFor="album-viewer-name" className="text-sm font-medium">
                Name <span className="text-destructive">*</span>
              </label>
              <Input
                id="album-viewer-name"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                placeholder="Your name"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && nameValue.trim()) {
                    void handleSubmit();
                  }
                }}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            disabled={
              submitting ||
              (step === 1
                ? !phoneValue || phoneValue.length < 8
                : !nameValue.trim())
            }
          >
            {submitting ? "Loading..." : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
