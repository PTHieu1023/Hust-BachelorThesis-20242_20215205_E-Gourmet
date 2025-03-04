import AuthController from "@/components/authController";
import {ThemeToggle} from "@/components/themeController";
import Image from "next/image";

export default async function Home() {

  return (
      <main className="flex h-screen w-screen items-center justify-center flex-col bg-background">
        <Image
            className="dark:invert"
            src="https://nextjs.org/icons/next.svg"
            alt="Next.js logo"
            width={180}
            height={38}
            priority
        />
        <AuthController />
        <ThemeToggle />
      </main>
  );
}
