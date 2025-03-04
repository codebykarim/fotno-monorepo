"use client";
import { NavUser } from "@/components/home/nav-user";
import { SidebarTrigger } from "@workspace/ui/components/sidebar";
import { Icons } from "@workspace/ui/lib/icons";
import { cn } from "@workspace/ui/lib/utils";
import {
  CalendarIcon,
  ChartPieIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  return (
    <div>
      <main className="py-10 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">{/* Your content */}</div>
      </main>
    </div>
  );
}
