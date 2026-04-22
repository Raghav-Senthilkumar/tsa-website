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

export type EventItem = {
  id: string | number;
  title: string;
  date: string;
  venue: string;
  status?: string;
  imageSrc: string;
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
    imageSrc:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "neon",
    title: "Neon Lights",
    date: "MAY 03",
    venue: "Downtown",
    status: "sold out",
    imageSrc:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "cyber",
    title: "Cyber Punk",
    date: "JUN 14",
    venue: "Warehouse",
    status: "check tickets",
    imageSrc:
      "https://images.unsplash.com/photo-1520975682071-a8e6a4b5b1b6?auto=format&fit=crop&w=1200&q=80",
  },
];

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
      xStep: 104, // horizontal spacing between cards in the fan
      yStep: 16, // slight vertical drop as cards move away from center
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
      <div className="relative w-full overflow-hidden bg-black">
        <div className="relative mx-auto flex min-h-[120vh] w-full max-w-6xl flex-col items-center px-6 py-14 sm:px-10 sm:py-16">
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
            className="relative mt-12 flex h-[440px] w-full items-center justify-center select-none sm:h-[520px] md:h-[700px]"
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
                  "absolute h-[380px] w-[230px] cursor-grab overflow-hidden rounded-[1.25rem] bg-neutral-900 shadow-2xl ring-[6px] ring-background active:cursor-grabbing sm:h-[460px] sm:w-[290px] md:h-[620px] md:w-[400px]",
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
                <img
                  src={item.imageSrc}
                  alt=""
                  className="h-full w-full object-cover"
                  draggable={false}
                />
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

