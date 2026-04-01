/**
 * Layout Template System
 * Defines all available page and spread layouts for album design
 * Slot coordinates are percentages (0-100) for resolution independence
 */

export interface Slot {
  x: number; // position percentage
  y: number;
  width: number; // size percentage
  height: number;
}

export interface LayoutTemplate {
  id: string;
  name: string;
  type: "spread" | "single"; // spread = 2-page, single = 1-page
  displayName: string;
  description: string;
  slots: Slot[];
  thumbnail?: string; // Optional visual reference
}

// ─── Spread Layouts (Left + Right Pages, each page is 50% width) ──────────

export const SPREAD_FULL_BLEED: LayoutTemplate = {
  id: "spread-full-bleed",
  name: "Full Bleed",
  type: "spread",
  displayName: "Full Bleed",
  description: "One image spanning both pages",
  slots: [
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
  ],
};

export const SPREAD_TWO_IMAGE_HORIZONTAL: LayoutTemplate = {
  id: "spread-two-image-horizontal",
  name: "Two Image Horizontal",
  type: "spread",
  displayName: "Two Images (Horizontal)",
  description: "Left image on left page, right image on right page",
  slots: [
    {
      x: 0,
      y: 0,
      width: 50,
      height: 100,
    },
    {
      x: 50,
      y: 0,
      width: 50,
      height: 100,
    },
  ],
};

export const SPREAD_THREE_IMAGE_GRID: LayoutTemplate = {
  id: "spread-three-image-grid",
  name: "Three Image Grid",
  type: "spread",
  displayName: "Three Images",
  description: "Two images on left, one on right",
  slots: [
    {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
    },
    {
      x: 0,
      y: 50,
      width: 50,
      height: 50,
    },
    {
      x: 50,
      y: 0,
      width: 50,
      height: 100,
    },
  ],
};

export const SPREAD_TWO_PLUS_ONE_LEFT: LayoutTemplate = {
  id: "spread-two-plus-one-left",
  name: "2+1 Left Accent",
  type: "spread",
  displayName: "2+1 (Left Accent)",
  description: "Large image on left, two smaller on right",
  slots: [
    {
      x: 0,
      y: 0,
      width: 50,
      height: 100,
    },
    {
      x: 50,
      y: 0,
      width: 50,
      height: 50,
    },
    {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
    },
  ],
};

export const SPREAD_ONE_PLUS_TWO_RIGHT: LayoutTemplate = {
  id: "spread-one-plus-two-right",
  name: "1+2 Right Accent",
  type: "spread",
  displayName: "1+2 (Right Accent)",
  description: "Two smaller images on left, large on right",
  slots: [
    {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
    },
    {
      x: 0,
      y: 50,
      width: 50,
      height: 50,
    },
    {
      x: 50,
      y: 0,
      width: 50,
      height: 100,
    },
  ],
};

export const SPREAD_FOUR_GRID: LayoutTemplate = {
  id: "spread-four-grid",
  name: "Four Grid",
  type: "spread",
  displayName: "Four Images (2×2)",
  description: "2×2 grid across both pages",
  slots: [
    {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
    },
    {
      x: 0,
      y: 50,
      width: 50,
      height: 50,
    },
    {
      x: 50,
      y: 0,
      width: 50,
      height: 50,
    },
    {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
    },
  ],
};

export const SPREAD_PANORAMIC_STRIP: LayoutTemplate = {
  id: "spread-panoramic-strip",
  name: "Panoramic Strip",
  type: "spread",
  displayName: "Panoramic Strip",
  description: "Wide panoramic image with smaller accent",
  slots: [
    {
      x: 0,
      y: 0,
      width: 100,
      height: 60,
    },
    {
      x: 0,
      y: 60,
      width: 100,
      height: 40,
    },
  ],
};

export const SPREAD_SIX_GRID: LayoutTemplate = {
  id: "spread-six-grid",
  name: "Six Grid",
  type: "spread",
  displayName: "Six Images (2×3)",
  description: "2×3 grid across both pages",
  slots: [
    {
      x: 0,
      y: 0,
      width: 50,
      height: 33.33,
    },
    {
      x: 0,
      y: 33.33,
      width: 50,
      height: 33.33,
    },
    {
      x: 0,
      y: 66.66,
      width: 50,
      height: 33.34,
    },
    {
      x: 50,
      y: 0,
      width: 50,
      height: 33.33,
    },
    {
      x: 50,
      y: 33.33,
      width: 50,
      height: 33.33,
    },
    {
      x: 50,
      y: 66.66,
      width: 50,
      height: 33.34,
    },
  ],
};

export const SPREAD_SPLIT_VERTICAL: LayoutTemplate = {
  id: "spread-split-vertical",
  name: "Vertical Split",
  type: "spread",
  displayName: "Vertical Split",
  description: "Top image across both, two below",
  slots: [
    {
      x: 0,
      y: 0,
      width: 100,
      height: 50,
    },
    {
      x: 0,
      y: 50,
      width: 50,
      height: 50,
    },
    {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
    },
  ],
};

// ─── Single Page Layouts ────────────────────────────────────────────────

export const SINGLE_COVER_FULL: LayoutTemplate = {
  id: "single-cover-full",
  name: "Cover Full",
  type: "single",
  displayName: "Full Page Cover",
  description: "One image filling the entire page",
  slots: [
    {
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    },
  ],
};

export const SINGLE_COVER_WITH_TITLE: LayoutTemplate = {
  id: "single-cover-with-title",
  name: "Cover With Title",
  type: "single",
  displayName: "Cover with Title",
  description: "Image with space for title text at bottom",
  slots: [
    {
      x: 0,
      y: 0,
      width: 100,
      height: 75,
    },
  ],
};

export const SINGLE_CENTERED: LayoutTemplate = {
  id: "single-centered",
  name: "Centered",
  type: "single",
  displayName: "Centered Image",
  description: "Centered image with margins",
  slots: [
    {
      x: 10,
      y: 10,
      width: 80,
      height: 80,
    },
  ],
};

export const SINGLE_CENTERED_WITH_TEXT: LayoutTemplate = {
  id: "single-centered-with-text",
  name: "Centered with Text",
  type: "single",
  displayName: "Centered with Text",
  description: "Centered image with space for text below",
  slots: [
    {
      x: 10,
      y: 5,
      width: 80,
      height: 60,
    },
  ],
};

export const SINGLE_TWO_VERTICAL: LayoutTemplate = {
  id: "single-two-vertical",
  name: "Two Vertical",
  type: "single",
  displayName: "Two Images (Stacked)",
  description: "Two images stacked vertically",
  slots: [
    {
      x: 0,
      y: 0,
      width: 100,
      height: 50,
    },
    {
      x: 0,
      y: 50,
      width: 100,
      height: 50,
    },
  ],
};

export const SINGLE_THREE_GRID: LayoutTemplate = {
  id: "single-three-grid",
  name: "Three Grid",
  type: "single",
  displayName: "Three Images (Grid)",
  description: "One large image with two smaller below",
  slots: [
    {
      x: 0,
      y: 0,
      width: 100,
      height: 50,
    },
    {
      x: 0,
      y: 50,
      width: 50,
      height: 50,
    },
    {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
    },
  ],
};

export const SINGLE_FOUR_GRID: LayoutTemplate = {
  id: "single-four-grid",
  name: "Four Grid",
  type: "single",
  displayName: "Four Images (2×2)",
  description: "Four images in a 2×2 grid",
  slots: [
    {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
    },
    {
      x: 50,
      y: 0,
      width: 50,
      height: 50,
    },
    {
      x: 0,
      y: 50,
      width: 50,
      height: 50,
    },
    {
      x: 50,
      y: 50,
      width: 50,
      height: 50,
    },
  ],
};

// ─── Template Collections ──────────────────────────────────────────────

export const SPREAD_LAYOUTS = [
  SPREAD_FULL_BLEED,
  SPREAD_TWO_IMAGE_HORIZONTAL,
  SPREAD_THREE_IMAGE_GRID,
  SPREAD_TWO_PLUS_ONE_LEFT,
  SPREAD_ONE_PLUS_TWO_RIGHT,
  SPREAD_FOUR_GRID,
  SPREAD_PANORAMIC_STRIP,
  SPREAD_SIX_GRID,
  SPREAD_SPLIT_VERTICAL,
];

export const SINGLE_LAYOUTS = [
  SINGLE_COVER_FULL,
  SINGLE_COVER_WITH_TITLE,
  SINGLE_CENTERED,
  SINGLE_CENTERED_WITH_TEXT,
  SINGLE_TWO_VERTICAL,
  SINGLE_THREE_GRID,
  SINGLE_FOUR_GRID,
];

export const ALL_LAYOUTS = [...SPREAD_LAYOUTS, ...SINGLE_LAYOUTS];

/**
 * Get a layout template by ID
 */
export const getLayoutById = (id: string): LayoutTemplate | undefined => {
  return ALL_LAYOUTS.find((layout) => layout.id === id);
};

/**
 * Get all spread layouts
 */
export const getSpreadLayouts = (): LayoutTemplate[] => SPREAD_LAYOUTS;

/**
 * Get all single page layouts
 */
export const getSingleLayouts = (): LayoutTemplate[] => SINGLE_LAYOUTS;
