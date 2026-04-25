declare module "next/navigation" {
  export function usePathname(): string;

  export function useRouter(): {
    push: (href: string) => void;
    refresh: () => void;
  };
}

declare module "next/link" {
  import Link from "next/link";
  export default Link;
}
