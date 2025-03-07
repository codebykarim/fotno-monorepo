"use client";

import type { Variants } from "motion/react";
import { useAnimation } from "motion/react";
import { Icons } from "@workspace/ui/components/icons";

const facebookVariants: Variants = {
  normal: {
    opacity: 1,
    pathLength: 1,
    pathOffset: 0,
    transition: {
      duration: 0.4,
      opacity: { duration: 0.1 },
    },
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [1, 0],
    transition: {
      duration: 0.6,
      ease: "linear",
      opacity: { duration: 0.1 },
    },
  },
};

const StarIcon = ({ stroke }: { stroke: string }) => {
  const controls = useAnimation();

  return (
    <div
      className="cursor-pointer select-none rounded-md transition-colors duration-200 flex items-center justify-center"
      onMouseEnter={() => {
        controls.start("animate");
      }}
      onMouseLeave={() => {
        controls.start("normal");
      }}
    >
      <Icons.star
        variants={facebookVariants}
        animate={controls}
        stroke={stroke}
      />
    </div>
  );
};

export { StarIcon };
