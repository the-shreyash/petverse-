import FloatingPaw from "./FloatingPaw";
import GradientRing from "./GradientRing";
import FloatingDots from "./FloatingDots";

const HeroDecorations = () => {
  return (
    <>
      <GradientRing />

      <FloatingDots />

      <FloatingPaw className="top-10 left-12 w-10" />
      <FloatingPaw className="bottom-10 right-10 w-8" />
    </>
  );
};

export default HeroDecorations;