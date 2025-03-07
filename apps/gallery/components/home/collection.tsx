import Image from "next/image";
import React from "react";
import { AspectRatio } from "@workspace/ui/components/aspect-ratio";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { cn } from "@workspace/ui/lib/utils";
import { StarIcon } from "@workspace/ui/components/animated-icon";
type Props = {
  coverImage: string;
  isSelected?: boolean;
  onSelect?: () => void;
  onStar?: () => void;
  showCheckbox?: boolean;
  isStarred?: boolean;
};

const Collection = ({
  coverImage,
  isSelected = false,
  onSelect,
  onStar,
  showCheckbox = false,
  isStarred = false,
}: Props) => {
  return (
    <AspectRatio ratio={3 / 2} className="group relative">
      <Image
        src={coverImage}
        alt="Collection cover"
        fill
        className={cn(
          "h-full w-full rounded-2xl object-cover transition-all duration-300",
          isSelected ? "brightness-75" : "hover:brightness-75"
        )}
      />
      <div
        className={cn(
          "absolute right-3 top-3 transition-opacity",
          showCheckbox || isSelected
            ? "opacity-100"
            : "opacity-0 group-hover:opacity-100"
        )}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          className="h-5 w-5 border-2 border-white bg-black/50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
        />
      </div>
      <div
        className={cn(
          "absolute left-3 top-3 transition-opacity",
          "opacity-0 group-hover:opacity-100"
        )}
      >
        <StarIcon stroke={isStarred ? "yellow" : "white"} />
      </div>
    </AspectRatio>
  );
};

export default Collection;
