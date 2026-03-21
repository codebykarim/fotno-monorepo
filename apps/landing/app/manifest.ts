import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FOTNO — Photo Gallery Delivery Platform",
    short_name: "FOTNO",
    description:
      "The modern photo gallery delivery platform for professional photographers. Create stunning password-protected client galleries.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#c97a3a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
