import HeroImage from "./HeroImage";
import HeroFloatingCard from "./HeroFloatingCard";
import HeroDecorations from "./Decorations/HeroDecorations";

const HeroRight = () => {
  return (
    <div className="relative flex h-[700px] items-center justify-center">

      
        <HeroDecorations />
  
      {/* Main Hero Image */}
      <HeroImage />

      {/* Top Left */}
      <HeroFloatingCard
        title="Health Score"
        value="98%"
        icon="❤️"
        className="top-10 left-0"
      />

      {/* Top Right */}
      <HeroFloatingCard
        title="AI Assistant"
        value="Online"
        icon="🤖"
        className="top-24 right-0"
      />

      {/* Bottom Left */}
      <HeroFloatingCard
        title="Next Vaccine"
        value="12 Aug"
        icon="💉"
        className="bottom-24 left-4"
      />

      {/* Bottom Right */}
      <HeroFloatingCard
        title="Weight"
        value="18.4 kg"
        icon="⚖️"
        className="bottom-10 right-8"
      />

    </div>
  );
};

export default HeroRight;