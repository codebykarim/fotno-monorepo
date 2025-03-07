declare module "next/navigation" {
  export function usePathname(): string;
}

declare module "next/link" {
  import Link from "next/link";
  export default Link;
}
