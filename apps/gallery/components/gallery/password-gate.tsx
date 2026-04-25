"use client";

import { FormEvent, useEffect, useState } from "react";
import { LockKeyhole } from "lucide-react";
import Image from "next/image";
import Logo from "@workspace/ui/components/logo";

type PasswordGateProps = {
  title: string;
  coverImageSrc?: string | null;
  photographerName?: string;
  onUnlock: (password: string) => Promise<void>;
  isSubmitting: boolean;
};

export default function PasswordGate({
  title,
  coverImageSrc,
  photographerName,
  onUnlock,
  isSubmitting,
}: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [showCoverImage, setShowCoverImage] = useState(Boolean(coverImageSrc));

  useEffect(() => {
    setShowCoverImage(Boolean(coverImageSrc));
  }, [coverImageSrc]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onUnlock(password);
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden px-5 py-6 text-white sm:px-8 sm:py-10"
      style={{ background: "oklch(0.14 0.01 50)" }}
    >
      <div className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-6xl items-stretch overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] shadow-[0_30px_120px_rgba(0,0,0,0.6)] backdrop-blur-sm">
        <section className="relative hidden min-h-[32rem] flex-1 overflow-hidden lg:block">
          {showCoverImage && coverImageSrc ? (
            <Image
              src={coverImageSrc}
              alt={`${title} gallery cover`}
              fill
              className="object-cover"
              onError={() => setShowCoverImage(false)}
              priority
            />
          ) : null}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.16),transparent_40%),linear-gradient(135deg,rgba(10,15,25,0.75),rgba(6,8,14,0.95))]" />
          <div className="absolute inset-x-0 bottom-0 p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/80">
              FOTNO PRIVATE GALLERY
            </p>
            <h2 className="mt-3 max-w-xl text-4xl font-semibold leading-tight tracking-tight text-white">
              Curated storytelling. Delivered in a premium private experience.
            </h2>
            <p className="mt-3 text-sm text-white/75">
              Secure, cinematic viewing for clients and collaborators.
            </p>
          </div>
        </section>

        <section className="flex w-full flex-col justify-between p-6 sm:p-10 lg:max-w-[32rem]">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex items-center justify-center">
              <Logo invert />
            </div>

            <div className="mt-10 rounded-3xl border border-white/15 bg-white/[0.05] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                Private Access
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                {title}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                Enter your password to unlock the full gallery experience.
              </p>
              {photographerName ? (
                <p className="mt-2 text-xs uppercase tracking-[0.12em] text-white/55">
                  by {photographerName}
                </p>
              ) : null}

              <form className="mt-8 space-y-3" onSubmit={handleSubmit}>
                <label htmlFor="gallery-password" className="sr-only">
                  Gallery password
                </label>
                <input
                  id="gallery-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter gallery password"
                  className="h-12 w-full rounded-2xl border border-white/20 bg-black/20 px-4 text-sm text-white placeholder:text-white/45 outline-none ring-0 transition focus:border-primary/80 focus:bg-black/35"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-2xl bg-primary text-sm font-semibold text-primary-foreground shadow-[0_10px_35px_oklch(0.72_0.14_65_/_0.25)] transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Unlocking..." : "Unlock Gallery"}
                </button>
              </form>
            </div>
          </div>

          <p className="mt-6 text-xs text-white/50">
            Protected by Fotno secure gallery access.
          </p>
        </section>
      </div>
    </div>
  );
}
