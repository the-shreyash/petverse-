import Container from "../../ui/Container";
import NavLogo from "./NavLogo";
import NavLinks from "./NavLinks";
import NavActions from "./NavActions";
import useScrollSpy from "../../../hooks/useScrollSpy";
import { SECTION_IDS, scrollToSection } from "./navConfig";

const Navbar = () => {
  const { scrolled, activeId } = useScrollSpy(SECTION_IDS, 20);

  const handleNavigate = (target) => scrollToSection(target, 72);

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-white/30 bg-white/60 shadow-[0_8px_30px_rgba(16,185,129,.08)] backdrop-blur-2xl"
          : "border-b border-white/20 bg-white/75 backdrop-blur-xl",
      ].join(" ")}
    >
      <Container>
        <div
          className={[
            "flex items-center justify-between transition-all duration-300",
            scrolled ? "h-16" : "h-24",
          ].join(" ")}
        >
          <NavLogo />
          <NavLinks activeId={activeId} onNavigate={handleNavigate} />
          <NavActions />
        </div>
      </Container>
    </header>
  );
};

export default Navbar;
