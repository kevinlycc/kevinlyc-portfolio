"use client";

import { useLayoutEffect } from "react";

export default function IntroCleanup() {
  useLayoutEffect(() => {
    document.body.classList.remove("intro-active", "intro-ready");
    // Reset scroll to top across multiple frames — Lenis on the homepage may
    // still be releasing its smooth-scroll position when this page mounts,
    // so a single reset can be clobbered the next paint.
    const reset = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    reset();
    let revealTimer = 0;
    const r1 = requestAnimationFrame(() => {
      reset();
      requestAnimationFrame(() => {
        reset();
        // Lift the curtain dropped by goToProject — fade it out now that
        // the project page is mounted at scroll 0.
        if (document.body.classList.contains("nav-transitioning")) {
          document.body.classList.remove("nav-transitioning");
          document.body.classList.add("nav-revealing");
          revealTimer = window.setTimeout(() => {
            document.body.classList.remove("nav-revealing");
          }, 650);
        }
      });
    });
    return () => {
      cancelAnimationFrame(r1);
      if (revealTimer) clearTimeout(revealTimer);
    };
  }, []);
  return null;
}
