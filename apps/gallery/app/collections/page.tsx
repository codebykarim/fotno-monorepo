"use client";
import Collection from "@/components/home/collection";
import { Badge } from "@workspace/ui/components/badge";
import { FolderIcon, FoldersIcon, PlusIcon } from "lucide-react";
import React from "react";
import GlassIcons from "@/components/home/folder";
import { InteractiveHoverButton } from "@workspace/ui/components/interactive-hover-button";
type Props = {};

const CollectionsPage = (props: Props) => {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center space-y-5 md:space-y-0 justify-between">
        <h1 className="text-3xl font-bold">Collections</h1>
        <InteractiveHoverButton text="New Collection" />
      </div>
      <div className="flex flex-wrap p-5 gap-10 mt-10">
        <div className="space-y-3 hover:opacity-90 cursor-pointer">
          <Collection coverImage="https://images.unsplash.com/photo-1655736394091-b1c3efc76a08?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          <p className="text-base  text-foreground font-semibold">
            Jhon & Diana
          </p>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-500">Published</Badge>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">Feb 5, 2025</span>
          </div>
        </div>
        <div className="space-y-3 hover:opacity-90 cursor-pointer">
          <Collection coverImage="https://images.unsplash.com/flagged/photo-1620830102229-9db5c00d4afc?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          <p className="text-base  text-foreground font-semibold">
            Steve & Jane
          </p>
          <div className="flex items-center space-x-2">
            <Badge className="bg-primary">Draft</Badge>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">Feb 5, 2025</span>
          </div>
        </div>
        <div className="space-y-3 hover:opacity-90 cursor-pointer">
          <Collection coverImage="https://images.unsplash.com/photo-1628046276142-a614ec8c5504?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          <p className="text-base  text-foreground font-semibold">Sofia</p>
          <div className="flex items-center space-x-2">
            <Badge className="bg-green-500">Published</Badge>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">Feb 5, 2025</span>
          </div>
        </div>
        <div className="space-y-3 hover:opacity-90 cursor-pointer">
          <Collection coverImage="https://images.unsplash.com/photo-1550784718-990c6de52adf?q=80&w=1884&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
          <p className="text-base  text-foreground font-semibold">
            Franklin & Sara
          </p>
          <div className="flex items-center space-x-2">
            <Badge className="bg-primary">Draft</Badge>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">Feb 5, 2025</span>
          </div>
        </div>
        <div className="relative space-y-3">
          <GlassIcons
            items={[
              {
                icon: <FoldersIcon className="h-16 w-16 text-white" />,
                color: "blue",
                label: "",
                frontImage:
                  "https://images.unsplash.com/photo-1739932884695-98a239b8adf1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                backImages: [
                  "https://images.unsplash.com/photo-1739188366834-1281a22a1ac5?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                  "https://images.unsplash.com/photo-1739932900241-4d3362b5ed8e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                ],
              },
            ]}
          />
          <div className="flex items-center space-x-2">
            <FolderIcon className="h-4 w-4 text-primary" />
            <p className="text-base text-foreground font-semibold">
              Grands Day
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-primary">Draft</Badge>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">Feb 5, 2025</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionsPage;
