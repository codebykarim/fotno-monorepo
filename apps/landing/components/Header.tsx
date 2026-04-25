"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Popover,
  PopoverButton,
  PopoverBackdrop,
  PopoverPanel,
} from "@headlessui/react";
import { cn } from "@workspace/ui/lib/utils";

import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { Icons } from "@workspace/ui/components/icons";
import { ThemeToggle } from "@workspace/ui/components/theme-toggle";
import { useSession } from "@workspace/lib/auth/auth-client";
import { Logo } from "@workspace/ui/components/logo";

function MobileNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <PopoverButton
      as={Link}
      href={href}
      className="block w-full rounded-xl p-3 text-base font-medium text-foreground transition-colors hover:bg-accent"
    >
      {children}
    </PopoverButton>
  );
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-foreground"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
    >
      <path
        d="M0 1H14M0 7H14M0 13H14"
        className={cn("origin-center transition", open && "scale-90 opacity-0")}
      />
      <path
        d="M2 2L12 12M12 2L2 12"
        className={cn(
          "origin-center transition",
          !open && "scale-90 opacity-0",
        )}
      />
    </svg>
  );
}

function MobileNavigation({ isUserLoggedIn }: { isUserLoggedIn: boolean }) {
  return (
    <Popover>
      <PopoverButton
        className="relative z-10 flex h-8 w-8 items-center justify-center focus:not-data-focus:outline-hidden"
        aria-label="Toggle Navigation"
      >
        {({ open }) => <MobileNavIcon open={open} />}
      </PopoverButton>
      <PopoverBackdrop
        transition
        className="fixed inset-0 bg-foreground/30 backdrop-blur-sm duration-150 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
      />
      <PopoverPanel
        transition
        className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-background/95 backdrop-blur-xl p-4 text-lg tracking-tight text-foreground ring-1 shadow-xl ring-border/50 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in"
      >
        <MobileNavLink href="#features">Features</MobileNavLink>
        <MobileNavLink href="#testimonials">Testimonials</MobileNavLink>
        <MobileNavLink href="#pricing">Pricing</MobileNavLink>
        <MobileNavLink href="#faq">FAQ</MobileNavLink>
        <hr className="m-2 border-border" />
        {isUserLoggedIn ? (
          <MobileNavLink
            href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/dashboard`}
          >
            My Dashboard
          </MobileNavLink>
        ) : (
          <MobileNavLink
            href={`${process.env.NEXT_PUBLIC_AUTH_URL}/account?plan=Free`}
          >
            Get started
          </MobileNavLink>
        )}
      </PopoverPanel>
    </Popover>
  );
}

const navLinks = [
  { label: "Features", href: "/#features" },
  // { label: "Testimonials", href: "/#testimonials" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

const AUTH_TIMEOUT_MS = 1500;

export function Header() {
  const { data: session, isPending } = useSession();
  const [ready, setReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isPending) {
      setReady(true);
      return;
    }
    const timer = setTimeout(() => setReady(true), AUTH_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [isPending]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full overflow-visible transition-all duration-300",
        scrolled
          ? "border-b border-border/50 bg-background/80 py-4 backdrop-blur-xl"
          : "bg-transparent py-6",
      )}
    >
      <Container className="overflow-visible">
        <nav className="relative z-50 flex items-center justify-between overflow-visible">
          <div className="flex items-center md:gap-x-20 lg:gap-x-24">
            <Link
              href="/"
              aria-label="Home"
              className="group inline-flex shrink-0 items-center overflow-visible"
            >
              <Logo size="sm" />
            </Link>
            <div className="hidden md:flex md:gap-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-x-4">
            <ThemeToggle />
            <div
              className={cn(
                "hidden transition-opacity duration-300 md:block",
                ready ? "opacity-100" : "opacity-0",
              )}
            >
              {session?.user ? (
                <Button
                  href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/dashboard`}
                  color="main"
                >
                  My Dashboard
                </Button>
              ) : (
                <Button
                  href={`${process.env.NEXT_PUBLIC_AUTH_URL}/account?plan=Free`}
                  color="main"
                >
                  Get started
                </Button>
              )}
            </div>

            <div
              className={cn(
                "-mr-1 transition-opacity duration-300 md:hidden",
                ready ? "opacity-100" : "opacity-0",
              )}
            >
              <MobileNavigation isUserLoggedIn={!!session?.user} />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
