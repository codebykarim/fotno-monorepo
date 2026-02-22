"use client";

import { FormEvent, useState } from "react";
import { LockKeyhole } from "lucide-react";

type PasswordGateProps = {
  title: string;
  onUnlock: (password: string) => Promise<void>;
  isSubmitting: boolean;
};

export default function PasswordGate({
  title,
  onUnlock,
  isSubmitting,
}: PasswordGateProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onUnlock(password);
  };

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto flex min-h-[85vh] max-w-xl items-center justify-center">
        <div className="gallery-panel w-full rounded-3xl p-8">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Private Gallery
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Enter the password shared by your photographer.
          </p>

          <form className="mt-8 space-y-3" onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Gallery password"
              className="h-12 w-full rounded-2xl border border-border bg-background/88 px-4 text-sm text-foreground outline-none ring-0 transition focus:border-primary"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Unlocking..." : "Unlock Gallery"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
