"use client";

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
import { Logo } from "@/components/Logo";
import { NavLink } from "@/components/NavLink";
import { Icons } from "@workspace/ui/components/icons";
import { useSession } from "@workspace/lib/auth/auth-client";

function MobileNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <PopoverButton as={Link} href={href} className="block w-full p-2">
      {children}
    </PopoverButton>
  );
}

function MobileNavIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="h-3.5 w-3.5 overflow-visible stroke-slate-700"
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
          !open && "scale-90 opacity-0"
        )}
      />
    </svg>
  );
}

function MobileNavigation({
  isUserLoggedIn,
  isLoading,
}: {
  isUserLoggedIn: boolean;
  isLoading: boolean;
}) {
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
        className="fixed inset-0 bg-foreground/30 duration-150 data-closed:opacity-0 data-enter:ease-out data-leave:ease-in"
      />
      <PopoverPanel
        transition
        className="absolute inset-x-0 top-full mt-4 flex origin-top flex-col rounded-2xl bg-background p-4 text-lg tracking-tight text-foreground ring-1 shadow-xl ring-background/5 data-closed:scale-95 data-closed:opacity-0 data-enter:duration-150 data-enter:ease-out data-leave:duration-100 data-leave:ease-in"
      >
        <MobileNavLink href="#features">Features</MobileNavLink>
        <MobileNavLink href="#testimonials">Testimonials</MobileNavLink>
        <MobileNavLink href="#pricing">Pricing</MobileNavLink>
        <hr className="m-2 border-primary/40" />
        {isLoading ? (
          <div className="h-10 bg-background/10 animate-pulse rounded-full" />
        ) : isUserLoggedIn ? (
          <MobileNavLink
            href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/dashboard`}
          >
            My Dashboard
          </MobileNavLink>
        ) : (
          <div className="flex flex-col w-fit">
            <MobileNavLink href={`${process.env.NEXT_PUBLIC_AUTH_URL}/account`}>
              <span>
                Get started <span className="hidden lg:inline">today</span>
              </span>
            </MobileNavLink>
          </div>
        )}
      </PopoverPanel>
    </Popover>
  );
}

export function Header() {
  const { data: session, isPending } = useSession();

  return (
    <header className="py-10 bg-background">
      <Container>
        <nav className="relative z-50 flex justify-between">
          <div className="flex items-center md:gap-x-12">
            <Link href="#" aria-label="Home">
              <div className="flex items-center justify-center gap-2">
                <Icons.logo className="h-8 w-auto text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
                  FOTNO
                </h1>
              </div>
            </Link>
            <div className="hidden md:flex md:gap-x-6">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#testimonials">Testimonials</NavLink>
              <NavLink href="#pricing">Pricing</NavLink>
            </div>
          </div>
          <div className="flex items-center gap-x-5 md:gap-x-8">
            <div className="hidden md:block">
              {isPending ? (
                <div className="w-[140px] h-10 bg-foreground/10 animate-pulse rounded-full" />
              ) : session?.user ? (
                <Button
                  href={`${process.env.NEXT_PUBLIC_DASHBOARD_URL}/dashboard`}
                  color="main"
                >
                  My Dashboard
                </Button>
              ) : (
                <div className="flex gap-2 items-center">
                  <Button
                    href={`${process.env.NEXT_PUBLIC_AUTH_URL}/account`}
                    color="main"
                  >
                    <span>
                      Get started{" "}
                      <span className="hidden lg:inline">today</span>
                    </span>
                  </Button>
                </div>
              )}
            </div>

            <div className="-mr-1 md:hidden">
              <MobileNavigation
                isUserLoggedIn={session?.user !== undefined}
                isLoading={isPending}
              />
            </div>
          </div>
        </nav>
      </Container>
    </header>
  );
}
