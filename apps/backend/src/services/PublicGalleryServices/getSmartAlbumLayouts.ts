/**
 * Get predefined album layout templates (spread and single-page)
 * These are static layout definitions that clients can use in the designer
 *
 * Note: In a production implementation, these would likely be imported from
 * a shared library (e.g., apps/gallery/lib/layout-templates.ts)
 * For now, returning a basic structure that matches the contract
 */
export const getSmartAlbumLayouts = async () => {
  // Predefined layout templates with their structure
  const layouts = {
    // Cover page layout
    cover: [
      {
        id: "cover-full-bleed",
        name: "Full Bleed Cover",
        category: "cover",
        slots: [{ x: 0, y: 0, width: 100, height: 100 }],
      },
    ],
    // Single page layouts
    singlePage: [
      {
        id: "single-centered",
        name: "Centered Image",
        category: "single",
        slots: [
          { x: 10, y: 10, width: 80, height: 80 },
        ],
      },
      {
        id: "single-cover-with-title",
        name: "Cover with Title",
        category: "single",
        slots: [
          { x: 0, y: 0, width: 100, height: 70 },
        ],
      },
      {
        id: "single-centered-with-text",
        name: "Centered with Text",
        category: "single",
        slots: [
          { x: 15, y: 15, width: 70, height: 60 },
        ],
      },
    ],
    // Two-page spread layouts
    spreads: [
      {
        id: "spread-full-bleed",
        name: "Full Bleed Spread",
        category: "spread",
        slots: [{ x: 0, y: 0, width: 100, height: 100 }],
      },
      {
        id: "spread-two-image-horizontal",
        name: "Two Images (Side by Side)",
        category: "spread",
        slots: [
          { x: 0, y: 0, width: 50, height: 100 },
          { x: 50, y: 0, width: 50, height: 100 },
        ],
      },
      {
        id: "spread-two-image-vertical",
        name: "Two Images (Top & Bottom)",
        category: "spread",
        slots: [
          { x: 0, y: 0, width: 100, height: 50 },
          { x: 0, y: 50, width: 100, height: 50 },
        ],
      },
      {
        id: "spread-three-image-grid",
        name: "Three Images (Grid)",
        category: "spread",
        slots: [
          { x: 0, y: 0, width: 50, height: 50 },
          { x: 50, y: 0, width: 50, height: 50 },
          { x: 25, y: 50, width: 50, height: 50 },
        ],
      },
      {
        id: "spread-four-grid",
        name: "Four Images (2x2 Grid)",
        category: "spread",
        slots: [
          { x: 0, y: 0, width: 50, height: 50 },
          { x: 50, y: 0, width: 50, height: 50 },
          { x: 0, y: 50, width: 50, height: 50 },
          { x: 50, y: 50, width: 50, height: 50 },
        ],
      },
      {
        id: "spread-two-plus-one",
        name: "Two Large + One Small",
        category: "spread",
        slots: [
          { x: 0, y: 0, width: 100, height: 50 },
          { x: 0, y: 50, width: 50, height: 50 },
          { x: 50, y: 50, width: 50, height: 50 },
        ],
      },
      {
        id: "spread-one-plus-two",
        name: "One Large + Two Small",
        category: "spread",
        slots: [
          { x: 0, y: 0, width: 50, height: 100 },
          { x: 50, y: 0, width: 50, height: 50 },
          { x: 50, y: 50, width: 50, height: 50 },
        ],
      },
      {
        id: "spread-panoramic-strip",
        name: "Panoramic Strip",
        category: "spread",
        slots: [{ x: 0, y: 25, width: 100, height: 50 }],
      },
    ],
  };

  return { layouts };
};
