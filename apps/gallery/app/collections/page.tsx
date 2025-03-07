"use client";
import Collection from "@/components/home/collection";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  FolderIcon,
  FoldersIcon,
  Trash2Icon,
  DownloadIcon,
  ShareIcon,
} from "lucide-react";
import React, { useState } from "react";
import GlassIcons from "@/components/home/folder";
import { InteractiveHoverButton } from "@workspace/ui/components/interactive-hover-button";
import { collections } from "@workspace/lib/data/dummy_collections";

const CollectionsPage = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = () => {
    if (
      selectedIds.length ===
      collections.filter((collection) => collection.type === "collection")
        .length
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(
        collections
          .filter((collection) => collection.type === "collection")
          .map((collection) => collection.id)
      );
    }
  };

  return (
    <div className="w-full relative min-h-screen pb-20">
      <div className="flex flex-col md:flex-row md:items-center space-y-5 md:space-y-0 justify-between">
        <h1 className="text-3xl font-bold">Collections</h1>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <Button variant="outline" onClick={handleSelectAll}>
              {selectedIds.length ===
              collections.filter(
                (collection) => collection.type === "collection"
              ).length
                ? "Deselect All"
                : "Select All"}
            </Button>
          )}
          <InteractiveHoverButton text="New Collection" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-5 gap-y-16 gap-x-10 mt-10">
        {collections.map((item) => (
          <div key={item.id} className="space-y-3 cursor-pointer">
            {item.type === "collection" ? (
              <Collection
                coverImage={item.coverImage}
                isSelected={selectedIds.includes(item.id)}
                onSelect={() => handleSelect(item.id)}
                showCheckbox={selectedIds.length > 0}
              />
            ) : (
              <GlassIcons
                items={[
                  {
                    icon: <FoldersIcon className="h-16 w-16 text-white" />,
                    color: "blue",
                    label: "",
                    frontImage: item.frontImage,
                    backImages: item.backImages,
                  },
                ]}
              />
            )}
            <div className="flex items-center space-x-2">
              {item.type === "folder" && (
                <FolderIcon className="h-4 w-4 text-primary" />
              )}
              <p className="text-base text-foreground font-semibold">
                {item.title}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                className={
                  item.status === "published" ? "bg-green-500" : "bg-primary"
                }
              >
                {item.status === "published" ? "Published" : "Draft"}
              </Badge>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-gray-500">{item.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Action Dock */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">
                {selectedIds.length}{" "}
                {selectedIds.length === 1 ? "item" : "items"} selected
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ShareIcon className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <DownloadIcon className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2Icon className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedIds([])}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
