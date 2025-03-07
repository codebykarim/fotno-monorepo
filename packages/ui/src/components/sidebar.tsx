"use client";
import * as Icons from "lucide-react";
import { ChevronLeftIcon, ChevronRightIcon, LucideIcon } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname } from "next/navigation";
type Props = {
  items: {
    title: string;
    icon: keyof typeof Icons;
    href: string;
    number?: number;
  }[];
};

const SideBar = ({ items }: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  return (
    <div
      className={`relative flex h-fit transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-[247.5px]"
      } flex-col rounded-xl bg-foreground bg-clip-border py-4 text-white shadow-xl shadow-blue-gray-900/5`}
    >
      <nav
        className={`flex min-w-0 flex-col gap-1 p-2 font-sans text-base font-normal ${
          isCollapsed ? "items-center" : ""
        }`}
      >
        {items.map((item) => {
          const Icon = Icons[item.icon] as LucideIcon;
          return (
            <a href={item.href} key={item.href}>
              <div
                key={item.href}
                role="button"
                className={cn(
                  "flex items-center w-full p-3",
                  pathname === item.href && "text-primary"
                )}
              >
                <div className="grid mr-4 place-items-center">
                  <Icon />
                </div>
                {!isCollapsed && (
                  <>
                    {item.title}
                    <div className="grid ml-auto place-items-center justify-self-end">
                      <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-full select-none whitespace-nowrap bg-blue-gray-500/20 text-blue-gray-900">
                        <span className="">{item.number}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </a>
          );
        })}
      </nav>

      {/* <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-foreground text-white hover:bg-opacity-80 transition-all duration-300 cursor-pointer"
      >
        {isCollapsed ? (
          <ChevronRightIcon className="h-4 w-4" />
        ) : (
          <ChevronLeftIcon className="h-4 w-4" />
        )}
      </button> */}
    </div>
  );
};

export default SideBar;
