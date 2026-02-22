import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">Gallery not found</h1>
        <p className="mt-3 text-sm text-slate-600">
          Check the gallery link and try again.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Back to gallery home
        </Link>
      </div>
    </main>
  );
}
