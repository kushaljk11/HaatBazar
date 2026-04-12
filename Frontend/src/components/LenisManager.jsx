import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MARKETING_PATHS = new Set([
  "/",
  "/aboutus",
  "/contact",
  "/how-it-works",
  "/help-center",
]);

export default function LenisManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    const shouldEnableLenis = MARKETING_PATHS.has(pathname);
    if (!shouldEnableLenis) {
      return undefined;
    }

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.2,
    });

    lenis.on("scroll", () => ScrollTrigger.update());

    const raf = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      ScrollTrigger.refresh();
    };
  }, [pathname]);

  return null;
}
