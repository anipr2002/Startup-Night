import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Ripple, { DotPattern } from "@/components/ui/ripple";
import { ShineBorder } from "@/components/ui/shine-border";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignOutButton,
} from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { checkUser } from "@/actions/checkUser";
import Image from "next/image";
import { cn } from "@/lib/utils";
import BgNoiseWrapper from "@/components/texture-wrapper";
import Marquee from "@/components/ui/marquee";

export default async function Home() {
  const user = await currentUser();

  await checkUser();
  return (
    <>
      <BgNoiseWrapper url="/cult-noise.png">
        <MaxWidthWrapper key={user?.id}>
          <div className="flex flex-col items-center justify-center w-full h-screen">
            {/*  */}
            <div className="border-t-2 border-b-2 border-transparent w-screen bg-[#D3C5B4] text-white text-center font-animal absolute top-2">
              <Marquee pauseOnHover className="[--duration:20s]" repeat={10}>
                <div className="mx-10">Under development</div>
              </Marquee>
            </div>

            <div className="absolute bottom-0 right-2 w-fit font-animal text-xl">
              {" "}
              Made with ❤️ by{" "}
              <span>
                <Link href="https://anirudhpr.me" className="text-[#6C5549]">
                  Anirudh
                </Link>
              </span>
            </div>
            <div className="font-roger text-5xl font-bold text-center">
              Welcome to{" "}
              <div className="flex items-center gap-2">
                <Image
                  src="/logodark.svg"
                  alt="PantryPal Logo"
                  width={50}
                  height={50}
                />
                <span className="text-[#D3C5B4] text-6xl font-bold">
                  PantryPal
                </span>
              </div>
            </div>
            <DotPattern
              className={cn(
                "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
              )}
            />
            {!user && (
              <div className="mt-24 flex flex-col gap-5 w-full px-5 font-roger z-50">
                <SignInButton>
                  <Button
                    className="w-full"
                    variant={"outline"}
                    // onClick={createUser}
                  >
                    Sign In
                  </Button>
                </SignInButton>

                <SignUpButton>
                  <Button
                    className={cn("w-full bg-[#6C5549] text-white")}
                    // variant={"outline"}
                    // onClick={createUser}
                  >
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>
        </MaxWidthWrapper>
      </BgNoiseWrapper>
    </>
  );
}
