"use client";

import { useLayoutEffect } from "react";

export default function IntroCleanup() {
  useLayoutEffect(() => {
    document.body.classList.remove("intro-active", "intro-ready");
    // Reset scroll to top so the project page doesn't inherit the homepage
    // scroll position (which would land the user at the bottom of the page).
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);
  return null;
}
