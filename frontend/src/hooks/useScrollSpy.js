import { useEffect, useState } from "react";

/**
 * Tracks page scroll for the landing navbar:
 *  - `scrolled`: true once the user scrolls past `offset` (drives the
 *    glassmorphism + shrink states).
 *  - `activeId`: the id of the section currently in view (drives the
 *    active-link highlight).
 *
 * @param {string[]} sectionIds  ids to observe, in document order
 * @param {number}   offset      px scrolled before `scrolled` flips true
 */
export default function useScrollSpy(sectionIds = [], offset = 20) {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState(sectionIds[0] || "");

  // Stable primitive key so the observer only re-subscribes when the set changes.
  const idsKey = sectionIds.join(",");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  useEffect(() => {
    if (!sectionIds.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the most visible section currently intersecting the viewport.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) setActiveId(visible[0].target.id);
      },
      {
        // Bias detection toward the upper-middle of the viewport so the
        // highlight switches as a section's heading reaches the navbar.
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    const nodes = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idsKey]);

  return { scrolled, activeId };
}
