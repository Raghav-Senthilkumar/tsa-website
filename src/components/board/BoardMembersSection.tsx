import InertiaElement from "@/components/motion/InertiaElement";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const base = import.meta.env.BASE_URL;

const CARDS = [
  { src: `${base}leadership.jpg`, rotate: "-8deg", tag: "leadership", tagColor: "#fbc6ff" },
  { src: `${base}community.jpg`, rotate: "4deg", tag: "community first", tagColor: "#e6fab9" },
  { src: `${base}events.jpg`, rotate: "-3deg", tag: "culture nights", tagColor: "#82a0ff" },
  { src: `${base}support.jpg`, rotate: "6deg", tag: "support", tagColor: "#e6fab9" },
  { src: `${base}events.jpg`, rotate: "-6deg", tag: "fundraisers", tagColor: "#fbc6ff" },
  { src: `${base}community.jpg`, rotate: "2deg", tag: "connections", tagColor: "#82a0ff" },
];

function HoverInertiaCard({
  src,
  rotate,
  tag,
  tagColor,
}: (typeof CARDS)[number]) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!cardRef.current || !innerRef.current) return;

    const card = cardRef.current;
    const inner = innerRef.current;

    const xTo = gsap.quickTo(inner, "x", { duration: 0.9, ease: "power3.out" });
    const yTo = gsap.quickTo(inner, "y", { duration: 0.9, ease: "power3.out" });
    const rTo = gsap.quickTo(inner, "rotation", {
      duration: 1.1,
      ease: "power3.out",
    });
    const sxTo = gsap.quickTo(inner, "scaleX", { duration: 0.6, ease: "power3.out" });
    const syTo = gsap.quickTo(inner, "scaleY", { duration: 0.6, ease: "power3.out" });

    const onMove = (e: PointerEvent) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(px * 24);
      yTo(py * 24);
      rTo(px * 5);
    };

    const onDown = (e: PointerEvent) => {
      // Mobile/touch has no hover — give a small inertial "kick" on press.
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      xTo(px * 20);
      yTo(py * 20);
      rTo(px * 4);
      sxTo(1.03);
      syTo(1.03);
    };

    const onUp = () => {
      sxTo(1);
      syTo(1);
      xTo(0);
      yTo(0);
      rTo(0);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
      rTo(0);
      sxTo(1);
      syTo(1);
    };

    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerdown", onDown);
    card.addEventListener("pointerup", onUp);
    card.addEventListener("pointercancel", onUp);
    card.addEventListener("pointerleave", onLeave);

    return () => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerdown", onDown);
      card.removeEventListener("pointerup", onUp);
      card.removeEventListener("pointercancel", onUp);
      card.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative w-full touch-none select-none overflow-visible"
      style={{ transform: `rotate(${rotate})` }}
    >
      <div
        ref={innerRef}
        className="relative will-change-transform"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        <div className="relative overflow-hidden rounded-3xl bg-zinc-200 shadow-[0_18px_60px_-35px_rgba(0,0,0,0.55)] ring-1 ring-black/5 transition-all duration-300 ease-out group-hover:scale-[1.05] group-hover:shadow-[0_26px_80px_-40px_rgba(0,0,0,0.65)]">
          <img
            src={src}
            alt=""
            draggable={false}
            className="h-[clamp(190px,24vh,280px)] w-full object-cover"
          />
        </div>

        <div
          className="absolute -top-4 left-6 inline-flex items-center rounded-[50px] px-4 py-2 text-sm font-extrabold tracking-tight text-zinc-900 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.55)] ring-1 ring-black/10"
          style={{ backgroundColor: tagColor }}
        >
          {tag}
        </div>
      </div>
    </div>
  );
}

export default function BoardMembersSection() {
  return (
    <section
      id="board"
      aria-label="Our board members"
      className="relative w-full overflow-hidden bg-background py-12 sm:py-14 md:flex md:min-h-screen md:items-center"
    >
      {/* blurred blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <svg
          className="absolute -left-32 top-16 h-[520px] w-[520px] opacity-35 blur-[50px] sm:h-[680px] sm:w-[680px]"
          viewBox="0 0 600 600"
          fill="none"
        >
          <path
            d="M458 126c68 59 106 155 89 242-18 87-92 164-180 186-88 23-189-8-241-79-53-71-58-182-7-261 51-80 176-147 339-88Z"
            fill="#ED1C24"
          />
        </svg>
        <svg
          className="absolute -right-40 top-44 h-[560px] w-[560px] opacity-30 blur-[50px] sm:h-[720px] sm:w-[720px]"
          viewBox="0 0 600 600"
          fill="none"
        >
          <path
            d="M504 238c32 93-8 216-96 287-87 71-222 90-313 34-91-55-138-184-91-281 47-97 188-162 309-139 121 23 159 6 191 99Z"
            fill="#241D4F"
          />
        </svg>
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-6 md:px-10">
        <div className="inline-flex w-fit shrink-0 items-center self-start rounded-full border border-zinc-300 bg-background px-2.5 py-0.5 text-xs font-semibold leading-none tracking-wide text-zinc-700">
          Board
        </div>

        <div className="mt-4 flex flex-col items-start gap-10 md:flex-row md:items-end md:justify-between">
          <h2
            className="max-w-xl text-pretty text-5xl leading-[0.92] tracking-[-0.06em] text-zinc-900 sm:text-6xl md:text-7xl"
            style={{ textTransform: "lowercase" }}
          >
            our board members
          </h2>

          <p className="max-w-md text-pretty text-sm font-semibold leading-6 text-zinc-600 sm:text-base sm:leading-7">
            A scattered “work-style” grid with inertia scroll. We’ll swap these
            placeholders for real board photos + roles next.
          </p>
        </div>

        <div className="relative mt-10 grid grid-cols-2 justify-items-center gap-[34px] sm:grid-cols-3 md:mt-12 lg:grid-cols-3">
          {CARDS.map((c) => (
            <InertiaElement
              key={c.tag}
              speed={0.9}
              direction="down"
              className="w-full max-w-[min(380px,44vw)] sm:max-w-[min(380px,28vw)]"
            >
              <HoverInertiaCard {...c} />
            </InertiaElement>
          ))}
        </div>
      </div>
    </section>
  );
}

