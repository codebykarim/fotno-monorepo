"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@workspace/ui/components/button";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const Header = (props: Props) => {
  const router = useRouter();
  return (
    <div className="fixed top-0 left-0 right-0 z-10 flex h-16 items-center justify-between bg-background px-4 backdrop-blur-sm">
      <Button
        onClick={async () => {
          await authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/"); // redirect to login page
              },
            },
          });
        }}
      >
        Logout
      </Button>
    </div>
  );
};

export default Header;
