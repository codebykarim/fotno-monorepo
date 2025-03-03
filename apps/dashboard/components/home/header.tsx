"use client";
import { logout } from "@/actions/logout";
import { Button } from "@workspace/ui/components/button";
import React from "react";

type Props = {};

const Header = (props: Props) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-10 flex h-16 items-center justify-between bg-background px-4 backdrop-blur-sm">
      <Button onClick={logout}>Logout</Button>
    </div>
  );
};

export default Header;
