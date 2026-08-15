import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import Lenis from "lenis";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { InitiativeDetails } from "./pages/InitiativeDetails";
import { getLenis, setLenis } from "./lib/smoothScroll";

// Buttery momentum scrolling for the whole page (disabled under reduced-motion).
function SmoothScroll() {
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      // lerp-driven (not duration+easing): each frame chases the target
      // scroll position instead of running a fixed-length glide, so it
      // stays responsive to rapid/continuous wheel input instead of
      // dragging out a long tail after you stop scrolling.
      lerp: 0.12,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    setLenis(lenis);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, [prefersReducedMotion]);

  return null;
}

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const lenis = getLenis();
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        setTimeout(() => {
          if (lenis) lenis.scrollTo(element, { offset: -80, duration: 1 });
          else element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <SmoothScroll />
        <ScrollManager />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/initiatives/:type" element={<InitiativeDetails />} />
          </Routes>
        </Layout>
      </Router>
    </MotionConfig>
  );
}
