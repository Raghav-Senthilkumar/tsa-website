import { ArrowUpRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

/** Local asset from `/public/thai.jpeg` (served at site root) */
const HERO_IMAGE = `${import.meta.env.BASE_URL}thai.jpeg`;
const LOGO = `${import.meta.env.BASE_URL}logo.jpg`;

/** Thai flag–inspired accents: gold ring on avatars */
const THAI_GOLD = "#E8C547";

const AVATAR_IMAGES = [
  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=128&h=128&q=80",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=128&h=128&q=80",
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=128&h=128&q=80",
  "https://images.unsplash.com/photo-1511632765486-a26380d490e2?auto=format&fit=crop&w=128&h=128&q=80",
] as const;

export default function AeroHero2() {
  return (
    <section className="relative flex min-h-dvh w-full items-end justify-center">
      <div
        className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_IMAGE})` }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/45" />
      </div>

      <div className="absolute left-0 top-0 z-20 p-8">
        <img
          src={LOGO}
          alt="Thai Student Association"
          className="h-11 w-auto select-none object-contain"
          draggable={false}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl px-6 pb-20 text-center text-[#FFFFF0] md:px-0">
        <div className="flex flex-col items-stretch justify-between gap-10 text-left lg:flex-row lg:items-end">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-5xl tracking-tight text-[#FFFFF0] md:text-7xl">
              Thai Student Association
            </h1>

            <p className="max-w-2xl text-lg font-bold leading-relaxed text-[#FFFFF0]/95 md:text-xl">
              Connecting Thai Students, Celebrating Culture, Building Community
            </p>
          </div>
          <div className="mt-auto space-y-7">
            <div className="mt-8 flex flex-wrap items-center gap-3 lg:mt-auto">
              <div className="flex -space-x-3">
                {AVATAR_IMAGES.map((src, i) => (
                  <Avatar
                    key={src}
                    className="size-12 border-2 transition-all duration-300 hover:grayscale-0"
                    style={{
                      borderColor: THAI_GOLD,
                    }}
                  >
                    <AvatarImage src={src} alt="" />
                    <AvatarFallback className="font-bold text-[#1C2B5A]">
                      {i + 1}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="flex flex-col text-sm font-bold text-[#FFFFF0]">
                <span className="text-base sm:text-lg">Community</span>
                <span className="opacity-90">Events &amp; culture</span>
              </div>
            </div>
            <div className="flex w-fit gap-6">
              <Button
                className="group not-disabled:inset-shadow-none mx-auto flex cursor-pointer items-center justify-center gap-0 rounded-full border-none bg-transparent px-0 py-3 text-sm font-normal shadow-none hover:bg-transparent sm:py-4 sm:text-base [:hover,[data-pressed]]:bg-transparent"
                render={<a href="#about" aria-label="Learn more about TSA" />}
              >
                <span className="rounded-full bg-white px-6 py-3 font-bold text-[#9B1B30] duration-500 ease-in-out group-hover:bg-[#7A1028] group-hover:text-[#FFFFF0] group-hover:transition-colors">
                  Learn More
                </span>
                <div className="relative flex h-fit cursor-pointer items-center overflow-hidden rounded-full bg-white p-3 font-bold text-[#9B1B30] duration-500 ease-in-out group-hover:bg-[#7A1028] group-hover:text-[#FFFFF0] group-hover:transition-colors sm:p-4">
                  <ArrowUpRight className="absolute h-4 w-4 -translate-x-1/2 transition-all duration-500 ease-in-out group-hover:translate-x-10 sm:h-5 sm:w-5" />
                  <ArrowUpRight className="absolute h-4 w-4 -translate-x-10 transition-all duration-500 ease-in-out group-hover:-translate-x-1/2 sm:h-5 sm:w-5" />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
