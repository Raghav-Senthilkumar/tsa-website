import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";

type GalleryTransitionContextValue = {
  transitionTo: (to: string) => void;
};

const GalleryTransitionContext = createContext<GalleryTransitionContextValue | null>(
  null,
);

function isExternalLink(to: string) {
  return /^https?:\/\//i.test(to) || /^mailto:/i.test(to) || /^tel:/i.test(to);
}

function GalleryTransitionOverlay({
  overlayRef,
  pathRef,
}: {
  overlayRef: React.RefObject<HTMLDivElement | null>;
  pathRef: React.RefObject<SVGPathElement | null>;
}) {
  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-[999] flex items-center justify-center opacity-0"
      aria-hidden="true"
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1316 664"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-full scale-[1.3]"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          ref={pathRef}
          d="M13.4746 291.27C13.4746 291.27 100.646 -18.6724 255.617 16.8418C410.588 52.356 61.0296 431.197 233.017 546.326C431.659 679.299 444.494 21.0125 652.73 100.784C860.967 180.556 468.663 430.709 617.216 546.326C765.769 661.944 819.097 48.2722 988.501 120.156C1174.21 198.957 809.424 543.841 988.501 636.726C1189.37 740.915 1301.67 149.213 1301.67 149.213"
          stroke="#9B1B30"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function GalleryTransitionProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const busyRef = useRef(false);
  const lastNavTargetRef = useRef<string | null>(null);
  const pathLenRef = useRef<number>(0);
  const initialLoadDoneRef = useRef(false);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    pathLenRef.current = len;
    gsap.set(path, {
      strokeDasharray: len,
      strokeDashoffset: len,
      strokeWidth: 2,
    });
    gsap.set(overlayRef.current, { opacity: 0 });
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    const path = pathRef.current;
    if (!overlay || !path) return;
    if (initialLoadDoneRef.current) return;

    const len = pathLenRef.current || path.getTotalLength();

    // Show overlay immediately on first paint (prevents "cut-in").
    gsap.set(overlay, { opacity: 1 });
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: 0, strokeWidth: 300 });
    busyRef.current = true;

    const waitForLoad = async () => {
      // Wait for full load (includes images, stylesheets, etc.)
      if (document.readyState !== "complete") {
        await new Promise<void>((resolve) => {
          const onLoad = () => {
            window.removeEventListener("load", onLoad);
            resolve();
          };
          window.addEventListener("load", onLoad, { once: true });
        });
      }

      // Best-effort: wait for fonts (prevents late layout shifts under overlay).
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fonts = (document as any).fonts;
        if (fonts?.ready) await fonts.ready;
      } catch {
        // ignore
      }

      // Best-effort: decode already-present, non-lazy images so we don't reveal half-loaded.
      try {
        const imgs = Array.from(document.images).filter((img) => {
          const isLazy = img.loading === "lazy";
          const hasSrc = Boolean(img.currentSrc || img.src);
          return hasSrc && !isLazy;
        });
        await Promise.all(
          imgs.map(async (img) => {
            if (img.complete) {
              // decode() can still reject; ignore failures.
              await img.decode().catch(() => undefined);
              return;
            }
            await new Promise<void>((resolve) => {
              const done = () => resolve();
              img.addEventListener("load", done, { once: true });
              img.addEventListener("error", done, { once: true });
            });
          }),
        );
      } catch {
        // ignore
      }
    };

    let cancelled = false;
    void waitForLoad().then(() => {
      if (cancelled) return;
      const tl = gsap.timeline({
        onComplete: () => {
          initialLoadDoneRef.current = true;
          busyRef.current = false;
          gsap.set(overlay, { opacity: 0 });
          gsap.set(path, { strokeDashoffset: len, strokeWidth: 2 });
        },
      });

      // Reveal site.
      tl.to(path, {
        strokeDashoffset: len,
        strokeWidth: 2,
        duration: 1.05,
        ease: "power2.inOut",
      }).to(
        overlay,
        {
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
        },
        0.72,
      );
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // When we arrive at the target route via our transition, play the "enter" animation.
  useEffect(() => {
    const target = lastNavTargetRef.current;
    if (!target) return;
    if (location.pathname !== target) return;

    const overlay = overlayRef.current;
    const path = pathRef.current;
    if (!overlay || !path) return;

    const len = pathLenRef.current || path.getTotalLength();
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { opacity: 0 });
        gsap.set(path, { strokeDashoffset: len, strokeWidth: 2 });
        busyRef.current = false;
        lastNavTargetRef.current = null;
      },
    });

    tl.to(path, {
      strokeDashoffset: len,
      strokeWidth: 2,
      duration: 0.95,
      ease: "power2.inOut",
    }).to(
      overlay,
      {
        opacity: 0,
        duration: 0.35,
        ease: "power2.inOut",
      },
      0.65,
    );

    return () => {
      tl.kill();
    };
  }, [location.pathname]);

  const transitionTo = useCallback(
    (to: string) => {
      if (!to || isExternalLink(to)) {
        window.location.href = to;
        return;
      }
      // Animate only for key page transitions (avoid affecting normal hash / misc links).
      const shouldAnimate = to === "/gallery" || to === "/";
      if (!shouldAnimate) {
        navigate(to);
        return;
      }

      if (busyRef.current) return;
      busyRef.current = true;
      lastNavTargetRef.current = to;

      const overlay = overlayRef.current;
      const path = pathRef.current;
      if (!overlay || !path) {
        busyRef.current = false;
        lastNavTargetRef.current = null;
        navigate(to);
        return;
      }

      const len = pathLenRef.current || path.getTotalLength();
      gsap.set(overlay, { opacity: 1 });
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, strokeWidth: 2 });

      const tl = gsap.timeline({
        onComplete: () => {
          navigate(to);
        },
      });

      tl.to(overlay, { opacity: 1, duration: 0.25, ease: "power2.inOut" }).to(
        path,
        {
          strokeDashoffset: 0,
          strokeWidth: 300,
          duration: 1.1,
          ease: "power2.inOut",
        },
        0,
      );

      return () => {
        tl.kill();
      };
    },
    [navigate],
  );

  const value = useMemo(() => ({ transitionTo }), [transitionTo]);

  return (
    <GalleryTransitionContext.Provider value={value}>
      <GalleryTransitionOverlay overlayRef={overlayRef} pathRef={pathRef} />
      {children}
    </GalleryTransitionContext.Provider>
  );
}

export function useGalleryTransition() {
  const ctx = useContext(GalleryTransitionContext);
  if (!ctx) {
    throw new Error("useGalleryTransition must be used within GalleryTransitionProvider");
  }
  return ctx;
}

