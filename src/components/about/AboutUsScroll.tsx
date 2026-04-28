import { useLayoutEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const base = import.meta.env.BASE_URL;

type ServiceCard = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  theme: "red" | "navy" | "cream";
};

export default function AboutUsScroll() {
  const cards = useMemo<ServiceCard[]>(
    () => [
      {
        title: "Cultural Events",
        description:
          "Placeholder text about cultural celebrations, food nights, and shared traditions that bring people together.",
        imageSrc: `${base}events.jpg`,
        imageAlt: "Students celebrating culture",
        theme: "red",
      },
      {
        title: "Community",
        description:
          "Placeholder text about meeting new friends, staying connected, and finding your people on campus.",
        imageSrc: `${base}community.jpg`,
        imageAlt: "Community gathering",
        theme: "cream",
      },
      {
        title: "Leadership",
        description:
          "Placeholder text about leading events, building confidence, and creating impact through service.",
        imageSrc: `${base}leadership.jpg`,
        imageAlt: "Leadership and teamwork",
        theme: "navy",
      },
      {
        title: "Support",
        description:
          "Placeholder text about welcoming new members, sharing resources, and supporting students throughout the year.",
        imageSrc: `${base}support.jpg`,
        imageAlt: "Student support",
        theme: "cream",
      },
    ],
    [],
  );

  const rootRef = useRef<HTMLElement | null>(null);
  const cardRefs = useRef<Array<HTMLElement | null>>([]);
  const overlayRefs = useRef<Array<HTMLDivElement | null>>([]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const els = cardRefs.current.filter(Boolean) as HTMLElement[];
      if (els.length < 2) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        els.forEach((el) => gsap.set(el, { clearProps: "transform" }));
        overlayRefs.current.forEach((ov) => ov && gsap.set(ov, { opacity: 0 }));
        return () => {};
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Only enable pinning and scroll effects on desktop (md and above)
        // On mobile, the pinning causes scroll stuttering
        const isDesktop = window.matchMedia("(min-width: 768px)").matches;
        
        if (!isDesktop) {
          // On mobile, just set initial transforms without ScrollTrigger
          els.forEach((eachCard, index) => {
            gsap.set(eachCard, { clearProps: "transform" });
          });
          overlayRefs.current.forEach((ov) => ov && gsap.set(ov, { opacity: 0 }));
          return () => {};
        }

        const triggers: ScrollTrigger[] = [];

        els.forEach((eachCard, index) => {
          if (index >= els.length - 1) return;

          triggers.push(
            ScrollTrigger.create({
              trigger: eachCard,
              start: "top top",
              endTrigger: els[els.length - 1],
              end: "top top",
              pin: true,
              pinSpacing: false,
            }),
          );

          const nextCard = els[index + 1];
          const overlay = overlayRefs.current[index];

          triggers.push(
            ScrollTrigger.create({
              trigger: nextCard,
              start: "top bottom",
              end: "top top",
              onUpdate: (self) => {
                const progress = self.progress;
                gsap.set(eachCard, {
                  scale: 1 - progress * 0.25,
                  rotation: index % 2 === 0 ? progress * 5 : -progress * 5,
                  rotationX: index % 2 === 0 ? progress * 40 : -progress * 40,
                  transformOrigin: "50% 50%",
                });
                if (overlay) gsap.set(overlay, { opacity: progress * 0.35 });
              },
            }),
          );
        });

        return () => triggers.forEach((t) => t.kill());
      });

      const onResize = () => ScrollTrigger.refresh();
      window.addEventListener("resize", onResize);

      return () => {
        window.removeEventListener("resize", onResize);
        mm.revert();
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative w-full bg-background font-manrope"
      aria-label="Our Services"
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10">
        <div className="mb-10">
          <div className="inline-flex w-fit items-center rounded-full border border-zinc-300 bg-background px-3 py-1 text-xs font-semibold tracking-wide text-zinc-700">
            Our Services
          </div>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            Built for culture, community, and impact.
          </h2>
          <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
            Scroll to explore what we do — each section pins, then tilts and scales
            away as the next one arrives.
          </p>
        </div>

        <div className="space-y-0">
          {cards.map((c, index) => {
            const bg =
              c.theme === "red"
                ? "bg-[#9B1B30]"
                : c.theme === "navy"
                  ? "bg-[#241D4F]"
                  : "bg-[#FFFFF0]";
            const fg = c.theme === "cream" ? "text-zinc-900" : "text-[#FFFFF0]";
            const border = c.theme === "cream" ? "border-black/10" : "border-white/15";

            return (
              <section
                key={c.title}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                className={[
                  "relative flex w-full flex-col gap-8 overflow-hidden rounded-[28px] border-b",
                  border,
                  bg,
                  fg,
                  "px-6 py-12 md:flex-row md:items-start md:justify-between md:gap-10 md:px-10 md:py-16",
                ].join(" ")}
                style={{ perspective: 1000, transformStyle: "preserve-3d" }}
              >
                <div
                  ref={(el) => {
                    overlayRefs.current[index] = el;
                  }}
                  className="pointer-events-none absolute inset-0 bg-black opacity-0"
                  aria-hidden="true"
                />

                <div className="shrink-0">
                  <span className="text-5xl font-semibold tracking-tight sm:text-6xl md:text-7xl">
                    ({String(index + 1).padStart(2, "0")})
                  </span>
                </div>

                <div className="flex w-full flex-col items-start md:w-[62%]">
                  <h3 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                    {c.title}
                  </h3>
                  <div className="mt-6 w-full overflow-hidden rounded-2xl p-2">
                    <img
                      src={c.imageSrc}
                      alt={c.imageAlt}
                      className="h-[220px] w-full rounded-xl object-cover sm:h-[280px] md:h-[320px]"
                      loading="lazy"
                      draggable={false}
                    />
                  </div>
                  <p
                    className={[
                      "mt-5 pt-2 max-w-prose text-sm leading-6 sm:text-base sm:leading-7",
                      c.theme === "cream" ? "text-zinc-700" : "text-white/85",
                    ].join(" ")}
                  >
                    {c.description}
                  </p>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

