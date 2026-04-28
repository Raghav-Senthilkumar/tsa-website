import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ImageReveal from "@/components/ui/image-tiles";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { useGalleryTransition } from "@/components/transitions/GalleryTransitionProvider";

const base = import.meta.env.BASE_URL;

const CARDS = [
  { src: `${base}Alison.jpg`, rotate: "-8deg", tag: "alison", tagColor: "#A51931" },
  { src: `${base}Ei.jpg`, rotate: "4deg", tag: "ei", tagColor: "#F4F5F8" },
  { src: `${base}Linh.jpg`, rotate: "-3deg", tag: "linh", tagColor: "#2D2A4A" },
  { src: `${base}Ismail.jpg`, rotate: "6deg", tag: "ismail", tagColor: "#A51931" },
  { src: `${base}Eric.jpg`, rotate: "-6deg", tag: "eric", tagColor: "#F4F5F8" },
  { src: `${base}Christina.jpg`, rotate: "2deg", tag: "christina", tagColor: "#2D2A4A" },
  { src: `${base}Crystal.jpg`, rotate: "-2deg", tag: "crystal", tagColor: "#A51931" },
  { src: `${base}Gokul.jpg`, rotate: "5deg", tag: "gokul", tagColor: "#F4F5F8" },
  { src: `${base}Dara.jpg`, rotate: "-5deg", tag: "dara", tagColor: "#2D2A4A" },
  { src: `${base}Xander.jpg`, rotate: "3deg", tag: "xander", tagColor: "#A51931" },
  { src: `${base}Vincent.jpg`, rotate: "-7deg", tag: "vincent", tagColor: "#F4F5F8" },
  { src: `${base}Ije.jpg`, rotate: "7deg", tag: "ije", tagColor: "#2D2A4A" },
  { src: `${base}Pat.jpg`, rotate: "-4deg", tag: "pat", tagColor: "#A51931" },
  { src: `${base}Im.jpg`, rotate: "1deg", tag: "im", tagColor: "#F4F5F8" },
];

const GALLERY_IMAGES = {
  left: `${base}thai.jpeg`,
  middle: `${base}events.jpg`,
  right: `${base}thai_2.jpeg`,
} as const;

const GALLERY_BG = `${import.meta.env.BASE_URL}gallery-bg.png`;

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
    // Tailwind `md` — pointer inertia fights vertical scroll on small viewports.
    const mq = window.matchMedia("(min-width: 768px)");

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

    const reset = () => {
      gsap.set(inner, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 });
    };

    const detach = () => {
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerdown", onDown);
      card.removeEventListener("pointerup", onUp);
      card.removeEventListener("pointercancel", onUp);
      card.removeEventListener("pointerleave", onLeave);
    };

    const attach = () => {
      detach();
      if (!mq.matches) {
        reset();
        return;
      }
      card.addEventListener("pointermove", onMove);
      card.addEventListener("pointerdown", onDown);
      card.addEventListener("pointerup", onUp);
      card.addEventListener("pointercancel", onUp);
      card.addEventListener("pointerleave", onLeave);
    };

    attach();
    mq.addEventListener("change", attach);

    return () => {
      mq.removeEventListener("change", attach);
      detach();
      reset();
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative w-full touch-auto select-none overflow-visible"
      style={{ transform: `rotate(${rotate})` }}
    >
      <div
        ref={innerRef}
        className="relative will-change-transform"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-zinc-200 shadow-[0_16px_48px_-32px_rgba(0,0,0,0.55)] ring-1 ring-black/5 transition-all duration-300 ease-out group-hover:scale-[1.04] group-hover:shadow-[0_24px_64px_-38px_rgba(0,0,0,0.65)]">
          <img
            src={src}
            alt=""
            draggable={false}
            className="h-full w-full object-cover"
          />
        </div>

        <div
          style={{ backgroundColor: tagColor }}
          className={`absolute -top-3 left-4 inline-flex items-center rounded-[999px] px-3 py-1.5 text-xs font-extrabold tracking-tight shadow-[0_12px_40px_-24px_rgba(0,0,0,0.55)] ring-1 ring-black/10 sm:-top-4 sm:left-6 sm:px-4 sm:py-2 sm:text-sm ${
            (tagColor === "#2D2A4A" || tagColor === "#A51931") ? "text-white" : "text-zinc-900"
          }`}
        >
          {tag}
        </div>
      </div>
    </div>
  );
}

export default function BoardMembersSection() {
  const { transitionTo } = useGalleryTransition();
  return (
    <section
      id="board"
      aria-label="Our board members"
      className="relative w-full overflow-hidden bg-background py-16 sm:py-20 md:flex md:min-h-[115vh] md:items-center"
    >
      {/* blurred blobs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <svg
          className="absolute -left-52 top-8 h-[clamp(360px,62vw,680px)] w-[clamp(360px,62vw,680px)] opacity-30 blur-[50px] sm:-left-60 sm:top-10 sm:opacity-35 md:-left-72 md:top-12"
          viewBox="0 0 600 600"
          fill="none"
        >
          <path
            d="M458 126c68 59 106 155 89 242-18 87-92 164-180 186-88 23-189-8-241-79-53-71-58-182-7-261 51-80 176-147 339-88Z"
            fill="#ED1C24"
          />
        </svg>
        <svg
          className="absolute -right-56 top-40 h-[clamp(380px,66vw,720px)] w-[clamp(380px,66vw,720px)] opacity-25 blur-[50px] sm:-right-64 sm:top-44 sm:opacity-30 md:-right-72 md:top-52"
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

        <div className="relative mt-10 grid grid-cols-2 justify-items-center gap-2.5 pb-10 sm:grid-cols-3 sm:gap-4 sm:pb-12 md:mt-12 md:grid-cols-4 md:pb-14">
          {CARDS.map((c) => (
            <div
              key={c.tag}
              className="w-full max-w-[150px] sm:max-w-[180px] md:max-w-[200px]"
            >
              <HoverInertiaCard {...c} />
            </div>
          ))}
        </div>

        <div className="group relative mx-auto mt-44 flex w-full max-w-2xl flex-col items-center pt-10 text-center sm:mt-56 sm:pt-12">
          <img
            src={GALLERY_BG}
            alt=""
            aria-hidden="true"
            className="animate-tsa-float pointer-events-none absolute -left-6 -top-10 z-0 h-[clamp(138px,22vw,220px)] w-auto -rotate-[14deg] select-none transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:-rotate-[10deg] sm:-left-12 sm:-top-14 md:-left-20 md:-top-20"
            draggable={false}
          />
          <img
            src={GALLERY_BG}
            alt=""
            aria-hidden="true"
            className="animate-tsa-float-soft pointer-events-none absolute -right-7 -top-8 z-0 h-[clamp(129px,21vw,210px)] w-auto rotate-[20deg] select-none transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-[16deg] sm:-right-10 sm:-top-10 md:-right-16 md:-top-14"
            draggable={false}
          />
          <div className="relative z-10 flex w-full flex-col items-center">
            <div className="inline-flex items-center rounded-full border border-zinc-300 bg-background px-3 py-1 text-xs font-semibold tracking-wide text-zinc-700">
              Gallery
            </div>
            <h2 className="mt-2 text-pretty text-4xl leading-[1] tracking-[-0.04em] text-zinc-900 sm:text-5xl md:text-6xl">
              community moments
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-pretty text-sm font-semibold leading-6 text-zinc-600 sm:text-base sm:leading-7">
              A quick peek at events, culture nights, and the people who make TSA
              special.
            </p>
            <div className="mt-0 flex justify-center">
              <Button
                size="sm"
                className="group not-disabled:inset-shadow-none mx-auto flex cursor-pointer items-center justify-center gap-0 rounded-full border-none bg-transparent px-0 py-2 text-sm font-normal shadow-none hover:bg-transparent [:hover,[data-pressed]]:bg-transparent"
                render={
                  <button
                    type="button"
                    aria-label="View the gallery"
                    onClick={() => transitionTo("/gallery")}
                  />
                }
              >
                <span className="rounded-full bg-white px-4 py-1.5 font-bold text-[#9B1B30] duration-500 ease-in-out group-hover:bg-[#7A1028] group-hover:text-[#FFFFF0] group-hover:transition-colors">
                  View gallery
                </span>
                <div className="relative flex h-fit cursor-pointer items-center overflow-hidden rounded-full bg-white p-2.5 font-bold text-[#9B1B30] duration-500 ease-in-out group-hover:bg-[#7A1028] group-hover:text-[#FFFFF0] group-hover:transition-colors">
                  <ArrowUpRight className="absolute h-4 w-4 -translate-x-1/2 transition-all duration-500 ease-in-out group-hover:translate-x-10" />
                  <ArrowUpRight className="absolute h-4 w-4 -translate-x-10 transition-all duration-500 ease-in-out group-hover:-translate-x-1/2" />
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-center sm:mt-4">
          <ImageReveal
            leftImage={GALLERY_IMAGES.left}
            middleImage={GALLERY_IMAGES.middle}
            rightImage={GALLERY_IMAGES.right}
          />
        </div>
      </div>
    </section>
  );
}

