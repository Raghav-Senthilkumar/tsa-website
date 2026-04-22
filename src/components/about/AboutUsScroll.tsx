import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type AboutSlide = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
};

const base = import.meta.env.BASE_URL;

/** Horizontal Thai flag bands (1:1:2:1:1) — matches site accent colors */
const THAI_FLAG_PROGRESS_BG = [
  "linear-gradient(to right,",
  "#ED1C24 0% 16.666%,",
  "#FFFFFF 16.666% 33.333%,",
  "#241D4F 33.333% 66.666%,",
  "#FFFFFF 66.666% 83.333%,",
  "#ED1C24 83.333% 100%)",
].join(" ");

export default function AboutUsScroll() {
  const slides: AboutSlide[] = useMemo(
    () => [
      {
        title: "Cultural Events",
        description:
          "Placeholder text about cultural celebrations, food nights, and shared traditions that bring people together.",
        imageSrc: `${base}events.jpg`,
        imageAlt: "Students celebrating culture",
      },
      {
        title: "Community",
        description:
          "Placeholder text about meeting new friends, staying connected, and finding your people on campus.",
        imageSrc: `${base}community.jpg`,
        imageAlt: "Community gathering",
      },
      {
        title: "Leadership",
        description:
          "Placeholder text about leading events, building confidence, and creating impact through service.",
        imageSrc: `${base}leadership.jpg`,
        imageAlt: "Leadership and teamwork",
      },
      {
        title: "Support",
        description:
          "Placeholder text about welcoming new members, sharing resources, and supporting students throughout the year.",
        imageSrc: `${base}support.jpg`,
        imageAlt: "Student support",
      },
    ],
    [],
  );

  const rootRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!rootRef.current || !trackRef.current || !progressFillRef.current) return;

    const syncImageLayout = (index: number) => {
      const windowEl =
        rootRef.current?.querySelector<HTMLElement>("[data-about-window]");
      const slideEls = Array.from(
        rootRef.current?.querySelectorAll<HTMLElement>("[data-about-image]") ?? [],
      );
      const imgHeight = windowEl?.offsetHeight ?? 0;
      if (!imgHeight) return;

      slideEls.forEach((el) => {
        el.style.height = `${imgHeight}px`;
      });

      gsap.set(trackRef.current!, { y: -(index * imgHeight) });
    };

    // Ensure first paint doesn't show multiple images.
    syncImageLayout(0);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: reduce)", () => {
      // Still pin to keep layout consistent, but skip animations.
      const st = ScrollTrigger.create({
        trigger: rootRef.current!,
        start: "top top",
        end: `${window.innerHeight * slides.length}px`,
        pin: true,
        pinSpacing: true,
        onRefresh: () => syncImageLayout(activeIndex),
        onUpdate: (self) => {
          const next = Math.min(
            slides.length - 1,
            Math.max(0, Math.floor(self.progress * slides.length)),
          );
          setActiveIndex(next);
          progressFillRef.current!.style.clipPath = `inset(0 ${
            (1 - self.progress) * 100
          }% 0 0)`;

          syncImageLayout(next);
        },
      });
      return () => st.kill();
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const end = () => window.innerHeight * slides.length;
        const st = ScrollTrigger.create({
          id: "about-us-scroll",
          trigger: rootRef.current!,
          start: "top top",
          end: () => `+=${end()}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          onRefreshInit: () => syncImageLayout(activeIndex),
          onRefresh: () => syncImageLayout(activeIndex),
          onUpdate: (self) => {
            const next = Math.min(
              slides.length - 1,
              Math.max(0, Math.floor(self.progress * slides.length)),
            );
            setActiveIndex((prev) => (prev === next ? prev : next));
            progressFillRef.current!.style.clipPath = `inset(0 ${
              (1 - self.progress) * 100
            }% 0 0)`;

            const windowEl =
              rootRef.current!.querySelector<HTMLElement>("[data-about-window]");
            const imgHeight = windowEl?.offsetHeight ?? 0;
            if (!imgHeight) return;

            const slideEls = Array.from(
              rootRef.current!.querySelectorAll<HTMLElement>("[data-about-image]"),
            );
            slideEls.forEach((el) => {
              el.style.height = `${imgHeight}px`;
            });

            gsap.to(trackRef.current!, {
              y: -(next * imgHeight),
              duration: 0.35,
              ease: "power3.out",
              overwrite: true,
            });
          },
        });

        return () => st.kill();
      }, rootRef);

      return () => ctx.revert();
    });

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      mm.revert();
    };
  }, [slides.length]);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-dvh w-full items-center overflow-hidden bg-background"
      aria-label="Our Services"
    >
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-1 flex-col justify-center gap-8 px-6 py-10 sm:py-12 md:flex-row md:items-center md:justify-between md:gap-12 md:px-10 lg:gap-16 lg:py-16">
        {/* LEFT */}
        <div className="flex w-full flex-col items-start justify-center md:w-[44%]">
          <div className="inline-flex items-center rounded-full border border-zinc-300 bg-background px-3 py-1 text-xs font-semibold tracking-wide text-zinc-700">
            About
          </div>
          <div className="mt-4 flex items-center gap-4">
            <h2 className="text-balance text-3xl tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
              Our Services
            </h2>
            <svg
              viewBox="0 0 30 20"
              className="ml-3 h-9 w-14 shrink-0 overflow-hidden rounded-[6px] ring-1 ring-black/10 sm:ml-4 sm:h-10 sm:w-16"
              aria-hidden="true"
              focusable="false"
            >
              <rect x="0" y="0" width="30" height="3" fill="#ED1C24" />
              <rect x="0" y="3" width="30" height="3" fill="#FFFFFF" />
              <rect x="0" y="6" width="30" height="8" fill="#241D4F" />
              <rect x="0" y="14" width="30" height="3" fill="#FFFFFF" />
              <rect x="0" y="17" width="30" height="3" fill="#ED1C24" />
            </svg>
          </div>

          <div className="mt-8 flex w-full flex-col gap-3 sm:mt-10 sm:gap-4">
            {slides.map((s, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={s.title}
                  type="button"
                  className="group flex w-full items-baseline justify-between gap-4 text-left"
                  onClick={() => {
                    // Click jump: scroll to the matching segment.
                    const st = ScrollTrigger.getById("about-us-scroll");
                    if (!st) return;
                    const total = st.end - st.start;
                    const next = st.start + total * (i / slides.length);
                    window.scrollTo({ top: next, behavior: "smooth" });
                  }}
                >
                  <span
                    className={[
                      "text-2xl font-semibold tracking-tight transition-colors sm:text-3xl",
                      isActive ? "text-zinc-900" : "text-zinc-300",
                      "group-hover:text-zinc-700",
                    ].join(" ")}
                  >
                    {s.title}
                  </span>
                  <span
                    className={[
                      "mt-1 text-sm font-semibold tabular-nums transition-colors",
                      isActive ? "text-zinc-900" : "text-zinc-300",
                      "group-hover:text-zinc-600",
                    ].join(" ")}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Horizontal indicator (progress) */}
          <div className="mt-8 w-full sm:mt-10">
            <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-zinc-200">
              <div
                ref={progressFillRef}
                className="pointer-events-none h-full w-full will-change-[clip-path]"
                style={{
                  backgroundImage: THAI_FLAG_PROGRESS_BG,
                  clipPath: "inset(0 100% 0 0)",
                }}
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-semibold text-zinc-500">
              <span>{String(activeIndex + 1).padStart(2, "0")}</span>
              <span className="h-[1px] w-10 bg-zinc-300" />
              <span>{String(slides.length).padStart(2, "0")}</span>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex w-full flex-col items-start justify-center gap-4 sm:gap-6 md:w-[48%]">
          <div className="relative w-full max-w-xl">
            {/* “Better shaped” image window */}
            <div className="relative w-full overflow-hidden rounded-[28px] bg-zinc-100 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.35)] ring-1 ring-black/5">
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-zinc-900/5 blur-2xl"
                aria-hidden="true"
              />

              <div
                className="relative h-[240px] w-full sm:h-[280px] md:h-[300px] lg:h-[340px]"
                data-about-window
              >
                <div
                  ref={trackRef}
                  className="will-change-transform"
                  style={{ transform: "translateY(0px)" }}
                >
                  {slides.map((s) => (
                    <div
                      key={s.title}
                      data-about-image
                      className="w-full"
                    >
                      <img
                        src={s.imageSrc}
                        alt={s.imageAlt}
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-xl">
            <p className="text-pretty text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
              {slides[activeIndex]?.description ?? ""}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

