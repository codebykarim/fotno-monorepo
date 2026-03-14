"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  ArrowLeft,
  Check,
  ImageIcon,
  Loader2,
  Search,
  X,
  Eye,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Input } from "@workspace/ui/components/input";
import { Card, CardContent } from "@workspace/ui/components/card";
import { jsonFetcher } from "@/lib/api/client";
import { cn } from "@workspace/ui/lib/utils";

interface Ancestor {
  id: string;
  name: string;
}

interface PhotoFolder {
  id: string;
  name: string;
  ancestors: Ancestor[];
  photoCount: number;
  totalSize: number;
}

interface PhotoFoldersResponse {
  folders: PhotoFolder[];
}

export interface SelectedFolder {
  id: string;
  name: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / k ** i).toFixed(1)} ${sizes[i]}`;
}

function getLevel(photoFolders: PhotoFolder[], path: Ancestor[]) {
  const depth = path.length;

  const matching = photoFolders.filter((f) => {
    for (let i = 0; i < depth; i++) {
      const ancestor = f.ancestors[i];
      const pathItem = path[i];
      if (!ancestor || !pathItem || ancestor.id !== pathItem.id) return false;
    }
    return true;
  });

  const branchMap = new Map<
    string,
    {
      id: string;
      name: string;
      totalPhotos: number;
      totalSize: number;
      folderCount: number;
    }
  >();
  const leaves: PhotoFolder[] = [];

  for (const folder of matching) {
    if (folder.ancestors.length === depth) {
      leaves.push(folder);
    } else {
      const ancestor = folder.ancestors[depth];
      if (!ancestor) continue;
      const existing = branchMap.get(ancestor.id);
      if (existing) {
        existing.totalPhotos += folder.photoCount;
        existing.totalSize += folder.totalSize;
        existing.folderCount++;
      } else {
        branchMap.set(ancestor.id, {
          id: ancestor.id,
          name: ancestor.name,
          totalPhotos: folder.photoCount,
          totalSize: folder.totalSize,
          folderCount: 1,
        });
      }
    }
  }

  const branches = [...branchMap.values()].sort((a, b) =>
    a.name.localeCompare(b.name),
  );
  leaves.sort((a, b) => a.name.localeCompare(b.name));

  return { branches, leaves };
}

export function GdriveBrowser({
  selectedFolders,
  onSelectionChange,
  onPreviewFolder,
}: {
  selectedFolders: SelectedFolder[];
  onSelectionChange: (folders: SelectedFolder[]) => void;
  onPreviewFolder: (folderId: string) => void;
}) {
  const { data, isLoading } = useSWR<PhotoFoldersResponse>(
    "/api/gdrive/photo-folders",
    jsonFetcher,
    { revalidateOnFocus: false },
  );

  const [path, setPath] = useState<Ancestor[]>([]);
  const [search, setSearch] = useState("");
  const selectedIds = new Set(selectedFolders.map((f) => f.id));

  function toggleFolder(folder: PhotoFolder) {
    if (selectedIds.has(folder.id)) {
      onSelectionChange(selectedFolders.filter((f) => f.id !== folder.id));
    } else {
      onSelectionChange([
        ...selectedFolders,
        { id: folder.id, name: folder.name },
      ]);
    }
  }

  function navigateInto(branch: { id: string; name: string }) {
    setPath([...path, { id: branch.id, name: branch.name }]);
  }

  function navigateBack() {
    setPath(path.slice(0, -1));
  }

  function navigateTo(index: number) {
    setPath(path.slice(0, index + 1));
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-sm text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Scanning your Google Drive for photo folders...</span>
        </CardContent>
      </Card>
    );
  }

  const allFolders = data?.folders ?? [];

  if (allFolders.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
          <ImageIcon className="h-8 w-8" />
          <span>No folders with photos found in your Drive</span>
        </CardContent>
      </Card>
    );
  }

  const isSearching = search.trim().length > 0;
  const searchLower = search.trim().toLowerCase();

  const searchResults = isSearching
    ? allFolders.filter((f) => {
        const fullPath = [...f.ancestors.map((a) => a.name), f.name]
          .join(" ")
          .toLowerCase();
        return fullPath.includes(searchLower);
      })
    : [];

  const { branches, leaves } = getLevel(allFolders, path);

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search folders..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-9"
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Breadcrumb */}
      {!isSearching && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <button
            type="button"
            onClick={() => setPath([])}
            className="transition-colors hover:text-foreground"
          >
            My Drive
          </button>
          {path.map((item, idx) => (
            <span key={item.id} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5" />
              <button
                type="button"
                onClick={() => navigateTo(idx)}
                className="transition-colors hover:text-foreground"
              >
                {item.name}
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Back button */}
      {!isSearching && path.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={navigateBack}
          className="gap-1.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Button>
      )}

      {/* Folder list */}
      <div className="max-h-[28rem] overflow-y-auto rounded-lg border divide-y">
        {isSearching ? (
          <>
            {searchResults.map((folder) => {
              const isSelected = selectedIds.has(folder.id);
              const pathStr = folder.ancestors.map((a) => a.name).join(" / ");

              return (
                <div
                  key={folder.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 transition-colors",
                    isSelected ? "bg-primary/5" : "hover:bg-muted/50",
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleFolder(folder)}
                    className="shrink-0"
                  />
                  <div className="flex min-w-0 flex-1 items-center gap-2.5 text-sm">
                    {isSelected ? (
                      <FolderOpen className="h-4.5 w-4.5 shrink-0 text-primary" />
                    ) : (
                      <Folder className="h-4.5 w-4.5 shrink-0 text-muted-foreground" />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        {folder.name}
                      </span>
                      {pathStr && (
                        <span className="block truncate text-xs text-muted-foreground">
                          {pathStr}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-xs font-medium">
                      {folder.photoCount} photo
                      {folder.photoCount !== 1 ? "s" : ""}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatBytes(folder.totalSize)}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 shrink-0 p-0"
                    onClick={() => onPreviewFolder(folder.id)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}

            {searchResults.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No folders matching &ldquo;{search.trim()}&rdquo;
              </div>
            )}
          </>
        ) : (
          <>
            {/* Branch folders */}
            {branches.map((branch) => (
              <button
                key={branch.id}
                type="button"
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                onClick={() => navigateInto(branch)}
              >
                <Folder className="h-4.5 w-4.5 shrink-0 text-muted-foreground" />
                <span className="flex-1 truncate text-sm font-medium">
                  {branch.name}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {branch.folderCount} folder
                  {branch.folderCount !== 1 ? "s" : ""}
                  {" \u00B7 "}
                  {branch.totalPhotos} photo
                  {branch.totalPhotos !== 1 ? "s" : ""}
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />
              </button>
            ))}

            {/* Leaf folders */}
            {leaves.map((folder) => {
              const isSelected = selectedIds.has(folder.id);

              return (
                <div
                  key={folder.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 transition-colors",
                    isSelected ? "bg-primary/5" : "hover:bg-muted/50",
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => toggleFolder(folder)}
                    className="shrink-0"
                  />
                  <div className="flex flex-1 items-center gap-2.5 text-sm">
                    {isSelected ? (
                      <FolderOpen className="h-4.5 w-4.5 shrink-0 text-primary" />
                    ) : (
                      <Folder className="h-4.5 w-4.5 shrink-0 text-muted-foreground" />
                    )}
                    <span className="flex-1 truncate font-medium">
                      {folder.name}
                    </span>
                  </div>

                  <div className="shrink-0 text-right">
                    <div className="text-xs font-medium">
                      {folder.photoCount} photo
                      {folder.photoCount !== 1 ? "s" : ""}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatBytes(folder.totalSize)}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 shrink-0 p-0"
                    onClick={() => onPreviewFolder(folder.id)}
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}

            {branches.length === 0 && leaves.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                No photo folders found here
              </div>
            )}
          </>
        )}
      </div>

      {/* Selected folders summary */}
      {selectedFolders.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground">
            {selectedFolders.length} folder
            {selectedFolders.length !== 1 ? "s" : ""} selected:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {selectedFolders.map((f) => (
              <span
                key={f.id}
                className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
              >
                <Check className="h-3 w-3" />
                {f.name}
                <button
                  type="button"
                  onClick={() =>
                    onSelectionChange(
                      selectedFolders.filter((sf) => sf.id !== f.id),
                    )
                  }
                  className="ml-0.5 hover:text-destructive"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
