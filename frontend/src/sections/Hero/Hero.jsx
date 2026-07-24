import Background from "../../components/ui/Background";
import Container from "../../components/ui/Container";

import HeroLeft from "./HeroLeft";
import HeroRight from "./HeroRight";
import HeroScroll from "./HeroScroll";

const Hero = () => {
  return (
    <section id="hero" className="relative overflow-hidden bg-slate-50 pt-32">
      <Background />

      <Container>
        <div className="grid min-h-[calc(100vh-120px)] items-center gap-16 lg:grid-cols-2">

          <HeroLeft />

          <HeroRight />

        </div>
        
      </Container>
      <HeroScroll />
    </section>
    
  );
};

export default Hero;