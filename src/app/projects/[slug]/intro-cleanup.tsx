"use client";

import { useEffect } from "react";

export default function IntroCleanup() {
  useEffect(() => {
    document.body.classList.remove("intro-active", "intro-ready");
  }, []);
  return null;
}
