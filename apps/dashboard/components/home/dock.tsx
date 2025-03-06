"use client";
import {
  HomeIcon,
  ImageIcon,
  LayoutTemplateIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";

import {
  Dock,
  DockIcon,
  DockItem,
  DockLabel,
} from "@workspace/ui/components/dock";
import { useRouter } from "next/navigation";

const data = [
  {
    title: "Home",
    icon: (
      <HomeIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
    ),
    href: `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/`,
  },
  {
    title: "Gallery",
    icon: (
      <ImageIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
    ),
    href: `${process.env.NEXT_PUBLIC_GALLERY_URL}/`,
  },
  {
    title: "Website",
    icon: (
      <LayoutTemplateIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
    ),
    href: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/`,
  },
  {
    title: "Studio",
    icon: (
      <UsersIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
    ),
    href: `${process.env.NEXT_PUBLIC_STUDIO_URL}/`,
  },
  {
    title: "Settings",
    icon: (
      <SettingsIcon className="h-full w-full text-neutral-600 dark:text-neutral-300" />
    ),
    href: `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/account`,
  },
];

export function DockComponent() {
  const router = useRouter();
  return (
    <div className="absolute bottom-2 left-1/2 max-w-full -translate-x-1/2">
      <Dock className="items-end pb-3">
        {data.map((item, idx) => (
          <DockItem
            key={idx}
            className="aspect-square rounded-2xl bg-gray-200 dark:bg-neutral-800"
            onClick={() => item.href && router.push(item.href)}
          >
            <DockLabel>{item.title}</DockLabel>
            <DockIcon>{item.icon}</DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  );
}
