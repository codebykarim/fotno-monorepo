import Link from "next/link";

export function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-background hover:text-primary"
    >
      {children}
    </Link>
  );
}
