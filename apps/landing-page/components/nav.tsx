"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Icons } from "@workspace/ui/lib/icons";
import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { authClient } from "@/lib/auth-client";

const navigation = [
  {
    name: "Products",
    href: "/products",
  },
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
];

const LandingPageNav = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = authClient.useSession();

  return (
    <header className="">
      <nav
        aria-label="Global"
        className="mx-auto flex items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <Link href="#" className="-m-1.5 p-1.5 flex items-center gap-2">
            <Icons.logo className="h-8 w-auto text-black" />
            <p className="text-2xl font-bold">FOTNO</p>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            <Icons.menu aria-hidden="true" className="size-6" />
          </Button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm/6 font-semibold text-gray-900"
            >
              {item.name}
            </Link>
          ))}
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {session ? (
            <Link
              href="/dashboard"
              className="text-sm/6 font-semibold text-gray-900"
            >
              <Button variant="default">Dashboard</Button>
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm/6 font-semibold text-gray-900"
            >
              <Button variant="default">Login</Button>
            </Link>
          )}
        </div>
      </nav>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="-m-2.5 p-2.5">
            <span className="sr-only">Open menu</span>
            {/* Replace with your menu icon */}
          </Button>
        </SheetTrigger>

        <SheetContent className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-start gap-2">
            <Icons.logo className="h-8 w-auto text-blue-500" />
            <SheetTitle>FOTNO</SheetTitle>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                {session ? (
                  <Link
                    href="/dashboard"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                  >
                    Log in
                  </Link>
                )}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
};

export default LandingPageNav;
