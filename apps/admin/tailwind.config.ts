import tailwindThemeConfig from "@workspace/ui/tailwind.config";
import type { Config } from "tailwindcss";

const config: Config = {
  presets: [tailwindThemeConfig],
  content: [
    "./**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
};

export default config;
