export function initViewportHeightVar() {
  if (typeof window === "undefined") return () => {};

  let raf = 0;
  const set = () => {
    const vv = window.visualViewport;
    const height = vv?.height ?? window.innerHeight;
    document.documentElement.style.setProperty("--vh", `${height * 0.01}px`);
  };

  const onResize = () => {
    window.cancelAnimationFrame(raf);
    raf = window.requestAnimationFrame(set);
  };

  set();

  window.addEventListener("resize", onResize, { passive: true });
  window.addEventListener("orientationchange", onResize, { passive: true });
  window.visualViewport?.addEventListener("resize", onResize, { passive: true });

  return () => {
    window.cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("orientationchange", onResize);
    window.visualViewport?.removeEventListener("resize", onResize);
  };
}

