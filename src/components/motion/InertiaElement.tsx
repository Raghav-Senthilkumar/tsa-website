import { type ElementType, type ReactNode, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type InertiaDirection = "up" | "down" | "left" | "right";

type Props<T extends ElementType> = {
  as?: T;
  className?: string;
  children: ReactNode;
  /**
   * Higher values move further/faster.
   * Typical range: 0.2 – 1.5
   */
  speed: number;
  direction: InertiaDirection;
};

function getAxis(direction: InertiaDirection) {
  return direction === "left" || direction === "right" ? "x" : "y";
}

function getSign(direction: InertiaDirection) {
  return direction === "up" || direction === "left" ? -1 : 1;
}

export default function InertiaElement<T extends ElementType = "div">({
  as,
  className,
  children,
  speed,
  direction,
}: Props<T>) {
  const Comp = (as ?? "div") as ElementType;
  const elRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!elRef.current) return;

    const axis = getAxis(direction);
    const sign = getSign(direction);
    const amplitude = sign * speed * 135; // noticeable, but not excessive

    const ctx = gsap.context(() => {
      gsap.set(elRef.current!, { x: 0, y: 0 });

      gsap.to(elRef.current!, {
        [axis]: amplitude,
        ease: "none",
        scrollTrigger: {
          trigger: elRef.current!,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });
    }, elRef);

    return () => ctx.revert();
  }, [speed, direction]);

  return (
    <Comp ref={elRef} className={className}>
      {children}
    </Comp>
  );
}

