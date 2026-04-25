import Link from "next/link";

import { Button } from "@/components/Button";
import { SlimLayout } from "@/components/SlimLayout";
import { Icons } from "@workspace/ui/components/icons";
import Logo from "@workspace/ui/components/logo";

export default function NotFound() {
  return (
    <SlimLayout>
      <div className="flex">
        <Link href="/" aria-label="Home">
          <div className="flex items-center justify-center gap-2">
            <Logo />
          </div>
        </Link>
      </div>
      <p className="mt-20 text-sm font-medium text-muted-foreground">404</p>
      <h1 className="mt-3 text-lg font-semibold text-foreground">
        Page not found
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Sorry, we couldn’t find the page you’re looking for.
      </p>
      <Button href="/" className="mt-10">
        Go back home
      </Button>
    </SlimLayout>
  );
}
