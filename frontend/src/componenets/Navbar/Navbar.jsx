import Container from "../container";
import NavLogo from "./NavLogo";
import NavLinks from "./NavLinks";
import NavActions from "./NavActions";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-white/75 backdrop-blur-xl">
      <Container>
        <div className="flex h-24 items-center justify-between">
          <NavLogo />
          <NavLinks />
          <NavActions />
        </div>
      </Container>
    </header>
  );
};

export default Navbar;