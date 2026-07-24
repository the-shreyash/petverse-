/**
 * Landing navbar link config.
 * `target` is the id of the section each link smooth-scrolls to.
 */
export const NAV_LINKS = [
  { label: "Home", target: "hero" },
  { label: "Features", target: "features" },
  { label: "AI Care", target: "ai-assistant" },
  { label: "Shop", target: "dashboard-preview" },
  { label: "Adoption", target: "adoption-community" },
];

export const SECTION_IDS = NAV_LINKS.map((l) => l.target);

/** Smoothly scroll to a section, accounting for the fixed navbar height. */
export function scrollToSection(id, navHeight = 80) {
  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
  window.scrollTo({ top, behavior: "smooth" });
}
