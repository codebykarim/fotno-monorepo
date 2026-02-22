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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#f2f6ff_0,#eef2ff_35%,#f8fafc_100%)] px-6 py-10">
      <div className="mx-auto flex min-h-[85vh] max-w-xl items-center justify-center">
        <div className="w-full rounded-3xl border border-black/10 bg-white/85 p-8 shadow-2xl shadow-slate-900/10 backdrop-blur">
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <p className="text-xs font-semibold tracking-[0.2em] text-slate-500 uppercase">
            Private Gallery
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-3 text-sm text-slate-600">
            Enter the password shared by your photographer.
          </p>

          <form className="mt-8 space-y-3" onSubmit={handleSubmit}>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Gallery password"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-2xl bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Unlocking..." : "Unlock Gallery"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
