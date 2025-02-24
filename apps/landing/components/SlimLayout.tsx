import Image from "next/image";

import backgroundImage from "@/images/background-auth.jpg";

export function SlimLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="relative flex min-h-screen shrink-0 justify-center md:px-12 lg:px-0">
        <div className="relative z-10 flex flex-1 flex-col bg-white px-4 py-10 shadow-2xl sm:justify-center md:flex-none md:px-28">
          <main className="mx-auto w-full max-w-md sm:px-4 md:w-96 md:max-w-sm md:px-0">
            {children}
          </main>
        </div>
        <div className="relative hidden sm:contents lg:relative lg:block lg:flex-1 blur-sm opacity-80">
          <div className="absolute inset-0 bg-secondary/50 mix-blend-multiply z-10"></div>
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src="https://www.hockwoldhallnorfolk.com/wp-content/uploads/2017/02/wedding-photographer.jpg"
            alt=""
            unoptimized
            fill
          />
        </div>
      </div>
    </>
  );
}
