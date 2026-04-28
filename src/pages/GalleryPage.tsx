import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGalleryTransition } from "@/components/transitions/GalleryTransitionProvider";

const base = import.meta.env.BASE_URL;

const IMAGES = [
  `${base}thai.jpeg`,
  `${base}thai_2.jpeg`,
  `${base}events.jpg`,
  `${base}community.jpg`,
  `${base}leadership.jpg`,
  `${base}support.jpg`,
  `${base}video/water_festival_poster.jpg`,
  `${base}video/krathong_poster.jpg`,
  `${base}video/trivia_poster.jpg`,
] as const;

export default function GalleryPage() {
  const { transitionTo } = useGalleryTransition();
  return (
    <main className="relative w-full">
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 w-full">
        <div className="pointer-events-auto w-full bg-[#141414]/70 pt-[env(safe-area-inset-top)] backdrop-blur-md">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-3 py-3 sm:px-6 sm:py-4">
          <Button
            size="sm"
            variant="secondary"
            render={
              <button
                type="button"
                aria-label="Go back to home page"
                onClick={() => transitionTo("/")}
              />
            }
            className="rounded-full bg-white/90 text-zinc-900 hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Button>

          <div className="hidden rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/85 ring-1 ring-white/20 sm:inline-flex">
            Gallery
          </div>
          </div>
        </div>
      </header>

      <section className="min-h-dvh w-full bg-[#141414] px-3 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-[calc(5rem+env(safe-area-inset-top))] sm:px-6 sm:pt-[calc(6rem+env(safe-area-inset-top))]">
        <div className="mx-auto w-full max-w-7xl">
          <div className="columns-1 gap-3 space-y-3 sm:columns-2 sm:gap-5 sm:space-y-5 lg:columns-3">
            {IMAGES.map((src) => (
              <div
                key={src}
                className="break-inside-avoid overflow-hidden rounded-xl bg-white/5 ring-1 ring-white/10 sm:rounded-2xl"
              >
                <img
                  src={src}
                  alt=""
                  className="h-auto w-full object-cover"
                  draggable={false}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

