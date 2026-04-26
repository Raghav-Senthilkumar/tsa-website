import * as React from "react";
import {
  AnimatePresence,
  animate,
  motion,
  type PanInfo,
  useDragControls,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

type EventMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string };

export type EventItem = {
  id: string | number;
  title: string;
  date: string;
  venue: string;
  status?: string;
  media: EventMedia;
};

function wrap(min: number, max: number, v: number) {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
}

const ITEMS: EventItem[] = [
  {
    id: "squid",
    title: "Squid Game",
    date: "APR 21",
    venue: "Activation",
    status: "netflix",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
      alt: "Squid Game event",
    },
  },
  {
    id: "neon",
    title: "Neon Lights",
    date: "MAY 03",
    venue: "Downtown",
    status: "sold out",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80",
      alt: "Neon Lights event",
    },
  },
  {
    id: "cyber",
    title: "Cyber Punk",
    date: "JUN 14",
    venue: "Warehouse",
    status: "check tickets",
    media: {
      type: "image",
      src: "https://images.unsplash.com/photo-1520975682071-a8e6a4b5b1b6?auto=format&fit=crop&w=1200&q=80",
      alt: "Cyber Punk event",
    },
  },
];

function EventMediaView({
  media,
  title,
  isCenter,
}: {
  media: EventMedia;
  title: string;
  isCenter: boolean;
}) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  React.useEffect(() => {
    if (media.type !== "video") return;
    const el = videoRef.current;
    if (!el) return;

    if (isCenter) {
      // Best-effort; browsers may still block autoplay if not muted.
      void el.play().catch(() => undefined);
    } else {
      el.pause();
      // Reset so it doesn't keep advancing while off-center.
      try {
        el.currentTime = 0;
      } catch {
        // ignore
      }
    }
  }, [isCenter, media.type]);

  if (media.type === "video") {
    return (
      <video
        ref={videoRef}
        className="h-full w-full object-cover"
        src={media.src}
        poster={media.poster}
        muted
        loop
        playsInline
        preload="metadata"
        draggable={false}
        aria-label={title}
      />
    );
  }

  return (
    <img
      src={media.src}
      alt={media.alt ?? title}
      className="h-full w-full object-cover"
      draggable={false}
      loading="lazy"
    />
  );
}

export default function UpcomingEvents() {
  const items = ITEMS;
  const [active, setActive] = React.useState(0);
  const [slideDir, setSlideDir] = React.useState<1 | -1>(1);
  const count = items.length;
  const activeIndex = wrap(0, count, active);
  const dragControls = useDragControls();

  // Semi-circle geometry (tuned to match "arc tilt" feel)
  const geom = React.useMemo(
    () => ({
      xStep: 98, // horizontal spacing between cards in the fan
      yStep: 14, // slight vertical drop as cards move away from center
      rotateStep: 9, // degrees per offset for the fanned look
      scaleDrop: 0.05,
    }),
    [],
  );

  // Drag maps into a continuous "center index" progress (not x translation).
  const progress = useMotionValue(active);
  const startActiveRef = React.useRef(active);
  const springRef = React.useRef<ReturnType<typeof animate> | null>(null);

  React.useEffect(() => {
    // keep motion value aligned when active changes programmatically
    progress.set(active);
  }, [active, progress]);

  const onDragStart = () => {
    springRef.current?.stop();
    startActiveRef.current = active;
    progress.set(active);
  };

  const onDrag = (_: unknown, info: PanInfo) => {
    // small pixel distance produces arc movement (not large lateral motion)
    const pxPerIndex = 360; // larger = less travel per px (tighter feel)
    const raw = startActiveRef.current + -info.offset.x / pxPerIndex;
    // show only a small "preview" of the next/prev card while holding
    const previewRange = 0.35;
    const clamped = Math.max(
      startActiveRef.current - previewRange,
      Math.min(startActiveRef.current + previewRange, raw),
    );
    progress.set(clamped);
  };

  const onDragEnd = (_: unknown, { offset, velocity }: PanInfo) => {
    const swipe = Math.abs(offset.x) * velocity.x;
    const threshold = 10000;
    const dir = swipe < -threshold ? 1 : swipe > threshold ? -1 : 0;
    const next = active + dir;

    // snap progress with spring and only update active on snap choice
    if (dir !== 0) setSlideDir(dir);
    setActive(next);
    springRef.current?.stop();
    springRef.current = animate(progress, next, {
      type: "spring",
      stiffness: 260,
      damping: 18,
      mass: 0.85,
    });
  };

  return (
    <section id="events" aria-label="Upcoming events">
      <div className="relative w-full overflow-hidden bg-[#303030]">
        <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col items-center px-6 py-14 sm:px-10 sm:py-16">
          <header className="w-full text-center">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-white/80">
              Events
            </div>
            <h2 className="mt-4 font-manrope text-4xl font-extrabold uppercase tracking-tighter text-white sm:text-5xl">
              Upcoming Events
            </h2>
          </header>

          {/* CARDS STACK */}
          <motion.div
            className="relative z-10 mt-12 flex h-[410px] w-full items-center justify-center select-none sm:h-[490px] md:h-[660px]"
            aria-label="Upcoming events carousel"
            drag="x"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0}
            dragMomentum={false}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onDragEnd={onDragEnd}
            style={{ touchAction: "pan-y" }}
          >
            {/* Decorative shape anchored to this draggable area */}
            <svg
              className="pointer-events-none absolute bottom-0 left-0 z-0 -translate-x-32 translate-y-32 opacity-80 scale-90 h-[250px] w-[250px] sm:scale-100 sm:-translate-x-28 sm:translate-y-40 sm:h-[520px] sm:w-[520px] md:h-[640px] md:w-[640px] lg:h-[700px] lg:w-[700px]"
              viewBox="0 0 450 460"
              fill="none"
              aria-hidden="true"
              focusable="false"
            >
              <path
                d="M404.776 223.259C398.804 258.396 403.743 292.836 415.688 327.792C416.361 329.723 417.484 333.136 416.339 334.169L416.226 334.281C415.328 335.201 413.218 335.089 410.681 334.595C400.847 332.777 391.912 330.554 382.078 329.229C352.936 326.647 323.413 330.778 296.718 343.531C273.728 353.858 258.259 366.813 243.576 387.131C226.872 406.103 219.576 425.029 217.667 450.376C217.151 459.469 213.02 460.143 208.889 451.454C200.537 434.503 193.532 416.273 182.172 401.141C171.013 386.974 159.047 372.717 144.813 361.784C136.977 355.991 129.726 349.391 121.419 344.249C117.153 341.578 112.281 340.006 107.97 337.536C92.9953 327.186 75.6629 320.922 58.2856 315.848C41.0655 310.146 23.1044 307.003 4.96379 305.723C1.32668 305.633 -1.74915 305.341 1.14707 301.39C3.84122 297.977 6.58028 294.744 8.98257 291.085C15.3812 281.52 21.3757 271.462 23.8902 259.967C25.372 252.513 27.7743 245.172 28.0662 237.561C27.9315 219.734 23.3963 201.459 12.8442 186.911C5.86184 177.414 9.29689 175.258 20.1184 175.438C38.9326 175.438 57.163 170.589 74.9893 164.796C92.5014 159.565 110.687 155.232 125.595 144.163C143.286 132.174 160.439 118.928 173.977 102.314C177.21 98.3179 179.253 93.5134 182.082 89.2476C186.819 82.7367 192.32 76.6973 195.553 69.1986C199.998 59.9487 202.221 49.5313 204.825 39.6078C206.509 32.6928 208.462 25.7778 209.226 18.6832C210.326 14.4624 207.542 -0.71468 212.257 0.0262124C214.928 0.609946 218.341 6.08806 220.384 9.05163C225.256 16.1687 230.24 23.2408 234.753 30.6049C240.321 40.3263 249.279 47.1515 257.496 54.3583C262.278 58.5792 266.409 63.8328 271.618 67.7168C276.759 71.6233 282.551 74.4747 288.164 77.6179C305.384 88.5965 324.715 94.6808 343.821 101.506C351.387 104.425 359.312 106.198 367.328 107.276C391.103 110.531 414.812 115.695 438.835 115.65C444.313 115.807 453.72 114.64 446.199 123.261C422.288 153.099 411.018 187.113 404.754 223.237L404.776 223.259Z"
                fill="#9B1B30"
              />
            </svg>

            {/* Decorative scribble (top-right) */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 80 109"
              fill="none"
              aria-hidden="true"
              focusable="false"
              className="pointer-events-none absolute right-0 top-0 z-50 translate-x-10 -translate-y-10 rotate-90 text-white h-[82px] w-[104px] sm:translate-x-12 sm:-translate-y-12 sm:h-[116px] sm:w-[148px] md:translate-x-14 md:-translate-y-14 md:h-[148px] md:w-[188px] lg:translate-x-16 lg:-translate-y-16 lg:h-[176px] lg:w-[224px]"
            >
              <path
                d="M11.1056 107.429C11.1056 107.429 41.3921 75.9563 1.85536 45.3846C39.6893 67.1983 37.5729 21.5813 34.6647 13.925C40.0573 22.0799 72.2872 32.0642 78.2717 2.44878"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

          {[-2, -1, 0, 1, 2].map((offset) => {
            const index = wrap(0, count, active + offset);
            const item = items[index];
            const isCenter = offset === 0;

            // rel = (card virtual index) - progress
            const rel = useTransform(progress, (p) => active + offset - p);
            const abs = useTransform(rel, (r) => Math.abs(r));

            const x = useTransform(rel, (r) => r * geom.xStep);
            const y = useTransform(rel, (r) => Math.abs(r) * geom.yStep);
            const rotateZ = useTransform(rel, (r) => {
              const absR = Math.abs(r);
              // Smoothly reduce rotation on the outer-most cards (±2) so we
              // don't introduce a hard threshold that can jitter while dragging.
              const start = 1.6;
              const end = 2.2;
              const tRaw = (absR - start) / (end - start);
              const t = Math.max(0, Math.min(1, tRaw));
              const ease = t * t * (3 - 2 * t); // smoothstep
              const outerTighten = 1 - ease * 0.15; // 1 -> 0.85
              return r * geom.rotateStep * outerTighten;
            });
            const scale = useTransform(
              abs,
              (a) => Math.max(0.86, 1 - a * geom.scaleDrop),
            );
            const zIndex = useTransform(abs, (a) => Math.round(50 - a * 10));

            return (
              <motion.div
                key={`${item.id}-${offset}`}
                className={cn(
                  "absolute z-10 h-[350px] w-[210px] cursor-grab overflow-hidden rounded-[1.25rem] bg-neutral-900 shadow-2xl ring-[3px] ring-background active:cursor-grabbing sm:h-[420px] sm:w-[270px] sm:ring-[5px] md:h-[580px] md:w-[380px] md:ring-[6px]",
                  isCenter ? "z-20" : "z-10",
                )}
                onPointerDown={(e) => dragControls.start(e)}
                style={{
                  x,
                  y,
                  rotateZ,
                  scale,
                  opacity: 1,
                  zIndex,
                }}
                transition={{ type: "spring", stiffness: 280, damping: 18, mass: 0.9 }}
              >
                <EventMediaView media={item.media} title={item.title} isCenter={isCenter} />
              </motion.div>
            );
          })}
          </motion.div>

          {/* FOOTER TITLE */}
          <div className="relative z-[80] mt-10 pb-2 text-center pointer-events-none sm:mt-12">
            <AnimatePresence mode="wait">
              <motion.h3
                key={activeIndex}
                initial={{
                  x: slideDir === 1 ? 60 : -60,
                  y: 22,
                  rotate: slideDir === 1 ? 12 : -12,
                  opacity: 0,
                }}
                animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                exit={{
                  x: slideDir === 1 ? -60 : 60,
                  y: 22,
                  rotate: slideDir === 1 ? -12 : 12,
                  opacity: 0,
                }}
                transition={{ type: "spring", stiffness: 420, damping: 22, mass: 0.8 }}
                className="font-manrope text-3xl font-extrabold uppercase tracking-tighter text-white sm:text-4xl"
              >
                {items[activeIndex].title}
              </motion.h3>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${activeIndex}`}
                initial={{ x: slideDir === 1 ? 18 : -18, y: 8, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                exit={{ x: slideDir === 1 ? -18 : 18, y: -8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 26, mass: 0.65 }}
                className="mt-2 font-epilogue text-sm font-medium text-white/70 sm:text-base"
              >
                {items[activeIndex].date} • {items[activeIndex].venue}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

