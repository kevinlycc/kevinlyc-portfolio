"use client";
/* eslint-disable @next/next/no-img-element -- parity with static site; optimize later */

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { isTouchOrCoarse } from "@/components/util";

gsap.registerPlugin(ScrollToPlugin);

const MOBILE_BREAKPOINT = 960;

export default function HomePage() {
  const router = useRouter();
  const [year, setYear] = useState<number | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const goToProject = (slug: string) => router.push(`/projects/${slug}`);
  const cardKeyDown = (slug: string) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter") goToProject(slug);
  };

  // Refs for DOM elements
  const mainImageSectionRef = useRef<HTMLDivElement>(null);
  const mainImageTrackRef   = useRef<HTMLDivElement>(null);
  const mainImageRef        = useRef<HTMLDivElement>(null);
  const mainImageTextRef    = useRef<HTMLDivElement>(null);
  const aboutMePanelRef     = useRef<HTMLDivElement>(null);
  const mobileHeroBridgeRef = useRef<HTMLDivElement>(null);
  const mobileHeroButtonRef = useRef<HTMLButtonElement>(null);

  // Refs for projects horizontal scroll
  const projectsTrackRef  = useRef<HTMLDivElement>(null);
  const projectsRunnerRef = useRef<HTMLDivElement>(null);

  // Locomotive Scroll instance — shared with smoothScrollTo
  const locomotiveRef = useRef<any>(null);

  // Scroll targets exposed to nav handlers
  const aboutScrollTargetRef    = useRef<number>(0);
  const projectsScrollTargetRef = useRef<number>(0);

  // ── Smooth scroll helper ─────────────────────────────────────────────────
  // Used by header "Contact" / logo clicks.  Delegates to Locomotive Scroll
  // (→ Lenis) once available, with a GSAP fallback.
  const smoothScrollTo = (targetY: number) => {
    const loco = locomotiveRef.current;
    if (loco) {
      try {
        loco.scrollTo(targetY, { duration: 2.6 });
      } catch {
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
      return;
    }
    gsap.to(window, {
      duration: 1.6,
      scrollTo: { y: targetY, autoKill: false },
      ease: "power2.inOut",
    });
  };

  // ── Nav click handlers ────────────────────────────────────────────────────
  const handleNameClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    smoothScrollTo(0);
  };

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    smoothScrollTo(aboutScrollTargetRef.current);
  };

  const handleProjectsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    smoothScrollTo(projectsScrollTargetRef.current);
  };

  // Drop the textured overlay (synchronously before paint) when returning
  // from a project page, so the homepage's giant "Kevin" never paints in
  // the gap between mount and scroll-to-cards. The inline script in
  // layout.tsx handles full reloads; this handles Next.js client-side nav.
  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("return") === "projects") {
      document.body.classList.remove("nav-revealing");
      document.body.classList.add("nav-transitioning");
    }
  }, []);

  // ── Stable year ───────────────────────────────────────────────────────────
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // ── Scroll reset on (re)load ─────────────────────────────────────────────
  useEffect(() => {
    const isReturningFromProject = () =>
      new URLSearchParams(window.location.search).get("return") === "projects";
    const reset = () => {
      if (isReturningFromProject()) return;
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    reset();
    window.addEventListener("load",     reset);
    window.addEventListener("pageshow", reset);
    return () => {
      window.removeEventListener("load",     reset);
      window.removeEventListener("pageshow", reset);
    };
  }, []);

  // ── Intro zoom animation ──────────────────────────────────────────────────
  useEffect(() => {
    const site = document.querySelector<HTMLElement>(".site");
    if (!site) return;

    function applyIntroZoomFit() {
      const el = document.querySelector<HTMLElement>(".site");
      if (!el) return;
      if (!document.body.classList.contains("intro-active")) return;
      if (
        document.body.classList.contains("intro-unveiled") &&
        !document.body.classList.contains("intro-ready")
      ) {
        return;
      }
      const fullH = el.scrollHeight;
      const vh    = window.innerHeight;
      if (!fullH || !vh) return;
      const pad     = window.innerWidth <= 960 ? 0.78 : 0.9;
      let   scale   = Math.min(1, (vh * pad) / fullH);
      if (scale < 0.08) scale = 0.08;
      const scaledH = fullH * scale;
      const ty      = Math.max(0, (vh - scaledH) / 2);
      el.style.setProperty("--intro-scale",       String(scale));
      el.style.setProperty("--intro-translate-y", `${ty}px`);
    }

    applyIntroZoomFit();
    requestAnimationFrame(() => requestAnimationFrame(applyIntroZoomFit));
    window.addEventListener("load", applyIntroZoomFit);
    const onResize = () => {
      if (document.body.classList.contains("intro-active")) applyIntroZoomFit();
    };
    window.addEventListener("resize", onResize);

    const blockScroll = (e: Event) => {
      if (document.body.classList.contains("intro-active")) e.preventDefault();
    };
    window.addEventListener("wheel",      blockScroll, { passive: false });
    window.addEventListener("touchmove",  blockScroll, { passive: false });

    const timeouts: number[] = [];

    function startAnimation() {
      const unveilDelay    = 650;
      const veilDuration   = 950;
      const afterVeil      = unveilDelay + veilDuration + 80;
      const headerSlideMs  = 650;
      const afterHeaderIn  = afterVeil + headerSlideMs;

      timeouts.push(window.setTimeout(() => {
        document.body.classList.add("intro-unveiled");
      }, unveilDelay));

      timeouts.push(window.setTimeout(() => {
        document.body.classList.add("intro-header-in");
      }, afterVeil));

      timeouts.push(window.setTimeout(() => {
        document.body.classList.add("intro-ready");
      }, afterHeaderIn));

      const mobileTitleOutDuration = 650;
      const mobileTitleOutDistance = 240;
      const mobileScrollInDuration = 650;
      const mobileFooterFadeLead = 260;
      const mobileFooterFadeDuration = 220;

      if (window.innerWidth <= 960) {
        const bottomTitle  = document.querySelector<HTMLElement>(".title--bottom");
        const siteFooter   = document.querySelector<HTMLElement>("#site-footer");
        const bridgeButton = mobileHeroButtonRef.current;
        if (bottomTitle) gsap.set(bottomTitle, { clearProps: "opacity,transform" });
        if (siteFooter) gsap.set(siteFooter, { clearProps: "opacity" });
        if (bridgeButton) gsap.set(bridgeButton, { yPercent: -115 });

        // Mobile Phase 1a: fade footer out slightly before title slide
        timeouts.push(window.setTimeout(() => {
          if (siteFooter) {
            gsap.to(siteFooter, {
              opacity: 0,
              duration: mobileFooterFadeDuration / 1000,
              ease: "power2.in",
            });
          }
        }, afterHeaderIn + 700 - mobileFooterFadeLead));

        // Mobile Phase 1b: slide bottom title down
        timeouts.push(window.setTimeout(() => {
          if (bottomTitle) {
            gsap.to(bottomTitle, {
              yPercent: mobileTitleOutDistance,
              duration: mobileTitleOutDuration / 1000,
              ease: "power3.inOut",
            });
          }
        }, afterHeaderIn + 700));

        // Mobile Phase 2: reveal content + reset temporary intro state
        timeouts.push(window.setTimeout(() => {
          document.body.classList.remove("intro-active");
          document.body.classList.remove("intro-header-in");
          document.body.classList.remove("intro-ready");
          document.body.style.overflow = "";
          if (!site) return;
          site.style.removeProperty("--intro-scale");
          site.style.removeProperty("--intro-translate-y");

          const bottomTitle = document.querySelector<HTMLElement>(".title--bottom");
          if (bottomTitle) {
            gsap.delayedCall(0.05, () => {
              gsap.set(bottomTitle, { clearProps: "transform,opacity" });
            });
          }
          if (siteFooter) {
            gsap.delayedCall(0.05, () => {
              gsap.set(siteFooter, { clearProps: "opacity" });
            });
          }
          if (bridgeButton) {
            gsap.to(bridgeButton, {
              yPercent: 0,
              duration: mobileScrollInDuration / 1000,
              ease: "power3.out",
              clearProps: "transform",
            });
          }
        }, afterHeaderIn + 700 + mobileTitleOutDuration));
      } else {
        // Desktop: original timing, no fade sequence
        timeouts.push(window.setTimeout(() => {
          document.body.classList.remove("intro-active");
          document.body.classList.remove("intro-header-in");
          document.body.classList.remove("intro-ready");
          document.body.style.overflow = "";
          if (!site) return;
          site.style.removeProperty("--intro-scale");
          site.style.removeProperty("--intro-translate-y");
        }, afterHeaderIn + 1400));
      }
    }

    const heroImg      = document.querySelector<HTMLImageElement>(".hero-featured-img");
    const readyPromise = heroImg
      ? heroImg.decode().catch(() => Promise.resolve())
      : Promise.resolve();

    readyPromise.then(() => requestAnimationFrame(startAnimation));

    return () => {
      timeouts.forEach(clearTimeout);
      window.removeEventListener("load",    applyIntroZoomFit);
      window.removeEventListener("resize",  onResize);
      window.removeEventListener("wheel",   blockScroll);
      window.removeEventListener("touchmove", blockScroll);
    };
  }, []);

  /* -------------------------------------------------------------------------
     Hero image scroll animation — Locomotive Scroll + CSS sticky + GSAP

     Layout contract (set in minimalist.css):
       .animation-scroll-track  →  height: 300vh   (the "scroll budget")
       .animation-sticky-frame  →  position: sticky; top: 0; height: 100vh

     Sticking distance = trackHeight − stickyFrameHeight = 200vh.
     Locomotive Scroll's scrollCallback maps that 200vh of scroll to
     GSAP timeline progress 0 → 1, giving a scrubbed, physics-smooth animation.

     Timeline (progress 0 → 1):
       0 → 0.5   width compression + centring  (power2.in)
       0.5 → 1   slide to left edge            (expo.out)
       0.6+       text panel fades in           (power3.out)
  ------------------------------------------------------------------------- */
  useEffect(() => {
    const imgWrap    = mainImageRef.current;
    const textPanel  = mainImageTextRef.current;
    const trackEl    = mainImageTrackRef.current;
    const runner     = projectsRunnerRef.current;
    const projTrack  = projectsTrackRef.current;
    if (!imgWrap || !textPanel || !trackEl || !runner || !projTrack) return;

    let mounted    = true;
    let locoScroll: any = null;
    let resizeRaf = 0;
    let removeResizeListener: (() => void) | null = null;

    // Safety: if the overlay is up (return=projects) and the scroll-to logic
    // never runs, make sure it still fades out so the page isn't permanently covered.
    const revealSafetyTimer = window.setTimeout(() => {
      if (document.body.classList.contains("nav-transitioning")) {
        document.body.classList.remove("nav-transitioning");
        document.body.classList.add("nav-revealing");
        window.setTimeout(() => {
          document.body.classList.remove("nav-revealing");
        }, 650);
      }
    }, 1500);

    const useNativeTouchScroll = () => isTouchOrCoarse();

    // Resolve when the intro animation has completed
    const waitForIntro = () =>
      new Promise<void>((resolve) => {
        const check = () =>
          document.body.classList.contains("intro-active")
            ? requestAnimationFrame(check)
            : resolve();
        check();
      });

    const aboutMePanel = aboutMePanelRef.current;

    // On touch/coarse devices: skip Locomotive and use native browser scrolling
    if (useNativeTouchScroll()) {
      gsap.set(imgWrap,   { clearProps: "all" });
      gsap.set(textPanel, { clearProps: "all" });
      if (aboutMePanel) gsap.set(aboutMePanel, { clearProps: "all" });

      waitForIntro().then(() => {
        if (!mounted) return;

        // Set scroll target for the "Scroll↓" button to the background panel
        const textPanelEl = mainImageTextRef.current;
        if (textPanelEl) {
          aboutScrollTargetRef.current =
            textPanelEl.getBoundingClientRect().top + window.scrollY - 60;
        }
      });

      return () => {
        mounted = false;
        locomotiveRef.current = null;
      };
    }

    // ── Image GSAP timeline ────────────────────────────────────────────────
    const tl = gsap.timeline({ paused: true });

    gsap.set(imgWrap,   { width: "100%", marginLeft: "0%" });
    gsap.set(textPanel, { opacity: 0, x: 0, visibility: "hidden" });
    if (aboutMePanel) gsap.set(aboutMePanel, { opacity: 0, x: 50, visibility: "hidden" });

    const resumeEntries = Array.from(
      textPanel.querySelectorAll<HTMLElement>(".resume-entry")
    );
    if (resumeEntries.length) gsap.set(resumeEntries, { opacity: 0, y: 14 });

    const aboutMeItems = aboutMePanel
      ? Array.from(aboutMePanel.querySelectorAll<HTMLElement>(".about-me-panel__item"))
      : [];
    if (aboutMeItems.length) gsap.set(aboutMeItems, { opacity: 0, y: 14 });

    tl.to(imgWrap, { width: "48%", ease: "power2.inOut", duration: 1.0 }, 0);

    if (aboutMePanel) {
      tl.fromTo(
        aboutMePanel,
        { opacity: 0, x: 50, visibility: "hidden" },
        { opacity: 1, x: 0, visibility: "visible", ease: "power3.out", duration: 0.40 },
        1.20
      );
      if (aboutMeItems.length) {
        tl.fromTo(
          aboutMeItems,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, ease: "power2.out", duration: 0.90 },
          1.40
        );
      }
      tl.to(
        aboutMePanel,
        { opacity: 0, ease: "power2.in", duration: 0.30 },
        2.60
      );
    }

    tl.fromTo(
      textPanel,
      { opacity: 0, x: 50, visibility: "hidden" },
      { opacity: 1, x: 0,  visibility: "visible", ease: "power3.out", duration: 0.40 },
      3.00
    );
    resumeEntries.forEach((entry, i) => {
      tl.fromTo(
        entry,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0,  ease: "power2.out", duration: 0.90 },
        3.20 + i * 0.30
      );
    });

    // ── Projects GSAP timeline ─────────────────────────────────────────────
    const projTl = gsap.timeline({ paused: true });
    gsap.set(runner, { x: 0 });

    // ── Track bounds ───────────────────────────────────────────────────────
    let trackDocTop     = 0;
    let trackScrollDist = 1;
    let projTrackDocTop = 0;
    let projScrollDist  = 1;

    const computeBounds = () => {
      const rect      = trackEl.getBoundingClientRect();
      trackDocTop     = rect.top + window.scrollY;
      trackScrollDist = Math.max(1, trackEl.offsetHeight - window.innerHeight);

      gsap.set(runner, { x: 0 });
      const wordEl    = runner.querySelector<HTMLElement>(".projects-word");
      const charCount = wordEl?.textContent?.trim().length || 1;
      const charWidth = runner.scrollWidth / charCount;
      const scrollBudget = Math.max(0, runner.scrollWidth - window.innerWidth + charWidth * 0.3);
      projTrack.style.height = `${window.innerHeight + scrollBudget}px`;

      const prect     = projTrack.getBoundingClientRect();
      projTrackDocTop = prect.top + window.scrollY;
      projScrollDist  = Math.max(1, scrollBudget);

      // Expose snap targets to nav handlers.
      // ABOUT lands at peak About Me visibility (timeline t=2.40 — middle of dwell,
      // after items finish fading in at 2.30 and before fade-out begins at 2.60).
      const aboutMeTime = 2.40;
      const totalDur = Math.max(1, tl.totalDuration());
      const aboutProgress = Math.min(1, aboutMeTime / totalDur);
      aboutScrollTargetRef.current    = trackDocTop + aboutProgress * trackScrollDist;
      const cardsEl = document.querySelector<HTMLElement>(".exp-sticky-section");
      projectsScrollTargetRef.current = cardsEl
        ? cardsEl.getBoundingClientRect().top + window.scrollY - 100
        : projTrackDocTop + projScrollDist;

      projTl.clear();
      projTl.to(runner, { x: -scrollBudget, ease: "none", duration: 1 });
      locoScroll?.resize?.();
    };

    waitForIntro().then(() => {
      if (!mounted) return;

      computeBounds();
      tl.progress(0);
      projTl.progress(0);


      import("locomotive-scroll").then(({ default: LocomotiveScroll }) => {
        if (!mounted) return;

        locoScroll = new LocomotiveScroll({
          lenisOptions: {
            lerp:            0.07,
            smoothWheel:     true,
            syncTouch:       true,
            syncTouchLerp:   0.08,
            wheelMultiplier: 1,
            touchMultiplier: 2,
          },
          scrollCallback: (args: any) => {
            const scrollY = typeof args.scroll === "number"
              ? args.scroll
              : window.scrollY;

            // Image animation
            const p1 = gsap.utils.clamp(0, 1, (scrollY - trackDocTop) / trackScrollDist);
            tl.progress(p1);

            // Projects horizontal scroll
            const p2 = gsap.utils.clamp(0, 1, (scrollY - projTrackDocTop) / projScrollDist);
            projTl.progress(p2);
          },
        });

        const onResize = () => {
          if (resizeRaf) return;
          resizeRaf = window.requestAnimationFrame(() => {
            resizeRaf = 0;
            computeBounds();
          });
        };

        locomotiveRef.current = locoScroll;
        window.addEventListener("resize", onResize, { passive: true });
        removeResizeListener = () => {
          if (resizeRaf) window.cancelAnimationFrame(resizeRaf);
          window.removeEventListener("resize", onResize);
        };

        // If the user is returning from a project page, jump to the cards section
        // and clear the query param so a refresh doesn't repeat the jump.
        const params = new URLSearchParams(window.location.search);
        if (params.get("return") === "projects") {
          window.history.replaceState({}, "", "/");
          requestAnimationFrame(() =>
            requestAnimationFrame(() => {
              const target = projectsScrollTargetRef.current;
              if (target > 0) {
                try {
                  locoScroll?.scrollTo?.(target, { immediate: true });
                } catch {
                  window.scrollTo(0, target);
                }
              }
              // Lift the curtain — fade out the textured overlay now that
              // we've snapped to the cards. Remove the class entirely
              // after the transition finishes so a future back-click
              // can re-cover the page instantly.
              requestAnimationFrame(() => {
                document.body.classList.remove("nav-transitioning");
                document.body.classList.add("nav-revealing");
                window.setTimeout(() => {
                  document.body.classList.remove("nav-revealing");
                }, 650);
              });
            })
          );
        }
      });
    });

    return () => {
      mounted = false;
      window.clearTimeout(revealSafetyTimer);
      tl.kill();
      projTl.kill();
      removeResizeListener?.();
      locoScroll?.destroy();
      locomotiveRef.current = null;
    };
  }, []);

  useEffect(() => {
    const textPanel = mainImageTextRef.current;
    if (!textPanel) return;
    const resumePanel = textPanel.querySelector<HTMLElement>(".resume-panel");
    if (!resumePanel) return;

    if (window.innerWidth > MOBILE_BREAKPOINT) {
      gsap.set(textPanel, { clearProps: "all" });
      gsap.set(resumePanel, { clearProps: "all" });
      return;
    }

    let rafId = 0;

    const resumeEntries = Array.from(
      textPanel.querySelectorAll<HTMLElement>(".resume-entry")
    );

    gsap.set(textPanel, { opacity: 1, x: 0, visibility: "visible" });
    gsap.set(resumePanel, { opacity: 0, x: 50 });
    if (resumeEntries.length) gsap.set(resumeEntries, { opacity: 0, y: 14 });

    const revealTl = gsap.timeline({ paused: true });
    revealTl.fromTo(
      resumePanel,
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, ease: "power3.out", duration: 0.4 },
      0
    );
    resumeEntries.forEach((item, i) => {
      revealTl.fromTo(
        item,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, ease: "power2.out", duration: 0.9 },
        0.2 + i * 0.3
      );
    });

    const applyRevealProgress = () => {
      rafId = 0;
      if (window.innerWidth > MOBILE_BREAKPOINT) {
        revealTl.progress(1);
        return;
      }

      if (document.body.classList.contains("intro-active")) {
        revealTl.progress(0);
        rafId = window.requestAnimationFrame(applyRevealProgress);
        return;
      }

      const rect = textPanel.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      const start = viewportH * 0.42;
      const end = -viewportH * 0.18;
      const progress = gsap.utils.clamp(0, 1, (start - rect.top) / (start - end));
      revealTl.progress(progress);
    };

    const onScroll = () => {
      if (!rafId) rafId = window.requestAnimationFrame(applyRevealProgress);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      revealTl.kill();
      gsap.set(textPanel, { clearProps: "all" });
      gsap.set(resumePanel, { clearProps: "all" });
      if (resumeEntries.length) gsap.set(resumeEntries, { clearProps: "all" });
    };
  }, []);

  useEffect(() => {
    const section = mainImageSectionRef.current;
    const img = document.querySelector<HTMLElement>(".hero-featured-img");
    if (!section || !img) return;

    let rafId = 0;

    const applyMobileParallax = () => {
      rafId = 0;

      if (window.innerWidth > MOBILE_BREAKPOINT) {
        gsap.set(img, { clearProps: "transform" });
        return;
      }

      if (document.body.classList.contains("intro-active")) {
        gsap.set(img, { clearProps: "transform" });
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportH = window.innerHeight || 1;
      const progress = gsap.utils.clamp(0, 1, (-rect.top) / (viewportH * 1.4));
      const imgY = gsap.utils.interpolate(0, 55, progress);

      gsap.set(img, { y: imgY, force3D: true });
    };

    const onScroll = () => {
      if (!rafId) rafId = window.requestAnimationFrame(applyMobileParallax);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      gsap.set(img, { clearProps: "transform" });
    };
  }, []);

  useEffect(() => {
    const textPanel = mainImageTextRef.current;
    if (!textPanel) return;
    if (window.innerWidth > MOBILE_BREAKPOINT) return;

    const header = textPanel.querySelector<HTMLElement>(".resume-panel__header");
    const entries = Array.from(
      textPanel.querySelectorAll<HTMLElement>(".resume-entry")
    );
    if (!entries.length) return;

    const speeds = [28, 28, 28, 28];
    let rafId = 0;

    const applyParallax = () => {
      rafId = 0;
      if (window.innerWidth > MOBILE_BREAKPOINT) return;
      if (document.body.classList.contains("intro-active")) return;

      const viewportH = window.innerHeight || 1;

      if (header) {
        const rect = header.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const progress = gsap.utils.clamp(0, 1, (viewportH - center) / viewportH);
        const y = gsap.utils.interpolate(38, -38, progress);
        gsap.set(header, { y, force3D: true });
      }

      entries.forEach((entry, i) => {
        const rect = entry.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const progress = gsap.utils.clamp(0, 1, (viewportH - center) / viewportH);
        const speed = speeds[i] ?? 4;
        const y = gsap.utils.interpolate(speed, -speed, progress);
        gsap.set(entry, { y, force3D: true });
      });
    };

    const onScroll = () => {
      if (!rafId) rafId = window.requestAnimationFrame(applyParallax);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (header) gsap.set(header, { clearProps: "transform" });
      entries.forEach((entry) => gsap.set(entry, { clearProps: "transform" }));
    };
  }, []);

  // ── Live clock (SF time) ──────────────────────────────────────────────────
  useEffect(() => {
    function updateTime() {
      const timeStr = new Date().toLocaleTimeString("en-US", {
        timeZone: "America/Los_Angeles",
        hour:     "2-digit",
        minute:   "2-digit",
        hour12:   false,
      });
      document.querySelectorAll(".time").forEach(el => {
        el.textContent = timeStr;
      });
    }
    updateTime();
    const id = window.setInterval(updateTime, );
    return () => clearInterval(id);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="site">

        <header id="site-header">
          {/* ── Desktop header (hidden on mobile) ── */}
          <div className="site-header__left desktop-only-header">
            <h2 className="logo">
              <a href="#site-header" className="cursor-can-hover" onClick={handleNameClick}>
                Kevin Chhim
              </a>
            </h2>
          </div>
          <nav className="header-nav site-header__center desktop-only-header" aria-label="Primary">
            <a href="#section-background" className="cursor-can-hover" onClick={handleAboutClick}>ABOUT</a>
            <a>&nbsp;&nbsp;</a>
            <a href="#section-projects" className="cursor-can-hover" onClick={handleProjectsClick}>PROJECTS</a>
            <a>&nbsp;&nbsp;</a>
            <a href="https://github.com/kevinlycc" target="_blank" className="cursor-can-hover">GITHUB</a>
            <a>&nbsp;&nbsp;</a>
            <a href="https://www.linkedin.com/in/kevin-chhim/" className="cursor-can-hover" target="_blank">LINKEDIN</a>
            <a>&nbsp;&nbsp;</a>
            <a href="mailto:kevinlyc@uci.edu" className="cursor-can-hover">CONTACT</a>
            <a>&nbsp;&nbsp;</a>
            <a href="/resume.pdf" className="cursor-can-hover" target="_blank">RESUME</a>
          </nav>
          <div className="site-header__right desktop-only-header">
            <div className="header-info">
              <span className="location">irvine, ca</span>&nbsp;
              <span className="time">—:—</span>
              <span className="menu-dot-container" aria-hidden="true">
                <svg className="menu-dot" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="4" />
                </svg>
              </span>
            </div>
          </div>

          {/* ── Mobile header (hidden on desktop) ── */}
          <div className={`mobile-header-wrap${mobileNavOpen ? " nav-open" : ""}`}>
            {/* Panel A: default — name + location/time + MENU trigger */}
            <div className="mobile-panel mobile-panel-default">
              <span className="mobile-identity">
                <div className="header-info" style={{display:"inline"}}>
                  <a href="#site-header" onClick={handleNameClick}>
                    <span className="location">irvine, ca</span>&nbsp;
                    <span className="time mobile-time">—:—</span>
                    <span className="menu-dot-container" aria-hidden="true">
                      <svg className="menu-dot" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="8" cy="8" r="4" />
                      </svg>
                    </span>
                  </a>
                </div>
              </span>
              <button
                className="mobile-menu-btn"
                aria-label="Open navigation"
                onClick={() => setMobileNavOpen(true)}
              >
                MENU
              </button>
            </div>

            {/* Panel B: nav links */}
            <div className="mobile-panel mobile-panel-nav" aria-hidden={!mobileNavOpen}>
              <button
                className="mobile-back-btn"
                aria-label="Close navigation"
                onClick={() => setMobileNavOpen(false)}
              >
                BACK
              </button>
              <nav className="mobile-nav-links" aria-label="Primary mobile">
                <a href="https://github.com/kevinlycc" target="_blank">GITHUB</a>
                <a href="https://www.linkedin.com/in/kevin-chhim/" target="_blank">LINKEDIN</a>
                <a href="mailto:kevinchhim@gmail.com">EMAIL</a>
              </nav>
            </div>
          </div>
        </header>

        <main id="content">
          <section className="page-wrapper layout-0" id="homepage" ref={mainImageSectionRef}>
            <div className="scroll-wrapper">
              <div className="container">

                <h2 className="title">Kevin</h2>

                {/* ── Sticky animation section ─────────────────────────────
                    .animation-scroll-track  is 300vh tall.
                    .animation-sticky-frame  is 100vh sticky at top:0.
                    Locomotive Scroll maps the 200vh scroll budget to the
                    GSAP timeline, so the image animates while this section
                    is pinned in view. ──────────────────────────────────── */}
                <div className="animation-scroll-track" ref={mainImageTrackRef}>
                  {/* Aligns with scroll Y where hero/background scrub reaches p=1 (same as trackScrollDist) */}
                  <span className="hero-scrub-end-anchor" id="section-background" aria-hidden="true" />
                  <div className="animation-sticky-frame">

                    <div className="grid__animation-wrapper" ref={mainImageRef}>
                      <div className="grid grid--layout-0" data-name="Compartment Chair">
                        <div
                          className="grid__item grid__item--featured"
                          aria-label="Compartment Chair"
                        >
                          <div className="grid__item-image">
                            <div
                              className="responsive-image hero-featured-image"
                              style={{ paddingTop: "125%" }}
                            >
                              <span className="hero-image-base" aria-hidden="true" />
                              <img
                                className="hero-featured-img"
                                src="/assets/milan.png"
                                alt="Featured"
                                width={1600}
                                height={2000}
                                loading="eager"
                                fetchPriority="high"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mobile-hero-bridge" ref={mobileHeroBridgeRef}>
                      <button
                        type="button"
                        className="mobile-hero-bridge__button"
                        ref={mobileHeroButtonRef}
                        onClick={() => smoothScrollTo(aboutScrollTargetRef.current || window.innerHeight)}
                        aria-label="Scroll to background section"
                      >
                        <span className="mobile-hero-bridge__label">Scroll</span>
                        <span className="mobile-hero-bridge__arrow" aria-hidden="true">↓</span>
                      </button>
                    </div>

                    <div className="about-me-panel" ref={aboutMePanelRef}>
                      <div className="about-me-panel__inner">
                        <span className="about-me-panel__label">About Me</span>
                        <p className="about-me-panel__lead about-me-panel__item">
                          hey, i&apos;m kevin! i&apos;m a computer engineering student at uc irvine who loves building things close to the metal — embedded systems, chip design, the whole low-level rabbit hole. i used a qualcomm dev board at a hackathon once and kind of never recovered.
                        </p>
                        <p className="about-me-panel__intro about-me-panel__item">outside of that, i&apos;m usually:</p>
                        <ul className="about-me-panel__list about-me-panel__item">
                          <li>Reading <em>The Prince</em> by Niccolò Machiavelli</li>
                          <li>Playing Marvel Rivals and Black Myth: Wukong</li>
                          <li>Rock Climbing or Lion Dancing</li>
                        </ul>
                        <p className="about-me-panel__current about-me-panel__item">
                          i&apos;m currently diving deeper into edge AI — compressing vision models and deploying them for real-time on-device inference.
                        </p>
                      </div>
                    </div>

                    <div className="main-image-text-panel" ref={mainImageTextRef}>
                      <div className="resume-panel">
                        <div className="resume-panel__header">
                          <span className="resume-panel__label">Background</span>
                        </div>
                        <div className="resume-entries">

                          <div className="resume-entry">
                            <span className="resume-entry__num">01</span>
                            <div className="resume-entry__content">
                              <p className="resume-entry__role">Hardware Engineer Intern</p>
                              <p className="resume-entry__meta"><span className="resume-entry__company">Phillips Connect</span><span className="resume-entry__period">Jun 2026 — Sep 2026</span></p>
                              <p className="resume-entry__tag">Hardware design and embedded systems development processes for smart trailer technology</p>
                            </div>
                          </div>

                          <div className="resume-entry">
                            <span className="resume-entry__num">02</span>
                            <div className="resume-entry__content">
                              <p className="resume-entry__role">Vice President of Technology</p>
                              <p className="resume-entry__meta"><span className="resume-entry__company">ESC @ UCI</span><span className="resume-entry__period">Apr 2026 — Present</span></p>
                              <p className="resume-entry__tag">Leading technical strategy and development for UCI's Engineering Student Council</p>
                            </div>
                          </div>

                          <div className="resume-entry">
                            <span className="resume-entry__num">03</span>
                            <div className="resume-entry__content">
                              <p className="resume-entry__role">Embedded Systems Engineer</p>
                              <p className="resume-entry__meta"><span className="resume-entry__company">Micromouse @ UCI</span><span className="resume-entry__period">Sep 2025 — Present</span></p>
                              <p className="resume-entry__tag">Embedded firmware and motor control for autonomous maze-solving robot</p>
                            </div>
                          </div>

                          <div className="resume-entry">
                            <span className="resume-entry__num">04</span>
                            <div className="resume-entry__content">
                              <p className="resume-entry__role">B.S. Computer Engineering</p>
                              <p className="resume-entry__meta"><span className="resume-entry__company">UCI</span><span className="resume-entry__period">Sep 2023 — Present</span></p>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              {/* ── Featured Projects — horizontal scroll ─────────────────────────
                  .projects-scroll-track is 450vh tall.
                  .projects-sticky-frame is 100vh sticky at top:0.
                  The GSAP projTl translates .projects-runner left as scroll
                  progresses, sliding the title off-left and revealing cards. ── */}
              {/* ── Featured / Projects title animation — horizontal scroll ─────────
                  Runner contains two 100vw word panels: "Featured" then "Projects".
                  GSAP translates the runner left by 100vw over the scroll budget,
                  shifting "Featured" off-left and revealing "Projects". ───────── */}
              <div className="projects-scroll-track" ref={projectsTrackRef} id="section-projects">
                <div className="projects-sticky-frame">
                  <div className="projects-runner" ref={projectsRunnerRef}>
                    <div className="projects-word-panel">
                      <span className="projects-word">Projects</span>
                    </div>
                    <div className="projects-runner-slack" aria-hidden="true" />
                  </div>
                </div>
              </div>

              <p className="mobile-projects-title">Projects</p>

              {/* ── Featured Projects — 4-col sticky grid ────────────────────────────── */}
              {/*  Flat row-major layout: cells are direct grid children so CSS    */}
              {/*  Grid controls all row heights uniformly. Spotify sticks at top. */}
              <div className="exp-sticky-section">

                {/* Grid A — rows 1-2: Pokemon Generator sticks here */}
                <div className="exp-sticky-grid">

                  {/* Row 1 */}
                  <div role="link" tabIndex={0} onClick={() => goToProject("underwatch")} onKeyDown={cardKeyDown("underwatch")} className="exp-sticky-card">
                    <span className="exp-sticky-card__num">01</span>
                    <div className="exp-sticky-card__body">
                      <p className="exp-sticky-card__name">Underwatch</p>
                      <p className="exp-sticky-card__category">Embedded · Edge AI</p>
                      <p className="exp-sticky-card__desc">On-device fall detection with 3-stage alert escalation, servo tracking, and physical feedback — fully offline.</p>
                      <p className="exp-sticky-card__stack">Arduino UNO Q · Qualcomm QRB2210 · STM32U585 · Edge Impulse · Zephyr RTOS · C++</p>
                    </div>
                  </div>
                  <div
                    className="exp-sticky-card"
                    onClick={() => router.push('/projects/fitform')}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="exp-sticky-card__num">02</span>
                    <div className="exp-sticky-card__body">
                     <p className="exp-sticky-card__name">FitForm</p>
                     <p className="exp-sticky-card__category">Mobile · Edge AI</p>
                     <p className="exp-sticky-card__desc">Fully offline AI coaching app with real-time form feedback for squats and jump shots.</p>
                     <p className="exp-sticky-card__stack">Google LiteRT · MoveNet Lightning · Snapdragon 8 Elite · Hexagon NPU · Android</p>
                    </div>
                  </div>
                  <div role="link" tabIndex={0} onClick={() => goToProject("qascade")} onKeyDown={cardKeyDown("qascade")} className="exp-sticky-card exp-sticky-card--pinned">
                    <span className="exp-sticky-card__num">03</span>
                    <div className="exp-sticky-card__body">
                      <p className="exp-sticky-card__name">Qascade</p>
                      <p className="exp-sticky-card__category">Edge AI · Robotics</p>
                      <p className="exp-sticky-card__desc">End-to-end pipeline for compressing and deploying vision models to the Qualcomm Hexagon DSP for real-time robotics perception.</p>
                      <p className="exp-sticky-card__stack">PyTorch · AIMET · ONNX · QNN SDK · Qualcomm AI Hub · Python</p>
                    </div>
                  </div>
                  <div className="exp-sticky-card exp-sticky-card--blank" />

                  {/* Row 2 */}
                  <div className="exp-sticky-card exp-sticky-card--blank" />
                  <div className="exp-sticky-card exp-sticky-card--blank" />
                  <div className="exp-sticky-card exp-sticky-card--blank" />
                  <div role="link" tabIndex={0} onClick={() => goToProject("moveo")} onKeyDown={cardKeyDown("moveo")} className="exp-sticky-card">
                    <span className="exp-sticky-card__num">04</span>
                    <div className="exp-sticky-card__body">
                      <p className="exp-sticky-card__name">Moveo Robotic Arm</p>
                      <p className="exp-sticky-card__category">Embedded · Robotics</p>
                      <p className="exp-sticky-card__desc">Multi-axis 3D-printed robotic arm with embedded motion control, stepper drivers, and inverse kinematics for precise articulated movement.</p>
                      <p className="exp-sticky-card__stack">Arduino Mega · RAMPS 1.4 · NEMA 17 · A4988/DRV8825 · Embedded C++</p>
                    </div>
                  </div>
                </div>

                {/* Grid B — rows 3-4: AKPsi sticks here, Pokemon Generator has exited */}
                <div className="exp-sticky-grid exp-sticky-grid--no-top-border">

                  {/* Row 3 */}
                  <div role="link" tabIndex={0} onClick={() => goToProject("fpv-drone")} onKeyDown={cardKeyDown("fpv-drone")} className="exp-sticky-card">
                    <span className="exp-sticky-card__num">05</span>
                    <div className="exp-sticky-card__body">
                      <p className="exp-sticky-card__name">FPV Quadcopter</p>
                      <p className="exp-sticky-card__category">Embedded · Hardware</p>
                      <p className="exp-sticky-card__desc">Modular FPV quadcopter with autonomous GPS missions, ArduPilot flight control, and AI object recognition on live video.</p>
                      <p className="exp-sticky-card__stack">Matek F405 · ArduPilot · ELRS · ESP32C3 · Raspberry Pi · GPS</p>
                    </div>
                  </div>
                  <div role="link" tabIndex={0} onClick={() => goToProject("esc-website")} onKeyDown={cardKeyDown("esc-website")} className="exp-sticky-card exp-sticky-card--pinned">
                    <span className="exp-sticky-card__num">06</span>
                    <div className="exp-sticky-card__body">
                      <p className="exp-sticky-card__name">Official Engineering Student Council Website</p>
                      <p className="exp-sticky-card__category">Full-Stack</p>
                      <p className="exp-sticky-card__desc">Official website for UCI Engineering Student Council.</p>
                      <p className="exp-sticky-card__stack">Next.js · React · TypeScript · JavaScript</p>
                    </div>
                  </div>
                  <div role="link" tabIndex={0} onClick={() => goToProject("portfolio")} onKeyDown={cardKeyDown("portfolio")} className="exp-sticky-card">
                    <span className="exp-sticky-card__num">07</span>
                    <div className="exp-sticky-card__body">
                      <p className="exp-sticky-card__name">This Portfolio</p>
                      <p className="exp-sticky-card__category">Portfolio</p>
                      <p className="exp-sticky-card__desc">Built with Next.js, Three.js, Lenis, GSAP, and WebGL.</p>
                      <p className="exp-sticky-card__stack">Next.js · React · Three.js · Lenis · GSAP · WebGL · TypeScript</p>
                    </div>
                  </div>
                  <div className="exp-sticky-card exp-sticky-card--blank" />

                  {/* Row 4 */}
                  <div className="exp-sticky-card exp-sticky-card--blank" />
                  <div className="exp-sticky-card exp-sticky-card--blank" />
                  <div className="exp-sticky-card exp-sticky-card--blank" />
                  <div role="link" tabIndex={0} onClick={() => goToProject("smarttart")} onKeyDown={cardKeyDown("smarttart")} className="exp-sticky-card">
                    <span className="exp-sticky-card__num">08</span>
                    <div className="exp-sticky-card__body">
                      <p className="exp-sticky-card__name">SmartTart</p>
                      <p className="exp-sticky-card__category">Embedded · IoT</p>
                      <p className="exp-sticky-card__desc">IoT-enabled smart toaster with voice-controlled, AI-generated toast profiles over Wi-Fi.</p>
                      <p className="exp-sticky-card__stack">ESP32 · C++ · Google Gemini · HTTP API · OLED · I2C</p>
                    </div>
                  </div>
                  <div className="mobile-grid-ghost" aria-hidden="true" />
                </div>

              </div>


                <h2 className="title title--bottom">Kevin</h2>
              </div>

              <footer id="site-footer">
                <div className="site-footer__grid">
                  <div className="site-footer__left">
                    <span className="footer-dot" aria-hidden="true" />
                    <h3>embedded systems · hardware</h3>
                  </div>
                  <div className="site-footer__details">
                    <span className="footer-dot" aria-hidden="true" />
                    <div className="site-footer__details-content">
                      <h3>Irvine, CA</h3>
                      <h3 className="geo-tag" aria-label="Coordinates 33.6442 degrees north, 117.8453 degrees west">
                        <span>33.6442° N</span>
                        <span aria-hidden="true">/</span>
                        <span>117.8453° W</span>
                      </h3>
                    </div>
                  </div>
                  <div className="site-footer__links">
                    <a href="https://www.linkedin.com/in/kevin-chhim/" target="_blank" className="cursor-can-hover">linkedin</a>
                    <a href="mailto:kevinlychhim@gmail.com" className="cursor-can-hover">email</a>
                  </div>
                  <div className="site-footer__copyright">
                    <h3>Kevin Chhim</h3>
                    <h3>© <span id="current-year">{year ?? "—"}</span></h3>
                  </div>
                </div>
              </footer>
              <div className="mobile-scroll-buffer" aria-hidden="true" />
            </div>
          </section>
        </main>

      </div>

      <aside className="intro-side-brand" aria-hidden="true">
        <span>KC</span>
        <span>UCI</span>
        <span>KC</span>
        <span>UCI</span>
      </aside>
      <p className="label-global">
        Kevin Chhim is a embedded software engineer and student at UC Irvine passionate about embedded systems, VLSI, and hardware design.
      </p>
    </>
  );
}
